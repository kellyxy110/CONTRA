import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium,firefox} from 'playwright';

const origin='http://127.0.0.1:4173';
const server=spawn(process.execPath,['services/api/server.mjs'],{stdio:['ignore','pipe','pipe']});
let browser;
try{
 await new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(Error('Local server did not start')),15000);
  server.stdout.on('data',chunk=>{if(chunk.toString().includes('CONTRA http://127.0.0.1:4173')){clearTimeout(timeout);resolve();}});
  server.on('exit',code=>{clearTimeout(timeout);reject(Error(`Local server exited ${code}`));});
 });
 await mkdir('ci-output',{recursive:true});
 for(const [browserName,browserType] of [['chromium',chromium],['firefox',firefox]]){
 browser=await browserType.launch({headless:true});
 for(const width of [320,390,768,1024,1440]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin,{waitUntil:'networkidle'});
  await page.locator('#status-chart').waitFor();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark','approved dark default');
  const metrics=await page.locator('#metric-chips button').count();assert.equal(metrics,8,`readiness sectors at ${width}`);
  assert.equal(await page.locator('#radar').innerText().then(text=>/\b(?:10|20|30|40|50|60|70|80|90|100)%/.test(text)),false,'no guide percentages');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);assert.equal(overflow,false,`horizontal overflow at ${width}`);
  await page.screenshot({path:`ci-output/frontend-${browserName}-${width}-overview.png`,fullPage:true});
  if(width===390){await page.locator('#mobile-more').click();assert.equal(await page.locator('#mobile-menu').evaluate(node=>node.open),true);const link=page.locator('#mobile-menu a[href="#settlement"]');const group=link.locator('..');if(!await group.evaluate(node=>node.open))await group.locator('summary').click();await link.click();await page.locator('#workspace .workspace-panel').first().waitFor();assert.equal(new URL(page.url()).hash,'#settlement');}
  if(width===1440){
   assert((await page.locator('main').boundingBox()).y<100,'desktop content starts at the top');
   const lifecycle=await page.locator('.lifecycle-panel').boundingBox(),distribution=await page.locator('.status-panel').boundingBox();
   assert(Math.abs(lifecycle.y-distribution.y)<3,'lifecycle and distribution share the first analytical row');
   const committee=await page.locator('.committee-panel').boundingBox(),manifest=await page.locator('.evidence-panel').boundingBox();
   assert(Math.abs(committee.y-manifest.y)<3,'committee and evidence share the second analytical row');
   const activity=await page.locator('.events-panel').boundingBox();
   assert(activity.y>committee.y+committee.height-3,'activity follows the analytical panels');
   const fixtureCases=['Challenged','Challenged','ReviewCommit'].map((state,index)=>({
    state, case_id:String(index+1).repeat(64), created_at_ns:String(BigInt(Date.now())*1000000n),
   }));
   await page.route('**/api/view',async route=>{
    const {method}=route.request().postDataJSON();
    if(method==='list_cases')return route.fulfill({json:{value:{items:fixtureCases}}});
    if(method==='get_config')return route.fulfill({json:{value:{reserve_summary:{held_escrow_yocto:'0',paid_yocto:'0'}}}});
    return route.continue();
   });
   await page.locator('#case-range').dispatchEvent('change');
   const legend=page.getByRole('link',{name:'Challenged, 66.7%, 2 cases',exact:true});
   await legend.waitFor();
   await legend.focus();
   await page.keyboard.press('Enter');
   await page.waitForURL('**/#cases/state/Challenged');
   await page.goBack();
   await page.waitForURL(url=>!url.hash);
   await page.unroute('**/api/view');
   for(const route of ['cases','evidence','challenges','reviewers','settlement','lab','activity','settings']){
    const link=page.locator(`.rail a[href="#${route}"]`).first(),group=link.locator('..');
    if(!await group.evaluate(node=>node.open))await group.locator('summary').click();
    await link.click();
    await page.locator('#workspace .workspace-panel').first().waitFor();
    assert.equal(new URL(page.url()).hash,`#${route}`,`${browserName} route ${route}`);
   }
   const fixtureAccount='browser-fixture.testnet';
   const recordedJobs=[];
   await page.addInitScript(account=>{
    sessionStorage.setItem('contra-session','browser-fixture');
    sessionStorage.setItem('contra-account',account);
   },fixtureAccount);
   await page.route('**/api/session',route=>route.fulfill({json:{account:fixtureAccount}}));
   await page.route('**/api/config',route=>route.fulfill({json:{network:'testnet',provider_fixtures_enabled:true}}));
   await page.route('**/api/provider/jobs',route=>{
    if(route.request().method()==='GET')return route.fulfill({json:{jobs:recordedJobs,budgets:[]}});
    const input=route.request().postDataJSON();
    assert.equal(input.mode,'fixture');
    assert.equal(input.case_id,'a'.repeat(64));
    assert.equal(input.provider,'modal');
    const job={id:'browser-job-fixture',status:'COMPLETED',response_digest:'b'.repeat(64)};
    recordedJobs.push(job);
    return route.fulfill({status:201,json:job});
   });
   await page.goto('about:blank');
   await page.goto(origin+'/#lab',{waitUntil:'networkidle'});
   await page.locator('#evaluation-fixture input[name=case_id]').fill('a'.repeat(64));
   await page.locator('#evaluation-fixture select[name=provider]').selectOption('modal');
   await page.getByRole('button',{name:'Run development fixture'}).click();
   await page.locator('#evaluation-result').getByText('COMPLETED',{exact:true}).waitFor();
   await page.reload({waitUntil:'networkidle'});
   await page.locator('#workspace').getByText('browser-job-fixture',{exact:false}).waitFor();
  }
  if(width===390||width===1440)await page.screenshot({path:`ci-output/frontend-${browserName}-${width}-route.png`,fullPage:true});
  assert.deepEqual(errors,[],`browser errors at ${width}`);
  await page.close();
 }
 await browser.close();browser=undefined;
 }
 console.log('Chromium and Firefox passed every frontend route at five viewports against the local unavailable-chain runtime.');
}finally{await browser?.close();server.kill('SIGTERM');}
