import {ApiError,canonical,sha256} from '../api/store.mjs';
import {voteBytes} from '../../packages/protocol/encoding.mjs';

const HASH32=/^[0-9a-f]{64}$/;
const DISPOSITIONS=new Set(['ACCEPT','REJECT','UNRESOLVED']);

function members(caseRecord,roundId){
 if(!caseRecord?.terms||![0,1].includes(roundId))throw new ApiError(400,'Case and reviewer round are required');
 return roundId===0?caseRecord.terms.primary_committee:caseRecord.terms.fresh_committee;
}

export function inspectCommitteeControl({primary,fresh,registry,disclosures=[],partyAccounts=[],partyOperators=[]}){
 if(!Array.isArray(primary)||primary.length!==3||!Array.isArray(fresh)||fresh.length!==3)throw new ApiError(409,'Exactly three primary and three fresh reviewers are required');
 const all=[...primary,...fresh],accounts=all.map(value=>value.reviewer_id),operators=all.map(value=>value.operator_id);
 if(new Set(accounts).size!==6)throw new ApiError(409,'Primary and fresh reviewer accounts must be disjoint');
 if(operators.some(value=>!HASH32.test(value||''))||new Set(operators).size!==6)throw new ApiError(409,'Primary and fresh controlling operators must be valid and disjoint');
 const records=new Map((registry||[]).map(value=>[value.reviewer_id,value]));
 const stored=new Map(disclosures.map(value=>[value.digest,value]));
 const issues=[];
 for(const member of all){
  if(partyAccounts.includes(member.reviewer_id))issues.push(`${member.reviewer_id}: a case party cannot serve on its own committee`);
  if(partyOperators.includes(member.operator_id))issues.push(`${member.reviewer_id}: controlling operator conflicts with a declared case party`);
  const record=records.get(member.reviewer_id);
  if(!record)issues.push(`${member.reviewer_id}: registry record is unavailable`);
  else{
   if(!record.active)issues.push(`${member.reviewer_id}: registry record is inactive`);
   if(!record.confirmed)issues.push(`${member.reviewer_id}: registry record is unconfirmed`);
   if(record.operator_id!==member.operator_id)issues.push(`${member.reviewer_id}: operator identity does not match the frozen committee`);
   if(String(record.revision)!==String(member.revision))issues.push(`${member.reviewer_id}: registry revision does not match the frozen committee`);
   if(record.disclosure_digest!==member.disclosure_digest)issues.push(`${member.reviewer_id}: disclosure digest does not match the frozen committee`);
  }
  const disclosure=stored.get(member.disclosure_digest);
  if(!disclosure)issues.push(`${member.reviewer_id}: exact control disclosure is unavailable`);
  else if(disclosure.reviewer_id!==member.reviewer_id||disclosure.operator_id!==member.operator_id)issues.push(`${member.reviewer_id}: stored disclosure identity does not match the frozen committee`);
 }
 return {accounts_disjoint:true,operators_disjoint:true,operationally_ready:issues.length===0,independence_established:false,trust_statement:'Distinct accounts and declared operators do not by themselves establish independent control.',issues};
}

export function validateReviewerTransaction({actor,caseRecord,round,method,args}){
 if(!['commit_vote','reveal_vote'].includes(method))return true;
 if(!round||round.round_id!==args.round_id||round.case_id!==caseRecord.case_id)throw new ApiError(409,'Reviewer round identity does not match the frozen case');
 const committee=members(caseRecord,args.round_id),index=committee.findIndex(value=>value.reviewer_id===actor);
 if(index<0)throw new ApiError(403,'Reviewer is not appointed to this round');
 const slot=round.slots?.find(value=>value.reviewer_id===actor)??round.slots?.[index];
 if(!slot||slot.reviewer_id!==actor)throw new ApiError(409,'Reviewer vote slot is unavailable or mismatched');
 if(method==='commit_vote'){
  if(slot.commitment){if(slot.commitment===args.commitment)return true;throw new ApiError(409,'A conflicting commitment already exists');}
  if(round.phase!=='COMMIT')throw new ApiError(409,'Reviewer commitment phase is closed');
 }else{
  if(slot.revealed){if(slot.disposition===args.disposition&&slot.finding_digest===args.finding_digest)return true;throw new ApiError(409,'A conflicting reveal already exists');}
  if(round.phase!=='REVEAL')throw new ApiError(409,'Reviewer reveal phase is closed');
  if(!slot.commitment)throw new ApiError(409,'Reviewer has no recorded commitment to reveal');
  if(round.evidence_digest!==args.evidence_digest)throw new ApiError(409,'Reveal evidence does not match the frozen round');
 }
 return true;
}

export function reviewerWorkspace({actor,caseRecord,round,nowNs}){
 const committee=members(caseRecord,round.round_id),appointed=committee.some(value=>value.reviewer_id===actor),slots=round.slots||[],slot=slots.find(value=>value.reviewer_id===actor)||null;
 if(!appointed)throw new ApiError(403,'Account is not appointed to this reviewer round');
 const revealed=slots.filter(value=>value.revealed),counts={ACCEPT:0,REJECT:0,UNRESOLVED:0};
 for(const vote of revealed)if(DISPOSITIONS.has(vote.disposition))counts[vote.disposition]++;
 const decisive=Object.entries(counts).find(([,count])=>count>=Number(round.threshold||2))?.[0]||null,missing=slots.filter(value=>!value.revealed).map(value=>value.reviewer_id);
 const now=BigInt(String(nowNs)),commitEnd=BigInt(String(round.commit_end_ns)),revealEnd=BigInt(String(round.reveal_end_ns));
 let next_action='WAIT';
 if(round.closed_disposition||round.phase==='CLOSED')next_action='COMPLETE';
 else if(round.phase==='COMMIT')next_action=now>=commitEnd?'ADVANCE_TO_REVEAL':slot?.commitment?'WAIT_FOR_REVEAL':'COMMIT';
 else if(round.phase==='REVEAL')next_action=now>=revealEnd?'ADVANCE_OR_TIMEOUT':slot?.revealed?'WAIT_FOR_ROUND_CLOSE':slot?.commitment?'REVEAL':'MISSED_COMMIT';
 const maximumPossible={...counts},eligibleMissing=slots.filter(value=>!value.revealed&&(round.phase==='COMMIT'||value.commitment));for(const missingSlot of eligibleMissing)for(const key of Object.keys(maximumPossible))maximumPossible[key]++;
 const quorum_possible=decisive!==null||Object.values(maximumPossible).some(value=>value>=Number(round.threshold||2));
 return {case_id:caseRecord.case_id,round_id:round.round_id,reviewer_id:actor,appointed:true,phase:round.phase,next_action,commit_end_ns:String(round.commit_end_ns),reveal_end_ns:String(round.reveal_end_ns),slot,counts,threshold:Number(round.threshold||2),decisive_disposition:decisive,missing_reviewers:missing,quorum_possible,timeout_policy:round.round_id===0?'BASE_REFUND_V1':'KEEP_PRIMARY_V1',advisory:'Only a confirmed contract transition changes phase, quorum, verdict or settlement.'};
}

export function verifyFindingIdentity({store,caseRecord,round,reviewerId,findingDigest,disposition}){
 if(!HASH32.test(findingDigest||''))throw new ApiError(400,'Invalid finding digest');
 const linked=store.links(caseRecord.case_id).some(value=>value.digest===findingDigest&&value.actor===reviewerId&&value.kind==='finding');
 if(!linked)throw new ApiError(409,'Finding is not linked to this case and reviewer');
 let finding;try{finding=JSON.parse(store.read(findingDigest).bytes.toString('utf8'));}catch{throw new ApiError(409,'Finding artifact is unavailable or malformed');}
 if(finding.case_id!==caseRecord.case_id||finding.terms_digest!==caseRecord.terms_digest||finding.round_id!==round.round_id||finding.evidence_digest!==round.evidence_digest||finding.reviewer_id!==reviewerId||finding.disposition!==disposition)throw new ApiError(409,'Finding identity does not match the reviewer round');
 return finding;
}

export function buildReviewPackage({caseRecord,round,reviewerId,disposition,findingDigest,nonce}){
 if(!DISPOSITIONS.has(disposition))throw new ApiError(400,'Invalid reviewer disposition');
 members(caseRecord,round?.round_id);
 if(!members(caseRecord,round.round_id).some(value=>value.reviewer_id===reviewerId))throw new ApiError(403,'Reviewer is not appointed to this round');
 for(const [name,value] of [['finding digest',findingDigest],['nonce',nonce],['evidence digest',round.evidence_digest],['case digest',caseRecord.case_id],['terms digest',caseRecord.terms_digest]])if(!HASH32.test(value||''))throw new ApiError(400,`Invalid ${name}`);
 const reveal={case_id:caseRecord.case_id,round_id:round.round_id,chain_id:caseRecord.terms.chain_id,contract_account:caseRecord.terms.contract_account,terms_digest:caseRecord.terms_digest,reviewer_account:reviewerId,disposition,evidence_digest:round.evidence_digest,finding_digest:findingDigest,nonce};
 const commitment=sha256(Buffer.from(voteBytes(reveal))),payload_digest=sha256(canonical(reveal));
 return {schema:'CONTRA_REVIEW_PACKAGE_V1',reviewer_id:reviewerId,case_id:caseRecord.case_id,round_id:round.round_id,commitment,payload_digest,reveal,warning:'The nonce controls reveal recovery. Encrypt this package before server storage and never share it with another reviewer.'};
}
