import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const root=process.env.CONTRA_ROOT||'http://127.0.0.1:4176';
const out=process.env.CONTRA_ARTIFACT_DIR||'project/artifacts/m043/phase1';
const viewports=[
  ['desktop-short',1536,676],
  ['laptop',1366,768],
  ['desktop-reference',1200,900],
  ['desktop-wide',1440,900],
  ['desktop-full-hd',1920,1080],
  ['tablet',768,1024],
  ['mobile',390,844],
  ['mobile-effective',320,844]
];
const checks=[];
const record=(name,pass,detail='')=>{checks.push({name,pass,detail});console.log(`${pass?'PASS':'FAIL'} ${name}${detail?`: ${detail}`:''}`);};
const inside=(rect,width,height)=>rect.left>=0&&rect.top>=0&&rect.right<=width+.5&&rect.bottom<=height+.5;

await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
for(const [name,width,height] of viewports){
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[];
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(root,{waitUntil:'networkidle'});
  await page.screenshot({path:`${out}/${name}-${width}x${height}.png`});
  const metrics=await page.evaluate(()=>{
    const rect=selector=>document.querySelector(selector)?.getBoundingClientRect().toJSON();
    const visible=selector=>{const element=document.querySelector(selector);if(!element)return false;const box=element.getBoundingClientRect(),style=getComputedStyle(element);return style.visibility!=='hidden'&&style.display!=='none'&&box.width>0&&box.height>0;};
    return {
      viewport:{width:innerWidth,height:innerHeight},
      document:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},
      shell:rect('.shell'),nav:rect('nav'),profile:rect('.profile'),progress:rect('.path'),signals:rect('.signals'),canvas:rect('#radar'),tasks:rect('.tasks'),
      columns:[...document.querySelectorAll('.left,.middle,.right')].map(element=>({clientHeight:element.clientHeight,scrollHeight:element.scrollHeight,overflowY:getComputedStyle(element).overflowY})),
      primaryControls:['[data-action="case"]','[data-action="signals"]','[data-nav="Reviewers"]','[data-nav="Evidence"]','[data-nav="Activity"]'].map(selector=>({selector,visible:visible(selector),rect:rect(selector)})),
      fontSizes:['.profile p','.pathlabels p','.task p','.section-link'].map(selector=>({selector,size:parseFloat(getComputedStyle(document.querySelector(selector)).fontSize)}))
    };
  });
  record(`${name} has no horizontal overflow`,metrics.document.width<=width,`${metrics.document.width}/${width}`);
  record(`${name} has no console errors`,errors.length===0,errors.join(' | '));
  if(width>=901){
    record(`${name} shell fits visible viewport`,inside(metrics.shell,width,height),`bottom ${metrics.shell.bottom.toFixed(1)} of ${height}`);
    for(const key of ['nav','profile','progress','signals','canvas','tasks'])record(`${name} ${key} is fully visible`,inside(metrics[key],width,height),`bottom ${metrics[key].bottom.toFixed(1)}`);
    record(`${name} uses no document scrollbar`,metrics.document.height<=height,`${metrics.document.height}/${height}`);
    record(`${name} uses no independent column scrollbar`,metrics.columns.every(column=>column.clientHeight===column.scrollHeight&&!['auto','scroll'].includes(column.overflowY)),JSON.stringify(metrics.columns));
    record(`${name} primary controls are visible`,metrics.primaryControls.every(control=>control.visible&&inside(control.rect,width,height)));
    record(`${name} primary copy remains at least 10px`,metrics.fontSizes.every(item=>item.size>=10),JSON.stringify(metrics.fontSizes));
  }
  await page.close();
}
await browser.close();
const report={checkpoint:'CONTRA-2026-11-04-IMPL-M04.3-P1',root,viewports,checks};
await writeFile(`${out}/desktop-fit-report.json`,JSON.stringify(report,null,2));
if(checks.some(check=>!check.pass))process.exitCode=1;
