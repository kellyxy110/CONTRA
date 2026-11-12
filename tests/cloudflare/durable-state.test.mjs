import {env} from 'cloudflare:workers';
import {evictDurableObject,runInDurableObject,SELF} from 'cloudflare:test';
import {describe,it,expect} from 'vitest';
import {nep413Bytes,verifyEd25519,storeEvidence,storeFinding,storeReviewPackage} from '../../services/cloudflare/worker.mjs';

const digest=async bytes=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(value=>value.toString(16).padStart(2,'0')).join('');
const canonical=value=>Array.isArray(value)?`[${value.map(canonical).join(',')}]`:value&&typeof value==='object'?`{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`:JSON.stringify(value);
const publicOrigin=env.CONTRA_PUBLIC_ORIGIN;
const tx='11111111111111111111111111111111',block='22222222222222222222222222222222';
const stub=name=>env.CONTRA_STATE.getByName(name);
const operation=(id,account='creator.testnet')=>({id,account,payload_hash:'a'.repeat(64),contract_account:'contra-contestation.testnet'});
async function rejection(call,pattern){
 let caught=null;try{await call();}catch(error){caught=error;}
 expect(caught).toBeInstanceOf(Error);expect(caught.message).toMatch(pattern);
}
function base58(bytes){const alphabet='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';let value=0n;for(const byte of bytes)value=(value<<8n)+BigInt(byte);let out='';while(value){out=alphabet[Number(value%58n)]+out;value/=58n;}for(const byte of bytes){if(byte!==0)break;out='1'+out;}return out;}

describe('Cloudflare durable financial state',()=>{
 it('serialises concurrent duplicate preparation and rejects conflicting reuse',async()=>{
  const state=stub('concurrent-prepare'),results=await Promise.all(Array.from({length:8},()=>state.prepareOperation(operation('op-1'))));
  expect(results.filter(value=>!value.replayed)).toHaveLength(1);expect(results.every(value=>value.id==='op-1')).toBe(true);
  await rejection(()=>runInDurableObject(state,instance=>instance.prepareOperation({...operation('op-1'),payload_hash:'b'.repeat(64)})),/identity conflict/);
 });

 it('preserves one transaction identity and conservative UNKNOWN recovery',async()=>{
  const state=stub('transaction-identity');await state.prepareOperation(operation('op-1'));await state.handoffOperation('op-1');await state.markUnknown('op-1');
  expect((await state.attachTransactionHash('op-1',tx)).status).toBe('PENDING');
  await state.prepareOperation(operation('op-2','other.testnet'));await state.handoffOperation('op-2');
  await rejection(()=>runInDurableObject(state,instance=>instance.attachTransactionHash('op-2',tx)),/another operation/);
  const ambiguous=await state.reconcileReceipt({id:'op-1',tx_hash:tx,network:'testnet',contract_account:'contra-contestation.testnet',outcome:'UNKNOWN',block_height:10,block_hash:block});
  expect(ambiguous.status).toBe('UNKNOWN');
  expect((await state.operation('op-1')).tx_hash).toBe(tx);
 });

 it('confirms only an explicit matching non-regressed testnet receipt',async()=>{
  const state=stub('receipt-reconciliation');await state.prepareOperation(operation('op-1'));await state.handoffOperation('op-1');await state.attachTransactionHash('op-1',tx);
  await rejection(()=>runInDurableObject(state,instance=>instance.reconcileReceipt({id:'op-1',tx_hash:'33333333333333333333333333333333',network:'testnet',contract_account:'contra-contestation.testnet',outcome:'SUCCESS',block_height:11,block_hash:block})),/transaction identity/);
  const confirmed=await state.reconcileReceipt({id:'op-1',tx_hash:tx,network:'testnet',contract_account:'contra-contestation.testnet',outcome:'SUCCESS',block_height:11,block_hash:block});expect(confirmed.status).toBe('CONFIRMED');
  await state.prepareOperation(operation('op-2'));await state.handoffOperation('op-2');await state.attachTransactionHash('op-2','44444444444444444444444444444444');
  await rejection(()=>runInDurableObject(state,instance=>instance.reconcileReceipt({id:'op-2',tx_hash:'44444444444444444444444444444444',network:'testnet',contract_account:'contra-contestation.testnet',outcome:'SUCCESS',block_height:10,block_hash:block})),/stale/);
 });

 it('persists operation, session and immutable artifact across eviction with account isolation',async()=>{
  const state=stub('eviction-recovery'),bytes=new TextEncoder().encode('immutable evidence'),artifactDigest=await digest(bytes),token='c'.repeat(64);
  await state.prepareOperation(operation('op-1'));await state.saveSession({token_hash:token,account:'creator.testnet',expires:Date.now()+60000});await state.putArtifact({digest:artifactDigest,bytes,media_type:'text/plain'});
  await evictDurableObject(state);
  expect((await state.operation('op-1')).status).toBe('PREPARED');expect(await state.session(token,'beneficiary.testnet')).toBeNull();expect((await state.session(token,'creator.testnet')).account).toBe('creator.testnet');
  expect(new TextDecoder().decode((await state.readArtifact(artifactDigest)).bytes)).toBe('immutable evidence');await state.revokeSession(token,'creator.testnet');expect(await state.session(token,'creator.testnet')).toBeNull();
 });

 it('binds canonical evidence and its source bytes to one case',async()=>{
  const state=stub('case-evidence'),caseId='a'.repeat(64),record={case_id:caseId,terms_digest:'b'.repeat(64),evidence_digest:null,terms:{criteria:[{criterion_id:1}]}};
  const input={manifest:{created_at:'2026-11-11T12:00:00.000Z',sources:[{source_id:'source-1',media_type:'text/plain',content:'Evidence bytes',provenance:{origin:'test fixture',captured_at:'2026-11-11T11:00:00.000Z'}}],criteria:[{criterion_id:1,claim:'Criterion evidence',source_ids:['source-1']}]}};
  const saved=await storeEvidence(state,record,'creator.testnet',input),sourceDigest=await digest(new TextEncoder().encode('Evidence bytes'));
  expect(saved.digest).toBe(await digest(new TextEncoder().encode(canonical(saved.manifest))));
  expect(saved.manifest.sources[0].digest).toBe(sourceDigest);
  expect(await state.linked(caseId,sourceDigest)).toBe(true);
  expect(await state.linked('c'.repeat(64),sourceDigest)).toBe(false);
  await rejection(()=>storeEvidence(state,record,'creator.testnet',{manifest:{...input.manifest,criteria:[]}}),/every frozen criterion/);
 });

 it('stores a cited human finding without granting vote authority',async()=>{
  const state=stub('finding-boundary'),caseId='d'.repeat(64),evidence='e'.repeat(64),record={case_id:caseId,terms_digest:'f'.repeat(64),evidence_digest:evidence,terms:{criteria:[{criterion_id:1,requirement_digest:'a'.repeat(64)}],primary_committee:[{reviewer_id:'reviewer.testnet'}],fresh_committee:[]}},round={evidence_digest:evidence};
  const input={round_id:0,disposition:'ACCEPT',citations:[evidence],explanation:'Human assessment of the cited evidence',limitations:'Only the supplied source was reviewed'};
  await rejection(()=>storeFinding(state,record,round,'stranger.testnet',input),/authority/);
  await rejection(()=>storeFinding(state,record,round,'reviewer.testnet',{...input,citations:['b'.repeat(64)]}),/citation/);
  const saved=await storeFinding(state,record,round,'reviewer.testnet',input);
  expect(saved.finding.status).toBe('Reviewer finding');expect(saved.finding.reviewer_id).toBe('reviewer.testnet');
  expect(saved.digest).toBe(await digest(new TextEncoder().encode(canonical(saved.finding))));
  expect(await state.linked(caseId,saved.digest)).toBe(true);
 });

 it('binds encrypted recovery to the appointed reviewer, finding and frozen round',async()=>{
  const state=stub('review-package-boundary'),caseId='7'.repeat(64),evidence='8'.repeat(64),actor='reviewer.testnet';
  const record={case_id:caseId,terms_digest:'9'.repeat(64),evidence_digest:evidence,terms:{criteria:[{criterion_id:1,requirement_digest:'a'.repeat(64)}],primary_committee:[{reviewer_id:actor}],fresh_committee:[]}};
  const round={round_id:0,evidence_digest:evidence,phase:'COMMIT'};
  const finding=await storeFinding(state,record,round,actor,{round_id:0,disposition:'ACCEPT',citations:[evidence],explanation:'Cited human finding',limitations:''});
  const input={case_id:caseId,round_id:0,commitment:'b'.repeat(64),payload_digest:'c'.repeat(64),finding_digest:finding.digest,evidence_digest:evidence,disposition:'ACCEPT',encryption:'aes-256-gcm',ciphertext:'A'.repeat(64)};
  await rejection(()=>storeReviewPackage(state,record,round,'other.testnet',input),/appointed/);
  await rejection(()=>storeReviewPackage(state,record,round,actor,{...input,finding_digest:'d'.repeat(64)}),/Finding identity/);
  await rejection(()=>storeReviewPackage(state,record,{...round,evidence_digest:'e'.repeat(64)},actor,input),/frozen round/);
  await rejection(()=>storeReviewPackage(state,record,{...round,phase:'REVEAL'},actor,input),/commitment phase/);
  const saved=await storeReviewPackage(state,record,round,actor,input);expect(saved.body.round_id).toBe(0);
  await rejection(()=>storeReviewPackage(state,record,round,actor,{...input,commitment:'e'.repeat(64)}),/Conflicting review package/);
  const replay=await storeReviewPackage(state,record,{...round,phase:'REVEAL'},actor,input);expect(replay.replayed).toBe(true);
 });

 it('fails readiness closed when durable schema integrity is lost',async()=>{
  const state=stub('storage-failure');await state.health();await runInDurableObject(state,async(_instance,ctx)=>ctx.storage.sql.exec('DROP TABLE artifacts'));
  await rejection(()=>runInDurableObject(state,instance=>instance.health()),/schema is incomplete/);
 });

 it('serves liveness and reports chain readiness honestly',async()=>{
  expect((await SELF.fetch(publicOrigin+'/api/live')).status).toBe(200);
  const ready=await SELF.fetch(publicOrigin+'/api/ready'),report=await ready.json();expect(report.storage.integrity).toBe('ok');
  if(ready.status===200){expect(report.ready).toBe(true);expect(report.chain.status).toBe('ready');expect(report.chain.source.finality).toBe('final');}
  else{expect(ready.status).toBe(503);expect(report.ready).toBe(false);expect(report.chain.status).toBe('unavailable');}
 },30000);

 it('creates durable NEP-413 challenges while rejecting unauthenticated protected access',async()=>{
  const challenge=await SELF.fetch(publicOrigin+'/api/session/challenge',{method:'POST',headers:{Origin:publicOrigin,'Content-Type':'application/json'},body:JSON.stringify({account:'creator.testnet'})});
  expect(challenge.status).toBe(201);const value=await challenge.json();expect(value.account).toBe('creator.testnet');expect(value.nonce).toMatch(/^[A-Za-z0-9+/]+=*$/);
  const operation=await SELF.fetch(publicOrigin+'/api/operation?id=missing');expect(operation.status).toBe(401);
 });

 it('verifies a NEP-413 payload with Web Crypto Ed25519 and rejects a changed payload',async()=>{
  const pair=await crypto.subtle.generateKey({name:'Ed25519'},true,['sign','verify']),raw=new Uint8Array(await crypto.subtle.exportKey('raw',pair.publicKey)),publicKey=`ed25519:${base58(raw)}`;
  const payload=nep413Bytes({message:'CONTRA authentication',nonce:btoa(String.fromCharCode(...new Uint8Array(32).fill(7))),recipient:'contra.invalid'}),digest=await crypto.subtle.digest('SHA-256',payload),signature=new Uint8Array(await crypto.subtle.sign('Ed25519',pair.privateKey,digest));
  expect(await verifyEd25519(publicKey,signature,digest)).toBe(true);const changed=new Uint8Array(digest);changed[0]^=1;expect(await verifyEd25519(publicKey,signature,changed)).toBe(false);
 });

 it('rejects cross-origin writes and keeps live signing disabled',async()=>{
  const crossOrigin=await SELF.fetch(publicOrigin+'/api/session/challenge',{method:'POST',headers:{Origin:'https://attacker.invalid','Content-Type':'application/json'},body:JSON.stringify({account:'creator.testnet'})});expect(crossOrigin.status).toBe(403);
  const handoff=await SELF.fetch(publicOrigin+'/api/wallet/handoff',{method:'POST',headers:{Origin:publicOrigin,'Content-Type':'application/json'},body:'{}'});expect(handoff.status).toBe(403);expect((await handoff.json()).error).toMatch(/signing is disabled/i);
 });

 it('keeps provider credential probes closed without operator activation authentication',async()=>{
  const response=await SELF.fetch(publicOrigin+'/api/operator/provider-probe',{method:'POST',headers:{Origin:publicOrigin,'Content-Type':'application/json'},body:JSON.stringify({provider:'modal'})});
  expect(response.status).toBe(401);expect(await response.json()).toEqual({error:'Provider activation authentication required'});
 });

 it('preserves pre-handoff rejection but locks post-handoff uncertainty',async()=>{
  const state=stub('rejection-boundary');await state.prepareOperation(operation('pre'));expect((await state.rejectOperation('pre',true)).status).toBe('FAILED');
  await state.prepareOperation(operation('post'));await state.handoffOperation('post');expect((await state.rejectOperation('post',false)).status).toBe('UNKNOWN');
 });

 it('exports a digest-bound complete recovery package after eviction',async()=>{
  const state=stub('backup-package');await state.prepareOperation(operation('backup-op'));await evictDurableObject(state);const backup=await state.backup();
  expect(backup.schema).toBe('CONTRA_CLOUDFLARE_BACKUP_V1');expect(backup.digest).toMatch(/^[0-9a-f]{64}$/);expect(backup.tables.operations).toHaveLength(1);expect(Object.keys(backup.tables)).toHaveLength(13);
 });

 it('reserves provider budgets atomically and rejects conflicting idempotency reuse',async()=>{
  const state=stub('provider-ledger'),request={provider:'meta',idempotency_key:'fixture-1',account:'reviewer.testnet',case_id:'1'.repeat(64),payload_digest:'2'.repeat(64),reservation_micro_usd:100000};
  const jobs=await Promise.all(Array.from({length:6},()=>state.reserveProviderJob(request)));expect(jobs.filter(value=>!value.replayed)).toHaveLength(1);
  await rejection(()=>runInDurableObject(state,instance=>instance.reserveProviderJob({...request,payload_digest:'3'.repeat(64)})),/idempotency conflict/);
  const completed=await state.completeProviderJob({id:jobs[0].id,response_digest:'4'.repeat(64),actual_micro_usd:0});expect(completed.status).toBe('PROPOSED');
  const ledger=await state.providerState('reviewer.testnet'),meta=ledger.budgets.find(value=>value.provider==='meta');expect(meta.cap_micro_usd).toBe(3000000);expect(meta.reserved_micro_usd).toBe(0);expect(meta.used_micro_usd).toBe(0);
 });

 it('locks uncertain provider jobs without releasing or redispatching reservations',async()=>{
  const state=stub('provider-unknown'),job=await state.reserveProviderJob({provider:'baseten',idempotency_key:'fixture-unknown',account:'reviewer.testnet',case_id:'5'.repeat(64),payload_digest:'6'.repeat(64),reservation_micro_usd:200000});
  expect((await state.unknownProviderJob(job.id)).status).toBe('UNKNOWN');expect((await state.reserveProviderJob({provider:'baseten',idempotency_key:'fixture-unknown',account:'reviewer.testnet',case_id:'5'.repeat(64),payload_digest:'6'.repeat(64),reservation_micro_usd:200000})).status).toBe('UNKNOWN');
  await rejection(()=>runInDurableObject(state,instance=>instance.completeProviderJob({id:job.id,response_digest:'7'.repeat(64),actual_micro_usd:0})),/cannot complete/);
 });

 it('persists six disjoint reviewer slots and account-scoped consent or withdrawal history',async()=>{
  const state=stub('reviewer-lifecycle'),invitations=[];
  for(const committee of ['primary','fresh'])for(let slot=1;slot<=3;slot++){const body={committee,slot,purpose:'CONTRA reviewer onboarding'},digestValue=await digest(new TextEncoder().encode(canonical(body)));invitations.push(await state.createReviewerInvitation({digest:digestValue,reviewer_id:`${committee}${slot}.testnet`,operator_id:(committee==='primary'?'a':'b').repeat(63)+slot,committee,slot,expires:Date.now()+60000,body}));}
  expect(invitations).toHaveLength(6);expect(new Set(invitations.map(value=>value.reviewer_id)).size).toBe(6);expect(new Set(invitations.map(value=>value.operator_id)).size).toBe(6);
  const accepted=await state.respondReviewer({digest:invitations[0].digest,reviewer_id:'primary1.testnet',status:'CONSENTED',body:{conflicts:[],custody:'independent declaration'}});expect(accepted.status).toBe('CONSENTED');
  await state.respondReviewer({digest:invitations[1].digest,reviewer_id:'primary2.testnet',status:'WITHDRAWN',body:{reason:'unavailable'}});const history=await state.reviewerLifecycle('primary2.testnet');expect(history.events.map(value=>value.status)).toEqual(['INVITED','WITHDRAWN']);
  await rejection(()=>runInDurableObject(state,instance=>instance.respondReviewer({digest:invitations[0].digest,reviewer_id:'other.testnet',status:'CONSENTED',body:{}})),/not found/);
 });
});
