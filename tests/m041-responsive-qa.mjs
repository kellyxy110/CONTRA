import fs from 'node:fs/promises';
import path from 'node:path';

const playwright = await import(process.env.CONTRA_PLAYWRIGHT_MODULE || 'playwright');
const {chromium} = playwright;
const root = process.env.CONTRA_QA_ROOT || 'http://127.0.0.1:4174';
const output = path.resolve(process.env.CONTRA_QA_OUTPUT || 'project/artifacts/m041/phase1');
const executablePath = process.env.CONTRA_CHROMIUM_PATH || undefined;
const populatedCase = process.env.CONTRA_QA_CASE_ID || '';
const viewports = [
  ['desktop-1200x900', 1200, 900],
  ['laptop-1366x768', 1366, 768],
  ['desktop-1440x900', 1440, 900],
  ['desktop-1920x1080', 1920, 1080],
  ['tablet-768x1024', 768, 1024],
  ['mobile-390x844', 390, 844],
  ['mobile-320x844', 320, 844]
];
const report = {checkpoint:'CONTRA-2026-11-03-IMPL-M04.1-P1',root,populated_case:populatedCase || null,checks:[],measurements:{},console_errors:[]};
const check = (name, pass, detail='') => {
  report.checks.push({name,pass,detail});
  if (!pass) process.exitCode = 1;
};

await fs.mkdir(output,{recursive:true});
const browser = await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});

for (const [name,width,height] of viewports) {
  const context = await browser.newContext({viewport:{width,height},hasTouch:width<=900});
  const page = await context.newPage();
  page.on('console',message=>{if(message.type()==='error')report.console_errors.push(`${name}: ${message.text()}`);});
  page.on('pageerror',error=>report.console_errors.push(`${name}: ${error.message}`));
  await page.goto(root,{waitUntil:'networkidle'});
  if (populatedCase) {
    await page.locator('[data-action="account"]').first().click();
    await page.locator('#account-choice').selectOption({label:'creator.test.near'});
    await page.locator('[data-action="connect"]').click();
    await page.locator('dialog').evaluate(dialog=>dialog.close());
    await page.locator('[data-action="refresh"]').click();
    await page.waitForTimeout(300);
    await page.locator('[data-nav="Cases"]').click();
    await page.locator(`[data-case="${populatedCase}"]`).click();
    await page.locator('#dialog-title').filter({hasText:'Agreement & escrow'}).waitFor();
    await page.locator('dialog').evaluate(dialog=>dialog.close());
  }
  const measurements = await page.evaluate(()=>{
    const visible = element => {
      const style=getComputedStyle(element),rect=element.getBoundingClientRect();
      return style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0;
    };
    const sections=[...document.querySelectorAll('main section')].filter(visible).map(element=>{
      const rect=element.getBoundingClientRect();
      return {className:element.className,left:Math.round(rect.left),right:Math.round(rect.right),width:Math.round(rect.width),height:Math.round(rect.height)};
    });
    const shell=document.querySelector('.shell').getBoundingClientRect();
    return {
      viewport:{width:innerWidth,height:innerHeight},
      document:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},
      shell:{left:Math.round(shell.left),top:Math.round(shell.top),width:Math.round(shell.width),height:Math.round(shell.height)},
      sections,
      horizontal_overflow:document.documentElement.scrollWidth>innerWidth+1,
      clipped_sections:sections.filter(section=>section.left<0||section.right>innerWidth+1).map(section=>section.className),
      nav_scrollable:document.querySelector('nav').scrollWidth>=document.querySelector('nav').clientWidth,
      minimum_named_button:[...document.querySelectorAll('button')].every(button=>(button.getAttribute('aria-label')||button.textContent).trim().length>0),
      undersized_touch_targets:matchMedia('(pointer: coarse)').matches?[...document.querySelectorAll('button')].filter(visible).map(button=>{const rect=button.getBoundingClientRect();return {name:(button.getAttribute('aria-label')||button.textContent).trim().replace(/\s+/g,' ').slice(0,40),width:Math.round(rect.width),height:Math.round(rect.height)};}).filter(target=>target.width<44||target.height<44):[]
    };
  });
  report.measurements[name]=measurements;
  check(`${name} has no page horizontal overflow`,!measurements.horizontal_overflow,`${measurements.document.width}px document at ${width}px viewport`);
  check(`${name} has no viewport-clipped section`,measurements.clipped_sections.length===0,measurements.clipped_sections.join(', '));
  check(`${name} buttons retain accessible names`,measurements.minimum_named_button);
  if(width<=900)check(`${name} touch targets are at least 44px`,measurements.undersized_touch_targets.length===0,JSON.stringify(measurements.undersized_touch_targets));
  if(name==='desktop-1200x900')check('1200 x 900 preserves approved shell geometry',JSON.stringify(measurements.shell)===JSON.stringify({left:60,top:45,width:1080,height:810}),JSON.stringify(measurements.shell));
  await page.screenshot({path:path.join(output,`${populatedCase?'populated':'empty'}-${name}.png`),fullPage:true});
  await context.close();
}

check('browser console remains error-free',report.console_errors.length===0,report.console_errors.join(' | '));
await browser.close();
await fs.writeFile(path.join(output,`${populatedCase?'populated':'empty'}-responsive-report.json`),JSON.stringify(report,null,2));
for(const item of report.checks)console.log(`${item.pass?'PASS':'FAIL'} ${item.name}${item.detail?`: ${item.detail}`:''}`);
if(process.exitCode)throw Error('M04.1 responsive QA failed');
