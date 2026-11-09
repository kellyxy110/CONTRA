import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyJudgeEvidence} from '../scripts/run-judge-quickstart.mjs';

const digest='a'.repeat(64),fixture=()=>({environment:{contract_path:'real local NEAR Sandbox',external_wallet_path:'simulated handoff only',provider_path:'mocked in-process transports only'},counts:{sandbox_receipts:46,persisted_operations:47},wallet:{dispatch_count:0,restart_status:'UNKNOWN',recovered_status:'PENDING'},trust_boundary:{ai_commitments_before:0,ai_commitments_after:0,ai_status:'proposal-only',modal_proposal_digest:digest,verified_proposal_digest:'b'.repeat(64)},settlement:{final_disposition:'REJECT',resolution_basis:'FRESH',balance_delta_yocto:'1000000000000000000000000',result:'SUCCESS_VERIFIED'},timeout:{resolution_basis:'BASE_REFUND',final_disposition:'UNRESOLVED'}});

test('judge report requires genuine Sandbox, exact settlement and explicit simulation boundaries',()=>{
 const report=fixture();assert.equal(verifyJudgeEvidence(report).verified,true);
 for(const mutate of [value=>value.environment.contract_path='fixture',value=>value.wallet.dispatch_count=1,value=>value.trust_boundary.ai_commitments_after=1,value=>value.settlement.balance_delta_yocto='1',value=>value.timeout.resolution_basis='KEEP_PRIMARY',value=>value.counts.sandbox_receipts=0]){const changed=structuredClone(report);mutate(changed);assert.throws(()=>verifyJudgeEvidence(changed));}
});
