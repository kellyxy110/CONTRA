import {ApiError,canonical,sha256} from '../api/store.mjs';

const COMMITTEES=new Set(['primary','fresh']);
function required(value,name,max=512){if(typeof value!=='string'||!value.trim()||value.length>max)throw new ApiError(400,`Invalid ${name}`);return value.trim();}

export function buildReviewerInvitation({slot,committee,contract_account,network='testnet',expires_at}){
 if(!Number.isInteger(slot)||slot<1||slot>3||!COMMITTEES.has(committee))throw new ApiError(400,'Invalid reviewer committee slot');
 if(network!=='testnet')throw new ApiError(400,'Reviewer invitations are testnet only');
 const expiry=required(expires_at,'invitation expiry',64);if(new Date(expiry).toISOString()!==expiry||Date.parse(expiry)<=Date.now())throw new ApiError(400,'Reviewer invitation must have a future ISO expiry');
 const invitation={schema:'CONTRA_REVIEWER_INVITATION_V1',network,contract_account:required(contract_account,'contract account',64),committee,slot,expires_at:expiry,requirements:{distinct_account_control:true,distinct_controlling_operator:true,participant_consent:true,conflict_disclosure:true,key_custody_disclosure:true,availability_for_commit_and_reveal:true},authority:{can_review:true,can_settle:false,can_authorise_transactions:false,ai_output_is_non_binding:true},notice:'Invitation is not registration or proof of independence. The invited operator must attest using their own account and disclosure.'};
 return {...invitation,invitation_digest:sha256(canonical(invitation))};
}

export function assessReviewerResponses({invitations,responses,now=new Date().toISOString()}){
 if(!Array.isArray(invitations)||invitations.length!==6||!Array.isArray(responses))throw new ApiError(400,'Six invitations and their responses are required');
 const responseByDigest=new Map(responses.map(value=>[value.invitation_digest,value])),accounts=new Set(),operators=new Set(),issues=[];
 for(const invitation of invitations){
  const response=responseByDigest.get(invitation.invitation_digest);
  if(!response){issues.push(`${invitation.committee} slot ${invitation.slot}: response missing`);continue;}
  if(Date.parse(invitation.expires_at)<=Date.parse(now))issues.push(`${invitation.committee} slot ${invitation.slot}: invitation expired`);
  if(response.accepted!==true||response.consent!==true)issues.push(`${invitation.committee} slot ${invitation.slot}: explicit consent missing`);
  for(const field of ['reviewer_id','operator_id','disclosure_digest','custody_attestation','availability_attestation'])if(!response[field])issues.push(`${invitation.committee} slot ${invitation.slot}: ${field} missing`);
  if(!Array.isArray(response.conflicts))issues.push(`${invitation.committee} slot ${invitation.slot}: conflict disclosure missing`);
  if(accounts.has(response.reviewer_id))issues.push(`${invitation.committee} slot ${invitation.slot}: reviewer account reused`);accounts.add(response.reviewer_id);
  if(operators.has(response.operator_id))issues.push(`${invitation.committee} slot ${invitation.slot}: controlling operator reused`);operators.add(response.operator_id);
 }
 return {ready:issues.length===0,independence_established:false,accepted_responses:responses.filter(value=>value.accepted===true).length,distinct_accounts:accounts.size,distinct_operators:operators.size,issues,trust_statement:'Distinct attestations are necessary but do not independently prove separate real-world control.'};
}
