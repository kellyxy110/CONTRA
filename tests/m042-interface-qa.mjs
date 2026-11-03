import fs from 'node:fs/promises';
import path from 'node:path';

import {chromium} from 'playwright';

const emptyRoot = process.env.CONTRA_EMPTY_ROOT || 'http://127.0.0.1:4174';
const populatedRoot = process.env.CONTRA_QA_ROOT || 'http://127.0.0.1:4176';
const unchallengedId = process.env.CONTRA_UNCHALLENGED_CASE_ID;
const challengedId = process.env.CONTRA_CHALLENGED_CASE_ID;
if (!unchallengedId || !challengedId) throw Error('Both genuine case IDs are required');
const output = path.resolve(process.env.CONTRA_QA_OUTPUT || 'project/artifacts/m042/phase2');
await fs.mkdir(output, {recursive: true});

const report = {checkpoint:'CONTRA-2026-11-03-IMPL-M04.2-P2',checks:[],console_errors:[]};
const check = (name, pass, detail = '') => {
  report.checks.push({name, pass, detail});
  if (!pass) process.exitCode = 1;
};
const browser = await chromium.launch({headless: true});
const radarData = page => page.locator('#radar').evaluate(canvas => ({
  metrics: JSON.parse(canvas.dataset.metrics),
  markers: canvas.dataset.markers,
  label: canvas.getAttribute('aria-label')
}));
const trackedPage = async (root, options = {}) => {
  const context = await browser.newContext({viewport:{width:1200,height:900}, ...options});
  const page = await context.newPage();
  page.on('console', message => {
    if (message.type() === 'error') report.console_errors.push(message.text());
  });
  page.on('pageerror', error => report.console_errors.push(error.message));
  await page.goto(root, {waitUntil:'networkidle'});
  return {context, page};
};
const connect = async page => {
  await page.locator('[data-action="account"]').first().click();
  await page.locator('#account-choice').selectOption({label:'creator.test.near'});
  await page.locator('[data-action="connect"]').click();
  await page.locator('dialog').evaluate(dialog => dialog.close());
  await page.locator('[data-action="refresh"]').click();
  await page.waitForTimeout(350);
};
const selectCase = async (page, caseId) => {
  await page.locator('[data-nav="Cases"]').click();
  await page.locator(`[data-case="${caseId}"]`).click();
  await page.locator('#dialog-title').filter({hasText:'Agreement & escrow'}).waitFor();
  await page.locator('dialog').evaluate(dialog => dialog.close());
  await page.waitForTimeout(200);
};

const empty = await trackedPage(emptyRoot);
const zero = await radarData(empty.page);
check('zero state reports eight N/A sectors', zero.metrics.length === 8 && zero.metrics.every(metric => metric.denominator === 0 && metric.ratio === 0), JSON.stringify(zero.metrics));
check('radar exposes 25, 50, 75 and 100 percent markers', zero.markers === '25,50,75,100', zero.markers);
await empty.page.locator('.signals').screenshot({path:path.join(output, 'radar-zero.png')});
await empty.context.close();

const live = await trackedPage(populatedRoot, {deviceScaleFactor:2});
await connect(live.page);
await selectCase(live.page, unchallengedId);
const unchallenged = await radarData(live.page);
check('genuine unchallenged case is not a solid full circle', unchallenged.metrics.some(metric => metric.ratio > 0 && metric.ratio < 1) && unchallenged.metrics.some(metric => metric.denominator === 0), JSON.stringify(unchallenged.metrics));
check('unchallenged case marks challenge N/A', unchallenged.metrics.find(metric => metric.label === 'Challenge').denominator === 0);
check('genuine evidence uses retrievable source linkage', JSON.stringify(unchallenged.metrics.find(metric => metric.label === 'Evidence')).includes('"numerator":1') && unchallenged.metrics.find(metric => metric.label === 'Evidence').source.includes('retrievable'));
await live.page.locator('.signals').screenshot({path:path.join(output, 'radar-partial-unchallenged.png')});

await selectCase(live.page, challengedId);
const challenged = await radarData(live.page);
check('case switching changes challenge measurement', challenged.metrics.find(metric => metric.label === 'Challenge').ratio === 1 && challenged.metrics.find(metric => metric.label === 'Challenge').denominator === 4, JSON.stringify(challenged.metrics));
check('fresh review remains actual two of three participation', challenged.metrics.find(metric => metric.label === 'Review').numerator === 2 && challenged.metrics.find(metric => metric.label === 'Review').denominator === 3, JSON.stringify(challenged.metrics));
check('criteria remains partial without an independent evaluation record', challenged.metrics.find(metric => metric.label === 'Criteria').ratio === .5, JSON.stringify(challenged.metrics));
for (const tab of ['Criteria', 'Evidence', 'Overall']) {
  await live.page.locator('#signal-tabs button').filter({hasText:tab}).click();
  const tabData = await radarData(live.page);
  check(`${tab} tab preserves operational measurements`, JSON.stringify(tabData.metrics.map(({label,numerator,denominator,ratio}) => ({label,numerator,denominator,ratio}))) === JSON.stringify(challenged.metrics.map(({label,numerator,denominator,ratio}) => ({label,numerator,denominator,ratio}))));
}
await live.page.screenshot({path:path.join(output, 'the-bench-operational-1200x900.png')});
await live.page.locator('.signals').screenshot({path:path.join(output, 'radar-partial-challenged.png')});
await live.context.close();

const fullCase = {
  case_id:'f'.repeat(64),creator_id:'creator.test.near',state:'Settled',funded_principal_yocto:'1000000000000000000000000',
  primary_disposition:'ACCEPT',final_disposition:'REJECT',resolution_basis:'FRESH',phase:'CLOSED',
  challenge:{counterexample_digest:'counterexample',criterion_id:1},
  payout:{payout_intent_id:'intent',status:'SUCCESS_VERIFIED',last_attempt:{result:'SUCCESS',completed_at_ns:'1793729539797201869'}},
  terms_digest:'a'.repeat(64),
  terms:{amount_yocto:'1000000000000000000000000',criteria:[{criterion_id:1,kind:'GENERAL',requirement_digest:'r1'},{criterion_id:2,kind:'KEYBOARD',requirement_digest:'r2'}],primary_committee:[],fresh_committee:[],primary_reveal_end_ns:'1793729539797201869'}
};
const committee = Array.from({length:3}, (_, index) => ({reviewer_id:`reviewer${index}.test.near`,operator_id:`operator-${index}`,revision:'2',disclosure_digest:`disclosure-${index}`}));
fullCase.terms.primary_committee = committee;
fullCase.terms.fresh_committee = committee.map((reviewer,index) => ({...reviewer,reviewer_id:`fresh${index}.test.near`}));
const fullSlots = fullCase.terms.fresh_committee.map((reviewer,index) => ({reviewer_id:reviewer.reviewer_id,commitment:`commitment-${index}`,disposition:'REJECT',finding_digest:`finding-${index}`}));
const fullManifest = {criteria:[{criterion_id:1,source_ids:['s1']},{criterion_id:2,source_ids:['s2']}],sources:[{source_id:'s1',digest:'d1',provenance:{origin:'fixture',captured_at:'2026-11-03T00:00:00.000Z',submitted_by:'beneficiary.test.near'}},{source_id:'s2',digest:'d2',provenance:{origin:'fixture',captured_at:'2026-11-03T00:01:00.000Z',submitted_by:'beneficiary.test.near'}}]};
const source = {network:'sandbox',finality:'final',block_height:'1',block_hash:'fixture',observed_at:new Date().toISOString()};
const fixtureContext = await browser.newContext({viewport:{width:1200,height:900},deviceScaleFactor:2});
await fixtureContext.addInitScript(() => {sessionStorage.setItem('contra-account','creator.test.near');sessionStorage.setItem('contra-session','fixture-token');});
const fixture = await fixtureContext.newPage();
fixture.on('console', message => {if (message.type() === 'error') report.console_errors.push(message.text());});
await fixture.route('**/api/**', async route => {
  const request = route.request();
  const url = new URL(request.url());
  let value;
  if (url.pathname === '/api/health') value = {chain:'connected',network:'sandbox',independence:'Deterministic visual fixture'};
  else if (url.pathname === '/api/config') value = {accounts:['creator.test.near'],providers:[]};
  else if (url.pathname === '/api/availability') value = {items:{d1:true,d2:true},manifest:fullManifest,criterion_evaluations:[{criterion_id:1,result:'NOT_FULFILLED',recorded:true,verified:true},{criterion_id:2,result:'FULFILLED',recorded:true,verified:true}]};
  else if (url.pathname === '/api/evidence/manifests') value = {items:[{digest:'manifest',onchain:true,body:fullManifest}]};
  else if (url.pathname === '/api/artifact') value = {digest:url.searchParams.get('digest'),text:'fixture'};
  else if (url.pathname === '/api/view') {
    const body = request.postDataJSON();
    if (body.method === 'list_cases') value = {items:[fullCase]};
    else if (body.method === 'get_round') value = {slots:body.args.round_id === 1 ? fullSlots : fullSlots.map(slot => ({...slot,disposition:'ACCEPT'}))};
    else if (body.method === 'get_events') value = {items:[],next_after_seq:null};
    else value = null;
    value = {value,source};
  } else value = {error:'fixture route not found'};
  await route.fulfill({status:value.error?404:200,contentType:'application/json',body:JSON.stringify(value)});
});
await fixture.goto(emptyRoot, {waitUntil:'networkidle'});
const full = await radarData(fixture);
check('deterministic full fixture renders every sector at full depth', full.metrics.every(metric => metric.denominator > 0 && metric.ratio === 1), JSON.stringify(full.metrics));
await fixture.locator('.signals').screenshot({path:path.join(output, 'radar-full-deterministic-fixture.png')});
await fixtureContext.close();

check('browser console remains error-free', report.console_errors.length === 0, report.console_errors.join(' | '));
await browser.close();
await fs.writeFile(path.join(output, 'interface-report.json'), JSON.stringify(report, null, 2));
for (const item of report.checks) console.log(`${item.pass?'PASS':'FAIL'} ${item.name}${item.detail?`: ${item.detail}`:''}`);
if (process.exitCode) throw Error('M04.2 interface QA failed');
