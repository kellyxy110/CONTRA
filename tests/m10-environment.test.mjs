import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {providerConfig} from '../services/evaluators/provider.mjs';
import {loadRuntimeConfig} from '../services/runtime/config.mjs';

const root=path.resolve(import.meta.dirname,'..');

test('provider credentials remain independently pending by default',()=>{
 const config=providerConfig({});
 for(const provider of Object.values(config)){assert.equal(provider.status,'CREDENTIALS_PENDING');assert.equal(provider.available,false);assert.equal(provider.key,undefined);}
});

test('one malformed live provider does not alter the other provider states',()=>{
 const config=providerConfig({META_LIVE_ENABLED:'true',META_API_BASE_URL:'https://evil.invalid/v1/chat/completions',META_MODEL:'muse-spark-1.3',META_API_KEY:'sentinel'});
 assert.equal(config.meta.status,'MISCONFIGURED');assert(config.meta.issues.some(value=>value.includes('allowlist')));
 assert.equal(config.baseten.status,'CREDENTIALS_PENDING');assert.equal(config.modal.status,'CREDENTIALS_PENDING');
});

test('provider readiness requires every independent financial and interface gate',()=>{
 const config=providerConfig({META_LIVE_ENABLED:'true',META_API_BASE_URL:'https://api.meta.ai/v1/chat/completions',META_MODEL:'muse-spark-1.3',META_API_KEY:'sentinel',META_TIMEOUT_MS:'30000',META_MAX_REQUEST_MICRO_USD:'100000',META_MAX_SPEND_USD:'3',META_MODEL_VERIFIED:'1',META_BILLING_LIMIT_VERIFIED:'1',CONTRA_PAID_USAGE_AUTHORIZED:'1',CONTRA_CREDITS_VERIFIED:'1',CONTRA_PRICING_VERIFIED:'1'});
 assert.equal(config.meta.status,'READY');assert.equal(config.meta.available,true);assert.equal(config.meta.timeoutMs,30000);assert.equal(config.meta.maximumSpendUsd,3);
 assert.equal(config.baseten.available,false);assert.equal(config.modal.available,false);
});

test('runtime rejects credential-bearing and non-origin public URLs',()=>{
 const base={CONTRA_CHAIN_MODE:'testnet',CONTRA_RPC_URL:'https://rpc.testnet.near.org',CONTRA_CONTRACT_ACCOUNT:'contra-contestation.testnet',CONTRA_DATA_DIR:path.join(root,'.test-data')};
 assert.throws(()=>loadRuntimeConfig({...base,CONTRA_RPC_URL:'https://user:pass@rpc.testnet.near.org'}),/credentials/);
 assert.throws(()=>loadRuntimeConfig({...base,CONTRA_PUBLIC_ORIGIN:'https://contra-near.pages.dev/path'}),/without a path/);
 assert.throws(()=>loadRuntimeConfig({...base,CONTRA_ALLOWED_ORIGINS:'https://contra-near.pages.dev?x=1'}),/query or fragment/);
});

test('secret files are ignored while placeholder examples remain eligible for tracking',()=>{
 for(const file of ['.env','.env.local','.env.testnet','.env.providers','.dev.vars'])assert.doesNotThrow(()=>execFileSync('git',['check-ignore','-q',file],{cwd:root}));
 for(const file of ['.env.example','.env.local.example','.env.testnet.example','.env.providers.example','.dev.vars.example']){
  assert.equal(fs.existsSync(path.join(root,file)),true,file);
  const text=fs.readFileSync(path.join(root,file),'utf8');assert.equal(/(?:BEGIN (?:RSA|OPENSSH) PRIVATE KEY|ed25519:[1-9A-HJ-NP-Za-km-z]{80,}|sk-[A-Za-z0-9]{20,})/.test(text),false,file);
 }
});
