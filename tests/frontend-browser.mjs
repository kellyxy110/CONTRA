import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium, firefox} from 'playwright';

const origin = 'http://127.0.0.1:4173';
const server = spawn(process.execPath, ['services/api/server.mjs'], {stdio:['ignore','pipe','pipe']});
let browser;
try {
 await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Error('Local server did not start')), 15000);
  server.stdout.on('data', chunk => {
   if (chunk.toString().includes('CONTRA http://127.0.0.1:4173')) {
    clearTimeout(timer);
    resolve();
   }
  });
  server.on('exit', code => {clearTimeout(timer); reject(Error(`Local server exited ${code}`));});
 });
 await mkdir('ci-output',{recursive:true});
 for (const [name,engine] of [['chromium',chromium],['firefox',firefox]]) {
  browser = await engine.launch({headless:true});
  for (const width of [320,375,768,1024,1366,1440,1920]) {
   const page = await browser.newPage({viewport:{width, height:900}});
   await page.goto(origin);
   await page.getByRole('heading', {name:'Contestation Overview'}).waitFor();
   await page.getByText('Contract case data is unavailable.').waitFor();
   assert.equal(await page.locator('.kpis article').count(),4);
   assert.equal(await page.locator('.kpis .line-icon').count(),4);
   assert.equal(await page.locator('#navigation a .line-icon').count(),10);
   assert.equal(await page.locator('#navigation').evaluate(nav=>[...nav.children].every(link=>link.getBoundingClientRect().right<=nav.getBoundingClientRect().right)),true);
   if(width<=375)assert.equal(await page.locator('#navigation').evaluate(nav=>nav.scrollWidth>nav.clientWidth),false);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   for (const path of ['/workflow.css', '/tokens.css']) {
    assert.equal((await page.request.get(origin + path)).status(), 404);
   }
   await page.screenshot({path:`ci-output/contra-${name}-${width}-dark.png`,fullPage:true});
   await page.locator('#theme').selectOption('light');
   await page.reload();
   await page.waitForFunction(()=>document.documentElement.dataset.theme==='light');
   if(width===1440)await page.screenshot({path:`ci-output/contra-${name}-1440-light.png`,fullPage:true});
   if([1440,768,375,320].includes(width)){
    const cases=['ReviewCommit','Challenged','Settled'].map((state,index)=>({case_id:String(index+1).repeat(64),state,created_at_ns:'1794484800000000000',funded_principal_yocto:'1000000000000000000000000'}));
    cases[0].challenge={counterexample_digest:'c'.repeat(64)};
    await page.route('**/api/availability?*',route=>route.fulfill({json:{items:{}}}));
    await page.route('**/api/evidence/manifests?*',route=>route.fulfill({json:{items:[
     {kind:'Manifest',digest:'a'.repeat(64),onchain:true,body:{sources:[{provenance:{origin:'Fixture source'}}]}},
     {kind:'Manifest',digest:'b'.repeat(64),onchain:false},
    ]}}));
    await page.route('**/api/counterexample/records?*',route=>route.fulfill({json:{items:[{kind:'Counterexample',digest:'c'.repeat(64)}]}}));
    await page.route('**/api/view',route=>{
     const {method}=route.request().postDataJSON();
     const data={
      list_cases:{items:cases,next_index:null},
      get_events:{items:[{event:'case_funded',data:[{seq:'1',case_id:cases[0].case_id}]}]},
      get_round:{slots:[{commitment:'commit'},{revealed:true},{}]},
      get_config:{creator_allowlist:['browser-fixture.testnet']},
      preview_case:{case_id:'d'.repeat(64),terms_digest:'e'.repeat(64)},
     };
     return route.fulfill({json:{value:data[method]??null}});
    });
    await page.reload();
    await page.locator('#case').selectOption(cases[0].case_id);
    await page.locator('#review-chart .donut').waitFor();
    for(const status of ['Verified binding','Pending binding','Challenged']){
     await page.locator('#evidence').getByText(status,{exact:true}).waitFor();
    }
    assert.equal(await page.locator('.evidence-table th').evaluateAll(headers=>headers.every(header=>header.scrollHeight<=header.clientHeight)),true);
    assert.equal(await page.locator('#funded').textContent(),'3 NEAR');
    assert.equal(await page.locator('#case-chart .donut').count(),1);
    await page.locator('#status').evaluate(node=>{node.textContent='Deterministic visual fixture · no live records';});
    for(const theme of width===1440?['light','dark']:['dark']){
     await page.locator('#theme').selectOption(theme);
     await page.screenshot({path:`ci-output/contra-${name}-${width}-fixture-${theme}.png`,fullPage:true});
    }
    if(width===375){
     cases[0].creator_id='browser-fixture.testnet';
     cases[0].terms={criteria:[{criterion_id:1}]};
     await page.addInitScript(()=>sessionStorage.setItem('contra-session','browser-fixture'));
     await page.route('**/api/session',route=>route.fulfill({json:{account:'browser-fixture.testnet'}}));
     await page.route('**/api/config',route=>route.fulfill({json:{network:'testnet',contract_account:'contra-contestation.testnet',external_wallet_signing_authorized:false}}));
     await page.route('**/api/terms',route=>route.fulfill({json:{digest:'f'.repeat(64)}}));
     await page.route('**/api/wallet/prepare',route=>{
      const {call}=route.request().postDataJSON();
      assert.equal(call.method,'create_case');
      assert.equal(call.args.expected_terms_digest,'e'.repeat(64));
      return route.fulfill({json:{operation:{operation_id:'fixture-preparation',payload_hash:'a'.repeat(64)}}});
     });
     await page.route('**/api/evidence',route=>{
      const input=route.request().postDataJSON();
      assert.equal(input.case_id,cases[0].case_id);
      assert.equal(input.manifest.sources[0].provenance.origin,'Browser fixture');
      return route.fulfill({status:201,json:{digest:'a'.repeat(64)}});
     });
     await page.reload();
     await page.locator('#case').selectOption(cases[0].case_id);
     await page.getByRole('button',{name:'browser-fixture.testnet'}).waitFor();
     await page.locator('#navigation a[href="#evidence"]').click();
     await page.getByLabel('Evidence text').fill('Fixture record');
     await page.getByLabel('Provenance origin').fill('Browser fixture');
     await page.getByLabel('Captured at').fill('2026-11-12T12:00');
     await page.getByLabel('Claim for criterion 1').fill('Fixture claim');
     await page.getByRole('button',{name:'Store evidence'}).click();
     await page.getByText('Stored off-chain:',{exact:false}).waitFor();
     assert.equal(await page.getByRole('button',{name:'Sign evidence submission'}).count(),0);
     await page.locator('#navigation a[href="#cases"]').click();
     await page.getByLabel('Beneficiary Testnet account').fill('beneficiary.testnet');
     await page.getByLabel('Amount in NEAR').fill('1');
     await page.getByLabel('Creator operator digest').fill('1'.repeat(64));
     await page.getByLabel('Beneficiary operator digest').fill('2'.repeat(64));
     await page.getByLabel('Criterion requirement').fill('Fixture criterion');
     await page.getByLabel('Evidence policy').fill('Fixture policy');
     const deadlines=await page.locator('#workspace input[type=datetime-local]').all();
     for(const [i,input] of deadlines.entries()){
      const deadline=new Date(Date.now()+(i+1)*3600000);
      deadline.setMinutes(deadline.getMinutes()-deadline.getTimezoneOffset());
      await input.fill(deadline.toISOString().slice(0,16));
     }
     await page.getByRole('button',{name:'Preview case'}).click();
     await page.getByRole('button',{name:'Prepare Testnet case'}).click();
     await page.getByText('Prepared operation: fixture-preparation.',{exact:false}).waitFor();
     assert.equal(await page.getByRole('button',{name:'Sign case creation'}).count(),0);
     for(const link of await page.locator('#navigation a').all()){
      const title=await link.innerText();
      if(title==='Overview')continue;
      await link.click();
      await page.getByRole('heading',{level:1,name:title,exact:true}).waitFor();
      await page.locator('#workspace article').waitFor();
     }
    }
   }
   await page.close();
  }
  await browser.close();
  browser = undefined;
 }
} finally {
 await browser?.close();
 server.kill('SIGTERM');
}
