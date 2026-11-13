import test from 'node:test';
import assert from 'node:assert/strict';
import {buildEvidenceManifest, storeEvidence, evidenceSubmissionArgs} from '../apps/web/evidence-operations.mjs';

test('evidence retains provenance, criteria and contract arguments', async () => {
 const data = new Map([['captured','2026-11-12T10:00:00Z'],['content','proof'],['origin','source'],['criterion-7','claim']]);
 const record = {terms_digest:'terms', terms:{criteria:[{criterion_id:7}]}};
 const manifest = buildEvidenceManifest(data, record, new Date('2026-11-12T11:00:00Z'));
 assert.deepEqual(manifest.sources[0].provenance,{origin:'source',captured_at:'2026-11-12T10:00:00.000Z'});
 assert.deepEqual(manifest.criteria,[{criterion_id:7,claim:'claim',source_ids:['source-1']}]);
 const post=async (path, body)=>({path,body,digest:'digest'});
 assert.deepEqual(await storeEvidence({post,caseId:'case',manifest}),{path:'evidence',body:{case_id:'case',manifest},digest:'digest'});
 assert.deepEqual(evidenceSubmissionArgs('case',record,'digest'),{case_id:'case',terms_digest:'terms',manifest_digest:'digest'});
});
