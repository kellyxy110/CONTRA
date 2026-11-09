import {env} from 'cloudflare:workers';
import {evictDurableObject,runInDurableObject,SELF} from 'cloudflare:test';
import {describe,it,expect} from 'vitest';

const digest=async bytes=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(value=>value.toString(16).padStart(2,'0')).join('');
const tx='11111111111111111111111111111111',block='22222222222222222222222222222222';
const stub=name=>env.CONTRA_STATE.getByName(name);
const operation=(id,account='creator.testnet')=>({id,account,payload_hash:'a'.repeat(64),contract_account:'contra-contestation.testnet'});
async function rejection(call,pattern){
 let caught=null;try{await call();}catch(error){caught=error;}
 expect(caught).toBeInstanceOf(Error);expect(caught.message).toMatch(pattern);
}

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

 it('serves liveness, durable readiness and fail-closed unmigrated APIs',async()=>{
  expect((await SELF.fetch('https://contra.invalid/api/live')).status).toBe(200);
  const ready=await SELF.fetch('https://contra.invalid/api/ready');expect(ready.status).toBe(200);expect((await ready.json()).storage).toBe('cloudflare-durable-object-sqlite');
  const unavailable=await SELF.fetch('https://contra.invalid/api/transactions',{method:'POST'});expect(unavailable.status).toBe(503);expect((await unavailable.json()).error).toMatch(/no transaction is confirmed/);
 });
});
