import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
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

test('judge acceptance matrix contains one classified row for every frozen criterion',()=>{
 const source=fs.readFileSync(new URL('../docs/judges/ACCEPTANCE_MATRIX.md',import.meta.url),'utf8'),rows=[...source.matchAll(/^\| (AC\d{2}) \| (PASS|PARTIAL|BLOCKED|DEFERRED) \|/gm)].map(match=>({id:match[1],status:match[2]}));
 assert.deepEqual(rows.map(row=>row.id),Array.from({length:33},(_,index)=>`AC${String(index+1).padStart(2,'0')}`));
 assert.deepEqual(Object.fromEntries(['PASS','PARTIAL','BLOCKED','DEFERRED'].map(status=>[status,rows.filter(row=>row.status===status).length])),{PASS:23,PARTIAL:8,BLOCKED:0,DEFERRED:2});
});
