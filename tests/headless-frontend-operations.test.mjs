import test from 'node:test';
import assert from 'node:assert/strict';
import {eligibleCaseActions,readCaseDetails,readProtectedCaseRecords,readPagedCases,filterCases} from '../apps/web/contract-operations.mjs';
import {createWalletOperations,openAuthenticatedWallet,recoverWallet} from '../apps/web/wallet-operations.mjs';
import {evaluationFixtureArgs,submitDevelopmentFixture} from '../apps/web/evaluation-operations.mjs';

test('case actions retain exact deposits and safeguard payout retry',()=>{
 const c={state:'Draft',creator_id:'creator',terms:{beneficiary_id:'beneficiary',amount_yocto:'1000000000000000000000000'},beneficiary_accepted:true,terms_digest:'terms'};
 assert.deepEqual(eligibleCaseActions('id',c,'creator').map(([method,,deposit])=>[method,deposit]),[['fund_case','1000000000000000000000000'],['cancel_case','1']]);
 assert.deepEqual(eligibleCaseActions('id',{...c,beneficiary_accepted:false},'beneficiary').map(([method])=>method),['accept_terms']);
 assert.deepEqual(eligibleCaseActions('id',{...c,terms:{...c.terms,amount_yocto:'1000000000000000000000001'}},'creator').map(([method])=>method),['cancel_case']);
 assert.deepEqual(eligibleCaseActions('id',{state:'TransferFailed',payout:{payout_intent_id:'intent',attempt:'2'}},'any')[0],['retry_payout',{case_id:'id',payout_intent_id:'intent',expected_attempt:2},'0','Retry verified failed payout']);
});
test('protected case reads and paged filters stay independent of presentation',async()=>{
 const calls=[];
 const view=async(method,args)=>{calls.push([method,args]);return method==='get_case'?{case_id:'c',state:'Draft'}:method==='get_round'?{phase:'COMMIT'}:method==='get_events'?{items:[]}:method==='list_cases'?{items:[{case_id:'c',creator_id:'creator',state:'Draft',created_at_ns:'1'}]}:null;};
 const details=await readCaseDetails(view,'c');
 assert.equal(details.caseRecord.state,'Draft');assert.equal(details.round.phase,'COMMIT');
 const listed=await readPagedCases(view,{limit:5});assert.equal(listed.length,1);
 assert.equal(filterCases(listed,{account:'creator',mine:true}).length,1);
 const protectedRead=await readProtectedCaseRecords(async path=>path.startsWith('availability')?{items:{a:1}}:{items:[]},'c');
 assert.equal(protectedRead[0].__status,'available');
 const blocked=await readProtectedCaseRecords(async()=>{throw Error('403 unauthorised')},'c');
 assert.equal(blocked[0].__status,'inaccessible');
});
test('wallet prepare retains bounded create_case and signing remains fail closed',async()=>{
 const observed=[];let authorized=false;
 const request=async()=>({network:'testnet',contract_account:'contra-contestation.testnet',external_wallet_signing_authorized:authorized});
 const prepareWalletTransaction=async x=>{observed.push(['prepare',x]);return {operation:{operation_id:'op'}};};
 const sendPreparedWalletTransaction=async()=>{observed.push(['sent']);return {transactionHash:'hash'};};
 const reconcileWalletTransaction=async x=>{observed.push(['reconcile',x]);return {status:'CONFIRMED'};};
 let wallet={};
 const ops=createWalletOperations({request,getToken:()=> 'token',getAccount:()=> 'account',getWallet:()=>wallet,prepareWalletTransaction,sendPreparedWalletTransaction,reconcileWalletTransaction});
 assert.equal((await ops.prepareCase({request_id:'req'})).operation_id,'op');
 assert.deepEqual(observed[0][1].call,{method:'create_case',args:{request_id:'req'},deposit:'1',receiverId:'contra-contestation.testnet'});
 await assert.rejects(ops.signCall('create_case',{request_id:'req'},'1'),/authority gate/);
 assert.equal(observed.length,1);
 authorized=true;
 const result=await ops.signCall('create_case',{request_id:'req'},'1',{operation_id:'op'});
 assert.equal(result.transaction_hash,'hash');assert.equal(result.operation.status,'CONFIRMED');
 wallet=null;await assert.rejects(ops.signCall('create_case',{},'1'),/Reconnect the signing wallet/);
});
test('wallet authentication requires Testnet and restored sessions do not mint signers',async()=>{
 await assert.rejects(openAuthenticatedWallet({network:'mainnet'}),/Testnet/);
 const connected=await openAuthenticatedWallet({contractAccount:'contract',connectWallet:async()=>({wallet:{id:'wallet'},accounts:[{accountId:'creator.testnet'}]}),selectWalletAccount:items=>items[0],authenticateWallet:async(_wallet,account)=>({account})});
 assert.equal(connected.session.account,'creator.testnet');
 const normalised=await openAuthenticatedWallet({contractAccount:'contract',connectWallet:async()=>({wallet:{id:'wallet'},accounts:[{accountId:'creator.testnet'}]}),selectWalletAccount:items=>items[0],authenticateWallet:async()=>({token:'token'})});
 assert.equal(normalised.session.account,'creator.testnet');
 const recovered=await recoverWallet({token:'tok',recoverWalletSession:async()=>({account:'creator.testnet'}),restoreWalletOperations:async({accountId})=>assert.equal(accountId,'creator.testnet')});
 assert.equal(recovered.wallet,undefined);
});
test('evaluation fixtures exclude Baseten and retain non-binding recorded readback',async()=>{
 const hash='a'.repeat(64);
 assert.equal(evaluationFixtureArgs({caseId:hash,provider:'meta',account:'owner',idempotencyKey:'key'}).mode,'fixture');
 assert.throws(()=>evaluationFixtureArgs({caseId:hash,provider:'baseten',account:'owner',idempotencyKey:'key'}),/Meta and Modal/);
 const calls=[];
 const job=await submitDevelopmentFixture({caseId:hash,provider:'modal',account:'owner',digestText:async()=> 'key',post:async(_path,args)=>{calls.push(args);return {id:'job'}},request:async()=>({jobs:[{id:'job',status:'recorded',response_digest:'digest'}]})});
 assert.equal(job.response_digest,'digest');assert.equal(calls[0].provider,'modal');
});
