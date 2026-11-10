import {env} from 'cloudflare:workers';
import {evictDurableObject,runInDurableObject,SELF} from 'cloudflare:test';
import {describe,it,expect} from 'vitest';
import {nep413Bytes,verifyEd25519} from '../../services/cloudflare/worker.mjs';

const digest=async bytes=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(value=>value.toString(16).padStart(2,'0')).join('');
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

 it('fails readiness closed when durable schema integrity is lost',async()=>{
  const state=stub('storage-failure');await state.health();await runInDurableObject(state,async(_instance,ctx)=>ctx.storage.sql.exec('DROP TABLE artifacts'));
  await rejection(()=>runInDurableObject(state,instance=>instance.health()),/schema is incomplete/);
 });

 it('serves liveness and reports chain readiness honestly',async()=>{
  expect((await SELF.fetch(publicOrigin+'/api/live')).status).toBe(200);
  const ready=await SELF.fetch(publicOrigin+'/api/ready'),report=await ready.json();expect(report.storage.integrity).toBe('ok');
  if(ready.status===200){expect(report.ready).toBe(true);expect(report.chain.status).toBe('ready');expect(report.chain.source.finality).toBe('final');}
  else{expect(ready.status).toBe(503);expect(report.ready).toBe(false);expect(report.chain.status).toBe('unavailable');}
 },12000);

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

 it('preserves pre-handoff rejection but locks post-handoff uncertainty',async()=>{
  const state=stub('rejection-boundary');await state.prepareOperation(operation('pre'));expect((await state.rejectOperation('pre',true)).status).toBe('FAILED');
  await state.prepareOperation(operation('post'));await state.handoffOperation('post');expect((await state.rejectOperation('post',false)).status).toBe('UNKNOWN');
 });

 it('exports a digest-bound complete recovery package after eviction',async()=>{
  const state=stub('backup-package');await state.prepareOperation(operation('backup-op'));await evictDurableObject(state);const backup=await state.backup();
  expect(backup.schema).toBe('CONTRA_CLOUDFLARE_BACKUP_V1');expect(backup.digest).toMatch(/^[0-9a-f]{64}$/);expect(backup.tables.operations).toHaveLength(1);expect(Object.keys(backup.tables)).toHaveLength(8);
 });
});
