import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium,firefox} from 'playwright';

const root=process.env.CONTRA_QA_ROOT||'http://127.0.0.1:4176';
const out=path.resolve(process.env.CONTRA_QA_OUTPUT||'project/artifacts/m043/phase3/browser-matrix');
await fs.mkdir(out,{recursive:true});
const targets=[['windows-chrome',chromium,{channel:'chrome'}],['playwright-chromium',chromium,{}],['firefox',firefox,{}]];
const viewports=[['desktop-short',1536,676],['laptop',1366,768],['desktop-reference',1200,900],['desktop-wide',1440,900],['full-hd',1920,1080],['tablet',768,1024],['mobile',390,844],['effective-320',320,844]];
const report={checkpoint:'CONTRA-2026-11-04-IMPL-M04.3-P3',root,targets:[],manual_screen_reader:'NOT RUN: no manual assistive-technology session was available.'};
const inside=(rect,width,height)=>rect.left>=0&&rect.top>=0&&rect.right<=width+.5&&rect.bottom<=height+.5;
const overlap=boxes=>boxes.some((box,index)=>boxes.slice(index+1).some(other=>!(box.right<=other.left||other.right<=box.left||box.bottom<=other.top||other.bottom<=box.top)));

for(const [engineName,engine,launchOptions] of targets){
  const target={name:engineName,viewports:[],interaction_checks:[],console_errors:[]};
  const browser=await engine.launch({headless:true,...launchOptions});
  for(const [name,width,height] of viewports){
    const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});page.on('pageerror',error=>errors.push(error.message));
    await page.goto(root,{waitUntil:'networkidle'});
    await page.waitForFunction(()=>document.querySelector('#radar')?.dataset.metrics?.startsWith('[')&&document.querySelector('#radar')?.dataset.labelBoxes?.startsWith('['));
    const data=await page.evaluate(()=>{const rect=selector=>document.querySelector(selector).getBoundingClientRect().toJSON(),canvas=document.querySelector('#radar'),labels=JSON.parse(canvas.dataset.labelBoxes),textSelectors=['.profile p','.pathlabels p','.task p','.section-link','#signal-tabs button'];return {document:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},shell:rect('.shell'),nav:rect('nav'),profile:rect('.profile'),progress:rect('.path'),signals:rect('.signals'),tasks:rect('.tasks'),canvas:canvas.getBoundingClientRect().toJSON(),labels,values:JSON.parse(canvas.dataset.metrics),fonts:textSelectors.map(selector=>({selector,size:parseFloat(getComputedStyle(document.querySelector(selector)).fontSize)})),columns:[...document.querySelectorAll('.left,.middle,.right')].map(element=>({client:element.clientHeight,scroll:element.scrollHeight,overflow:getComputedStyle(element).overflowY}))};});
    const checks=[
      {name:'no horizontal overflow',pass:data.document.width<=width},
      {name:'no console error',pass:errors.length===0,detail:errors.join(' | ')},
      {name:'radar labels do not overlap',pass:!overlap(data.labels)},
      {name:'radar labels fit canvas',pass:data.labels.every(label=>label.left>=0&&label.top>=0&&label.right<=data.canvas.width&&label.bottom<=data.canvas.height)},
      {name:'radar exposes eight direct values',pass:data.values.length===8&&data.values.every(metric=>metric.value&&metric.source&&'observedAt' in metric)},
      {name:'primary text is at least 10px',pass:data.fonts.every(item=>item.size>=10),detail:JSON.stringify(data.fonts)}
    ];
    if(width>=901){
      for(const key of ['shell','nav','profile','progress','signals','tasks','canvas'])checks.push({name:`${key} fits visible viewport`,pass:inside(data[key],width,height),detail:`bottom ${data[key].bottom}`});
      checks.push({name:'desktop needs no document scroll',pass:data.document.height<=height,detail:`${data.document.height}/${height}`});
      checks.push({name:'desktop has no independent column scroll',pass:data.columns.every(column=>column.client===column.scroll&&!['auto','scroll'].includes(column.overflow)),detail:JSON.stringify(data.columns)});
    }
    await page.screenshot({path:path.join(out,`${engineName}-${name}-${width}x${height}.png`)});
    if(engineName==='playwright-chromium'&&width<=768){await page.locator('.signals').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,`final-${name}-radar-${width}x${height}.png`)});}
    target.viewports.push({name,width,height,checks,pass:checks.every(check=>check.pass)});target.console_errors.push(...errors.map(error=>`${name}: ${error}`));
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:1536,height:676},reducedMotion:'reduce'}),page=await context.newPage();
  await page.goto(root,{waitUntil:'networkidle'});
  const views=[['Overview',null],['Cases','Cases'],['Challenges','Challenges'],['Evidence','Evidence'],['Reviewers','The Bench'],['Settlement','Settlement & history'],['Lab','Review lab'],['Activity','Settlement & history'],['Settings','Settings']];
  for(const [view,heading] of views){await page.locator(`nav [data-nav="${view}"]`).focus();await page.keyboard.press('Enter');const visible=heading?await page.locator('#workspace-view h2').textContent().then(text=>text.trim()===heading):await page.locator('main').isVisible();target.interaction_checks.push({name:`keyboard navigation opens ${view}`,pass:visible});}
  await page.locator('nav [data-nav="Cases"]').click();await page.locator('nav [data-nav="Evidence"]').click();await page.goBack();await page.waitForFunction(()=>location.hash.includes('view=Cases')&&document.querySelector('#workspace-view h2')?.textContent.trim()==='Cases');target.interaction_checks.push({name:'browser Back restores Cases',pass:(await page.locator('#workspace-view h2').textContent()).trim()==='Cases'});
  const account=page.locator('[data-action="account"]').first();await account.focus();await account.press('Enter');await page.locator('dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');await page.locator('dialog').waitFor({state:'hidden'});target.interaction_checks.push({name:'Escape closes dialog and restores focus',pass:await page.evaluate(()=>document.activeElement?.matches('[data-action="account"]'))});
  target.interaction_checks.push({name:'reduced motion preference is active',pass:await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)});
  await context.close();await browser.close();
  target.pass=target.viewports.every(viewport=>viewport.pass)&&target.interaction_checks.every(check=>check.pass)&&target.console_errors.length===0;report.targets.push(target);
}

await fs.writeFile(path.join(out,'browser-matrix-report.json'),JSON.stringify(report,null,2));
for(const target of report.targets){for(const viewport of target.viewports)for(const check of viewport.checks)console.log(`${check.pass?'PASS':'FAIL'} ${target.name} ${viewport.name}: ${check.name}${check.detail?`: ${check.detail}`:''}`);for(const check of target.interaction_checks)console.log(`${check.pass?'PASS':'FAIL'} ${target.name}: ${check.name}`);}
if(report.targets.some(target=>!target.pass))throw Error('M04.3 browser matrix failed');
