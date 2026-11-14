import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLiveReviewerInvitations} from '../services/reviewers/live-invitations.mjs';

const accounts=['primary1.testnet','primary2.testnet','primary3.testnet','appeal.testnet','appeal2.testnet','appeal3.testnet'];

test('Phase 3 invitations bind six distinct accounts to disjoint committee slots',()=>{
 const values=buildLiveReviewerInvitations({accounts,expires:Date.now()+60000});
 assert.equal(values.length,6);
 assert.deepEqual(values.map(value=>[value.committee,value.slot]),[['primary',1],['primary',2],['primary',3],['fresh',1],['fresh',2],['fresh',3]]);
 assert.equal(new Set(values.map(value=>value.operator_id)).size,6);
 assert.equal(new Set(values.map(value=>value.digest)).size,6);
 assert(values.every(value=>value.body.reviewer_id===value.reviewer_id&&value.body.operator_id===value.operator_id));
});

test('Phase 3 invitation planning rejects duplicate or incomplete account sets',()=>{
 assert.throws(()=>buildLiveReviewerInvitations({accounts:accounts.slice(0,5),expires:Date.now()+60000}),/Exactly six/);
 assert.throws(()=>buildLiveReviewerInvitations({accounts:[...accounts.slice(0,5),accounts[0]],expires:Date.now()+60000}),/six distinct/);
});
