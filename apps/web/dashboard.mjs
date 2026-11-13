import {createApiClient} from './api-client.mjs';
import {eligibleCaseActions,filterCases,readPagedCases, readProtectedCaseRecords} from './contract-operations.mjs';
import {createWalletOperations, openAuthenticatedWallet, recoverWallet} from './wallet-operations.mjs';
import {buildEvidenceManifest, storeEvidence, evidenceSubmissionArgs} from './evidence-operations.mjs';
import {storeCounterexample, challengeEligibility, fileChallenge} from './challenge-operations.mjs';
import {deadlineFields, previewCase, yocto} from './case-operations.mjs';
import {submitDevelopmentFixture} from './evaluation-operations.mjs';
import {mountConstellations} from './constellations.mjs';
import {commitReviewerVote,revealReviewerVote,respondToInvitation,signReviewerConsent,storeReviewerFinding} from './reviewer-operations.mjs';
import {inspectReceipt, inspectOperation, operationRecoveryState, reconcileKnownOperation} from './settlement-operations.mjs';
import {createReviewRecoveryPackage,recoverReviewReveal} from './review-package.mjs';

const byId = id => document.getElementById(id);
const routes = {overview:'Overview',cases:'Cases',evidence:'Evidence',lab:'Evaluations',challenges:'Challenges',reviewers:'The Bench',settlement:'Settlement',constellations:'Constellations',activity:'Activity',settings:'Settings'};
let token = sessionStorage.getItem('contra-session');
const {request, view} = createApiClient(() => token);
const post = (path, body) => request(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
let cases = [], caseRequest = 0;
const chartTones = {
 Challenged:'challenged', ChallengeReview:'challenged', Settled:'verified',
 ReviewCommit:'review', ReviewReveal:'review', Committed:'committed',
 Revealed:'verified', Pending:'pending', SettlementPending:'transaction-pending',
};
const tone = label => chartTones[label] ?? 'neutral';
const colour = label => `var(--state-${tone(label)})`;
const readable = label => label.replace(/([a-z])([A-Z])/g, '$1 $2');
const iconPaths = {
 overview:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
 cases:'M3 7h7l2 2h9v11H3z M3 7V4h7l2 3h7v2',
 evidence:'M6 3h9l4 4v14H6z M14 3v5h5 M9 12h7m-7 4h7',
 lab:'M9 3h6m-5 0v7l-5 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-8V3 M8 15h8',
 challenges:'M12 3 3 20h18z M12 9v5m0 3v1',
 reviewers:'M3 21v-3a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v3 M14 4a4 4 0 0 1 0 7m4 4a4 4 0 0 1 3 4v2 M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
 settlement:'M3 6h18v13H3z M3 9h18m-6 4h6m-14 3h4',
 constellations:'M5 17 11 5l8 11-14 1z M3 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0m6-12a2 2 0 1 0 4 0 2 2 0 1 0-4 0m8 11a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
 activity:'M3 12h4l3-7 4 14 3-7h4',
 settings:'M4 6h16M4 12h16M4 18h16 M8 4v4m8 2v4m-5 2v4',
 funded:'M4 7h16v13H4z M4 7l4-4h8l4 4 M8 12h8',
 payouts:'M4 4h16v16H4z M8 12l3 3 5-6',
};

function icon(name) {
 const ns = 'http://www.w3.org/2000/svg';
 const svg = document.createElementNS(ns, 'svg');
 svg.setAttribute('viewBox', '0 0 24 24');
 svg.setAttribute('aria-hidden', 'true');
 svg.classList.add('line-icon');
 const path = document.createElementNS(ns, 'path');
 path.setAttribute('d', iconPaths[name]);
 svg.append(path);
 return svg;
}

function element(tag, content) {
 const node = document.createElement(tag);
 node.textContent = content;
 return node;
}

function chart(id, entries, unit) {
 const target = byId(id);
 target.replaceChildren();
 const total = entries.reduce((sum, [, count]) => sum + count, 0);
 if (!total) {
  target.append(element('p', 'No records to display.'));
  return;
 }
 const ring = element('div', '');
 ring.className = 'donut';
 ring.setAttribute('aria-hidden', 'true');
 const centre = element('div', '');
 centre.append(element('strong', String(total)), element('small', unit));
 ring.append(centre);
 let previous = 0;
 ring.style.background = 'conic-gradient(' + entries.map(([label, count]) => {
  const start = previous;
  previous += count / total * 100;
  return `${colour(label)} ${start}% ${previous}%`;
 }).join(',') + ')';
 const legend = element('ul', '');
 legend.setAttribute('aria-label', `${total} ${unit}`);
 entries.forEach(([name, count]) => {
  const item = element('li', '');
  const dot = element('i', '');
  dot.style.background = colour(name);
  item.append(dot, element('span', readable(name)), element('b', new Intl.NumberFormat('en-GB', {style:'percent', maximumFractionDigits:1}).format(count / total)));
  legend.append(item);
 });
 target.append(ring, legend);
}

function table(id, rows, width, empty) {
 const target = byId(id);
 target.replaceChildren();
 if (!rows.length) {
  const cell = element('td', empty);
  cell.colSpan = width;
  const row = element('tr', '');
  row.append(cell);
  target.append(row);
  return;
 }
 rows.forEach(values => {
  const row = element('tr', '');
  values.forEach(value => {
   const cell = element('td', '');
   if(value instanceof Node)cell.append(value);
   else cell.textContent = String(value ?? 'Unavailable');
   row.append(cell);
  });
  target.append(row);
 });
}

function near(yocto) {
 const digits = yocto.toString().padStart(25, '0');
 const fraction = digits.slice(-24).replace(/0+$/, '');
 return `${digits.slice(0,-24)}${fraction ? '.' + fraction : ''} NEAR`;
}

async function selectCase() {
 const generation = ++caseRequest;
 const id = byId('case').value;
 const record = cases.find(item => item.case_id === id);
 const steps = ['Draft','Funded','Submitted','ReviewCommit','ReviewReveal','Provisional','Challenged','ChallengeReview','Resolved','Unresolved','SettlementPending','TransferFailed','Settled'];
 const step = record ? steps.indexOf(record.state) : -1;
 const milestones = [0,2,3,8];
 const current = milestones.findLastIndex(value => step >= value);
 [...byId('timeline').children].forEach((item, i) => {
  item.dataset.stage = i < current || (i === current && record?.state === 'Settled') ? 'complete' :
   i === current ? (['Challenged','ChallengeReview'].includes(record.state) ? 'challenged' : 'current') : 'pending';
 });
 chart('review-chart', [], 'reviewers');
 table('evidence', [], 4, id ? 'Loading protected evidence…' : 'Select a case to inspect evidence.');
 if (!record) return;
 const [round, protectedData] = await Promise.allSettled([
  view('get_round', {case_id:id, round_id:Number(byId('round').value)}),
  readProtectedCaseRecords(request, id),
 ]);
 if (generation !== caseRequest) return;
 const slots = round.status === 'fulfilled' ? round.value?.slots ?? [] : [];
 const counts = new Map();
 slots.forEach(slot => {
  const state = slot.revealed ? 'Revealed' : slot.commitment ? 'Committed' : 'Pending';
  counts.set(state, (counts.get(state) ?? 0) + 1);
 });
 chart('review-chart', [...counts], 'reviewers');
 const records = protectedData.status === 'fulfilled' ? protectedData.value[1]?.items ?? [] : [];
 table('evidence', records.map(item => {
  const challenged = Boolean(record.challenge && item.digest && (
   item.digest === record.challenge.counterexample_digest || item.digest === record.evidence_digest
  ));
  const binding = element('span', challenged ? 'Challenged' : item.onchain === true ? 'Verified binding' : 'Pending binding');
  binding.className = 'evidence-status';
  binding.dataset.tone = challenged ? 'challenged' : item.onchain === true ? 'verified' : 'pending';
  return [item.kind ?? 'Manifest', item.digest?.slice(0,12), item.body?.sources?.[0]?.provenance?.origin, binding];
 }), 4, 'No authorised evidence records returned.');
}

function renderCases() {
 const days = Number(byId('period').value);
 const cutoff = BigInt(Date.now() - days * 86400000) * 1000000n;
 const filtered = days ? cases.filter(item => BigInt(item.created_at_ns) >= cutoff) : cases;
 const states = new Map();
 filtered.forEach(item => states.set(item.state, (states.get(item.state) ?? 0) + 1));
 byId('funded').textContent = near(filtered.reduce((sum,item) => sum + BigInt(item.funded_principal_yocto ?? 0), 0n));
 byId('challenges').textContent = (states.get('Challenged') ?? 0) + (states.get('ChallengeReview') ?? 0);
 const settled = states.get('Settled') ?? 0;
 byId('payouts').textContent = `${settled} ${settled === 1 ? 'case' : 'cases'}`;
 byId('active').textContent = filtered.filter(item => !['Cancelled','Settled','Resolved','Unresolved'].includes(item.state)).length;
 chart('case-chart', [...states], 'cases');
 const selector = byId('case');
 const selected = selector.value;
 selector.replaceChildren(new Option('Select a case', ''), ...filtered.map(item => new Option(`${item.case_id.slice(0,12)} · ${item.state}`, item.case_id)));
 if (filtered.some(item => item.case_id === selected)) selector.value = selected;
 void selectCase();
}

const scheme = matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
 const preference = byId('theme').value;
 document.documentElement.dataset.theme = preference === 'system' ? (scheme.matches ? 'dark' : 'light') : preference;
}
const savedTheme = localStorage.getItem('contra-dashboard-theme');
if (['dark','light','system'].includes(savedTheme)) byId('theme').value = savedTheme;
applyTheme();
scheme.addEventListener('change', applyTheme);
byId('theme').addEventListener('change', () => {
 localStorage.setItem('contra-dashboard-theme', byId('theme').value);
 applyTheme();
});
Object.entries(routes).forEach(([route, label]) => {
 const link = element('a', label);
 link.href = '#' + route;
 link.prepend(icon(route));
 if(route==='challenges')link.dataset.tone='challenged';
 byId('navigation').append(link);
});
for(const [id,name] of Object.entries({funded:'funded',challenges:'challenges',payouts:'payouts',active:'cases'})){
 byId(id).closest('article').prepend(icon(name));
}
const brandMark=document.querySelector('.brand svg').cloneNode(true);
brandMark.classList.add('statement-mark');
document.querySelector('.message').prepend(brandMark);
let routeRequest = 0;
let account = null;
let wallet = null;
async function reviewerInvitations(panel) {
 const identity=account;
 if(!token||!identity){
  panel.append(element('p','Connect your wallet to see reviewer invitations.'));
  return;
 }
 const section=element('section','');
 const feedback=element('p','');
 feedback.setAttribute('role','status');
 panel.append(section,feedback);
 async function refresh(){
  const {invitations=[],events=[]}=await request('reviewer/invitations');
  section.replaceChildren(element('h3','My invitations'));
  if(!invitations.length)section.append(element('p','No invitations for this account.'));
  for(const invitation of invitations){
   const item=element('div','');
   item.append(element('p',`${invitation.committee} · Slot ${invitation.slot} · ${invitation.status}`));
   const expires=Number(invitation.expires);
   item.append(element('p',`Expires: ${new Date(expires).toLocaleString('en-GB')}`));
   if(invitation.reviewer_id===identity && expires>Date.now() && ['INVITED','CONSENTED'].includes(invitation.status)){
    let consentInput=null;
    if(invitation.status==='INVITED'){
     consentInput=document.createElement('form');
     consentInput.append(element('h4','Signed reviewer control'));
     for(const [label,name,type] of [['Operator control digest','operator_id','text'],['Disclosure digest','disclosure_digest','text'],['Available from','available_from','datetime-local'],['Available until','available_until','datetime-local']]){
      const field=element('label',label),input=document.createElement('input');input.name=name;input.type=type;input.required=true;field.append(input);consentInput.append(field);
     }
     const conflicts=element('label','Conflicts, one per line'),conflictInput=document.createElement('textarea');conflictInput.name='conflicts';conflicts.append(conflictInput);consentInput.append(conflicts);
     item.append(consentInput);
    }
    for(const [label,status] of (invitation.status==='INVITED'?[['Consent','CONSENTED'],['Decline','WITHDRAWN']]:[['Withdraw consent','WITHDRAWN']])){
     const button=element('button',label);
     button.type='button';
     if(status==='CONSENTED'&&!wallet){button.disabled=true;button.title='Reconnect the invited wallet to sign reviewer control.';}
     item.append(button);
     button.addEventListener('click',async()=>{
      const buttons=[...item.querySelectorAll('button')];
      buttons.forEach(control=>{control.disabled=true;});
      try{
       if(account!==identity||!token||expires<=Date.now())throw Error('This invitation is no longer actionable.');
       const saved=status==='CONSENTED'
        ?await signReviewerConsent({post,wallet,invitation,reviewerId:identity,input:Object.fromEntries(new FormData(consentInput).entries())})
        :await respondToInvitation(post,invitation.digest,identity,status);
       feedback.textContent=`Invitation response: ${saved.status}.`;
       await refresh();
      }catch(error){feedback.textContent=error.message;}
      finally{buttons.forEach(control=>{control.disabled=false;});}
     });
    }
   }
   section.append(item);
  }
  const audit=element('ul','');
  events.forEach(event=>audit.append(element('li',`${event.status} · ${new Date(event.observed_at).toLocaleString('en-GB')}`)));
  section.append(element('h3','Invitation history'),audit.children.length?audit:element('p','No invitation events.'));
 }
 try{await refresh();}catch(error){feedback.textContent=error.message;}
}
async function reviewerWorkspace(panel) {
 const caseId=byId('case').value,roundId=Number(byId('round').value);
 if(!token||!account||!caseId){panel.append(element('p','Connect an appointed reviewer wallet and select a case to open the review workspace.'));return;}
 const section=element('section',''),feedback=element('p','');feedback.setAttribute('role','status');panel.append(section,feedback);
 let workspace;
 try{workspace=await request('reviewer/workspace?'+new URLSearchParams({case_id:caseId,round_id:roundId}));}
 catch(error){feedback.textContent=error.message;return;}
 const record=workspace.case,round=await view('get_round',{case_id:caseId,round_id:roundId});
 section.append(element('h3','Assigned case review'),element('p',`Round ${roundId} · ${round.phase ?? record.state} · Next action: ${workspace.next_action ?? 'Inspect evidence'}`),element('p',`Evidence digest: ${round.evidence_digest ?? 'Unavailable'}`));
 const findingForm=element('form','');findingForm.append(element('h4','Store human finding'));
 const dispositionLabel=element('label','Disposition'),disposition=element('select','');disposition.name='disposition';for(const value of ['ACCEPT','REJECT','UNRESOLVED'])disposition.append(new Option(value,value));dispositionLabel.append(disposition);findingForm.append(dispositionLabel);
 for(const [labelText,name] of [['Citation digest','citation'],['Explanation','explanation'],['Limitations','limitations']]){const label=element('label',labelText),input=name==='explanation'||name==='limitations'?element('textarea',''):element('input','');input.name=name;if(name!=='limitations')input.required=true;label.append(input);findingForm.append(label);}
 const save=element('button','Store human finding'),findingResult=element('div','');findingResult.setAttribute('role','status');findingForm.append(save,findingResult);section.append(findingForm);
 findingForm.addEventListener('submit',async event=>{event.preventDefault();save.disabled=true;try{const saved=await storeReviewerFinding(post,caseId,roundId,new FormData(findingForm));findingResult.textContent=`Finding stored: ${saved.digest}`;mountCommit(saved.digest,disposition.value);}catch(error){findingResult.textContent=error.message;}finally{save.disabled=false;}});
 function mountCommit(findingDigest,selectedDisposition){
  if(section.querySelector('[data-review-commit]'))return;
  const form=element('form','');form.dataset.reviewCommit='true';const passLabel=element('label','Recovery passphrase'),passphrase=element('input','');passphrase.type='password';passphrase.name='passphrase';passphrase.required=true;passphrase.minLength=12;passLabel.append(passphrase);const submit=element('button','Encrypt recovery package and commit'),result=element('div','');result.setAttribute('role','status');form.append(element('h4','Commit reviewer vote'),passLabel,submit,result);section.append(form);
  form.addEventListener('submit',async event=>{event.preventDefault();submit.disabled=true;try{if(!wallet)throw Error('Reconnect the appointed reviewer wallet before committing.');const sdk=await import('./wallet.bundle.js'),built=await createReviewRecoveryPackage({caseRecord:record,round,account,findingDigest,disposition:selectedDisposition,passphrase:passphrase.value,voteCommitment:sdk.voteCommitment});await post('reviewer/package',built);const sent=await commitReviewerVote(signWorkspaceCall,caseId,roundId,built.commitment);result.textContent=`Commit operation: ${sent.operation?.status ?? 'Unavailable'}. The nonce is encrypted in the durable recovery package.`;}catch(error){result.textContent=error.message;}finally{submit.disabled=false;}});
 }
 const recoverForm=element('form',''),recoverLabel=element('label','Recovery passphrase'),recoverPass=element('input','');recoverPass.type='password';recoverPass.required=true;recoverLabel.append(recoverPass);const recover=element('button','Recover and reveal vote'),recoverResult=element('div','');recoverResult.setAttribute('role','status');recoverForm.append(element('h4','Reveal committed vote'),recoverLabel,recover,recoverResult);section.append(recoverForm);
 recoverForm.addEventListener('submit',async event=>{event.preventDefault();recover.disabled=true;try{if(!wallet)throw Error('Reconnect the appointed reviewer wallet before revealing.');const stored=await request('reviewer/package?'+new URLSearchParams({case_id:caseId,round_id:roundId})),sdk=await import('./wallet.bundle.js'),args=await recoverReviewReveal({stored,caseRecord:record,account,passphrase:recoverPass.value,voteCommitment:sdk.voteCommitment}),sent=await revealReviewerVote(signWorkspaceCall,args);recoverResult.textContent=`Reveal operation: ${sent.operation?.status ?? 'Unavailable'}.`;}catch(error){recoverResult.textContent=error.message;}finally{recover.disabled=false;}});
}
async function evaluationTools(panel, config) {
 const identity = account;
 const caseId = byId('case').value;
 const history = element('section','');
 const feedback = element('p','');
 feedback.setAttribute('role','status');
 panel.append(element('p','Evaluation proposals are non-binding. Live execution appears only when every provider and case authority gate is ready.'), history, feedback);
 if(!token || !identity){
  feedback.textContent='Connect your wallet to inspect your evaluation jobs.';
  return;
 }
 async function refreshJobs(){
  const {jobs=[]}=await request('provider/jobs');
  const list=element('ul','');
  for(const job of jobs){
   if(caseId && job.case_id!==caseId)continue;
   const item=element('li',`${job.provider} · ${job.status} · Response digest: ${job.response_digest ?? 'Unavailable'}`);
   const inspect=element('button','Inspect evaluation result');
   const result=element('div','');
   result.setAttribute('role','status');
   item.append(inspect,result);
   inspect.addEventListener('click',async()=>{
    inspect.disabled=true;
    result.textContent='Loading evaluation result…';
    try{
     const detail=await request('provider/job-result?'+new URLSearchParams({case_id:job.case_id,id:job.id}));
     result.replaceChildren(element('p',`Status: ${detail.status}. Non-binding development result.`));
     if(detail.output!=null)result.append(element('pre',JSON.stringify(detail.output,null,2)));
     else result.append(element('p','No persisted result is available.'));
    }catch(error){result.textContent=error.message;}
    finally{inspect.disabled=false;}
   });
   list.append(item);
  }
  history.replaceChildren(element('h3','Evaluation jobs'),list.children.length?list:element('p','No matching jobs.'));
 }
 const refresh=element('button','Refresh evaluation jobs');
 panel.append(refresh);
 refresh.addEventListener('click',async()=>{
  refresh.disabled=true;
  try{await refreshJobs();feedback.textContent='Evaluation jobs refreshed.';}
  catch(error){feedback.textContent=error.message;}
  finally{refresh.disabled=false;}
 });
 if(config.provider_fixtures_enabled===true && caseId){
  const label=element('label','Development fixture provider');
  const provider=element('select','');
  provider.append(new Option('Meta','meta'),new Option('Modal','modal'));
  label.append(provider);
  const run=element('button','Run non-binding development fixture');
  panel.append(label,run);
  run.addEventListener('click',async()=>{
   run.disabled=true;
   feedback.textContent='Submitting development fixture…';
   try{
    if(identity!==account)throw Error('Reconnect the account that opened this workspace.');
    const digestText=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),byte=>byte.toString(16).padStart(2,'0')).join('');
    const job=await submitDevelopmentFixture({request,post,caseId,provider:provider.value,account:identity,digestText});
    feedback.textContent=`Development fixture: ${job.status}. Response digest: ${job.response_digest ?? 'Unavailable'}.`;
    await refreshJobs();
   }catch(error){feedback.textContent=error.message;}
   finally{run.disabled=false;}
  });
 }
 if(caseId&&config.providers?.meta?.status==='READY'){
  const form=element('form',''),roleLabel=element('label','Evaluation role'),role=element('select','');role.name='role';for(const value of ['primary','adversarial','fresh'])role.append(new Option(readable(value),value));roleLabel.append(role);const roundLabel=element('label','Round'),round=element('select','');round.name='round_id';round.append(new Option('Primary','0'),new Option('Fresh','1'));roundLabel.append(round);const submit=element('button','Run bounded Meta evaluation'),result=element('div','');result.setAttribute('role','status');form.append(roleLabel,roundLabel,submit,result);panel.append(form);
  form.addEventListener('submit',async event=>{event.preventDefault();submit.disabled=true;try{const job=await post('evaluate',{case_id:caseId,round_id:Number(round.value),role:role.value,idempotency_key:`browser-meta:${caseId}:${round.value}:${role.value}`});result.textContent=`Meta job: ${job.status}. ${job.response_digest ?? 'No response digest.'}`;await refreshJobs();}catch(error){result.textContent=error.message;}finally{submit.disabled=false;}});
 }
 if(caseId&&config.providers?.modal?.status==='READY'){
  const form=element('form',''),label=element('label','Meta proposal digest'),input=element('input','');input.name='proposal_digest';input.required=true;input.pattern='[0-9a-f]{64}';label.append(input);const submit=element('button','Verify proposal with Modal'),result=element('div','');result.setAttribute('role','status');form.append(label,submit,result);panel.append(form);
  form.addEventListener('submit',async event=>{event.preventDefault();submit.disabled=true;try{const roundId=Number(byId('round').value),job=await post('provider/jobs',{mode:'live',kind:'verification',case_id:caseId,round_id:roundId,proposal_digest:input.value,idempotency_key:`browser-modal:${caseId}:${roundId}:${input.value}`});result.textContent=`Modal job: ${job.status}. ${job.response_digest ?? 'No response digest.'}`;await refreshJobs();}catch(error){result.textContent=error.message;}finally{submit.disabled=false;}});
 }
 try{await refreshJobs();}catch(error){feedback.textContent=error.message;}
}
async function signWorkspaceCall(...args) {
 const sdk = await import('./wallet.bundle.js');
 return createWalletOperations({request,getToken:()=>token,getAccount:()=>account,getWallet:()=>wallet,...sdk}).signCall(...args);
}

function caseCreation(panel, config) {
 const creator=account;
 if(!token || !creator || !config.creator_allowlist?.includes(creator)){
  panel.append(element('p','Case creation requires an authenticated, allowlisted creator.'));
  return;
 }
 const form=element('form','');
 const fields=[
  ['beneficiary_id','Beneficiary Testnet account','text'],
  ['amount','Amount in NEAR','text'],
  ['creator_operator_id','Creator operator digest','text'],
  ['beneficiary_operator_id','Beneficiary operator digest','text'],
  ['requirement','Criterion requirement','text'],
  ['policy','Evidence policy','text'],
  ...deadlineFields.map(name=>[name,readable(name.replace(/_ns$/,'').replaceAll('_',' ')),'datetime-local']),
 ];
 for(const [name,title,type] of fields){
  const label=element('label',title);
  const input=element('input','');
  input.type=type;
  input.name=name;
  input.required=true;
  if(name.endsWith('_operator_id'))input.pattern='[0-9a-f]{64}';
  if(name==='beneficiary_id')input.pattern='[a-z0-9._-]+\\.testnet';
  label.append(input);
  form.append(label);
 }
 const criterion=element('label','Criterion type');
 const kind=element('select','');
 kind.name='kind';
 kind.append(new Option('General','GENERAL'),new Option('Keyboard','KEYBOARD'));
 criterion.append(kind);
 const submit=element('button','Preview case');
 const result=element('div','');
 result.setAttribute('role','status');
 form.append(criterion,submit,result);
 panel.append(form);
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  const data=new FormData(form);
  submit.disabled=true;
  result.textContent='Checking terms and committee eligibility…';
  try{
   if(data.get('beneficiary_id')===creator)throw Error('The beneficiary must be distinct from the creator.');
   yocto(data.get('amount'));
   const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(crypto.randomUUID()));
   const requestId=Array.from(new Uint8Array(hash),byte=>byte.toString(16).padStart(2,'0')).join('');
   const {terms,preview}=await previewCase({data,account:creator,post,view,requestId});
   result.textContent=`Predicted case ID: ${preview.case_id}. Terms digest: ${preview.terms_digest}.`;
   const prepare=element('button','Prepare Testnet case');
   prepare.type='button';
   result.append(prepare);
   const args={request_id:requestId,terms,expected_terms_digest:preview.terms_digest};
   prepare.addEventListener('click',async()=>{
    prepare.disabled=true;
    try{
     if(account!==creator)throw Error('Reconnect the creator account to prepare this preview.');
     const sdk=await import('./wallet.bundle.js');
     const operations=createWalletOperations({request,getToken:()=>token,getAccount:()=>account,getWallet:()=>wallet,...sdk});
     const operation=await operations.prepareCase(args);
     result.append(element('p',`Prepared operation: ${operation.operation_id}. Payload hash: ${operation.payload_hash}.`));
     const cancel=element('button','Cancel unsigned preparation');cancel.type='button';result.append(cancel);cancel.addEventListener('click',async()=>{cancel.disabled=true;try{const cancelled=await sdk.cancelPreparedWalletTransaction({token,operationId:operation.operation_id,accountId:creator,preHandoffVerified:operation.status==='PREPARED'});result.append(element('p',`Unsigned preparation: ${cancelled.status}.`));if(cancelled.status==='FAILED')cancel.remove();}catch(error){result.append(element('p',error.message));cancel.disabled=false;}});
     const attachSigningControl=async()=>{
      const runtime=await request('config');
      if(!wallet||runtime.external_wallet_signing_authorized!==true)return false;
      if(result.querySelector('[data-sign-case]'))return true;
      const sign=element('button','Sign case creation');
      sign.type='button';sign.dataset.signCase='true';result.append(sign);
      sign.addEventListener('click',async()=>{
      sign.disabled=true;
      try{
       if(account!==creator)throw Error('Reconnect the creator account to sign this preview.');
       const receipt=await operations.signCall('create_case',args,'1',operation);
       const persisted=receipt.operation?.status==='CONFIRMED' ? await view('get_case',{case_id:preview.case_id}) : null;
       result.append(element('p',`Operation status: ${receipt.operation?.status ?? 'Unavailable'}. Transaction: ${receipt.transaction_hash ?? 'Unavailable'}.`));
       if(persisted)result.append(element('p',`Case confirmed: ${persisted.case_id}`));
      }catch(error){result.append(element('p',error.message));}
      });
      return true;
     };
     if(!await attachSigningControl()){
      result.append(element('p','Signing requires the creator wallet and exact server authorisation.'));
      const refreshAuthority=element('button','Refresh signing authority');refreshAuthority.type='button';result.append(refreshAuthority);
      refreshAuthority.addEventListener('click',async()=>{refreshAuthority.disabled=true;try{if(await attachSigningControl()){refreshAuthority.remove();result.append(element('p','The existing prepared operation is now authorised.'));}else result.append(element('p','Signing authority is not active for this prepared operation.'));}catch(error){result.append(element('p',error.message));}finally{refreshAuthority.disabled=false;}});
     }
    }catch(error){result.append(element('p',error.message));prepare.disabled=false;}
   });
  }catch(error){result.textContent=error.message;}
  finally{submit.disabled=false;}
 });
}

function caseArtifactTools(panel, record, isChallenge) {
 if (!token || !account || ![record.creator_id,record.terms?.beneficiary_id].includes(account)) {
  panel.append(element('p','An authenticated case participant is required.'));
  return;
 }
 if (isChallenge && record.challenge) {
  panel.append(element('p','A challenge is already recorded for this case.'));
  return;
 }
 const form = element('form','');
 function field(labelText,name,type='text') {
  const label=element('label',labelText);
  const input=element('input','');
  input.type=type;
  input.name=name;
  input.required=true;
  label.append(input);
  form.append(label);
 }
 const criteria=record.terms?.criteria ?? [];
 if(isChallenge){
  if(!criteria.length)return;
  const label=element('label','Frozen criterion');
  const select=element('select','');
  select.name='criterion_id';
  criteria.forEach(item=>select.append(new Option(`Criterion ${item.criterion_id}`,item.criterion_id)));
  label.append(select);
  form.append(label);
  field('Counterexample','text');
 }else{
  field('Evidence text','content');
  field('Provenance origin','origin');
  field('Captured at','captured','datetime-local');
  criteria.forEach(item=>field(`Claim for criterion ${item.criterion_id}`,`criterion-${item.criterion_id}`));
 }
 const save=element('button',isChallenge?'Store counterexample':'Store evidence');
 const result=element('div','');
 result.setAttribute('role','status');
 form.append(save,result);
 panel.append(form);
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  const data=new FormData(form);
  save.disabled=true;
  result.textContent='Storing immutable record…';
  try{
   const caseId=record.case_id;
   const saved=isChallenge ? await storeCounterexample(post,caseId,data) :
    await storeEvidence({post,caseId,manifest:buildEvidenceManifest(data,record)});
   result.textContent=`Stored off-chain: ${saved.digest}`;
   const config=await request('config');
   const enabled=Boolean(wallet && config.network==='testnet' && config.external_wallet_signing_authorized===true);
   const eligible=isChallenge ? challengeEligibility(record,account,enabled) :
    enabled && account===record.terms?.beneficiary_id && record.state==='Funded';
   if(!eligible){
    result.append(element('p','On-chain submission requires an eligible case, connected wallet and server signing authorisation.'));
    return;
   }
   const submit=element('button',isChallenge?'Sign challenge':'Sign evidence submission');
   submit.type='button';
   result.append(submit);
   submit.addEventListener('click',async()=>{
    submit.disabled=true;
    try{
     const receipt=isChallenge ? await fileChallenge(signWorkspaceCall,caseId,Number(data.get('criterion_id')),saved.digest) :
      await signWorkspaceCall('submit_evidence',evidenceSubmissionArgs(caseId,record,saved.digest),'1');
     result.textContent=`Operation status: ${receipt.operation?.status ?? 'Unavailable'}. Transaction: ${receipt.transaction_hash ?? 'Unavailable'}`;
    }catch(error){result.append(element('p',error.message));}
   });
  }catch(error){result.textContent=error.message;}
  finally{save.disabled=false;}
 });
}
function caseExplorer(panel,records){
 const controls=element('form',''),searchLabel=element('label','Search cases'),search=element('input','');search.type='search';searchLabel.append(search);const stateLabel=element('label','Case state'),state=element('select','');state.append(new Option('All states',''),...([...new Set(records.map(item=>item.state))].sort().map(value=>new Option(readable(value),value))));stateLabel.append(state);const mineLabel=element('label','My cases only'),mine=element('input','');mine.type='checkbox';mineLabel.append(mine);const results=element('div','');controls.append(searchLabel,stateLabel,mineLabel);panel.append(controls,results);
 const render=()=>{const filtered=filterCases(records,{account,mine:mine.checked,state:state.value||null,search:search.value});if(!filtered.length){results.replaceChildren(element('p','No matching cases.'));return;}const list=element('ul','');for(const record of filtered){const item=element('li',''),open=element('button',`${record.case_id} · ${readable(record.state)}`);open.type='button';open.addEventListener('click',()=>{byId('case').value=record.case_id;void selectCase();mountCaseDetails(panel,record);});item.append(open);list.append(item);}results.replaceChildren(list);};
 for(const input of [search,state,mine])input.addEventListener('input',render);render();
}
function mountCaseDetails(panel,record){
 panel.querySelector('[data-case-details]')?.remove();const section=element('section','');section.dataset.caseDetails='true';section.append(element('h3',`Case ${record.case_id}`),element('p',`State: ${readable(record.state)}. Creator: ${record.creator_id}. Beneficiary: ${record.terms?.beneficiary_id ?? 'Unavailable'}.`),element('p',`Terms digest: ${record.terms_digest}. Evidence: ${record.evidence_digest ?? 'Not submitted'}.`));
 const actions=eligibleCaseActions(record.case_id,record,account),feedback=element('div','');feedback.setAttribute('role','status');for(const [method,args,deposit,label] of actions){const button=element('button',label);button.type='button';button.addEventListener('click',async()=>{button.disabled=true;try{const sent=await signWorkspaceCall(method,args,deposit);feedback.textContent=`${label}: ${sent.operation?.status ?? 'Unavailable'}. Transaction: ${sent.transaction_hash ?? 'Unavailable'}.`;}catch(error){feedback.textContent=error.message;}finally{button.disabled=false;}});section.append(button);}if(!actions.length)section.append(element('p','No case action is available for this account and state.'));section.append(feedback);panel.append(section);
}
function evidenceInspector(panel,caseId,records){
 const section=element('section','');section.append(element('h3','Authorised evidence records'));if(!records.length)section.append(element('p','No evidence or counterexample records are available.'));
 for(const record of records){const item=element('div',''),button=element('button',`${record.kind ?? 'Record'} · ${record.digest}`),result=element('div','');button.type='button';result.setAttribute('role','status');button.addEventListener('click',async()=>{button.disabled=true;try{const artifact=await request('artifact?'+new URLSearchParams({case_id:caseId,digest:record.digest}));result.replaceChildren(element('p',`${artifact.media_type} · ${artifact.digest}`),element('pre',artifact.text));}catch(error){result.textContent=error.message;}finally{button.disabled=false;}});item.append(button,result);section.append(item);}panel.append(section);
}
function activityTools(panel,items){
 const label=element('label','Filter activity'),input=element('input','');input.type='search';label.append(input);const output=element('ul','');panel.append(label,output);const render=()=>{const query=input.value.toLowerCase(),filtered=items.filter(event=>JSON.stringify(event).toLowerCase().includes(query));output.replaceChildren(...filtered.map(event=>{const data=event.data?.[0]??{},item=element('li',`${data.seq ?? '?'} · ${event.event} · ${data.case_id ?? 'Global'}`);if(data.case_id){const link=element('button','Open case');link.type='button';link.addEventListener('click',()=>{byId('case').value=data.case_id;location.hash='cases';});item.append(' ',link);}return item;}));if(!filtered.length)output.append(element('li','No matching activity.'));};input.addEventListener('input',render);render();
}
async function settingsTools(panel,config){
 panel.append(element('p',`Network: ${config.network ?? 'Unavailable'}`),element('p',`Account: ${account ?? 'Disconnected'}`),element('p',`Contract: ${config.contract_account ?? 'Unavailable'}`));if(!token)return;
 const renew=element('button','Renew session'),disconnect=element('button','Disconnect wallet'),feedback=element('div','');feedback.setAttribute('role','status');panel.append(renew,disconnect,feedback);
 renew.addEventListener('click',async()=>{renew.disabled=true;try{const sdk=await import('./wallet.bundle.js'),session=await sdk.renewWalletSession(token);token=session.token;account=session.account;sessionStorage.setItem('contra-session',token);feedback.textContent=`Session renewed for ${account}.`;}catch(error){feedback.textContent=error.message;}finally{renew.disabled=false;}});
 disconnect.addEventListener('click',async()=>{disconnect.disabled=true;try{const sdk=await import('./wallet.bundle.js');await sdk.disconnectWalletSession({token,wallet});token=null;account=null;wallet=null;sessionStorage.removeItem('contra-session');byId('wallet').textContent='Connect wallet';feedback.textContent='Wallet disconnected and session revoked.';await updateNavigation();}catch(error){feedback.textContent=error.message;disconnect.disabled=false;}});
}
function settlementTools(panel) {
 if (!token) {
  panel.append(element('p','Connect your wallet to inspect receipts or recover an operation.'));
  return;
 }
 function addForm(labelText, field, buttonText, inspect) {
  const form = element('form','');
  const label = element('label',labelText);
  const input = element('input','');
  input.name = field;
  input.required = true;
  label.append(input);
  const button = element('button',buttonText);
  const result = element('div','');
  result.setAttribute('role','status');
  form.append(label,button,result);
  panel.append(form);
  form.addEventListener('submit',async event=>{
   event.preventDefault();
   button.disabled = true;
   result.textContent = 'Checking…';
   try { await inspect(new FormData(form),result); }
   catch(error){result.textContent=error.message;}
   finally{button.disabled=false;}
  });
 }
 addForm('Transaction hash','tx_hash','Inspect receipt',async (data,result)=>{
  const receipt = await inspectReceipt(post,data);
  result.textContent = `Receipt status: ${receipt.status ?? receipt.outcome ?? 'Unavailable'}`;
 });
 addForm('Operation ID','operation_id','Inspect operation',async (data,result)=>{
  const id = data.get('operation_id');
  const operation = await inspectOperation(request,id);
  const state = operationRecoveryState(operation);
  result.textContent = `Operation status: ${operation.status ?? 'Unavailable'}`;
  if (state.locked) result.append(element('p','The transaction hash is unknown. This operation remains locked.'));
  if (!state.canReconcile) return;
  const reconcile = element('button','Reconcile with chain');
  reconcile.type = 'button';
  result.append(reconcile);
  reconcile.addEventListener('click',async ()=>{
   reconcile.disabled = true;
   try {
    const updated = await reconcileKnownOperation(post,id,operation);
    result.textContent = `Operation status: ${updated.status ?? 'Unavailable'}`;
   } catch(error) {
    result.append(element('p',error.message));
    reconcile.disabled = false;
   }
  });
 });
}
async function updateNavigation() {
 const generation = ++routeRequest;
 const route = location.hash.slice(1).split('/')[0] || 'overview';
 [...byId('navigation').children].forEach(link => {
  if (link.hash === '#' + route) link.setAttribute('aria-current','page');
  else link.removeAttribute('aria-current');
 });
 const overview = route === 'overview' || route === 'main';
 byId('overview').hidden = !overview;
 const workspace = byId('workspace');
 workspace.hidden = overview;
 document.querySelector('h1').textContent = overview ? 'Contestation Overview' : routes[route] ?? 'Destination unavailable';
 if (overview) return;
 const panel = element('article', '');
 panel.append(element('h2', routes[route] ?? 'Destination unavailable'), element('p','Loading…'));
 workspace.replaceChildren(panel);
 const show = entries => {
  if (generation !== routeRequest) return;
  const list = element('ul','');
  entries.forEach(entry=>list.append(element('li',entry)));
  panel.lastElementChild.replaceWith(entries.length ? list : element('p','No records available.'));
 };
 try {
  if (route === 'cases' || route === 'challenges' || route === 'settlement') {
   const records = await readPagedCases(view,{maxPages:20});
   const states = route === 'challenges' ? ['Provisional','Challenged','ChallengeReview'] :
    route === 'settlement' ? ['Resolved','Unresolved','SettlementPending','TransferFailed','Settled'] : null;
   const matching=records.filter(record=>!states||states.includes(record.state));
   if(route==='cases'){panel.lastElementChild.remove();caseExplorer(panel,matching);const selected=matching.find(record=>record.case_id===byId('case').value);if(selected)mountCaseDetails(panel,selected);}
   else show(matching.map(record=>`${record.case_id} · ${readable(record.state)}`));
   if(route==='cases'&&generation===routeRequest){
    const config=await view('get_config',{});
    if(generation===routeRequest)caseCreation(panel,config);
   }
   if(route==='challenges'&&generation===routeRequest){
    const selected=records.find(record=>record.case_id===byId('case').value);
    if(selected)caseArtifactTools(panel,selected,true);
    else panel.append(element('p','Select a case on the Overview to store a counterexample.'));
   }
   if(route==='settlement'&&generation===routeRequest)settlementTools(panel);
  } else if (route === 'activity') {
   const activity = await view('get_events',{case_id:null,after_seq:'0',limit:50});
   panel.lastElementChild.remove();activityTools(panel,activity.items);
  } else if (route === 'reviewers') {
   try{
    const registry = await view('list_reviewers',{from_index:'0',limit:32});
    show(registry.items.map(reviewer=>`${reviewer.reviewer_id} · ${reviewer.confirmed?'Confirmed':reviewer.active?'Active':'Inactive'}`));
   }catch{show(['Reviewer registry is unavailable.']);}
   if(generation===routeRequest){await reviewerInvitations(panel);await reviewerWorkspace(panel);}
  } else if (route === 'settings' || route === 'lab') {
   const config = await request('config');
   if(route==='settings'){panel.lastElementChild.remove();await settingsTools(panel,config);}
   else show(['Meta','Modal'].map(name=>`${name}: ${config.providers?.[name.toLowerCase()]?.status ?? 'Unavailable'}`));
   if(route==='lab'&&generation===routeRequest)await evaluationTools(panel,config);
  } else if (route === 'constellations') {
   const records=cases.length?cases:await readPagedCases(view,{maxPages:20});
   if(generation!==routeRequest)return;
   panel.lastElementChild.remove();
   mountConstellations(panel,{cases:records,selectedCase:byId('case').value,request,view});
  } else if (route === 'evidence') {
   const caseId = byId('case').value;
   if (!caseId) return show(['Select a case on the Overview to inspect its evidence.']);
   const [, records] = await readProtectedCaseRecords(request,caseId);
   show((records?.items ?? []).map(item=>`${item.kind ?? 'Manifest'} · ${item.digest ?? 'Digest unavailable'}`));
   if(route==='evidence'&&generation===routeRequest){
    const selected=cases.find(record=>record.case_id===caseId);
    if(selected){evidenceInspector(panel,caseId,records?.items??[]);caseArtifactTools(panel,selected,false);}
   }
  } else show(['Choose a destination from the navigation.']);
 } catch {
  show(['The records for this destination are unavailable.']);
 }
}
addEventListener('hashchange', updateNavigation);
byId('period').addEventListener('change', renderCases);
byId('case').addEventListener('change', selectCase);
byId('round').addEventListener('change', selectCase);
byId('wallet').addEventListener('click', async () => {
 const button = byId('wallet');
 button.disabled = true;
 try {
  const config = await request('config');
  const sdk = await import('./wallet.bundle.js');
  const connected = await openAuthenticatedWallet({network:config.network,contractAccount:config.contract_account,...sdk});
  const {session} = connected;
  wallet = connected.wallet;
  token = session.token;
  account = session.account;
  sessionStorage.setItem('contra-session',token);
  button.textContent = session.account;
  await selectCase();
  if (!byId('workspace').hidden) void updateNavigation();
 } catch (error) {
  byId('status').textContent = error.message;
 } finally {
  button.disabled = false;
 }
});

const [caseResult, activity] = await Promise.allSettled([
 readPagedCases(view, {maxPages:20}),
 view('get_events', {case_id:null,after_seq:'0',limit:20}),
]);
updateNavigation();
if (caseResult.status === 'fulfilled') {
 cases = caseResult.value;
 renderCases();
} else {
 byId('status').textContent = 'Contract case data is unavailable.';
 byId('period').disabled = true;
 chart('case-chart', [], 'cases');
 void selectCase();
}
table('events', activity.status === 'fulfilled' ? activity.value.items.map(event => [event.data?.[0]?.seq,event.data?.[0]?.case_id?.slice(0,12),event.event]) : [], 3, activity.status === 'fulfilled' ? 'No contract events returned.' : 'Contract activity is unavailable.');
if (token) {
 try {
  const sdk = await import('./wallet.bundle.js');
  const session = await recoverWallet({token,...sdk});
  account = session.account;
  byId('wallet').textContent = session.account;
  await updateNavigation();
 } catch {
  token = null;
  sessionStorage.removeItem('contra-session');
 }
}
