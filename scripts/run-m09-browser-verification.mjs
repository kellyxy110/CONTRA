import {chromium,firefox} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const origin=process.env.CONTRA_PUBLIC_ORIGIN||'https://contra-testnet.judithorluchee.workers.dev';
const output=path.resolve('project/artifacts/m09/browser');
async function launch(launcher,name){
 try{return await launcher.launch({headless:true});}catch(error){
  const base=process.env.LOCALAPPDATA&&path.join(process.env.LOCALAPPDATA,'ms-playwright');
  if(!base)throw error;
  const entries=(await fs.readdir(base)).filter(value=>value.startsWith(name==='chromium'?'chromium_headless_shell-':'firefox-')).sort().reverse();
  for(const entry of entries){
   const executable=path.join(base,entry,name==='chromium'?'chrome-headless-shell-win64/chrome-headless-shell.exe':'firefox/firefox.exe');
   try{await fs.access(executable);return await launcher.launch({headless:true,executablePath:executable});}catch{}
  }
  throw error;
 }
}
const profiles=[
 ['chromium','desktop',chromium,{width:1440,height:900}],
 ['chromium','mobile',chromium,{width:390,height:844}],
 ['firefox','desktop',firefox,{width:1440,height:900}],
 ['firefox','mobile',firefox,{width:390,height:844}]
];
await fs.mkdir(output,{recursive:true});
const results=[];
for(const [browserName,layout,launcher,viewport] of profiles){
 const browser=await launch(launcher,browserName);
 const context=await browser.newContext({viewport,colorScheme:'dark',reducedMotion:'reduce'});
 const page=await context.newPage(),consoleErrors=[],pageErrors=[];
 page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
 page.on('pageerror',error=>pageErrors.push(error.message));
 let response,lastError;
 for(let attempt=0;attempt<3&&!response;attempt++)try{response=await page.goto(origin,{waitUntil:'networkidle',timeout:60000});}catch(error){lastError=error;await page.waitForTimeout(1000*(attempt+1));}
 if(!response)throw lastError;
 await page.locator('#network').filter({hasText:'testnet'}).waitFor({timeout:30000});
 const readiness=await page.evaluate(async()=>{const response=await fetch('/api/ready');return {status:response.status,body:await response.json()};});
 if(response?.status()!==200||readiness.status!==200||readiness.body.ready!==true)throw Error(`${browserName} ${layout}: public application is not ready`);
 const metrics=await page.evaluate(()=>({viewport:innerWidth,document_width:document.documentElement.scrollWidth,buttons:[...document.querySelectorAll('button')].map(button=>({label:button.getAttribute('aria-label')||button.textContent.trim(),width:button.getBoundingClientRect().width,height:button.getBoundingClientRect().height})),missing_names:[...document.querySelectorAll('button,input,select,textarea')].filter(element=>!((element.getAttribute('aria-label')||element.textContent||element.closest('label')?.textContent||'').trim())).length}));
 if(metrics.document_width>metrics.viewport+1)throw Error(`${browserName} ${layout}: horizontal overflow ${metrics.document_width}/${metrics.viewport}`);
 if(metrics.missing_names)throw Error(`${browserName} ${layout}: ${metrics.missing_names} controls lack accessible names`);
 await page.locator('button.brand').click();
 await page.locator('#dialog-title').filter({hasText:/Connect account|Account connection/}).waitFor();
 const dialogText=await page.locator('dialog').innerText();
 if(!dialogText.includes('Connect testnet wallet')||!dialogText.includes('Transaction signing remains disabled'))throw Error(`${browserName} ${layout}: wallet boundary copy is missing`);
 await page.screenshot({path:path.join(output,`${browserName}-${layout}.png`),fullPage:true});
 results.push({browser:browserName,layout,version:browser.version(),url:page.url(),http_status:response.status(),ready_status:readiness.status,chain_block:readiness.body.chain?.block_height,storage_schema:readiness.body.storage?.schema_version,live_signing:false,horizontal_overflow:false,missing_accessible_names:0,console_errors:consoleErrors,page_errors:pageErrors,screenshot:`${browserName}-${layout}.png`});
 await browser.close();
}
const evidence={schema:'CONTRA_M09_BROWSER_EVIDENCE_V1',captured_at:new Date().toISOString(),origin,boundary:'Public browser rendering and authentication entry point only. No wallet key was imported, no signature was requested and no transaction was broadcast.',results};
await fs.writeFile(path.join(output,'evidence.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify(evidence,null,2));
