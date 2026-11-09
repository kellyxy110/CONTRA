import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assessM10Readiness,assessProviderReadiness,assessReviewerReadiness,controlStatementDigest} from '../services/external/m10-readiness.mjs';

const now=()=>new Date('2026-11-10T12:00:00.000Z');
const hash=value=>controlStatementDigest({value});
const reviewers=()=>({schema:'CONTRA_REVIEWER_EXTERNAL_READINESS_V1',reviewers:Array.from({length:6},(_,index)=>({account_id:`external-${index+1}.testnet`,operator_id:hash(`operator-${index+1}`),committee:index<3?'primary':'fresh',control_statement_digest:hash(`statement-${index+1}`),control_signature_verified:true,conflict_declared:false,available_from:'2026-11-10T00:00:00.000Z',available_until:'2026-11-11T00:00:00.000Z'}))});
const providers=()=>({schema:'CONTRA_PROVIDER_EXTERNAL_READINESS_V1',providers:Object.fromEntries([['meta',3],['baseten',3],['modal',5]].map(([name,cap])=>[name,{documentation_verified:true,account_access_verified:true,model_identifier:`${name}-verified-id`,interface_smoke_verified:true,credits_verified:true,pricing_verified:true,billing_limit_verified:true,owner_authorised:true,server_secret_configured:true,maximum_authorised_usd:cap}]))});

test('checked-in M10 proposal is fail-closed and does not imply external readiness',()=>{
 const input=JSON.parse(fs.readFileSync(new URL('../config/m10-external-readiness.example.json',import.meta.url),'utf8')),result=assessM10Readiness(input,{now});
 assert.equal(result.ready,false);assert.equal(result.reviewer.ready,false);assert.equal(result.reviewer.reviewer_count,0);
 for(const provider of Object.values(result.provider.providers))assert.equal(provider.ready,false);
});

test('reviewer readiness requires six distinct controls, operator-disjoint committees and live availability',()=>{
 const valid=reviewers();assert.equal(assessReviewerReadiness(valid,{now}).ready,true);
 const shared=structuredClone(valid);shared.reviewers[3].operator_id=shared.reviewers[0].operator_id;const result=assessReviewerReadiness(shared,{now});assert.equal(result.ready,false);assert(result.issues.some(value=>value.includes('not independent')));
 const expired=structuredClone(valid);expired.reviewers[2].available_until='2026-11-10T11:59:59.000Z';assert.equal(assessReviewerReadiness(expired,{now}).ready,false);
 const unsigned=structuredClone(valid);unsigned.reviewers[4].control_signature_verified=false;assert.equal(assessReviewerReadiness(unsigned,{now}).ready,false);
});

test('provider readiness is independent per provider and enforces each programme cap',()=>{
 const valid=providers();assert.equal(assessProviderReadiness(valid).ready,true);
 const metaBlocked=structuredClone(valid);metaBlocked.providers.meta.owner_authorised=false;let result=assessProviderReadiness(metaBlocked);assert.equal(result.ready,false);assert.equal(result.providers.meta.ready,false);assert.equal(result.providers.baseten.ready,true);assert.equal(result.providers.modal.ready,true);
 const overspend=structuredClone(valid);overspend.providers.baseten.maximum_authorised_usd=3.01;result=assessProviderReadiness(overspend);assert.equal(result.providers.baseten.ready,false);assert(result.providers.baseten.issues.some(value=>value.includes('USD 3')));
 assert.throws(()=>assessProviderReadiness({...valid,api_key:'unsafe'}),/forbidden secret/);
});

test('complete M10 readiness requires both independent reviewers and all bounded providers',()=>{
 assert.equal(assessM10Readiness({reviewers:reviewers(),providers:providers()},{now}).ready,true);
 const missingReviewer=reviewers();missingReviewer.reviewers.pop();const result=assessM10Readiness({reviewers:missingReviewer,providers:providers()},{now});assert.equal(result.ready,false);assert.equal(result.provider.ready,true);
});
