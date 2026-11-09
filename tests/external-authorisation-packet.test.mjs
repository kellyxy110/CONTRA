import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {authorisationPacketDigest,inspectAuthorisationPacket} from '../scripts/external-authorisation-packet.mjs';

const fixture=()=>JSON.parse(fs.readFileSync(new URL('../config/testnet-authorisation-proposal.json',import.meta.url),'utf8'));

test('external authorisation packet has stable digests and exposes every unresolved authority gate',()=>{
 const result=inspectAuthorisationPacket(fixture());
 assert.match(result.packet_sha256,/^[a-f0-9]{64}$/);
 assert.match(result.deployment_intent_sha256,/^[a-f0-9]{64}$/);
 assert.equal(result.ready_for_external_execution,false);
 assert.deepEqual(result.missing,['signer public key','production artifact SHA-256','owner authorisation bound to the final deployment intent digest','hosting destination and deployment authority','separate provider spending authorisation']);
});

test('packet digest changes if an action, cost ceiling or custody statement changes',()=>{
 const packet=fixture(),original=authorisationPacketDigest(packet);
 packet.permitted_actions.push('unexpected action');assert.notEqual(authorisationPacketDigest(packet),original);
 const cost=fixture();cost.deployment_plan.max_total_cost_yocto='6000000000000000000000000';assert.notEqual(authorisationPacketDigest(cost),original);
 const custody=fixture();custody.custody.method='offline-custody';assert.notEqual(authorisationPacketDigest(custody),original);
});
