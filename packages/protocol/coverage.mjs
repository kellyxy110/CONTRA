const LABELS = ['Evidence', 'Provenance', 'Review', 'Finality', 'Challenge', 'Quorum', 'Keyboard', 'Criteria'];
const DECISIVE = new Set(['ACCEPT', 'REJECT']);
const COMPLETED_EVALUATIONS = new Set(['FULFILLED', 'NOT_FULFILLED', 'INCONCLUSIVE']);

const entry = (label, numerator, denominator, source) => ({label, numerator, denominator, source});
const count = values => values.filter(Boolean).length;

export function coverageDepth(metric) {
  if (!metric.denominator) return 0;
  return Math.max(0, Math.min(1, metric.numerator / metric.denominator));
}

function selectedRound(c) {
  const roundId = c.challenge ? 1 : 0;
  return {roundId, slots: c.rounds?.[roundId] || []};
}

function evidenceState(c, availability) {
  const known = availability !== null;
  const manifest = availability?.__manifest || null;
  const sources = manifest?.sources || [];
  const manifestCriteria = manifest?.criteria || [];
  const sourceById = new Map(sources.map(source => [source.source_id, source]));
  const available = digest => known && availability?.[digest] === true;
  const validEvidence = new Set();

  for (const criterion of c.terms.criteria) {
    const record = manifestCriteria.find(item => item.criterion_id === criterion.criterion_id);
    if (!record?.source_ids?.length) continue;
    const linked = record.source_ids.map(id => sourceById.get(id));
    if (linked.every(source => source?.digest && available(source.digest))) validEvidence.add(criterion.criterion_id);
  }

  const validProvenance = sources.filter(source =>
    source.digest &&
    available(source.digest) &&
    source.provenance?.origin &&
    source.provenance?.captured_at &&
    source.provenance?.submitted_by
  );
  const evaluations = Array.isArray(availability?.__criterion_evaluations)
    ? availability.__criterion_evaluations
    : null;
  const completed = new Set((evaluations || [])
    .filter(item => COMPLETED_EVALUATIONS.has(item.result) && item.recorded === true)
    .map(item => item.criterion_id));
  const fulfilled = new Set((evaluations || [])
    .filter(item => item.result === 'FULFILLED' && item.recorded === true && item.verified === true)
    .map(item => item.criterion_id));

  return {known, manifest, sources, validEvidence, validProvenance, evaluations, completed, fulfilled};
}

export function coverage(c, tab = 'Overall', availability = null) {
  if (!c) return LABELS.map(label => entry(label, 0, 0, 'No selected chain case'));

  const criteria = c.terms.criteria || [];
  const keyboard = criteria.filter(item => item.kind === 'KEYBOARD');
  const {roundId, slots} = selectedRound(c);
  const evidence = evidenceState(c, availability);
  const revealed = slots.filter(slot => slot?.disposition);
  const dispositionCounts = ['ACCEPT', 'REJECT', 'UNRESOLVED'].map(disposition =>
    revealed.filter(slot => slot.disposition === disposition).length
  );
  const threshold = 2;
  const finalityMilestones = [
    DECISIVE.has(c.final_disposition) || c.resolution_basis === 'BASE_REFUND',
    Boolean(c.payout?.payout_intent_id),
    ['SUCCESS', 'FAILED'].includes(c.payout?.last_attempt?.result),
    c.state === 'Settled'
  ];
  const freshSlots = c.rounds?.[1] || [];
  const challengeMilestones = c.challenge ? [
    Boolean(c.challenge.counterexample_digest),
    freshSlots.some(slot => slot?.commitment),
    freshSlots.some(slot => slot?.disposition),
    ['FRESH', 'KEEP_PRIMARY'].includes(c.resolution_basis)
  ] : [];
  const criteriaDenominator = evidence.known ? criteria.length * 2 : 0;
  const criteriaNumerator = evidence.known
    ? criteria.reduce((total, criterion) => total + Number(evidence.validEvidence.has(criterion.criterion_id)) + Number(evidence.completed.has(criterion.criterion_id)), 0)
    : 0;

  const metrics = [
    entry(
      'Evidence',
      evidence.known ? evidence.validEvidence.size : 0,
      evidence.known ? criteria.length : 0,
      'Frozen criteria with a selected manifest record whose linked source digests are retrievable'
    ),
    entry(
      'Provenance',
      evidence.manifest ? evidence.validProvenance.length : 0,
      evidence.manifest ? evidence.sources.length : 0,
      'Selected manifest sources with retrievable bytes and origin, capture time and submitter provenance'
    ),
    entry(
      'Review',
      revealed.length,
      slots.length,
      `Completed reviewer reveals in selected round ${roundId}`
    ),
    entry(
      'Finality',
      count(finalityMilestones),
      finalityMilestones.length,
      'Completed final disposition, payout intent, observed callback result and settled-state milestones'
    ),
    entry(
      'Challenge',
      c.challenge ? count(challengeMilestones) : 0,
      c.challenge ? challengeMilestones.length : 0,
      'Confirmed counterexample, fresh commit, fresh reveal and fresh resolution milestones; N/A without a challenge'
    ),
    entry(
      'Quorum',
      Math.min(threshold, Math.max(0, ...dispositionCounts)),
      slots.length ? threshold : 0,
      `Largest matching disposition count in selected round ${roundId} against the policy threshold`
    ),
    entry(
      'Keyboard',
      evidence.evaluations ? keyboard.filter(criterion => evidence.fulfilled.has(criterion.criterion_id)).length : 0,
      evidence.evaluations ? keyboard.length : 0,
      'Keyboard criteria with an independently recorded and verified FULFILLED evaluation; N/A when evaluation records are unavailable'
    ),
    entry(
      'Criteria',
      criteriaNumerator,
      criteriaDenominator,
      'Per-criterion completion from two independent records: valid linked evidence and a recorded evaluation'
    )
  ];

  return metrics.map(metric => ({...metric, lens: tab}));
}
