import fs from 'node:fs';
import path from 'node:path';
import {randomBytes,randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {startSandbox,ONE,NEAR,sha} from '../services/chain/sandbox.mjs';
import {createApp} from '../services/api/server.mjs';
import {Store} from '../services/api/store.mjs';
import {voteCommitment} from '../packages/protocol/encoding.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.resolve(process.env.CONTRA_M04_OUTPUT||path.join(root,'project/artifacts/m04/local-journeys'));
fs.mkdirSync(output,{recursive:true});
const data=path.join(output,'data');fs.rmSync(data,{recursive:true,force:true});
const store=new Store(data),chain=await startSandbox(),app=createApp({store,chain,sandbox:true});
await new Promise(resolve=>app.server.listen(Number(process.env.PORT||4173),'0.0.0.0',resolve));
const base='http://127.0.0.1:'+(process.env.PORT||4173),tokens=new Map(),operations=[];
let closing=false;async function close(){if(closing)return;closing=true;app.server.close();store.close();await chain.close();}
process.once('uncaughtException',async error=>{console.error(error);await close();process.exit(1);});
process.once('unhandledRejection',async error=>{console.error(error);await close();process.exit(1);});

async function request(route,{account,body,method}={}){
 let token;if(account){token=tokens.get(account);if(!token){const response=await fetch(base+'/api/session/sandbox',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({account})}),session=await response.json();if(!response.ok)throw Error(JSON.stringify(session));token=session.token;tokens.set(account,token);}}
 const response=await fetch(base+'/api/'+route,{method:method||(body?'POST':'GET'),headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})}),value=await response.json();if(!response.ok)throw Error(route+' '+response.status+' '+JSON.stringify(value));return value;
}
const view=(method,args={})=>request('view',{body:{method,args,envelope:true}}).then(v=>v.value);
async function transact(account,method,args={},deposit='0'){
 const operation_id=randomUUID(),result=await request('transaction',{account,body:{operation_id,method,args,deposit:String(deposit)}});operations.push({operation_id,account,method,args,deposit:String(deposit),result});if(result.status!=='CONFIRMED')throw Error(method+' did not confirm: '+JSON.stringify(result));return result;
}
const disclosure=operator_label=>({operator_label,control:{common_control:'All Sandbox accounts in this run are controlled by one local process.',key_custody:'Ephemeral local Sandbox keys managed by near-workspaces.',signer_control:'The local CONTRA service submits fixture transactions.'},procedure:{provider:'Human fixture procedure',model:'No paid model',human_role:'Deterministic local acceptance scenario.'},conflicts:['Common process control across all six reviewer accounts'],limitations:['Not proof of independent reviewers','Not a live provider evaluation'],verification_sources:['M04 local Sandbox process and transaction log'],attested_at:new Date().toISOString()});

for(const [index,reviewer]of chain.reviewers.entries()){
 const saved=await request('reviewer/disclosure',{account:reviewer.accountId,body:{disclosure:disclosure('M04 controlled fixture operator '+index)}});
 await transact(chain.creator.accountId,'set_reviewer',{reviewer_id:reviewer.accountId,operator_id:saved.operator_id,disclosure_digest:saved.digest,active:true},ONE);
 await transact(reviewer.accountId,'confirm_reviewer',{revision:'2',disclosure_digest:saved.digest},ONE);
}

async function createCase(label){
 const creator=chain.creator.accountId,beneficiary=chain.beneficiary.accountId,requirement=await request('terms',{account:creator,body:{text:'All interactive controls must be reachable and operable by keyboard.'}}),terms={...await request('template',{account:creator}),criteria:[{criterion_id:1,kind:'KEYBOARD',requirement_digest:requirement.digest}],evidence_policy_digest:sha('CONTRA_EVIDENCE_V1'),creator_operator_id:sha('M04 creator operator'),beneficiary_operator_id:sha('M04 beneficiary operator')},request_id=randomBytes(32).toString('hex'),preview=await view('preview_case',{creator_id:creator,request_id,terms});
 await transact(creator,'create_case',{request_id,terms,expected_terms_digest:preview.terms_digest},ONE);
 await transact(beneficiary,'accept_terms',{case_id:preview.case_id,terms_digest:preview.terms_digest},ONE);
 await transact(creator,'fund_case',{case_id:preview.case_id,terms_digest:preview.terms_digest},NEAR);
 const manifest=await request('evidence',{account:beneficiary,body:{case_id:preview.case_id,manifest:{created_at:new Date().toISOString(),sources:[{source_id:'keyboard-run',media_type:'text/plain',content:label+' keyboard verification: tab order, focus visibility and activation recorded.',provenance:{origin:'M04 local Sandbox journey',captured_at:new Date().toISOString()}}],criteria:[{criterion_id:1,claim:'Keyboard behavior was exercised in the populated local workflow.',source_ids:['keyboard-run']}]}}});
 await transact(beneficiary,'submit_evidence',{case_id:preview.case_id,terms_digest:preview.terms_digest,manifest_digest:manifest.digest},ONE);
 await transact(chain.outsider.accountId,'advance_round',{case_id:preview.case_id});
 return {label,case_id:preview.case_id,terms_digest:preview.terms_digest,terms,manifest};
}

async function decide(record,round_id,disposition,citation){
 let c=await view('get_case',{case_id:record.case_id});const committee=round_id?c.terms.fresh_committee:c.terms.primary_committee,round=await view('get_round',{case_id:record.case_id,round_id}),reveals=[];
 for(const member of committee.slice(0,2)){
  const finding=await request('finding',{account:member.reviewer_id,body:{case_id:record.case_id,round_id,disposition,citations:[citation],explanation:`M04 controlled fixture finding: ${disposition} for round ${round_id}.`,limitations:'All reviewer keys in this run share one process and are not independent.'}}),vote={case_id:record.case_id,round_id,chain_id:c.terms.chain_id,contract_account:c.terms.contract_account,terms_digest:c.terms_digest,reviewer_account:member.reviewer_id,disposition,evidence_digest:round.evidence_digest,finding_digest:finding.digest,nonce:randomBytes(32).toString('hex')};
  await transact(member.reviewer_id,'commit_vote',{case_id:record.case_id,round_id,commitment:await voteCommitment(vote)});reveals.push(vote);
 }
 await chain.fastTo(round.commit_end_ns);await transact(chain.outsider.accountId,'advance_round',{case_id:record.case_id});
 for(const vote of reveals){const {chain_id,contract_account,terms_digest,reviewer_account,...args}=vote;await transact(reviewer_account,'reveal_vote',args);}
 await chain.fastTo(round.reveal_end_ns);await transact(chain.outsider.accountId,'advance_round',{case_id:record.case_id});return view('get_case',{case_id:record.case_id});
}

const unchallenged=await createCase('Unchallenged agreement');
await decide(unchallenged,0,'ACCEPT',unchallenged.manifest.digest);
await chain.fastTo(unchallenged.terms.challenge_end_ns);
const unchallengedBefore=BigInt((await chain.beneficiary.balance()).total.toString());
await transact(chain.outsider.accountId,'finalize_case',{case_id:unchallenged.case_id});
const unchallengedAfter=BigInt((await chain.beneficiary.balance()).total.toString());
unchallenged.final=await view('get_case',{case_id:unchallenged.case_id});unchallenged.receiver_balance_delta_yocto=String(unchallengedAfter-unchallengedBefore);

const challenged=await createCase('Challenged agreement');
await decide(challenged,0,'ACCEPT',challenged.manifest.digest);
const counterexample=await request('counterexample',{account:chain.creator.accountId,body:{case_id:challenged.case_id,criterion_id:1,text:'Keyboard focus becomes trapped in the review dialog after activating the challenge control.'}});
await transact(chain.creator.accountId,'file_challenge',{case_id:challenged.case_id,criterion_id:1,counterexample_digest:counterexample.digest},ONE);
await transact(chain.outsider.accountId,'advance_round',{case_id:challenged.case_id});
await decide(challenged,1,'REJECT',counterexample.digest);
const challengedBefore=BigInt((await chain.creator.balance()).total.toString());
await transact(chain.outsider.accountId,'finalize_case',{case_id:challenged.case_id});
const challengedAfter=BigInt((await chain.creator.balance()).total.toString());
challenged.counterexample=counterexample;challenged.final=await view('get_case',{case_id:challenged.case_id});challenged.receiver_balance_delta_yocto=String(challengedAfter-challengedBefore);

if(unchallenged.final.state!=='Settled'||unchallenged.final.final_disposition!=='ACCEPT'||unchallenged.final.payout.last_attempt.result!=='SUCCESS'||unchallenged.receiver_balance_delta_yocto!==NEAR.toString())throw Error('Unchallenged journey assertion failed');
if(challenged.final.state!=='Settled'||challenged.final.primary_disposition!=='ACCEPT'||challenged.final.final_disposition!=='REJECT'||challenged.final.resolution_basis!=='FRESH'||challenged.final.payout.last_attempt.result!=='SUCCESS'||challenged.receiver_balance_delta_yocto!==NEAR.toString())throw Error('Challenged journey assertion failed');
for(const operation of operations)if(operation.result.history.map(v=>v.status).join(',')!=='PREPARING,AWAITING_SIGNATURE,BROADCAST,PENDING,CONFIRMED')throw Error('Transaction lifecycle mismatch');

const report={checkpoint:'CONTRA-2026-11-03-IMPL-M04-J01',generated_at:new Date().toISOString(),environment:{network:'sandbox',contract_account:chain.contract.accountId,reviewer_control:'All six reviewer accounts are controlled by one local process; no independence claim.',paid_inference:false},counts:{operations:operations.length,receipts:chain.receipts.length,manifests:store.manifests(unchallenged.case_id).length+store.manifests(challenged.case_id).length},unchallenged:{case_id:unchallenged.case_id,manifest_digest:unchallenged.manifest.digest,final_disposition:unchallenged.final.final_disposition,resolution_basis:unchallenged.final.resolution_basis,payout:unchallenged.final.payout,receiver_balance_delta_yocto:unchallenged.receiver_balance_delta_yocto},challenged:{case_id:challenged.case_id,manifest_digest:challenged.manifest.digest,counterexample_digest:challenged.counterexample.digest,primary_disposition:challenged.final.primary_disposition,final_disposition:challenged.final.final_disposition,resolution_basis:challenged.final.resolution_basis,payout:challenged.final.payout,receiver_balance_delta_yocto:challenged.receiver_balance_delta_yocto}};
fs.writeFileSync(path.join(output,'journey-report.json'),JSON.stringify(report,null,2));fs.writeFileSync(path.join(output,'operations.json'),JSON.stringify(operations,null,2));fs.writeFileSync(path.join(output,'receipts.json'),JSON.stringify(chain.receipts,null,2));
console.log(JSON.stringify(report,null,2));console.log('M04_JOURNEYS_READY '+base);

if(process.env.CONTRA_KEEP_OPEN==='1'){await new Promise(resolve=>{for(const signal of ['SIGINT','SIGTERM'])process.once(signal,resolve);});await close();}else await close();
