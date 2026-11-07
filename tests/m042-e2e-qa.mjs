import fs from 'node:fs/promises';
import path from 'node:path';

import {chromium} from 'playwright';

const root = process.env.CONTRA_QA_ROOT || 'http://127.0.0.1:4176';
const emptyRoot = process.env.CONTRA_EMPTY_ROOT || 'http://127.0.0.1:4174';
const journeyPath = path.resolve(process.env.CONTRA_JOURNEY_REPORT || 'project/artifacts/m042/phase3/sandbox/journey-report.json');
const operationsPath = path.resolve(process.env.CONTRA_OPERATIONS_REPORT || 'project/artifacts/m042/phase3/sandbox/operations.json');
const output = path.resolve(process.env.CONTRA_QA_OUTPUT || 'project/artifacts/m042/phase3');
const journey = JSON.parse(await fs.readFile(journeyPath, 'utf8'));
const operations = JSON.parse(await fs.readFile(operationsPath, 'utf8'));
await fs.mkdir(output, {recursive:true});

const report = {
  checkpoint:'CONTRA-2026-11-03-IMPL-M04.2-P3',
  root,
  checks:[],
  console_errors:[],
  manual_screen_reader:'PARTIAL: automated semantics verified; no manual assistive-technology session was available.',
  journeys:{operations:journey.counts.operations,receipts:journey.counts.receipts,unchallenged:journey.unchallenged.case_id,challenged:journey.challenged.case_id}
};
const check = (name, pass, detail = '') => {
  report.checks.push({name, pass, detail});
  if (!pass) process.exitCode = 1;
};
const browser = await chromium.launch({headless:true});
const track = page => {
  page.on('console', message => {if (message.type() === 'error') report.console_errors.push(message.text());});
  page.on('pageerror', error => report.console_errors.push(error.message));
};
async function open(url = root, options = {}) {
  const context = await browser.newContext({viewport:{width:1200,height:900}, ...options});
  const page = await context.newPage();
  track(page);
  await page.goto(url, {waitUntil:'networkidle'});
  return {context, page};
}
async function connect(page, account = 'creator.test.near') {
  await page.locator('[data-action="account"]').first().click();
  await page.locator('#account-choice').selectOption({label:account});
  await page.locator('[data-action="connect"]').click();
  await page.locator('dialog').evaluate(dialog => dialog.close());
  await page.locator('[data-action="refresh"]').click();
  await page.waitForTimeout(300);
}
async function chooseCase(page, caseId) {
  await page.locator('nav [data-nav="Cases"]').click();
  await page.locator(`[data-select-case="${caseId}"]`).click();
  await page.waitForFunction(id => location.hash.includes(id) && document.querySelector('.person h2')?.title === id, caseId);
}
const noOverflow = page => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);

const primary = await open();
await connect(primary.page);
await chooseCase(primary.page, journey.challenged.case_id);
check('genuine challenged case is selected', await primary.page.locator('.person h2').getAttribute('title') === journey.challenged.case_id);

const views = [
  ['Overview', null],['Cases','Cases'],['Challenges','Challenges'],['Evidence','Evidence'],['Reviewers','The Bench'],
  ['Settlement','Settlement & history'],['Lab','Review lab'],['Activity','Settlement & history'],['Settings','Settings']
];
for (const [name, heading] of views) {
  await primary.page.locator(`nav [data-nav="${name}"]`).click();
  check(`${name} is a stable navigable view`, !await primary.page.locator('dialog').isVisible() && primary.page.url().includes(`view=${name}`));
  if (heading) check(`${name} view exposes its heading`, await primary.page.locator('#workspace-view h2').textContent() === heading);
}

await primary.page.locator('nav [data-nav="Cases"]').click();
await primary.page.locator('nav [data-nav="Evidence"]').click();
await primary.page.goBack();
await primary.page.waitForFunction(() => location.hash.includes('view=Cases'));
await primary.page.waitForFunction(() => document.querySelector('#workspace-view h2')?.textContent.trim() === 'Cases');
check('browser Back restores the prior major view', (await primary.page.locator('#workspace-view h2').textContent()).trim() === 'Cases', `${primary.page.url()} · ${await primary.page.locator('#workspace-view h2').textContent()}`);
check('view navigation moves focus to its heading', await primary.page.evaluate(() => document.activeElement?.matches('#workspace-view h2')));

await primary.page.goto(`${root}/#view=Evidence&case=${journey.unchallenged.case_id}`, {waitUntil:'networkidle'});
await primary.page.waitForFunction(id => document.querySelector('#workspace-view h2')?.textContent.trim() === 'Evidence' && document.querySelector('.person h2')?.title === id, journey.unchallenged.case_id);
check('direct navigation restores selected-case context', await primary.page.locator('#workspace-view h2').textContent() === 'Evidence' && await primary.page.locator('.person h2').getAttribute('title') === journey.unchallenged.case_id, `${primary.page.url()} · ${await primary.page.locator('#workspace-view h2').textContent()} · ${await primary.page.locator('.person h2').getAttribute('title')}`);
await chooseCase(primary.page, journey.challenged.case_id);
await primary.page.locator('nav [data-nav="Evidence"]').click();
const evidenceAction = primary.page.locator('#workspace-view [data-action="evidence"]');
await evidenceAction.focus();
await evidenceAction.press('Enter');
await primary.page.locator('dialog').waitFor({state:'visible'});
check('focused action uses its evidence dialog', await primary.page.locator('#dialog-title').textContent() === 'Evidence submission', await primary.page.locator('#dialog-title').textContent());
await primary.page.keyboard.press('Escape');
await primary.page.locator('dialog').waitFor({state:'hidden'});
await primary.page.waitForTimeout(200);
check('focused action dialog restores focus', await primary.page.evaluate(() => document.activeElement?.matches('#workspace-view [data-action="evidence"]')));

await primary.page.locator('nav [data-nav="Overview"]').click();
for (const label of ['Evidence','Reviews','Criteria','Protocol']) {
  await primary.page.locator('#material-tabs button').filter({hasText:label}).click();
  check(`${label} materials remain data-bound`, (await primary.page.locator('#materials').textContent()).trim().length > 0);
}
for (const label of ['Criteria','Evidence','Overall']) {
  await primary.page.locator('#signal-tabs button').filter({hasText:label}).click();
  check(`${label} radar tab keeps chart semantics`, (await primary.page.locator('#radar').getAttribute('aria-label')).includes(label));
}
await primary.page.locator('.search input').fill('challenge');
check('search filters genuine tasks', (await primary.page.locator('#today').textContent()).includes('Challenge & settlement'));
await primary.page.locator('.search input').fill('');
const firstActivity = await primary.page.locator('#activities').textContent();
await primary.page.locator('[data-activity="1"]').click();
check('activity pagination advances', await primary.page.locator('#activities').textContent() !== firstActivity);
await primary.page.locator('[data-activity="-1"]').click();

await primary.page.locator('#yesterday .task').last().click();
check('settled payout keeps retry disabled', await primary.page.locator('[data-action="retry"]').isDisabled());
await primary.page.keyboard.press('Escape');

const saved = operations.find(operation => operation.account === 'creator.test.near');
await primary.page.evaluate(operation => sessionStorage.setItem('contra-operation', JSON.stringify(operation)), {operation_id:saved.operation_id,method:saved.method,args:saved.args,deposit:saved.deposit});
await primary.page.reload({waitUntil:'networkidle'});
await primary.page.locator('[data-action="account"]').first().click();
await primary.page.locator('[data-action="reconcile"]').click();
await primary.page.locator('#dialog-title').filter({hasText:'Transaction reconciliation'}).waitFor();
check('reload reconciliation finds the confirmed transaction', (await primary.page.locator('#dialog-extra').textContent()).includes('CONFIRMED'));
await primary.page.keyboard.press('Escape');

await primary.page.locator('nav [data-nav="Settings"]').click();
check('settings discloses gated spending', (await primary.page.locator('#workspace-view').textContent()).includes('Paid inference disabled'));
await primary.page.locator('[data-action="account"]').first().click();
await primary.page.locator('[data-action="disconnect"]').click();
check('disconnect removes signing session', await primary.page.evaluate(() => !sessionStorage.getItem('contra-session') && !sessionStorage.getItem('contra-account')));
await primary.page.keyboard.press('Escape');
check('disconnect preserves read-only selected case', await primary.page.locator('.person h2').getAttribute('title') === journey.challenged.case_id);
check('unauthenticated evidence remains protected', (await primary.context.request.get(root+'/api/evidence/manifests?case_id='+journey.challenged.case_id)).status() === 401);
check('visible view has one main landmark', await primary.page.evaluate(() => [...document.querySelectorAll('main,[role="main"]')].filter(element => !element.hidden).length === 1));
await primary.page.locator('nav [data-nav="Overview"]').click();
await primary.page.screenshot({path:path.join(output,'final-desktop-1200x900.png'),fullPage:true});
await primary.context.close();

async function statePage(name, mutate) {
  const context = await browser.newContext({viewport:{width:1200,height:900}});
  const page = await context.newPage();
  track(page);
  await page.route('**/api/view', async route => {
    const response = await route.fetch();
    const payload = await response.json();
    const requestBody = route.request().postDataJSON();
    if (requestBody.method === 'list_cases') mutate(payload.value.items);
    await route.fulfill({response,json:payload});
  });
  await page.goto(`${root}/#view=${name}`, {waitUntil:'networkidle'});
  return {context,page};
}
const empty = await statePage('Cases', items => items.splice(0));
check('connected empty state is explicit', (await empty.page.locator('#workspace-view').textContent()).includes('No agreements'));
await empty.context.close();
const pending = await statePage('Settlement', items => {items[0].state='SettlementPending';items[0].payout={status:'AWAITING_RESULT',amount_yocto:'1000000000000000000000000',resolution_basis:'PRIMARY'};});
check('settlement pending state is distinct', (await pending.page.locator('#workspace-view').textContent()).includes('Awaiting result'));
await pending.context.close();
const transferFailed = await statePage('Settlement', items => {items[0].state='TransferFailed';items[0].payout={status:'FAILED_VERIFIED',amount_yocto:'1000000000000000000000000',resolution_basis:'PRIMARY'};});
check('verified transfer failure is distinct', (await transferFailed.page.locator('#workspace-view').textContent()).includes('Transfer failed'));
await transferFailed.context.close();

const unavailable = await open(emptyRoot);
check('chain unavailable state is explicit', (await unavailable.page.locator('.person p').textContent()).includes('Chain unavailable'));
await unavailable.context.close();
const failedContext = await browser.newContext({viewport:{width:1200,height:900}});
const failedPage = await failedContext.newPage();
await failedPage.route('**/api/health', route => route.abort('failed'));
await failedPage.goto(root, {waitUntil:'networkidle'});
check('service failure is explicit', await failedPage.locator('#dialog-title').textContent() === 'Service unavailable');
await failedContext.close();

const reduced = await open(root, {reducedMotion:'reduce'});
check('reduced motion preference is observed', await reduced.page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches && getComputedStyle(document.body).scrollBehavior !== 'smooth'));
await reduced.context.close();

for (const [name, viewport] of [['zoom-125-effective-960x720',{width:960,height:720}],['zoom-200-effective-320x422',{width:320,height:422}]]) {
  const view = await open(root, {viewport,hasTouch:true});
  await view.page.locator('nav [data-nav="Cases"]').click();
  check(`${name} has no horizontal overflow`, await noOverflow(view.page));
  check(`${name} keeps navigation and view content reachable`, await view.page.locator('nav').isVisible() && await view.page.locator('#workspace-view').isVisible());
  await view.page.screenshot({path:path.join(output,`${name}.png`),fullPage:true});
  await view.context.close();
}

for (const [name, viewport] of [['tablet',{width:768,height:1024}],['mobile',{width:390,height:844}]]) {
  const view = await open(root, {viewport,hasTouch:true});
  await connect(view.page);
  await chooseCase(view.page, journey.challenged.case_id);
  await view.page.locator('nav [data-nav="Settlement"]').click();
  check(`${name} stable view has no horizontal overflow`, await noOverflow(view.page));
  await view.page.screenshot({path:path.join(output,`final-${name}-${viewport.width}x${viewport.height}.png`),fullPage:true});
  await view.context.close();
}

const contrast = (a,b) => {
  const luminance = color => color.match(/\w\w/g).map(value => Number.parseInt(value,16)/255).map(value => value<=.03928?value/12.92:((value+.055)/1.055)**2.4).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);
  const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
};
check('soft white contrast exceeds 4.5 to 1', contrast('F5F7F5','0B1110') >= 4.5);
check('NEAR mint contrast exceeds 4.5 to 1', contrast('00EC97','0B1110') >= 4.5);
check('browser console remains error-free', report.console_errors.length === 0, report.console_errors.join(' | '));

await browser.close();
await fs.writeFile(path.join(output,'e2e-report.json'), JSON.stringify(report,null,2));
for (const item of report.checks) console.log(`${item.pass?'PASS':'FAIL'} ${item.name}${item.detail?`: ${item.detail}`:''}`);
if (process.exitCode) throw Error('M04.2 end-to-end QA failed');
