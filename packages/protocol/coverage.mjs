const LABELS = ['Evidence', 'Provenance', 'Review', 'Finality', 'Challenge', 'Quorum', 'Keyboard', 'Criteria'];
const DECISIVE = new Set(['ACCEPT', 'REJECT']);
const COMPLETED_EVALUATIONS = new Set(['FULFILLED', 'NOT_FULFILLED', 'INCONCLUSIVE']);
const LENS_SECTORS = {
  Criteria: new Set(['Evidence', 'Provenance', 'Keyboard', 'Criteria']),
  Evidence: new Set(['Evidence', 'Provenance', 'Review', 'Quorum']),
  Overall: new Set(LABELS)
};

export const COVERAGE_LENSES = {
  Criteria: 'Acceptance-record lens: linked criterion evidence, source provenance, verified keyboard results and criterion completion.',
  Evidence: 'Adjudication-readiness lens: retrievable evidence, provenance, selected-round participation and quorum.',
  Overall: 'Lifecycle lens: all eight evidence, review, challenge and settlement measurements.'
};

const count = values => values.filter(Boolean).length;
const entry = (label, numerator, denominator, source, status = 'measured', observedAt = null, reason = '') => ({label, numerator, denominator, source, status, observedAt, reason});
const unavailable = (label, source, status, observedAt, reason) => entry(label, 0, 0, source, status, observedAt, reason);

export function coverageDepth(metric) {
  if (metric.status !== 'measured' || !metric.denominator) return 0;
  return Math.max(0, Math.min(1, metric.numerator / metric.denominator));
}

export function coverageValue(metric) {
  if (metric.status === 'measured') return `${Math.round(coverageDepth(metric) * 100)}%`;
  if (metric.status === 'not-applicable') return 'N/A';
  if (metric.status === 'inaccessible') return 'Locked';
  if (metric.status === 'missing') return 'Missing';
  return 'Unavailable';
}

function selectedRound(c) {
  const roundId = c.challenge ? 1 : 0;
  const slots = Array.isArray(c.rounds?.[roundId]) ? c.rounds[roundId] : null;
  const committee = roundId ? c.terms?.fresh_committee : c.terms?.primary_committee;
  return {roundId, slots, expected: slots?.length || committee?.length || 0};
}

function evidenceState(c, availability) {
  const status = availability?.__status || (availability === null ? 'unavailable' : 'available');
  const known = status === 'available';
  const manifest = availability?.__manifest || null;
  const sources = manifest?.sources || [];
  const manifestCriteria = manifest?.criteria || [];
  const sourceById = new Map(sources.map(source => [source.source_id, source]));
  const available = digest => known && availability?.[digest] === true;
  const validEvidence = new Set();

  for (const criterion of c.terms?.criteria || []) {
    const record = manifestCriteria.find(item => item.criterion_id === criterion.criterion_id);
    if (!record?.source_ids?.length) continue;
    const linked = record.source_ids.map(id => sourceById.get(id));
    if (linked.every(source => source?.digest && available(source.digest))) validEvidence.add(criterion.criterion_id);
  }

  const validProvenance = sources.filter(source => source.digest && available(source.digest) && source.provenance?.origin && source.provenance?.captured_at && source.provenance?.submitted_by);
  const evaluations = known && Array.isArray(availability?.__criterion_evaluations) ? availability.__criterion_evaluations : null;
  const completed = new Set((evaluations || []).filter(item => COMPLETED_EVALUATIONS.has(item.result) && item.recorded === true).map(item => item.criterion_id));
  const fulfilled = new Set((evaluations || []).filter(item => item.result === 'FULFILLED' && item.recorded === true && item.verified === true).map(item => item.criterion_id));

  return {status, known, manifest, sources, validEvidence, validProvenance, evaluations, completed, fulfilled, observedAt: availability?.__observed_at || null, reason: availability?.__reason || ''};
}

function applyLens(metrics, tab) {
  const lens = LENS_SECTORS[tab] ? tab : 'Overall';
  const included = LENS_SECTORS[lens];
  return metrics.map(metric => included.has(metric.label) ? {...metric, lens, scope: 'included'} : {...metric, lens, scope: 'excluded', underlyingStatus: metric.status, status: 'not-applicable', reason: `${metric.label} is outside the ${lens} lens. ${COVERAGE_LENSES[lens]}`});
}

export function coverage(c, tab = 'Overall', availability = null) {
  if (!c) return applyLens(LABELS.map(label => unavailable(label, 'No selected chain case', 'unavailable', null, 'Select a case to calculate this measurement.')), tab);
  if (!c.terms || !Array.isArray(c.terms.criteria)) return applyLens(LABELS.map(label => unavailable(label, 'Selected case record', 'missing', null, 'The selected case is missing frozen terms or criteria.')), tab);

  const criteria = c.terms.criteria;
  const keyboard = criteria.filter(item => item.kind === 'KEYBOARD');
  const {roundId, slots, expected} = selectedRound(c);
  const evidence = evidenceState(c, availability);
  const observedAt = evidence.observedAt;
  const revealed = (slots || []).filter(slot => slot?.disposition);
  const dispositionCounts = ['ACCEPT', 'REJECT', 'UNRESOLVED'].map(disposition => revealed.filter(slot => slot.disposition === disposition).length);
  const threshold = 2;
  const finalityMilestones = [DECISIVE.has(c.final_disposition) || c.resolution_basis === 'BASE_REFUND', Boolean(c.payout?.payout_intent_id), ['SUCCESS', 'FAILED'].includes(c.payout?.last_attempt?.result), c.state === 'Settled'];
  const freshSlots = Array.isArray(c.rounds?.[1]) ? c.rounds[1] : [];
  const challengeMilestones = c.challenge ? [Boolean(c.challenge.counterexample_digest), freshSlots.some(slot => slot?.commitment), freshSlots.some(slot => slot?.disposition), ['FRESH', 'KEEP_PRIMARY'].includes(c.resolution_basis)] : [];
  const protectedStatus = evidence.status === 'available' ? 'missing' : evidence.status;
  const protectedReason = evidence.reason || 'Protected evidence records could not be retrieved.';
  const hasSelectedEvidence = Boolean(c.evidence_digest);

  const evidenceMetric = !hasSelectedEvidence
    ? entry('Evidence', 0, criteria.length, 'Frozen criteria with a selected manifest record whose linked source digests are retrievable', 'measured', observedAt)
    : !evidence.known
      ? unavailable('Evidence', 'Frozen criteria with a selected manifest record whose linked source digests are retrievable', protectedStatus, observedAt, protectedReason)
      : !evidence.manifest
        ? unavailable('Evidence', 'Frozen criteria with a selected manifest record whose linked source digests are retrievable', 'missing', observedAt, 'The chain references evidence but the selected manifest record is missing.')
        : entry('Evidence', evidence.validEvidence.size, criteria.length, 'Frozen criteria with a selected manifest record whose linked source digests are retrievable', 'measured', observedAt);

  const provenanceMetric = !hasSelectedEvidence
    ? unavailable('Provenance', 'Selected manifest sources with retrievable bytes and origin, capture time and submitter provenance', 'not-applicable', observedAt, 'No evidence manifest has been selected.')
    : !evidence.known
      ? unavailable('Provenance', 'Selected manifest sources with retrievable bytes and origin, capture time and submitter provenance', protectedStatus, observedAt, protectedReason)
      : !evidence.manifest
        ? unavailable('Provenance', 'Selected manifest sources with retrievable bytes and origin, capture time and submitter provenance', 'missing', observedAt, 'The selected manifest record is missing.')
        : !evidence.sources.length
          ? unavailable('Provenance', 'Selected manifest sources with retrievable bytes and origin, capture time and submitter provenance', 'not-applicable', observedAt, 'The selected manifest contains no sources.')
          : entry('Provenance', evidence.validProvenance.length, evidence.sources.length, 'Selected manifest sources with retrievable bytes and origin, capture time and submitter provenance', 'measured', observedAt);

  const reviewMetric = slots === null && !expected
    ? unavailable('Review', `Completed reviewer reveals in selected round ${roundId}`, 'missing', observedAt, 'Selected-round reviewer slots are missing.')
    : entry('Review', revealed.length, expected, `Completed reviewer reveals in selected round ${roundId}`, expected ? 'measured' : 'not-applicable', observedAt, expected ? '' : 'No reviewers are appointed in the selected round.');
  const quorumMetric = slots === null && !expected
    ? unavailable('Quorum', `Largest matching disposition count in selected round ${roundId} against the policy threshold`, 'missing', observedAt, 'Selected-round reviewer slots are missing.')
    : entry('Quorum', Math.min(threshold, Math.max(0, ...dispositionCounts)), expected ? threshold : 0, `Largest matching disposition count in selected round ${roundId} against the policy threshold`, expected ? 'measured' : 'not-applicable', observedAt, expected ? '' : 'No reviewers are appointed in the selected round.');
  const keyboardMetric = !evidence.known
    ? unavailable('Keyboard', 'Keyboard criteria with an independently recorded and verified FULFILLED evaluation', protectedStatus, observedAt, protectedReason)
    : evidence.evaluations === null
      ? unavailable('Keyboard', 'Keyboard criteria with an independently recorded and verified FULFILLED evaluation', 'missing', observedAt, 'Criterion evaluation records are missing.')
      : !keyboard.length
        ? unavailable('Keyboard', 'Keyboard criteria with an independently recorded and verified FULFILLED evaluation', 'not-applicable', observedAt, 'The agreement contains no keyboard criterion.')
        : entry('Keyboard', keyboard.filter(criterion => evidence.fulfilled.has(criterion.criterion_id)).length, keyboard.length, 'Keyboard criteria with an independently recorded and verified FULFILLED evaluation', 'measured', observedAt);
  const criteriaMetric = !evidence.known
    ? unavailable('Criteria', 'Per-criterion completion from two independent records: valid linked evidence and a recorded evaluation', protectedStatus, observedAt, protectedReason)
    : evidence.evaluations === null
      ? unavailable('Criteria', 'Per-criterion completion from two independent records: valid linked evidence and a recorded evaluation', 'missing', observedAt, 'Criterion evaluation records are missing.')
      : entry('Criteria', criteria.reduce((total, criterion) => total + Number(evidence.validEvidence.has(criterion.criterion_id)) + Number(evidence.completed.has(criterion.criterion_id)), 0), criteria.length * 2, 'Per-criterion completion from two independent records: valid linked evidence and a recorded evaluation', 'measured', observedAt);

  return applyLens([
    evidenceMetric,
    provenanceMetric,
    reviewMetric,
    entry('Finality', count(finalityMilestones), finalityMilestones.length, 'Completed final disposition, payout intent, observed callback result and settled-state milestones', 'measured', observedAt),
    c.challenge ? entry('Challenge', count(challengeMilestones), challengeMilestones.length, 'Confirmed counterexample, fresh commit, fresh reveal and fresh resolution milestones', 'measured', observedAt) : unavailable('Challenge', 'Confirmed counterexample, fresh commit, fresh reveal and fresh resolution milestones', 'not-applicable', observedAt, 'No challenge is confirmed.'),
    quorumMetric,
    keyboardMetric,
    criteriaMetric
  ], tab);
}
