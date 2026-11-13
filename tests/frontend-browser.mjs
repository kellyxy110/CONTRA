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
    const cases=['ReviewCommit','Challenged','Settled'].map((state,index)=>({case_id:String(index+1).repeat(64),state,creator_id:'creator.testnet',terms_digest:'9'.repeat(64),evidence_digest:'a'.repeat(64),created_at_ns:'1794484800000000000',funded_principal_yocto:'1000000000000000000000000',terms:{beneficiary_id:'beneficiary.testnet',chain_id:'testnet',contract_account:'contra-contestation.testnet',criteria:[{criterion_id:1,kind:'KEYBOARD',requirement_digest:'8'.repeat(64)}],primary_committee:[{reviewer_id:'browser-fixture.testnet'}],fresh_committee:[{reviewer_id:'fresh.testnet'}]}}));
    cases[2].challenge={counterexample_digest:'c'.repeat(64)};
    cases[2].rounds=[[{disposition:'ACCEPT'},{disposition:'ACCEPT'},{disposition:'REJECT'}],[{commitment:'d'.repeat(64),disposition:'REJECT'},{disposition:'REJECT'},{disposition:'ACCEPT'}]];
    cases[2].final_disposition='REJECT';cases[2].resolution_basis='FRESH';cases[2].payout={payout_intent_id:'payout-1',last_attempt:{result:'SUCCESS'}};
    cases[0].challenge={counterexample_digest:'c'.repeat(64)};
    await page.route('**/api/availability?*',route=>route.fulfill({json:{observed_at:'2026-11-13T00:00:00.000Z',items:{['4'.repeat(64)]:true},manifest:{schema:'CONTRA_EVIDENCE_V1',sources:[{source_id:'source-1',digest:'4'.repeat(64),provenance:{origin:'Fixture',captured_at:'2026-11-12T00:00:00.000Z',submitted_by:'creator.testnet'}}],criteria:[{criterion_id:1,source_ids:['source-1']}]},criterion_evaluations:[{criterion_id:1,result:'FULFILLED',recorded:true,verified:true}]}}));
    await page.route('**/api/evidence/manifests?*',route=>route.fulfill({json:{items:[
     {kind:'Manifest',digest:'a'.repeat(64),onchain:true,body:{sources:[{provenance:{origin:'Fixture source'}}]}},
     {kind:'Manifest',digest:'b'.repeat(64),onchain:false},
     {kind:'Manifest',digest:'d'.repeat(64),onchain:true},
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
     await page.locator('#evidence').getByText(status,{exact:true}).first().waitFor();
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
     cases[0].terms={...cases[0].terms,criteria:[{criterion_id:1,kind:'KEYBOARD',requirement_digest:'8'.repeat(64)}]};
     cases[1].creator_id='browser-fixture.testnet';cases[1].state='Provisional';
     await page.addInitScript(()=>sessionStorage.setItem('contra-session','browser-fixture'));
     await page.route('**/api/session',route=>route.fulfill({json:{account:'browser-fixture.testnet'}}));
     await page.route('**/api/session/renew',route=>route.fulfill({json:{token:'browser-fixture-renewed',account:'browser-fixture.testnet',expires:Date.now()+3600000}}));
     await page.route('**/api/config',route=>route.fulfill({json:{network:'testnet',contract_account:'contra-contestation.testnet',external_wallet_signing_authorized:false}}));
     await page.route('**/api/terms',route=>route.fulfill({json:{digest:'f'.repeat(64)}}));
     await page.route('**/api/wallet/prepare',route=>{
      const {call}=route.request().postDataJSON();
      assert.equal(call.method,'create_case');
      assert.equal(call.args.expected_terms_digest,'e'.repeat(64));
      return route.fulfill({json:{operation:{operation_id:'fixture-preparation',payload_hash:'a'.repeat(64)}}});
     });
     await page.route('**/api/wallet/reject',route=>route.fulfill({json:{operation_id:'fixture-preparation',status:'FAILED',payload:{signerId:'browser-fixture.testnet'}}}));
     await page.route('**/api/evidence',route=>{
      const input=route.request().postDataJSON();
      assert.equal(input.case_id,cases[0].case_id);
      assert.equal(input.manifest.sources[0].provenance.origin,'Browser fixture');
      return route.fulfill({status:201,json:{digest:'a'.repeat(64)}});
     });
     await page.route('**/api/artifact?*',route=>route.fulfill({json:{digest:'a'.repeat(64),media_type:'application/json',text:'{"schema":"CONTRA_EVIDENCE_V1"}'}}));
     await page.route('**/api/counterexample',route=>{const input=route.request().postDataJSON();assert.equal(input.case_id,cases[1].case_id);return route.fulfill({status:201,json:{digest:'c'.repeat(64)}});});
     await page.route('**/api/operation?*',route=>{const id=new URL(route.request().url()).searchParams.get('id');return route.fulfill({json:id==='pending-operation'?{operation_id:id,status:'PENDING',tx_hash:'11111111111111111111111111111111'}:{operation_id:id,status:'UNKNOWN',tx_hash:null}});});
     await page.route('**/api/wallet/reconcile',route=>route.fulfill({json:{operation_id:'pending-operation',status:'CONFIRMED',tx_hash:'11111111111111111111111111111111'}}));
     await page.reload();
     await page.locator('#case').selectOption(cases[0].case_id);
     await page.getByRole('button',{name:'browser-fixture.testnet'}).waitFor();
     await page.locator('#navigation a[href="#evidence"]').click();
     await page.getByRole('button',{name:/Manifest · a{64}/}).click();
     await page.getByText('CONTRA_EVIDENCE_V1',{exact:false}).waitFor();
     await page.getByLabel('Evidence text').fill('Fixture record');
     await page.getByLabel('Provenance origin').fill('Browser fixture');
     await page.getByLabel('Captured at').fill('2026-11-12T12:00');
     await page.getByLabel('Claim for criterion 1').fill('Fixture claim');
     await page.getByRole('button',{name:'Store evidence'}).click();
     await page.getByText('Stored off-chain:',{exact:false}).waitFor();
     assert.equal(await page.getByRole('button',{name:'Sign evidence submission'}).count(),0);
     await page.locator('#navigation a[href="#cases"]').click();
     await page.getByLabel('Search cases').fill(cases[0].case_id.slice(0,16));
     await page.getByRole('button',{name:new RegExp(cases[0].case_id)}).click();
     await page.getByRole('heading',{name:`Case ${cases[0].case_id}`}).waitFor();
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
     await page.getByRole('button',{name:'Cancel unsigned preparation'}).click();
     await page.getByText('Unsigned preparation: FAILED.',{exact:true}).waitFor();
     assert.equal(await page.getByRole('button',{name:'Sign case creation'}).count(),0);
     let evaluationJob;
     await page.route('**/api/provider/jobs',route=>{
      if(route.request().method()==='POST'){
       const input=route.request().postDataJSON();
       assert.equal(input.mode,'fixture');
       assert.equal(input.case_id,cases[0].case_id);
       evaluationJob={id:'fixture-job',provider:input.provider,status:'COMPLETED',case_id:input.case_id,response_digest:'f'.repeat(64)};
       return route.fulfill({status:201,json:evaluationJob});
      }
      return route.fulfill({json:{jobs:evaluationJob?[evaluationJob]:[]}});
     });
     await page.route('**/api/config',route=>route.fulfill({json:{network:'testnet',provider_fixtures_enabled:true}}));
     await page.locator('#navigation a[href="#lab"]').click();
     await page.getByLabel('Development fixture provider').selectOption('modal');
     await page.getByRole('button',{name:'Run non-binding development fixture'}).click();
     await page.getByText('Development fixture: COMPLETED.',{exact:false}).waitFor();
     await page.getByRole('button',{name:'Refresh evaluation jobs'}).click();
     await page.getByText('Evaluation jobs refreshed.',{exact:true}).waitFor();
     await page.route('**/api/provider/job-result?*',route=>{
      const url=new URL(route.request().url());
      assert.equal(url.searchParams.get('id'),'fixture-job');
      assert.equal(url.searchParams.get('case_id'),cases[0].case_id);
      return route.fulfill({json:{status:'PROPOSED',binding_authority:false,output:{scenario:'fixture output'}}});
     });
     await page.getByRole('button',{name:'Inspect evaluation result'}).click();
     await page.getByText('fixture output',{exact:false}).waitFor();
     await page.route('**/api/provider/job-result?*',route=>route.fulfill({status:404,json:{error:'Evaluation job not found'}}));
     await page.getByRole('button',{name:'Inspect evaluation result'}).click();
     await page.getByText('Evaluation job not found',{exact:true}).waitFor();
     const invite={reviewer_id:'browser-fixture.testnet',digest:'7'.repeat(64),committee:'PRIMARY',slot:1,status:'INVITED',expires:Date.now()+3600000};
     const invitationEvents=[];
     await page.route('**/api/reviewer/invitations',route=>route.fulfill({json:{invitations:[invite],events:invitationEvents}}));
     await page.route('**/api/reviewer/workspace?*',route=>route.fulfill({json:{case:cases[0],round_id:'0',records:[],next_action:'COMMIT'}}));
     await page.route('**/api/finding',route=>route.fulfill({status:201,json:{digest:'6'.repeat(64)}}));
     await page.route('**/api/reviewer/respond',route=>{
      const response=route.request().postDataJSON();
      assert.equal(response.reviewer_id,invite.reviewer_id);
      assert.equal(response.digest,invite.digest);
      invite.status=response.status;
      invitationEvents.push({status:response.status,observed_at:Date.now()});
      return route.fulfill({json:invite});
     });
     await page.locator('#navigation a[href="#reviewers"]').click();
     assert.equal(await page.getByRole('button',{name:'Consent',exact:true}).isDisabled(),true);
     await page.getByLabel('Citation digest').fill('a'.repeat(64));
     await page.getByLabel('Explanation').fill('Human fixture finding');
     await page.getByRole('button',{name:'Store human finding'}).click();
     await page.getByText('Finding stored:',{exact:false}).waitFor();
     await page.getByLabel('Recovery passphrase').first().fill('browser fixture recovery');
     assert.equal(await page.getByRole('button',{name:'Encrypt recovery package and commit'}).count(),1);
     await page.getByRole('button',{name:'Decline',exact:true}).click();
     await page.getByText('Invitation response: WITHDRAWN.',{exact:true}).waitFor();
     await page.reload();
     assert.equal(await page.getByRole('button',{name:'Consent',exact:true}).count(),0);
     await page.locator('#navigation a[href="#overview"]').click();
     await page.locator('#case').selectOption(cases[0].case_id);
     for(const link of await page.locator('#navigation a').all()){
      const title=await link.innerText();
      if(title==='Overview')continue;
      if(title==='Challenges')await page.locator('#case').evaluate((select,value)=>{select.value=value;},cases[1].case_id);
      if(title==='Constellations')await page.locator('#case').evaluate((select,value)=>{select.value=value;},cases[2].case_id);
      await link.click();
      await page.getByRole('heading',{level:1,name:title,exact:true}).waitFor();
      await page.locator('#workspace article').waitFor();
      if(title==='Constellations'){
       const radar=page.getByRole('img',{name:/Eight-axis evidence/});
       await radar.waitFor();
       assert.equal(await radar.locator('line').count(),8);
       await radar.locator('polygon').waitFor();
       assert.equal(await radar.locator('polygon').count(),1);
       await page.unroute('**/api/availability?*');
       await page.route('**/api/availability?*',route=>new URL(route.request().url()).searchParams.get('case_id')===cases[1].case_id?route.fulfill({status:403,json:{error:'Account is not authorised for this case'}}):route.fulfill({json:{observed_at:'2026-11-13T00:00:00.000Z',items:{['4'.repeat(64)]:true},manifest:{schema:'CONTRA_EVIDENCE_V1',sources:[{source_id:'source-1',digest:'4'.repeat(64),provenance:{origin:'Fixture',captured_at:'2026-11-12T00:00:00.000Z',submitted_by:'creator.testnet'}}],criteria:[{criterion_id:1,source_ids:['source-1']}]},criterion_evaluations:[{criterion_id:1,result:'FULFILLED',recorded:true,verified:true}]}}));
       await page.getByLabel('Comparison case').selectOption(cases[1].case_id);
       await page.getByRole('heading',{name:`Comparison · ${cases[1].case_id}`,exact:true}).waitFor();
       await page.getByText(/Evidence: inaccessible/).waitFor();
       await page.getByLabel('Primary case').selectOption('');
       await page.getByText('Select a case to compare evidence coverage.',{exact:true}).waitFor();
      }
      if(title==='Activity'){
       await page.getByLabel('Filter activity').fill('case_funded');
       await page.locator('#workspace').getByText(/case_funded/).waitFor();
      }
      if(title==='Challenges'){
       await page.getByLabel('Counterexample').fill('Browser counterexample');
       await page.getByRole('button',{name:'Store counterexample'}).click();
       await page.getByText('Stored off-chain:',{exact:false}).waitFor();
       assert.equal(await page.getByRole('button',{name:'Sign challenge'}).count(),0);
      }
      if(title==='Settlement'){
       const operation=page.getByLabel('Operation ID');
       await operation.fill('locked-operation');await page.getByRole('button',{name:'Inspect operation'}).click();await page.getByText('The transaction hash is unknown. This operation remains locked.',{exact:true}).waitFor();
       await operation.fill('pending-operation');await page.getByRole('button',{name:'Inspect operation'}).click();await page.getByRole('button',{name:'Reconcile with chain'}).click();await page.getByText('Operation status: CONFIRMED',{exact:true}).waitFor();
      }
      if(title==='Settings'){
       await page.getByRole('button',{name:'Renew session'}).click();
       await page.getByText('Session renewed for browser-fixture.testnet.',{exact:true}).waitFor();
      }
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
