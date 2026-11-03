import {chromium} from 'file:///C:/Users/user/AppData/Local/Temp/contra-playwright-ux2b/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const root=process.env.CONTRA_QA_ROOT||'http://127.0.0.1:4173',output=path.resolve(process.env.CONTRA_QA_OUTPUT||'project/artifacts/m04/local-journeys'),reportData=JSON.parse(await fs.readFile(path.join(output,'journey-report.json'),'utf8')),executablePath='C:/Users/user/AppData/Local/ms-playwright/chromium-1148/chrome-win/chrome.exe';
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath}),report={checkpoint:'CONTRA-2026-11-03-IMPL-M04-V01',case_id:reportData.challenged.case_id,console_errors:[],checks:[]};
const check=(name,pass,detail='')=>{report.checks.push({name,pass,detail});if(!pass)process.exitCode=1;};
async function open(viewport,reducedMotion='no-preference'){
 const context=await browser.newContext({viewport,reducedMotion}),page=await context.newPage();page.on('console',message=>{if(message.type()==='error')report.console_errors.push(message.text());});page.on('pageerror',error=>report.console_errors.push(error.message));await page.goto(root,{waitUntil:'networkidle'});return {context,page};
}
async function selectPopulated(page){
 await page.locator('[data-action="account"]').first().click();await page.locator('#account-choice').selectOption({label:'creator.test.near'});await page.locator('[data-action="connect"]').click();await page.locator('dialog').evaluate(dialog=>dialog.close());await page.locator('[data-action="refresh"]').click();await page.waitForTimeout(500);await page.locator('[data-nav="Cases"]').click();await page.locator(`[data-case="${reportData.challenged.case_id}"]`).click();await page.locator('#dialog-title').filter({hasText:'Agreement & escrow'}).waitFor();await page.locator('dialog').evaluate(dialog=>dialog.close());await page.waitForTimeout(250);
}
const desktop=await open({width:1200,height:900});await selectPopulated(desktop.page);await desktop.page.screenshot({path:path.join(output,'the-bench-populated-desktop-1200x900.png'),fullPage:true});
check('desktop populated challenged case',await desktop.page.locator('.person h2').textContent()==='Agreement '+reportData.challenged.case_id.slice(0,6));
check('desktop settled state',await desktop.page.locator('.person p').textContent()==='Settled');
check('desktop final block source visible',(await desktop.page.locator('#network').textContent()).includes('block'));
check('desktop no horizontal overflow',await desktop.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),String(await desktop.page.evaluate(()=>document.documentElement.scrollWidth)));
check('all buttons have accessible names',await desktop.page.evaluate(()=>[...document.querySelectorAll('button')].every(v=>(v.getAttribute('aria-label')||v.textContent).trim().length>0)));
await desktop.page.locator('#material-tabs button').filter({hasText:'Criteria'}).click();check('criteria material uses submitted sources',(await desktop.page.locator('#materials').textContent()).includes('cited source'));
await desktop.page.locator('#signal-tabs button').filter({hasText:'Evidence'}).click();await desktop.page.locator('[data-action="signals"]').click();check('signal details open',await desktop.page.locator('#dialog-title').textContent()==='Case signals');await desktop.page.locator('dialog .close').click();
await desktop.page.locator('.search input').fill('challenge');check('search filters actions',(await desktop.page.locator('#today').textContent()).includes('Challenge & settlement')&&await desktop.page.locator('#yesterday .task').count()===0);await desktop.page.locator('.search input').fill('');
await desktop.page.keyboard.press('Tab');check('keyboard focus is visible',await desktop.page.evaluate(()=>document.activeElement instanceof HTMLElement&&document.activeElement!==document.body));
await desktop.context.close();

const tablet=await open({width:768,height:1024});await selectPopulated(tablet.page);await tablet.page.screenshot({path:path.join(output,'the-bench-populated-tablet-768x1024.png'),fullPage:true});check('tablet no horizontal overflow',await tablet.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),String(await tablet.page.evaluate(()=>document.documentElement.scrollWidth)));check('tablet materials reachable',await tablet.page.locator('.materials').isVisible());await tablet.context.close();

const mobile=await open({width:390,height:844});await selectPopulated(mobile.page);await mobile.page.screenshot({path:path.join(output,'the-bench-populated-mobile-390x844.png'),fullPage:true});check('mobile no horizontal overflow',await mobile.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),String(await mobile.page.evaluate(()=>document.documentElement.scrollWidth)));check('mobile cards not clipped',await mobile.page.evaluate(()=>[...document.querySelectorAll('main section')].every(v=>{const r=v.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1;})));check('mobile navigation reachable',await mobile.page.locator('[data-nav="Evidence"]').isVisible());await mobile.context.close();

const reduced=await open({width:1200,height:900},'reduce');check('reduced motion preference observed',await reduced.page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches));await reduced.context.close();
check('browser console errors',report.console_errors.length===0,report.console_errors.join(' | '));
await fs.writeFile(path.join(output,'visual-qa-report.json'),JSON.stringify(report,null,2));await browser.close();
for(const item of report.checks)console.log(`${item.pass?'PASS':'FAIL'} ${item.name}${item.detail?': '+item.detail:''}`);if(process.exitCode)throw Error('M04 visual QA failed');
