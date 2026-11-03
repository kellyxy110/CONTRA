import fs from 'node:fs/promises';
import path from 'node:path';

import {chromium, firefox} from 'playwright';

const root = process.env.CONTRA_QA_ROOT || 'http://127.0.0.1:4176';
const output = path.resolve(process.env.CONTRA_QA_OUTPUT || 'project/artifacts/m042/phase3/browser-matrix');
await fs.mkdir(output, {recursive:true});
const targets = [
  ['windows-chrome', chromium, {channel:'chrome'}],
  ['windows-playwright-chromium', chromium, {}],
  ['windows-firefox', firefox, {}]
];
const report = {checkpoint:'CONTRA-2026-11-03-IMPL-M04.2-P3',root,targets:[],linux_chromium:{status:'BLOCKED',reason:'Playwright Chromium download on WSL failed at the network boundary: Azure Edge timed out, then alternate hosts returned EAI_AGAIN.'}};

for (const [name, engine, launchOptions] of targets) {
  const row = {name,checks:[],console_errors:[]};
  const browser = await engine.launch({headless:true,...launchOptions});
  const context = await browser.newContext({viewport:{width:1366,height:768}});
  const page = await context.newPage();
  page.on('console', message => {if (message.type() === 'error') row.console_errors.push(message.text());});
  page.on('pageerror', error => row.console_errors.push(error.message));
  await page.goto(root, {waitUntil:'networkidle'});
  await page.locator('[data-nav="Cases"]').click();
  row.checks.push({name:'stable Cases view',pass:await page.locator('#workspace-view h2').textContent().then(value=>value.trim()==='Cases')});
  row.checks.push({name:'no horizontal overflow',pass:await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)});
  row.checks.push({name:'single visible main landmark',pass:await page.evaluate(()=>[...document.querySelectorAll('main,[role="main"]')].filter(element=>!element.hidden).length===1)});
  row.checks.push({name:'no application console error',pass:row.console_errors.length===0,detail:row.console_errors.join(' | ')});
  await page.screenshot({path:path.join(output,`${name}-cases-1366x768.png`),fullPage:true});
  row.pass=row.checks.every(check=>check.pass);
  report.targets.push(row);
  await context.close();
  await browser.close();
}

await fs.writeFile(path.join(output,'browser-matrix-report.json'),JSON.stringify(report,null,2));
for(const target of report.targets)for(const check of target.checks)console.log(`${check.pass?'PASS':'FAIL'} ${target.name}: ${check.name}${check.detail?`: ${check.detail}`:''}`);
console.log(`BLOCKED linux-chromium: ${report.linux_chromium.reason}`);
if(report.targets.some(target=>!target.pass))throw Error('M04.2 browser matrix failed');
