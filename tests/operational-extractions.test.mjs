import test from 'node:test';
import assert from 'node:assert/strict';
import {counterexampleRequest,challengeEligibility,challengeSubmissionArgs,storeCounterexample,fileChallenge} from '../apps/web/challenge-operations.mjs';
import {invitationResponseArgs,reviewerControlStatement,signReviewerConsent,findingArgs,reviewerCommitmentArgs,commitmentTransactionArgs,revealTransactionArgs,verifyReviewerReveal,respondToInvitation,storeReviewerFinding,commitReviewerVote,revealReviewerVote} from '../apps/web/reviewer-operations.mjs';
import {receiptRequest,operationReadPath,reconciliationRequest,operationRecoveryState,inspectReceipt,inspectOperation,reconcileKnownOperation} from '../apps/web/settlement-operations.mjs';

test('challenge arguments and losing-party deadline eligibility are preserved',()=>{
 const d=new FormData();d.set('criterion_id','2');d.set('text','Counterexample');
 assert.deepEqual(counterexampleRequest('case-a',d),{case_id:'case-a',criterion_id:2,text:'Counterexample'});
 const c={state:'Provisional',primary_disposition:'ACCEPT',creator_id:'creator',terms:{beneficiary_id:'beneficiary',challenge_end_ns:'2000000000000000000'}};
 assert.equal(challengeEligibility(c,'creator',true,1000),true);
 assert.equal(challengeEligibility(c,'beneficiary',true,1000),false);
 assert.equal(challengeEligibility(c,'creator',false,1000),false);
 assert.equal(challengeEligibility(c,'creator',true,2000000000000),false);
 assert.deepEqual(challengeSubmissionArgs('case-a',2,'digest'),{case_id:'case-a',criterion_id:2,counterexample_digest:'digest'});
});
test('reviewer invitation, finding and commit data stay evidence-bound',()=>{
 const d=new FormData();for(const [key,value] of Object.entries({disposition:'ACCEPT',citation:'evidence',explanation:'reason',limitations:'limits'}))d.set(key,value);
 assert.deepEqual(invitationResponseArgs('invite','reviewer','CONSENTED',new Date('2026-01-01T00:00:00Z')),{digest:'invite',reviewer_id:'reviewer',status:'CONSENTED',body:{acknowledged_at:'2026-01-01T00:00:00.000Z'}});
 assert.deepEqual(findingArgs('case',1,d),{case_id:'case',round_id:1,disposition:'ACCEPT',citations:['evidence'],explanation:'reason',limitations:'limits'});
 const c={terms:{chain_id:'testnet',contract_account:'contract'},terms_digest:'terms'};
 const args=reviewerCommitmentArgs(c,'case',1,'reviewer','ACCEPT','evidence','finding','nonce');
 assert.equal(args.reviewer_account,'reviewer');assert.equal(args.terms_digest,'terms');
 assert.deepEqual(commitmentTransactionArgs('case',1,'hash'),{case_id:'case',round_id:1,commitment:'hash'});
 assert.deepEqual(revealTransactionArgs('case',1,'ACCEPT','evidence','finding','nonce'),{case_id:'case',round_id:1,disposition:'ACCEPT',evidence_digest:'evidence',finding_digest:'finding',nonce:'nonce'});
});
test('reviewer reveal blocks mismatched commitment before signing',async()=>{
 const c={terms:{chain_id:'testnet',contract_account:'contract'},terms_digest:'terms'};
 const args={voteCommitment:async()=> 'expected',caseData:c,caseId:'case',roundId:0,account:'reviewer',disposition:'REJECT',evidenceDigest:'evidence',findingDigest:'finding',nonce:'nonce',expectedCommitment:'expected'};
 assert.equal((await verifyReviewerReveal(args)).disposition,'REJECT');
 await assert.rejects(verifyReviewerReveal({...args,expectedCommitment:'different'}),/do not match the onchain commitment/);
});
test('reviewer consent requires a fresh wallet signature bound to the disclosure',async()=>{
 const invitation={digest:'a'.repeat(64)},reviewerId='reviewer.testnet',input={operator_id:'b'.repeat(64),disclosure_digest:'c'.repeat(64),available_from:'2099-01-01T00:00:00Z',available_until:'2099-01-02T00:00:00Z',conflicts:'none declared'};
 const statement=reviewerControlStatement(invitation,reviewerId,input);
 assert.equal(statement.invitation_digest,invitation.digest);assert.deepEqual(statement.conflicts,['none declared']);
 assert.deepEqual(reviewerControlStatement(invitation,reviewerId,input),statement);assert.equal('acknowledged_at' in statement,false);
 const calls=[],post=async(path,body)=>{calls.push([path,body]);return path==='reviewer/control-challenge'?{id:'challenge',message:'bound statement',nonce:btoa(String.fromCharCode(...new Uint8Array(32))),recipient:'contra-near.pages.dev'}:{status:'CONSENTED'};};
 const wallet={signMessage:async request=>{assert.equal(request.message,'bound statement');assert.equal(request.recipient,'contra-near.pages.dev');return {accountId:reviewerId,publicKey:'ed25519:key',signature:'signature'};}};
 assert.equal((await signReviewerConsent({post,wallet,invitation,reviewerId,input})).status,'CONSENTED');
 assert.equal(calls[0][0],'reviewer/control-challenge');assert.equal(calls[1][1].control_challenge_id,'challenge');assert.equal(calls[1][1].body.disclosure_digest,input.disclosure_digest);
 await assert.rejects(signReviewerConsent({post,wallet:null,invitation,reviewerId,input}),/recovered session cannot sign/);
 await assert.rejects(signReviewerConsent({post,wallet:{signMessage:async()=>({accountId:'other.testnet'})},invitation,reviewerId,input}),/does not match/);
});
test('settlement inspection preserves UNKNOWN lock without redispatch',()=>{
 const d=new FormData();d.set('tx_hash','tx');
 assert.deepEqual(receiptRequest(d),{tx_hash:'tx'});
 assert.equal(operationReadPath('id with space'),'operation?id=id+with+space');
 assert.deepEqual(reconciliationRequest('op'),{operation_id:'op'});
 assert.deepEqual(operationRecoveryState({status:'UNKNOWN'}),{canReconcile:false,locked:true});
 assert.deepEqual(operationRecoveryState({status:'UNKNOWN',tx_hash:'tx'}),{canReconcile:true,locked:false});
 assert.deepEqual(operationRecoveryState({status:'PENDING',tx_hash:'tx'}),{canReconcile:true,locked:false});
 assert.deepEqual(operationRecoveryState({status:'CONFIRMED',tx_hash:'tx'}),{canReconcile:false,locked:false});
});

test('challenge dispatch retains exact contract method and deposit',async()=>{
 let observed=[];
 const post=async(...args)=>{observed.push(args);return {digest:'digest'};};
 const data=new FormData();data.set('criterion_id','3');data.set('text','example');
 await storeCounterexample(post,'case',data);
 const sign=async(...args)=>{observed.push(args);return {status:'CONFIRMED'};};
 await fileChallenge(sign,'case',3,'digest');
 assert.deepEqual(observed,[['counterexample',{case_id:'case',criterion_id:3,text:'example'}],['file_challenge',{case_id:'case',criterion_id:3,counterexample_digest:'digest'},'1']]);
});
test('reviewer call dispatch keeps human finding and vote distinct',async()=>{
 const calls=[];const post=async(...args)=>{calls.push(args);return {digest:'finding'};};
 const sign=async(...args)=>{calls.push(args);return {ok:true};};
 const data=new FormData();for(const [k,v] of Object.entries({disposition:'ACCEPT',citation:'cit',explanation:'why',limitations:''}))data.set(k,v);
 await respondToInvitation(post,'inv','reviewer','CONSENTED',new Date('2026-01-01T00:00:00Z'));
 await storeReviewerFinding(post,'case',0,data);
 await commitReviewerVote(sign,'case',0,'commitment');
 await revealReviewerVote(sign,{case_id:'case',round_id:0,disposition:'ACCEPT'});
 assert.equal(calls[0][0],'reviewer/respond');assert.equal(calls[1][0],'finding');
 assert.deepEqual(calls[2],['commit_vote',{case_id:'case',round_id:0,commitment:'commitment'},'0']);
 assert.equal(calls[3][0],'reveal_vote');assert.equal(calls[3][2],'0');
});
test('settlement workflows inspect, reconcile once and reject hashless UNKNOWN',async()=>{
 let calls=[];const request=async p=>{calls.push(['get',p]);return {status:'UNKNOWN',tx_hash:'hash'};};
 const post=async(...args)=>{calls.push(args);return {status:'CONFIRMED'};};
 const data=new FormData();data.set('tx_hash','hash');
 await inspectReceipt(post,data);
 const operation=await inspectOperation(request,'abc');
 await reconcileKnownOperation(post,'abc',operation);
 assert.deepEqual(calls,[['receipt',{tx_hash:'hash'}],['get','operation?id=abc'],['wallet/reconcile',{operation_id:'abc'}]]);
 await assert.rejects(reconcileKnownOperation(post,'abc',{status:'UNKNOWN'}),/must remain locked/);
 assert.equal(calls.length,3);
});
