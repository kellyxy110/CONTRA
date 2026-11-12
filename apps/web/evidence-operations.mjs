export function buildEvidenceManifest(data, caseRecord, now = new Date()) {
 const captured = new Date(data.get('captured')).toISOString();
 return {
  created_at: now.toISOString(),
  sources: [{
   source_id:'source-1', media_type:'text/plain', content:data.get('content'),
   provenance:{origin:data.get('origin'), captured_at:captured},
  }],
  criteria:(caseRecord.terms?.criteria || []).map(criterion => ({
   criterion_id:criterion.criterion_id,
   claim:data.get(`criterion-${criterion.criterion_id}`),
   source_ids:['source-1'],
  })),
 };
}

export async function storeEvidence({post, caseId, manifest}) {
 return post('evidence', {case_id:caseId, manifest});
}

export function evidenceSubmissionArgs(caseId, caseRecord, digest) {
 return {case_id:caseId, terms_digest:caseRecord.terms_digest, manifest_digest:digest};
}
