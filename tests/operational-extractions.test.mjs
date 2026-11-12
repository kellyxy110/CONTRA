import test from 'node:test';
import assert from 'node:assert/strict';
import {counterexampleRequest,challengeEligibility,challengeSubmissionArgs} from '../apps/web/challenge-operations.mjs';
import {invitationResponseArgs,findingArgs,reviewerCommitmentArgs,commitmentTransactionArgs,revealTransactionArgs,verifyReviewerReveal} from '../apps/web/reviewer-operations.mjs';
import {receiptRequest,operationReadPath,reconciliationRequest,operationRecoveryState} from '../apps/web/settlement-operations.mjs';

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
test('settlement inspection preserves UNKNOWN lock without redispatch',()=>{
 const d=new FormData();d.set('tx_hash','tx');
 assert.deepEqual(receiptRequest(d),{tx_hash:'tx'});
 assert.equal(operationReadPath('id with space'),'operation?id=id+with+space');
 assert.deepEqual(reconciliationRequest('op'),{operation_id:'op'});
 assert.deepEqual(operationRecoveryState({status:'UNKNOWN'}),{canReconcile:false,locked:true});
 assert.deepEqual(operationRecoveryState({status:'UNKNOWN',tx_hash:'tx'}),{canReconcile:true,locked:false});
 assert.deepEqual(operationRecoveryState({status:'CONFIRMED',tx_hash:'tx'}),{canReconcile:false,locked:false});
});
