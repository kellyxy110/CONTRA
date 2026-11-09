import test from 'node:test';
import assert from 'node:assert/strict';
import {assessDocumentation} from '../scripts/ci-doc-drift.mjs';

test('interface changes require matching documentation',()=>{
 const result=assessDocumentation(['contracts/contestation/src/lib.rs']);
 assert.deepEqual(result.missing,['contract interface']);
 assert.equal(result.justified,false);
});

test('appropriate documentation satisfies interface impact',()=>{
 const result=assessDocumentation(['contracts/contestation/src/lib.rs','docs/protocol/CONTESTATION_MIGRATION.md']);
 assert.deepEqual(result.missing,[]);
});

test('specific no-change justification is accepted but short placeholders are not',()=>{
 assert.equal(assessDocumentation(['services/runtime/config.mjs'],'configuration shape and supported values are unchanged').justified,true);
 assert.equal(assessDocumentation(['services/runtime/config.mjs'],'none').justified,false);
});
