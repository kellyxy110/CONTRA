import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {assessDeploymentPlan,deploymentCommand,deploymentIntentDigest,verifyDeploymentTarget} from '../services/deployment/preflight.mjs';

const bytes=Buffer.from([0,97,115,109,1,0,0,0]),abi={production_exports:['new'],fault_only_exports:['set_callback_fault']},sha=createHash('sha256').update(bytes).digest('hex'),key='ed25519:11111111111111111111111111111111';
const ready=()=>{const plan={schema:'CONTRA_TESTNET_DEPLOYMENT_V1',network:'testnet',rpc_url:'https://rpc.testnet.near.org',contract_account:'contra.testnet',signer_account:'contra.testnet',signer_public_key:key,custody_method:'os-keychain',artifact_path:'contracts/contestation/target/wasm32-unknown-unknown/release/contra_contestation.wasm',artifact_sha256:sha,expected_current_code_hash:'EMPTY',max_total_cost_yocto:'1000000000000000000000000',minimum_account_balance_yocto:'2000000000000000000000000',minimum_balance_is_pre_existing_prerequisite:true,opening_balance_funding_requires_separate_authorisation:true,maximum_combined_owner_exposure_yocto:'3000000000000000000000000',initial_owner_account:'owner.testnet',creator_allowlist:['creator.testnet'],owner_authorisation:{id:'OWNER-M08-1',approved_by:'owner',approved_at:'2026-11-09T00:00:00.000Z',expires_at:'2026-11-10T00:00:00.000Z'}};plan.owner_authorisation.approved_plan_sha256=deploymentIntentDigest(plan);return plan;};
const options={artifactBytes:bytes,artifactExports:['new'],abi,now:()=>new Date('2026-11-09T12:00:00.000Z')};

test('preparation plan reports every owner-controlled deployment blocker',()=>{
 const plan={...ready(),contract_account:null,signer_account:null,signer_public_key:null,custody_method:null,expected_current_code_hash:null,max_total_cost_yocto:null,minimum_account_balance_yocto:null,minimum_balance_is_pre_existing_prerequisite:null,opening_balance_funding_requires_separate_authorisation:null,maximum_combined_owner_exposure_yocto:null,initial_owner_account:null,creator_allowlist:[],owner_authorisation:null};
 const result=assessDeploymentPlan(plan,options);assert.equal(result.ready,false);assert.equal(result.blockers.length,13);assert.equal(result.deployment_intent_sha256,deploymentIntentDigest(plan));
});

test('authorised offline plan binds exact production artifact and emits a complete testnet command',()=>{
 const plan=ready(),result=assessDeploymentPlan(plan,options);assert.equal(result.ready,true);assert.equal(result.deployment_intent_sha256,plan.owner_authorisation.approved_plan_sha256);assert.equal(result.artifact.sha256,sha);assert.match(deploymentCommand(plan),/^near contract deploy contra\.testnet /);assert.match(deploymentCommand(plan),/network-config testnet sign-with-keychain send$/);
 const ledger={...plan,custody_method:'ledger'};assert.match(deploymentCommand(ledger),/sign-with-ledger send$/);
 const offline={...plan,custody_method:'offline-custody'};assert.match(deploymentCommand(offline),/network-config testnet sign-later$/);
});

test('preflight refuses mainnet, embedded secrets, signer mismatch and artifact mismatch',()=>{
 assert.throws(()=>assessDeploymentPlan({...ready(),network:'mainnet'},options),/testnet/);
 assert.throws(()=>assessDeploymentPlan({...ready(),private_key:'ed25519:unsafe'},options),/forbidden secret/);
 assert.throws(()=>assessDeploymentPlan({...ready(),signer_account:'other.testnet'},options),/must be the contract account/);
 assert.throws(()=>assessDeploymentPlan({...ready(),artifact_sha256:'0'.repeat(64)},options),/SHA-256/);
 const changed=ready();changed.creator_allowlist=['other.testnet'];assert.throws(()=>assessDeploymentPlan(changed,options),/does not bind/);
 const exposure=ready();exposure.maximum_combined_owner_exposure_yocto='2000000000000000000000000';exposure.owner_authorisation.approved_plan_sha256=deploymentIntentDigest(exposure);assert.equal(assessDeploymentPlan(exposure,options).ready,false);
});

test('read-only target verification binds testnet, full-access key, empty code and fresh final block',async()=>{
 const plan=ready(),timestamp='1794225600000000000',transport=async(_url,{body})=>{const request=JSON.parse(body);let result;if(request.method==='status')result={chain_id:'testnet',sync_info:{syncing:false}};else if(request.params.request_type==='view_account')result={code_hash:'11111111111111111111111111111111',amount:'3000000000000000000000000'};else if(request.params.request_type==='view_access_key_list')result={keys:[{public_key:key,access_key:{permission:'FullAccess'}}]};else if(request.method==='block')result={header:{height:42,hash:'BLOCK42',timestamp_nanosec:timestamp}};else throw Error('unexpected request');return new Response(JSON.stringify({jsonrpc:'2.0',result}),{status:200});};
 const result=await verifyDeploymentTarget(plan,{transport,now:()=>new Date('2026-11-09T12:00:01.000Z')});assert.equal(result.current_code_hash,'EMPTY');assert.equal(result.block_hash,'BLOCK42');
});

test('read-only target verification fails closed on wrong network, key permission, code or staleness',async()=>{
 const plan=ready(),respond=overrides=>async(_url,{body})=>{const request=JSON.parse(body);let result;if(request.method==='status')result={chain_id:overrides.network||'testnet',sync_info:{syncing:false}};else if(request.params.request_type==='view_account')result={code_hash:overrides.code||'11111111111111111111111111111111',amount:overrides.amount||'3000000000000000000000000'};else if(request.params.request_type==='view_access_key_list')result={keys:[{public_key:key,access_key:{permission:overrides.permission||'FullAccess'}}]};else result={header:{height:42,hash:'BLOCK42',timestamp_nanosec:overrides.timestamp||'1794225600000000000'}};return new Response(JSON.stringify({jsonrpc:'2.0',result}),{status:200});};
 const clock=()=>new Date('2026-11-09T12:00:01.000Z');await assert.rejects(verifyDeploymentTarget(plan,{transport:respond({network:'mainnet'}),now:clock}),/not a synced/);await assert.rejects(verifyDeploymentTarget(plan,{transport:respond({permission:{FunctionCall:{}}}),now:clock}),/full-access/);await assert.rejects(verifyDeploymentTarget(plan,{transport:respond({code:'DIFFERENT'}),now:clock}),/code hash/);await assert.rejects(verifyDeploymentTarget(plan,{transport:respond({amount:'1'}),now:clock}),/balance/);await assert.rejects(verifyDeploymentTarget(plan,{transport:respond({timestamp:'1'}),now:clock}),/stale/);
});
