import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {Store} from '../services/api/store.mjs';
import {createApp} from '../services/api/server.mjs';

const directory=t=>{const value=fs.mkdtempSync(path.join(os.tmpdir(),'contra-ready-'));t.after(()=>fs.rmSync(value,{recursive:true,force:true}));return value;};
const listen=async(app,t)=>{await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));t.after(()=>app.server.listening?new Promise(resolve=>app.server.close(resolve)):undefined);return `http://127.0.0.1:${app.server.address().port}`;};

test('liveness does not claim chain or storage readiness',async t=>{
 const store=new Store(directory(t)),app=createApp({store}),base=await listen(app,t),response=await fetch(base+'/api/live'),body=await response.json();
 assert.equal(response.status,200);assert.equal(body.live,true);assert.equal('ready' in body,false);store.close();
});

test('readiness requires a healthy chain and intact durable storage',async t=>{
 const store=new Store(directory(t)),chain={network:'testnet',contractAccount:'contra.testnet',health:async()=>({status:'ready',network:'testnet',contract_account:'contra.testnet',source:{finality:'final'}})},app=createApp({store,chain}),base=await listen(app,t),response=await fetch(base+'/api/ready'),body=await response.json();
 assert.equal(response.status,200);assert.equal(body.ready,true);assert.equal(body.persistence.integrity,'ok');assert.equal(body.chain_health.source.finality,'final');const blob=store.put(Buffer.from('readiness evidence'),'text/plain');fs.unlinkSync(path.join(store.dir,'objects',blob.digest));const corrupt=await fetch(base+'/api/ready'),corruptBody=await corrupt.json();assert.equal(corrupt.status,503);assert.equal(corruptBody.ready,false);assert.equal(corruptBody.persistence.integrity,'failed');store.close();
});

test('unavailable and stale chain states are live but not ready',async t=>{
 for(const status of ['unavailable','stale']){const store=new Store(directory(t)),chain={network:'testnet',contractAccount:'contra.testnet',health:async()=>({status,network:'testnet',contract_account:'contra.testnet'})},app=createApp({store,chain}),base=await listen(app,t);assert.equal((await fetch(base+'/api/live')).status,200);const ready=await fetch(base+'/api/ready');assert.equal(ready.status,503);assert.equal((await ready.json()).ready,false);await new Promise(resolve=>app.server.close(resolve));store.close();}
 const store=new Store(directory(t)),chain={network:'testnet',contractAccount:'contra.testnet',health:async()=>{throw Error('RPC unavailable');}},app=createApp({store,chain}),base=await listen(app,t),ready=await fetch(base+'/api/ready'),body=await ready.json();assert.equal(ready.status,503);assert.equal(body.ready,false);assert.equal(body.chain_health.error,'Chain health check failed');store.close();
});

test('portable service contract enforces one persistent writer and separate probes',()=>{
 const service=JSON.parse(fs.readFileSync(new URL('../config/runtime-service.example.json',import.meta.url),'utf8'));assert.equal(service.schema,'CONTRA_RUNTIME_SERVICE_V1');assert.equal(service.process.replicas,1);assert.equal(service.storage.single_writer,true);assert.equal(service.storage.persistent_volume_required,true);assert.equal(service.probes.liveness,'/api/live');assert.equal(service.probes.readiness,'/api/ready');assert.equal(service.deployment_authorised,false);
});
