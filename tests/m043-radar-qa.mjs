import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';

const fixtureRoot=process.env.CONTRA_EMPTY_ROOT||'http://127.0.0.1:4174';
const genuineRoot=process.env.CONTRA_QA_ROOT||'http://127.0.0.1:4176';
const out=path.resolve(process.env.CONTRA_QA_OUTPUT||'project/artifacts/m043/phase2');
const journey=JSON.parse(await fs.readFile('project/artifacts/m042/phase3/sandbox/journey-report.json','utf8'));
await fs.mkdir(out,{recursive:true});
const checks=[],consoleErrors=[];
const check=(name,pass,detail='')=>{checks.push({name,pass,detail});console.log(`${pass?'PASS':'FAIL'} ${name}${detail?`: ${detail}`:''}`);if(!pass)process.exitCode=1;};
const browser=await chromium.launch({headless:true});
const observedAt='2026-11-04T00:00:00.000Z';
const source={network:'sandbox',finality:'final',block_height:'100',block_hash:'fixture-block',observed_at:observedAt};
const committee=Array.from({length:3},(_,index)=>({reviewer_id:`reviewer${index}.test.near`,operator_id:`operator-${index}`,revision:'2',disclosure_digest:`disclosure-${index}`}));
const slots=(dispositions=[],commitments=[])=>committee.map((reviewer,index)=>({...reviewer,commitment:commitments[index]?`commitment-${index}`:null,disposition:dispositions[index]||null,finding_digest:dispositions[index]?`finding-${index}`:null}));
const caseRecord=(overrides={})=>({case_id:'c'.repeat(64),creator_id:'creator.test.near',state:'Draft',phase:'OPEN',evidence_digest:null,primary_disposition:null,final_disposition:null,resolution_basis:null,payout:null,challenge:null,terms_digest:'t'.repeat(64),terms:{amount_yocto:'1000000000000000000000000',chain_id:'sandbox',contract_account:'contract.test.near',criteria:[{criterion_id:1,kind:'GENERAL',requirement_digest:'r1'},{criterion_id:2,kind:'KEYBOARD',requirement_digest:'r2'}],primary_committee:committee,fresh_committee:committee,primary_reveal_end_ns:'1793729539797201869'},...overrides});
const manifest={criteria:[{criterion_id:1,source_ids:['s1']},{criterion_id:2,source_ids:['s2']}],sources:[{source_id:'s1',digest:'d1',provenance:{origin:'fixture',captured_at:observedAt,submitted_by:'beneficiary.test.near'}},{source_id:'s2',digest:'d2',provenance:{origin:'fixture',captured_at:observedAt,submitted_by:'beneficiary.test.near'}}]};
const metrics=page=>page.locator('#radar').evaluate(canvas=>({metrics:JSON.parse(canvas.dataset.metrics),boxes:JSON.parse(canvas.dataset.labelBoxes),lens:canvas.dataset.lens,description:canvas.dataset.lensDescription,aria:canvas.getAttribute('aria-label'),size:canvas.getBoundingClientRect().toJSON()}));
const values=data=>Object.fromEntries(data.metrics.map(metric=>[metric.label,`${metric.status}:${metric.numerator}/${metric.denominator}:${metric.value}`]));
const labelsDoNotOverlap=boxes=>boxes.every((box,index)=>boxes.slice(index+1).every(other=>box.right<=other.left||other.right<=box.left||box.bottom<=other.top||other.bottom<=box.top));
const labelsFit=(boxes,size)=>boxes.every(box=>box.left>=0&&box.top>=0&&box.right<=size.width&&box.bottom<=size.height);

async function fixturePage(name,c,rounds,availability){
  const context=await browser.newContext({viewport:{width:1200,height:900},deviceScaleFactor:2});
  await context.addInitScript(()=>{sessionStorage.setItem('contra-account','creator.test.near');sessionStorage.setItem('contra-session','fixture-token');});
  const page=await context.newPage();
  page.on('console',message=>{if(message.type()==='error')consoleErrors.push(`${name}: ${message.text()}`);});
  page.on('pageerror',error=>consoleErrors.push(`${name}: ${error.message}`));
  await page.route('**/api/**',async route=>{
    const request=route.request(),url=new URL(request.url());let value,status=200;
    if(url.pathname==='/api/health')value={chain:'connected',network:'sandbox',independence:'Deterministic visual fixture, not a transaction'};
    else if(url.pathname==='/api/config')value={accounts:['creator.test.near'],providers:[]};
    else if(url.pathname==='/api/availability')value=availability;
    else if(url.pathname==='/api/evidence/manifests')value={items:c?.evidence_digest?[{digest:'manifest',onchain:true,body:manifest}]:[]};
    else if(url.pathname==='/api/artifact')value={digest:url.searchParams.get('digest'),text:'deterministic fixture source'};
    else if(url.pathname==='/api/view'){
      const body=request.postDataJSON();
      if(body.method==='list_cases')value={items:c?[c]:[]};
      else if(body.method==='get_round')value={slots:rounds?.[body.args.round_id]||[]};
      else if(body.method==='get_events')value={items:[],next_after_seq:null};
      else value=null;
      value={value,source};
    }else{status=404;value={error:'fixture route not found'};}
    await route.fulfill({status,contentType:'application/json',body:JSON.stringify(value)});
  });
  await page.goto(fixtureRoot,{waitUntil:'networkidle'});
  return {context,page};
}

const fixtures=[
  {name:'created-unfunded-zero',case:caseRecord(),rounds:[slots(),slots()],availability:{observed_at:observedAt,items:{},manifest:null,criterion_evaluations:[]},expected:{Evidence:'measured:0/2:0%',Provenance:'not-applicable:0/0:N/A',Review:'measured:0/3:0%',Finality:'measured:0/4:0%',Challenge:'not-applicable:0/0:N/A',Quorum:'measured:0/2:0%',Keyboard:'measured:0/1:0%',Criteria:'measured:0/4:0%'}},
  {name:'fresh-review-partial',case:caseRecord({state:'ChallengeReview',evidence_digest:'manifest',challenge:{counterexample_digest:'counterexample',criterion_id:1}}),rounds:[slots(['ACCEPT','ACCEPT'],[true,true]),slots(['REJECT'],[true])],availability:{observed_at:observedAt,items:{d1:true,d2:true},manifest,criterion_evaluations:[]},expected:{Evidence:'measured:2/2:100%',Provenance:'measured:2/2:100%',Review:'measured:1/3:33%',Finality:'measured:0/4:0%',Challenge:'measured:3/4:75%',Quorum:'measured:1/2:50%',Keyboard:'measured:0/1:0%',Criteria:'measured:2/4:50%'}},
  {name:'settled-challenged-complete',case:caseRecord({state:'Settled',evidence_digest:'manifest',challenge:{counterexample_digest:'counterexample',criterion_id:1},final_disposition:'REJECT',resolution_basis:'FRESH',payout:{payout_intent_id:'intent',last_attempt:{result:'SUCCESS',completed_at_ns:'1793729539797201869'}}}),rounds:[slots(['ACCEPT','ACCEPT','ACCEPT'],[true,true,true]),slots(['REJECT','REJECT','REJECT'],[true,true,true])],availability:{observed_at:observedAt,items:{d1:true,d2:true},manifest,criterion_evaluations:[{criterion_id:1,result:'NOT_FULFILLED',recorded:true,verified:true},{criterion_id:2,result:'FULFILLED',recorded:true,verified:true}]},expected:{Evidence:'measured:2/2:100%',Provenance:'measured:2/2:100%',Review:'measured:3/3:100%',Finality:'measured:4/4:100%',Challenge:'measured:4/4:100%',Quorum:'measured:2/2:100%',Keyboard:'measured:1/1:100%',Criteria:'measured:4/4:100%'}}
];
const rendered=[];
for(const fixture of fixtures){
  const {context,page}=await fixturePage(fixture.name,fixture.case,fixture.rounds,fixture.availability);
  const data=await metrics(page),actual=values(data);
  check(`${fixture.name} renders exact values`,JSON.stringify(actual)===JSON.stringify(fixture.expected),JSON.stringify(actual));
  check(`${fixture.name} labels do not overlap`,labelsDoNotOverlap(data.boxes),JSON.stringify(data.boxes));
  check(`${fixture.name} labels fit the chart`,labelsFit(data.boxes,data.size));
  check(`${fixture.name} exposes values in accessible text`,data.metrics.every(metric=>data.aria.includes(`${metric.label} ${metric.value}`)),data.aria);
  const screenshot=path.join(out,`radar-${fixture.name}.png`);await page.locator('.signals').screenshot({path:screenshot});rendered.push({name:fixture.name,path:screenshot,metrics:data.metrics});
  if(fixture.name==='fresh-review-partial'){
    const profiles=[];
    for(const lens of ['Criteria','Evidence','Overall']){await page.locator('#signal-tabs button').filter({hasText:lens}).click();const lensData=await metrics(page);profiles.push({lens,profile:lensData.metrics.map(metric=>`${metric.status}:${metric.ratio}`),description:lensData.description});}
    check('Criteria, Evidence and Overall tabs have distinct profiles',new Set(profiles.map(item=>JSON.stringify(item.profile))).size===3,JSON.stringify(profiles));
  }
  await context.close();
}

const disconnected=await browser.newContext({viewport:{width:1200,height:900}});const disconnectedPage=await disconnected.newPage();await disconnectedPage.goto(genuineRoot,{waitUntil:'networkidle'});const locked=await metrics(disconnectedPage);check('disconnected read-only case keeps protected evidence locked',locked.metrics.filter(metric=>['Evidence','Provenance','Keyboard','Criteria'].includes(metric.label)).every(metric=>metric.status==='inaccessible'&&metric.value==='Locked'));check('locked data is not rendered as measured zero',locked.metrics.filter(metric=>metric.status==='inaccessible').every(metric=>metric.denominator===0&&metric.value!=='0%'));await disconnected.close();

const genuine=await browser.newContext({viewport:{width:1200,height:900}});const genuinePage=await genuine.newPage();await genuinePage.goto(genuineRoot,{waitUntil:'networkidle'});await genuinePage.locator('[data-action="account"]').first().click();await genuinePage.locator('#account-choice').selectOption({label:'creator.test.near'});await genuinePage.locator('[data-action="connect"]').click();await genuinePage.locator('dialog').evaluate(dialog=>dialog.close());await genuinePage.locator('[data-action="refresh"]').click();await genuinePage.waitForTimeout(300);
const genuineProfiles=[];for(const caseId of [journey.unchallenged.case_id,journey.challenged.case_id]){await genuinePage.locator('[data-nav="Cases"]').click();await genuinePage.locator(`[data-select-case="${caseId}"]`).click();await genuinePage.locator('[data-nav="Overview"]').click();await genuinePage.waitForFunction(id=>document.querySelector('.person h2')?.title===id,caseId);const data=await metrics(genuinePage);genuineProfiles.push({case_id:caseId,metrics:data.metrics});await genuinePage.locator('.signals').screenshot({path:path.join(out,`radar-genuine-${caseId===journey.unchallenged.case_id?'unchallenged':'challenged'}.png`)});}
check('genuine case switching refreshes all eight measurements',genuineProfiles.every(item=>item.metrics.length===8)&&JSON.stringify(genuineProfiles[0].metrics)!==JSON.stringify(genuineProfiles[1].metrics));await genuine.close();

const composite=await browser.newPage({viewport:{width:1500,height:470},deviceScaleFactor:1});const cards=[];for(const item of rendered){const data=await fs.readFile(item.path);cards.push(`<figure><figcaption>${item.name}</figcaption><img src="data:image/png;base64,${data.toString('base64')}"></figure>`);}await composite.setContent(`<style>body{margin:0;padding:16px;background:#0b1110;color:#f5f7f5;font:14px Arial;display:flex;gap:14px}figure{margin:0;width:480px}figcaption{margin:0 0 8px;color:#00ec97}img{display:block;width:100%;height:auto;border:1px solid #53605b}</style>${cards.join('')}`);await composite.screenshot({path:path.join(out,'radar-three-state-comparison.png')});await composite.close();
check('browser console remains error-free',consoleErrors.length===0,consoleErrors.join(' | '));
await browser.close();
await fs.writeFile(path.join(out,'radar-qa-report.json'),JSON.stringify({checkpoint:'CONTRA-2026-11-04-IMPL-M04.3-P2',checks,fixtures:rendered,genuineProfiles,consoleErrors},null,2));
if(process.exitCode)throw Error('M04.3 radar QA failed');
