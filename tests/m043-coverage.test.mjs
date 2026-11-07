import assert from 'node:assert/strict';
import test from 'node:test';
import {coverage,coverageDepth,coverageValue,COVERAGE_LENSES} from '../packages/protocol/coverage.mjs';

const observedAt='2026-11-04T00:00:00.000Z';
const committee=Array.from({length:3},(_,index)=>({reviewer_id:`reviewer${index}.test`,operator_id:`operator-${index}`,disclosure_digest:`disclosure-${index}`}));
const slots=(dispositions=[],commitments=[])=>committee.map((reviewer,index)=>({...reviewer,commitment:commitments[index]?`commitment-${index}`:null,disposition:dispositions[index]||null}));
const baseCase=(overrides={})=>({case_id:'case-m043',state:'Draft',evidence_digest:null,primary_disposition:null,final_disposition:null,resolution_basis:null,payout:null,challenge:null,terms:{criteria:[{criterion_id:1,kind:'GENERAL'},{criterion_id:2,kind:'KEYBOARD'}],primary_committee:committee,fresh_committee:committee},rounds:[slots(),slots()],...overrides});
const manifest={criteria:[{criterion_id:1,source_ids:['s1']},{criterion_id:2,source_ids:['s2']}],sources:[{source_id:'s1',digest:'d1',provenance:{origin:'capture',captured_at:observedAt,submitted_by:'beneficiary.test'}},{source_id:'s2',digest:'d2',provenance:{origin:'capture',captured_at:observedAt,submitted_by:'beneficiary.test'}}]};
const available=(evaluations=[])=>({__status:'available',__manifest:manifest,__criterion_evaluations:evaluations,__observed_at:observedAt,d1:true,d2:true});
const emptyAvailable={__status:'available',__manifest:null,__criterion_evaluations:[],__observed_at:observedAt};
const summary=metrics=>Object.fromEntries(metrics.map(metric=>[metric.label,{numerator:metric.numerator,denominator:metric.denominator,status:metric.status,value:coverageValue(metric),depth:coverageDepth(metric),source:metric.source,observedAt:metric.observedAt}]));

test('M04.3 exact selected-case measurement matrix covers required lifecycle states',()=>{
  const states=[
    ['no selected case',null,null,{Evidence:[0,0,'unavailable'],Review:[0,0,'unavailable'],Challenge:[0,0,'unavailable']}],
    ['created but unfunded',baseCase(),emptyAvailable,{Evidence:[0,2,'measured'],Provenance:[0,0,'not-applicable'],Review:[0,3,'measured'],Finality:[0,4,'measured'],Challenge:[0,0,'not-applicable'],Quorum:[0,2,'measured'],Keyboard:[0,1,'measured'],Criteria:[0,4,'measured']}],
    ['funded without evidence',baseCase({state:'Funded',funded_principal_yocto:'1'}),emptyAvailable,{Evidence:[0,2,'measured'],Provenance:[0,0,'not-applicable'],Review:[0,3,'measured']}],
    ['evidence with incomplete review',baseCase({state:'ReviewReveal',evidence_digest:'manifest',rounds:[slots(['ACCEPT'],[true]),slots()]}),available(),{Evidence:[2,2,'measured'],Provenance:[2,2,'measured'],Review:[1,3,'measured'],Quorum:[1,2,'measured'],Criteria:[2,4,'measured']}],
    ['provisional outcome',baseCase({state:'Provisional',evidence_digest:'manifest',primary_disposition:'ACCEPT',rounds:[slots(['ACCEPT','ACCEPT'],[true,true]),slots()]}),available(),{Review:[2,3,'measured'],Quorum:[2,2,'measured'],Finality:[0,4,'measured']}],
    ['active challenge',baseCase({state:'Challenged',evidence_digest:'manifest',challenge:{counterexample_digest:'counterexample'},rounds:[slots(['ACCEPT','ACCEPT'],[true,true]),slots()]}),available(),{Review:[0,3,'measured'],Challenge:[1,4,'measured'],Quorum:[0,2,'measured']}],
    ['fresh review incomplete',baseCase({state:'ChallengeReview',evidence_digest:'manifest',challenge:{counterexample_digest:'counterexample'},rounds:[slots(['ACCEPT','ACCEPT'],[true,true]),slots(['REJECT'],[true])]}),available(),{Review:[1,3,'measured'],Challenge:[3,4,'measured'],Quorum:[1,2,'measured']}],
    ['settled unchallenged',baseCase({state:'Settled',evidence_digest:'manifest',final_disposition:'ACCEPT',resolution_basis:'PRIMARY',payout:{payout_intent_id:'intent',last_attempt:{result:'SUCCESS'}},rounds:[slots(['ACCEPT','ACCEPT'],[true,true]),slots()]}),available(),{Finality:[4,4,'measured'],Challenge:[0,0,'not-applicable'],Review:[2,3,'measured']}],
    ['settled challenged',baseCase({state:'Settled',evidence_digest:'manifest',challenge:{counterexample_digest:'counterexample'},final_disposition:'REJECT',resolution_basis:'FRESH',payout:{payout_intent_id:'intent',last_attempt:{result:'SUCCESS'}},rounds:[slots(['ACCEPT','ACCEPT'],[true,true]),slots(['REJECT','REJECT'],[true,true])]}),available(),{Finality:[4,4,'measured'],Challenge:[4,4,'measured'],Review:[2,3,'measured'],Quorum:[2,2,'measured']}]
  ];
  for(const [name,c,availability,expected] of states){const actual=summary(coverage(c,'Overall',availability));for(const [label,[numerator,denominator,status]] of Object.entries(expected))assert.deepEqual([actual[label].numerator,actual[label].denominator,actual[label].status],[numerator,denominator,status],`${name}: ${label}`);for(const metric of Object.values(actual))if(c)assert.equal(metric.observedAt,observedAt,`${name}: observation time`);}
});

test('M04.3 retrieval failures remain distinct from zero and N/A',()=>{
  const c=baseCase({evidence_digest:'manifest'});
  const inaccessible=summary(coverage(c,'Overall',{__status:'inaccessible',__reason:'participant authorization required',__observed_at:observedAt}));
  for(const label of ['Evidence','Provenance','Keyboard','Criteria'])assert.deepEqual([inaccessible[label].status,inaccessible[label].value,inaccessible[label].depth],['inaccessible','Locked',0]);
  const unavailable=summary(coverage(c,'Overall',{__status:'unavailable',__reason:'network failed',__observed_at:observedAt}));
  assert.deepEqual([unavailable.Evidence.status,unavailable.Evidence.value],['unavailable','Unavailable']);
  const missing=summary(coverage(c,'Overall',{__status:'available',__manifest:null,__criterion_evaluations:null,__observed_at:observedAt}));
  assert.deepEqual([missing.Evidence.status,missing.Evidence.value],['missing','Missing']);
  const notApplicable=summary(coverage(baseCase(),'Overall',emptyAvailable));
  assert.deepEqual([notApplicable.Challenge.status,notApplicable.Challenge.value],['not-applicable','N/A']);
  assert.deepEqual([notApplicable.Evidence.status,notApplicable.Evidence.value],['measured','0%']);
});

test('M04.3 chart lenses are defined and produce distinct visible scopes',()=>{
  const c=baseCase({state:'Settled',evidence_digest:'manifest',challenge:{counterexample_digest:'counterexample'},final_disposition:'REJECT',resolution_basis:'FRESH',payout:{payout_intent_id:'intent',last_attempt:{result:'SUCCESS'}},rounds:[slots(['ACCEPT','ACCEPT'],[true,true]),slots(['REJECT'],[true])]});
  const results=Object.fromEntries(Object.keys(COVERAGE_LENSES).map(lens=>[lens,coverage(c,lens,available())]));
  assert.deepEqual(results.Criteria.filter(metric=>metric.scope==='included').map(metric=>metric.label),['Evidence','Provenance','Keyboard','Criteria']);
  assert.deepEqual(results.Evidence.filter(metric=>metric.scope==='included').map(metric=>metric.label),['Evidence','Provenance','Review','Quorum']);
  assert.equal(results.Overall.filter(metric=>metric.scope==='included').length,8);
  assert.notDeepEqual(results.Criteria.map(coverageDepth),results.Evidence.map(coverageDepth));
  assert.notDeepEqual(results.Evidence.map(coverageDepth),results.Overall.map(coverageDepth));
  for(const lens of Object.keys(COVERAGE_LENSES))for(const metric of results[lens])assert.ok(metric.source&&'observedAt' in metric&&Number.isInteger(metric.numerator)&&Number.isInteger(metric.denominator));
});
