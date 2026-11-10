import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assessCreatorEligibility,requireCreatorEligibility} from '../services/deployment/creator-eligibility.mjs';

const evidence=JSON.parse(fs.readFileSync(new URL('../project/artifacts/m08/testnet-deployment/deployment.json',import.meta.url),'utf8'));

test('deployed M08 configuration has no creator that can satisfy create_case',()=>{
 const config={contract_account:evidence.contract_account,creator_allowlist:evidence.initial_state.creator_allowlist};
 const result=assessCreatorEligibility(config);
 assert.equal(result.contract_account_listed,true);
 assert.deepEqual(result.eligible_creators,[]);
 assert.equal(result.can_create_case,false);
 assert.throws(()=>requireCreatorEligibility(config),/No allowlisted account/);
});

test('a distinct valid allowlisted account restores creator eligibility without weakening the rule',()=>{
 const result=requireCreatorEligibility({contract_account:'contra-contestation.testnet',creator_allowlist:['creator.testnet','contra-contestation.testnet']});
 assert.deepEqual(result.eligible_creators,['creator.testnet']);
 assert.equal(result.can_create_case,true);
});
