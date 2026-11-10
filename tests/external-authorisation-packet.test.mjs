import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {authorisationPacketDigest,inspectAuthorisationPacket} from '../scripts/external-authorisation-packet.mjs';

const fixture=()=>JSON.parse(fs.readFileSync(new URL('../config/testnet-authorisation-proposal.json',import.meta.url),'utf8'));

test('external authorisation packet has stable digests and exposes independent authority gates',()=>{
 const result=inspectAuthorisationPacket(fixture());
 assert.match(result.packet_sha256,/^[a-f0-9]{64}$/);
 assert.match(result.deployment_intent_sha256,/^[a-f0-9]{64}$/);
 assert.deepEqual(result.readiness.m08_contract_deployment,{ready:false,missing:['owner authorisation bound to the final deployment intent digest']});
 assert.equal(fixture().deployment_plan.custody_method,'os-keychain');
 assert.equal(fixture().account_observation.public_key,fixture().deployment_plan.signer_public_key);
 assert.deepEqual(result.readiness.m09_hosting,{ready:false,missing:['hosting destination and deployment authority']});
 assert.deepEqual(result.readiness.m10_provider_usage,{ready:false,missing:['separate provider spending authorisation']});
});

test('M08 readiness is independent from hosting and provider authorisation',()=>{
 const packet=fixture(),plan=packet.deployment_plan;
 packet.account_observation={status:'EXISTS'};
 plan.signer_public_key='ed25519:11111111111111111111111111111111';
 plan.artifact_sha256='a'.repeat(64);
 plan.owner_authorisation={approved_plan_sha256:'placeholder'};
 const result=inspectAuthorisationPacket(packet);
 assert.equal(result.readiness.m08_contract_deployment.ready,true);
 assert.equal(result.readiness.m09_hosting.ready,false);
 assert.equal(result.readiness.m10_provider_usage.ready,false);
});

test('authorising hosting or provider usage cannot authorise M08',()=>{
 const packet=fixture();packet.hosting.deployment_authorised=true;packet.providers.spending_authorised=true;
 const result=inspectAuthorisationPacket(packet);
 assert.equal(result.readiness.m08_contract_deployment.ready,false);
 assert.equal(result.readiness.m09_hosting.ready,true);
 assert.equal(result.readiness.m10_provider_usage.ready,true);
});

test('packet digest changes if an action, cost ceiling or custody statement changes',()=>{
 const packet=fixture(),original=authorisationPacketDigest(packet);
 packet.permitted_actions.push('unexpected action');assert.notEqual(authorisationPacketDigest(packet),original);
 const cost=fixture();cost.deployment_plan.max_total_cost_yocto='6000000000000000000000000';assert.notEqual(authorisationPacketDigest(cost),original);
 const custody=fixture();custody.custody.method='offline-custody';assert.notEqual(authorisationPacketDigest(custody),original);
});
