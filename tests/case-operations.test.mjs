import test from 'node:test';
import assert from 'node:assert/strict';
import {deadlineFields, previewCase, yocto} from '../apps/web/case-operations.mjs';

test('case preview preserves policy, deadlines and contract arguments', async () => {
 const now=Date.parse('2026-11-12T12:00:00Z');
 const values=new Map([['amount','1'],['beneficiary_id','beneficiary.testnet'],['creator_operator_id','a'],['beneficiary_operator_id','b'],['kind','GENERAL'],['requirement','work'],['policy','policy']]);
 deadlineFields.forEach((field,index)=>values.set(field,new Date(now+(index+1)*3600000).toISOString()));
 const calls=[];
 const post=async (path,body)=>{calls.push([path,body]);return {digest:body.text+'-digest'}};
 const view=async (method,args)=>{calls.push([method,args]);return {terms_digest:'terms'}};
 const {terms,preview}=await previewCase({data:values,account:'creator.testnet',post,view,requestId:'request',now});
 assert.equal(terms.amount_yocto,'1000000000000000000000000');
 assert.equal(terms.criteria[0].requirement_digest,'work-digest');
 assert.equal(terms.evidence_policy_digest,'policy-digest');
 assert.equal(terms.fund_by_ns,String(BigInt(now+3600000)*1000000n));
 assert.deepEqual(calls[2],['preview_case',{creator_id:'creator.testnet',request_id:'request',terms}]);
 assert.equal(preview.terms_digest,'terms');
 assert.throws(()=>yocto('1.1'),/limited to 1 NEAR/);
 values.set(deadlineFields[1],values.get(deadlineFields[0]));
 await assert.rejects(previewCase({data:values,account:'creator.testnet',post,view,requestId:'request',now}),/Deadlines/);
});
