import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';

const origin='http://127.0.0.1:4173';
const server=spawn(process.execPath,['services/api/server.mjs'],{stdio:['ignore','pipe','pipe']});
let browser;
try{
 await new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(Error('Local server did not start')),15000);
  server.stdout.on('data',chunk=>{if(chunk.toString().includes('CONTRA http://127.0.0.1:4173')){clearTimeout(timeout);resolve();}});
  server.on('exit',code=>{clearTimeout(timeout);reject(Error(`Local server exited ${code}`));});
 });
 browser=await chromium.launch({headless:true});
 await mkdir('ci-output',{recursive:true});
 for(const width of [320,390,768,1024,1440]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin,{waitUntil:'networkidle'});
  await page.locator('#radar svg').waitFor();
  const metrics=await page.locator('#metric-chips button').count();assert.equal(metrics,8,`readiness sectors at ${width}`);
  assert.equal(await page.locator('#radar').innerText().then(text=>/\b(?:10|20|30|40|50|60|70|80|90|100)%/.test(text)),false,'no guide percentages');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);assert.equal(overflow,false,`horizontal overflow at ${width}`);
  if(width===390){await page.locator('#mobile-more').click();assert.equal(await page.locator('#mobile-menu').evaluate(node=>node.open),true);await page.locator('#mobile-menu a[href="#settlement"]').click();await page.locator('#workspace .workspace-panel').first().waitFor();assert.equal(new URL(page.url()).hash,'#settlement');}
  if(width===1440){await page.locator('.rail a[href="#cases"]').click();await page.locator('#workspace .workspace-panel').first().waitFor();assert.equal(new URL(page.url()).hash,'#cases');}
  await page.screenshot({path:`ci-output/frontend-${width}.png`,fullPage:true});
  assert.deepEqual(errors,[],`browser errors at ${width}`);
  await page.close();
 }
 console.log('Five viewport browser journeys and screenshots passed against the local unavailable-chain runtime.');
}finally{await browser?.close();server.kill('SIGTERM');}
