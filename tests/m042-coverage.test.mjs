import assert from 'node:assert/strict';
import test from 'node:test';

import {coverage, coverageDepth} from '../packages/protocol/coverage.mjs';

const LABELS = ['Evidence', 'Provenance', 'Review', 'Finality', 'Challenge', 'Quorum', 'Keyboard', 'Criteria'];
const SOURCE = {
  Evidence: 'Frozen criteria with a selected manifest record whose linked source digests are retrievable',
  Provenance: 'Selected manifest sources with retrievable bytes and origin, capture time and submitter provenance',
  Review: 'Completed reviewer reveals in selected round 0',
  Finality: 'Completed final disposition, payout intent, observed callback result and settled-state milestones',
  Challenge: 'Confirmed counterexample, fresh commit, fresh reveal and fresh resolution milestones',
  Quorum: 'Largest matching disposition count in selected round 0 against the policy threshold',
  Keyboard: 'Keyboard criteria with an independently recorded and verified FULFILLED evaluation',
  Criteria: 'Per-criterion completion from two independent records: valid linked evidence and a recorded evaluation'
};
const slots = dispositions => Array.from({length: 3}, (_, index) => ({
  reviewer_id: `reviewer${index}.test`,
  commitment: dispositions[index] === undefined ? null : `commitment-${index}`,
  disposition: dispositions[index] || null
}));
const baseCase = overrides => ({
  case_id: 'case-a',
  state: 'Draft',
  final_disposition: null,
  resolution_basis: null,
  payout: null,
  challenge: null,
  evidence_digest: 'manifest',
  terms: {
    criteria: [
      {criterion_id: 1, kind: 'GENERAL', requirement_digest: 'requirement-1'},
      {criterion_id: 2, kind: 'KEYBOARD', requirement_digest: 'requirement-2'}
    ]
  },
  rounds: [slots([]), slots([])],
  ...overrides
});
const manifest = {
  criteria: [
    {criterion_id: 1, source_ids: ['source-1']},
    {criterion_id: 2, source_ids: ['source-2']}
  ],
  sources: [
    {source_id: 'source-1', digest: 'digest-1', provenance: {origin: 'capture', captured_at: '2026-11-03T00:00:00.000Z', submitted_by: 'beneficiary.test'}},
    {source_id: 'source-2', digest: 'digest-2', provenance: {origin: 'capture', captured_at: '2026-11-03T00:01:00.000Z', submitted_by: 'beneficiary.test'}}
  ]
};
const availability = (overrides = {}) => ({
  'digest-1': true,
  'digest-2': true,
  __manifest: manifest,
  __criterion_evaluations: [],
  ...overrides
});
const vector = metrics => Object.fromEntries(metrics.map(metric => [metric.label, [metric.numerator, metric.denominator, coverageDepth(metric)]]));

test('M04.2 radar exposes eight operational sectors with exact sources', () => {
  const metrics = coverage(baseCase({}), 'Overall', availability());
  assert.deepEqual(metrics.map(metric => metric.label), LABELS);
  for (const metric of metrics) assert.equal(metric.source, SOURCE[metric.label]);
});

test('M04.2 radar states preserve exact numerator, denominator and render depth', () => {
  const states = [
    {
      name: 'no selected case',
      metrics: coverage(null),
      expected: Object.fromEntries(LABELS.map(label => [label, [0, 0, 0]]))
    },
    {
      name: 'draft with no evidence records',
      metrics: coverage(baseCase({evidence_digest:null}), 'Overall', {__manifest: null, __criterion_evaluations: []}),
      expected: {Evidence:[0,2,0],Provenance:[0,0,0],Review:[0,3,0],Finality:[0,4,0],Challenge:[0,0,0],Quorum:[0,2,0],Keyboard:[0,1,0],Criteria:[0,4,0]}
    },
    {
      name: 'one valid evidence source',
      metrics: coverage(baseCase({state: 'Submitted'}), 'Overall', availability({'digest-2': false})),
      expected: {Evidence:[1,2,.5],Provenance:[1,2,.5],Review:[0,3,0],Finality:[0,4,0],Challenge:[0,0,0],Quorum:[0,2,0],Keyboard:[0,1,0],Criteria:[1,4,.25]}
    },
    {
      name: 'one primary reviewer completed',
      metrics: coverage(baseCase({state: 'ReviewReveal', rounds:[slots(['ACCEPT']),slots([])]}), 'Overall', availability()),
      expected: {Evidence:[2,2,1],Provenance:[2,2,1],Review:[1,3,1/3],Finality:[0,4,0],Challenge:[0,0,0],Quorum:[1,2,.5],Keyboard:[0,1,0],Criteria:[2,4,.5]}
    },
    {
      name: 'primary quorum reached',
      metrics: coverage(baseCase({state:'Provisional',primary_disposition:'ACCEPT',rounds:[slots(['ACCEPT','ACCEPT']),slots([])]}), 'Overall', availability()),
      expected: {Evidence:[2,2,1],Provenance:[2,2,1],Review:[2,3,2/3],Finality:[0,4,0],Challenge:[0,0,0],Quorum:[2,2,1],Keyboard:[0,1,0],Criteria:[2,4,.5]}
    },
    {
      name: 'confirmed challenge with fresh commit',
      metrics: coverage(baseCase({state:'ChallengeReview',challenge:{counterexample_digest:'counterexample'},rounds:[slots(['ACCEPT','ACCEPT']),slots([null])]}), 'Overall', availability()),
      expected: {Evidence:[2,2,1],Provenance:[2,2,1],Review:[0,3,0],Finality:[0,4,0],Challenge:[2,4,.5],Quorum:[0,2,0],Keyboard:[0,1,0],Criteria:[2,4,.5]}
    },
    {
      name: 'fresh reversal resolved',
      metrics: coverage(baseCase({state:'Resolved',challenge:{counterexample_digest:'counterexample'},final_disposition:'REJECT',resolution_basis:'FRESH',rounds:[slots(['ACCEPT','ACCEPT']),slots(['REJECT','REJECT'])]}), 'Overall', availability()),
      expected: {Evidence:[2,2,1],Provenance:[2,2,1],Review:[2,3,2/3],Finality:[1,4,.25],Challenge:[4,4,1],Quorum:[2,2,1],Keyboard:[0,1,0],Criteria:[2,4,.5]}
    },
    {
      name: 'fully recorded settlement and criteria',
      metrics: coverage(baseCase({state:'Settled',challenge:{counterexample_digest:'counterexample'},final_disposition:'REJECT',resolution_basis:'FRESH',payout:{payout_intent_id:'intent',last_attempt:{result:'SUCCESS'}},rounds:[slots(['ACCEPT','ACCEPT','ACCEPT']),slots(['REJECT','REJECT','REJECT'])]}), 'Overall', availability({__criterion_evaluations:[{criterion_id:1,result:'NOT_FULFILLED',recorded:true,verified:true},{criterion_id:2,result:'FULFILLED',recorded:true,verified:true}]})),
      expected: {Evidence:[2,2,1],Provenance:[2,2,1],Review:[3,3,1],Finality:[4,4,1],Challenge:[4,4,1],Quorum:[2,2,1],Keyboard:[1,1,1],Criteria:[4,4,1]}
    }
  ];

  for (const state of states) assert.deepEqual(vector(state.metrics), state.expected, state.name);
});

test('radar tabs preserve underlying records while applying distinct scopes', () => {
  const c = baseCase({
    challenge: {counterexample_digest: 'counterexample'},
    rounds: [slots(['ACCEPT','ACCEPT','ACCEPT']), slots(['REJECT'])]
  });
  const byTab = ['Criteria', 'Evidence', 'Overall'].map(tab => coverage(c, tab, availability()));
  assert.notDeepEqual(byTab.map(vector)[0], byTab.map(vector)[1]);
  assert.notDeepEqual(byTab.map(vector)[1], byTab.map(vector)[2]);
  assert.deepEqual(byTab.map(metrics => metrics[0].lens), ['Criteria', 'Evidence', 'Overall']);
  assert.deepEqual(byTab.map(metrics => metrics.filter(metric => metric.scope === 'included').map(metric => metric.label)), [
    ['Evidence','Provenance','Keyboard','Criteria'],
    ['Evidence','Provenance','Review','Quorum'],
    LABELS
  ]);
  assert.deepEqual(byTab.map(metrics => metrics.find(metric => metric.label === 'Review').numerator), [1,1,1]);
  assert.equal(byTab[0].find(metric => metric.label === 'Review').source, 'Completed reviewer reveals in selected round 1');
  assert.equal(byTab[0].find(metric => metric.label === 'Quorum').source, 'Largest matching disposition count in selected round 1 against the policy threshold');
});
