import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';

const root=process.env.CONTRA_QA_ROOT||'http://127.0.0.1:4176';
const output=path.resolve(process.env.CONTRA_QA_OUTPUT||'project/artifacts/m043/phase3/final');
const caseId=process.env.CONTRA_CASE_ID||'e97ff99942388b0e490e057435228fa82709ec76f2849b5c8c1bec579eca6e9c';
const viewports=[
  ['desktop-short',1536,676],
  ['laptop',1366,768],
  ['desktop-reference',1200,900],
  ['desktop-wide',1440,900],
  ['full-hd',1920,1080],
  ['tablet',768,1024],
  ['mobile',390,844],
  ['effective-320',320,844]
];

await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1536,height:676}});
const page=await context.newPage();
const errors=[];
page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
page.on('pageerror',error=>errors.push(error.message));
await page.goto(root,{waitUntil:'networkidle'});
await page.locator('[data-action="account"]').first().click();
await page.locator('#account-choice').selectOption({label:'creator.test.near'});
await page.locator('[data-action="connect"]').click();
await page.locator('dialog').evaluate(dialog=>dialog.close());
await page.locator('[data-action="refresh"]').click();
await page.locator('nav [data-nav="Cases"]').click();
await page.locator(`[data-select-case="${caseId}"]`).click();
await page.waitForFunction(id=>document.querySelector('.person h2')?.title===id&&document.querySelector('#radar')?.dataset.metrics?.startsWith('['),caseId);
await page.locator('nav [data-nav="Overview"]').click();

const captures=[];
for(const [name,width,height] of viewports){
  await page.setViewportSize({width,height});
  await page.evaluate(()=>scrollTo(0,0));
  await page.waitForFunction(()=>document.querySelector('#radar')?.dataset.metrics?.startsWith('['));
  const file=`${name}-${width}x${height}.png`;
  await page.screenshot({path:path.join(output,file)});
  captures.push({name,width,height,file,kind:'visible viewport',scroll_y:0});
  if(width<=768){
    await page.locator('.signals').scrollIntoViewIfNeeded();
    const radarFile=`${name}-radar-${width}x${height}.png`;
    await page.screenshot({path:path.join(output,radarFile)});
    captures.push({name:`${name}-radar`,width,height,file:radarFile,kind:'visible viewport',scroll_y:await page.evaluate(()=>scrollY)});
  }
}

const metrics=await page.evaluate(()=>JSON.parse(document.querySelector('#radar').dataset.metrics));
const report={checkpoint:'CONTRA-2026-11-04-IMPL-M04.3-P3',root,case_id:caseId,account:'creator.test.near',captures,metrics,console_errors:errors};
await fs.writeFile(path.join(output,'capture-report.json'),JSON.stringify(report,null,2));
await browser.close();
console.log(`Captured ${captures.length} genuine-case viewport images for ${caseId}`);
if(errors.length)throw Error(`Capture console errors: ${errors.join(' | ')}`);
