import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assessWalletAuthority} from '../services/wallet/authority.mjs';

const packet=JSON.parse(fs.readFileSync(new URL('../config/m09-wallet-authority-proposal.json',import.meta.url)));

test('repaired contract and creator pass read-only readiness without enabling signing',()=>{
 const result=assessWalletAuthority(packet,{now:new Date('2026-11-10T10:00:00Z'),chain:{code_hash:packet.contract_code_hash}});
 assert.equal(result.ready,false);assert.equal(result.non_financial_ready,true);
 assert.deepEqual(result.blockers,['verified beneficiary identity','owner approval','live signing gate']);
});

test('beneficiary must differ from creator and contract',()=>{
 for(const beneficiary_account of [packet.creator_account,packet.contract_account]){
  const result=assessWalletAuthority({...packet,beneficiary_account,beneficiary_public_keys:['ed25519:11111111111111111111111111111111']},{now:new Date('2026-11-10T10:00:00Z'),chain:{code_hash:packet.contract_code_hash}});
  assert(result.blockers.includes('distinct beneficiary identity'));
 }
});

test('code drift, expired authority and unbounded totals fail closed',()=>{
 const result=assessWalletAuthority({...packet,maximum_total_journey_expenditure_yocto:'1',expires_at:'2026-11-09T00:00:00Z'},{now:new Date('2026-11-10T10:00:00Z'),chain:{code_hash:'11111111111111111111111111111111'}});
 assert(result.blockers.includes('verified contract code hash'));assert(result.blockers.includes('bounded expenditure limits'));assert(result.blockers.includes('unexpired authority'));
});
