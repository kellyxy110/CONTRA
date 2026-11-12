import {buildEvidenceManifest,storeEvidence,evidenceSubmissionArgs} from './evidence-operations.mjs';
import {deadlineFields,previewCase} from './case-operations.mjs';
import {voteCommitment} from './wallet.bundle.js';
// Contract reads and explicitly bounded artifact and signing forms.
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
const display = value => value === null || value === undefined || value === '' ? 'Unavailable' : String(value);
const datum = (label,value) => `<div class="fact"><dt>${escape(label)}</dt><dd>${escape(display(value))}</dd></div>`;
const panel = (title,content,detail='') => `<article class="panel workspace-panel"><header><span class="panel-mark"></span><h2>${escape(title)}</h2>${detail?`<span class="pill">${escape(detail)}</span>`:''}</header><div class="workspace-body">${content}</div></article>`;
const note = message => `<p class="workspace-note">${escape(message)}</p>`;
const error = message => `<p class="workspace-error" role="alert">${escape(message)}</p>`;
const query = params => new URLSearchParams(params).toString();
const caseIdValid = id => /^[0-9a-f]{64}$/i.test(id);
const readHash = () => {
 const hash = location.hash.slice(1);
 try { return decodeURIComponent(hash); }
 catch { return hash; }
};
const safeJson = value => escape(JSON.stringify(value,null,2));
const list = (items,render,empty) => items?.length ? items.map(render).join('') : note(empty);
const date = ns => {try{return new Date(Number(BigInt(ns)/1000000n)).toLocaleString();}catch{return 'Unavailable';}};
const state = {casePage:'0',caseFilter:'',caseSort:'newest',eventCursor:'0',activeView:'overview'};
const digestText=async text=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(byte=>byte.toString(16).padStart(2,'0')).join('');

export function mountWorkspaces({request,view,loadCase,signCall,prepareCase,canSign,getAccount,getCaseId,showNotice}){
 const host=document.getElementById('workspace');
 const overview=document.querySelector('.key-figures'),dashboard=document.querySelector('.dashboard-grid');
 const dashboardKpis=document.getElementById('overview-kpis');
 const caseInput=document.getElementById('case-id');
 const select=id=>{if(!caseIdValid(id))return;caseInput.value=id;location.hash=`#cases/${id}`;};
 const post=(path,body)=>request(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const selected=()=>{const id=readHash().split('/')[1]||getCaseId();return caseIdValid(id)?id:null;};
 const requireCase=()=>selected()||null;
 const caseLink=id=>`<a href="#cases/${escape(id)}" class="case-link">${escape(id)}</a>`;
 const busy=()=>{host.innerHTML=panel('Loading',note('Reading the latest available records.'))};
 async function maybe(path){try{return await request(path)}catch(e){return {__error:e.message}}}
 async function caseRecord(id){return await view('get_case',{case_id:id})}
 async function caseBoard(title,predicate,description){
  let cursor='0',items=[];
  for(let pageIndex=0;pageIndex<3;pageIndex++){const page=await view('list_cases',{from_index:cursor,limit:50});items.push(...(page.items||[]));if(!page.next_index)break;cursor=page.next_index}
  const matching=items.filter(predicate);
  host.innerHTML=panel(title,`${note(description)}${list(matching,c=>`<div class="record"><div><a class="case-link" href="#${escape(state.activeView)}/${escape(c.case_id)}">${escape(c.case_id)}</a><small>${escape(c.creator_id)} · ${escape(c.terms?.beneficiary_id||'Beneficiary unavailable')}</small></div><span class="status-pill">${escape(c.state)}</span></div>`,'No matching contract cases returned.')}`,`${matching.length} cases`);
 }
 async function cases(){
  const [page,config]=await Promise.all([view('list_cases',{from_index:state.casePage,limit:30}),view('get_config',{})]);
  const items=page?.items||[];
  const mine=readHash()==='cases/my',stateMatch=readHash().match(/^cases\/state\/([A-Za-z]+)$/)?.[1];
  const filtered=items.filter(c=>(!mine||getAccount()&&[c.creator_id,c.terms?.beneficiary_id].includes(getAccount()))&&(!stateMatch||c.state===stateMatch)&&[c.case_id,c.creator_id,c.terms?.beneficiary_id,c.state].some(v=>String(v||'').toLowerCase().includes(state.caseFilter.toLowerCase())));
  if(state.caseSort==='state')filtered.sort((a,b)=>String(a.state).localeCompare(String(b.state)));
  if(state.caseSort==='newest')filtered.sort((a,b)=>BigInt(a.created_at_ns)>BigInt(b.created_at_ns)?-1:1);
  host.innerHTML=panel(stateMatch?`${stateMatch} cases`:mine?'My Cases':'Cases',`<div class="workspace-controls"><label>Search visible cases<input id="case-filter" type="search" value="${escape(state.caseFilter)}" placeholder="Case ID, account or status"></label><label>Sort<select id="case-sort"><option value="newest" ${state.caseSort==='newest'?'selected':''}>Newest</option><option value="state" ${state.caseSort==='state'?'selected':''}>State</option></select></label></div>${list(filtered,c=>`<div class="record"><div>${caseLink(c.case_id)}<small>${escape(c.creator_id)} · ${escape(c.terms?.beneficiary_id||'Beneficiary unavailable')}</small></div><span class="status-pill">${escape(c.state)}</span></div>`,'No matching cases on this page.')}<div class="workspace-controls"><button type="button" id="case-next" ${!page?.next_index?'disabled':''}>Next page</button><span>Starting at ${escape(state.casePage)}</span></div>${note('Case creation requires a signed contract transaction. Live signing is disabled in the current Testnet runtime.')}`,`${items.length} returned`);
  host.querySelector('#case-filter').addEventListener('input',e=>{state.caseFilter=e.target.value;cases().then(()=>host.querySelector('#case-filter')?.focus())});
  host.querySelector('#case-sort').addEventListener('change',e=>{state.caseSort=e.target.value;cases()});
  host.querySelector('#case-next').addEventListener('click',()=>{state.casePage=page.next_index;cases()});
  const eligible=getAccount()&&config.creator_allowlist?.includes(getAccount());
  if(!eligible)return;
  host.insertAdjacentHTML('beforeend',panel('Prepare a case',`<form id="case-preview-form" class="workspace-form vertical"><label>Beneficiary Testnet account<input name="beneficiary_id" pattern="[a-z0-9._-]+\\.testnet" required></label><label>Amount (NEAR)<input name="amount" inputmode="decimal" required></label><label>Creator operator digest<input name="creator_operator_id" pattern="[0-9a-f]{64}" required></label><label>Beneficiary operator digest<input name="beneficiary_operator_id" pattern="[0-9a-f]{64}" required></label><label>Criterion kind<select name="kind"><option value="GENERAL">General</option><option value="KEYBOARD">Keyboard</option></select></label><label>Criterion requirement<textarea name="requirement" required rows="3"></textarea></label><label>Evidence policy<textarea name="policy" required rows="3"></textarea></label>${deadlineFields.map((field,i)=>`<label>${escape(field.replaceAll('_',' ').replace(' ns',''))}<input name="${field}" type="datetime-local" required value="${new Date(Date.now()+(i+1)*3600000).toISOString().slice(0,16)}"></label>`).join('')}<button type="submit">Validate and preview case</button></form><div id="case-preview-result" aria-live="polite"></div>${note('Preview checks the frozen contract policy and committee. Creating or funding the case requires a separately authorised signed transaction; live signing is disabled.')}`));
  host.querySelector('#case-preview-form').addEventListener('submit',async event=>{
   event.preventDefault();const form=event.target,data=new FormData(form),result=host.querySelector('#case-preview-result');form.querySelector('button').disabled=true;result.textContent='Validating immutable terms';
   try{
    const requestId=await digestText(crypto.randomUUID());
    const {terms,preview}=await previewCase({data,account:getAccount(),post,view,requestId});
    result.innerHTML=`<h3>Contract preview</h3><dl>${datum('Case ID',preview.case_id)}${datum('Terms digest',preview.terms_digest)}${datum('Primary reviewers',preview.primary_committee?.map(v=>v.reviewer_id).join(', '))}${datum('Fresh reviewers',preview.fresh_committee?.map(v=>v.reviewer_id).join(', '))}</dl><pre>${safeJson({request_id:requestId,terms,expected_terms_digest:preview.terms_digest})}</pre><button type="button" id="prepare-onchain">Prepare Testnet case</button><div id="case-signing-result" role="status"></div>`;
    const callArgs={request_id:requestId,terms,expected_terms_digest:preview.terms_digest};
    const signingResult=result.querySelector('#case-signing-result');
    const prepareButton=result.querySelector('#prepare-onchain');
    prepareButton.addEventListener('click',async()=>{
     prepareButton.disabled=true;
     try{
      const operation=await prepareCase(callArgs);
      signingResult.innerHTML=`<dl>${datum('Operation ID',operation.operation_id)}${datum('Payload hash',operation.payload_hash)}</dl><button type="button" id="create-onchain">Request wallet signature</button>`;
      const signButton=signingResult.querySelector('#create-onchain');
      signButton.addEventListener('click',async()=>{
       signButton.disabled=true;
       try{
        const receipt=await signCall('create_case',callArgs,'1',operation);
        const persisted=receipt.operation?.status==='CONFIRMED'?await caseRecord(preview.case_id):null;
        signingResult.innerHTML=`<pre>${safeJson(receipt)}</pre>${persisted?caseLink(preview.case_id):note('Case creation has not been confirmed. Inspect the operation before retrying.')}`;
       }catch(err){signingResult.insertAdjacentHTML('beforeend',error(err.message));signButton.disabled=false}
      });
     }catch(err){signingResult.innerHTML=error(err.message);prepareButton.disabled=false}
    });
   }catch(e){result.innerHTML=error(e.message)}finally{form.querySelector('button').disabled=false}
  });
 }
 async function detail(id){
  const c=await caseRecord(id);if(!c)throw Error('Case not found');
  const round=await view('get_round',{case_id:id,round_id:c.challenge?1:0});
  const events=await view('get_events',{case_id:id,after_seq:'0',limit:20});
  const terms=c.terms||{};
  host.innerHTML=`<div class="workspace-heading"><span>CASE DETAIL</span><h2>${escape(id)}</h2><p>Contract state: <strong>${escape(c.state)}</strong> · Revision ${escape(c.revision)}</p></div><div class="workspace-grid">${panel('Participants and terms',`<dl>${datum('Creator',c.creator_id)}${datum('Beneficiary',terms.beneficiary_id)}${datum('Network',terms.chain_id)}${datum('Contract',terms.contract_account)}${datum('Terms digest',c.terms_digest)}${datum('Funded principal',c.funded_principal_yocto?`${c.funded_principal_yocto} yoctoNEAR`:null)}${datum('Base fallback',terms.base_fallback)}${datum('Challenge fallback',terms.challenge_fallback)}</dl>${(terms.criteria||[]).map(item=>`<div class="record"><span>Criterion ${escape(item.criterion_id)} · ${escape(item.kind)}</span><code>${escape(item.requirement_digest)}</code></div>`).join('')}`)}${panel('Evaluation',`<dl>${datum('Selected round',c.challenge?'Fresh appeal':'Primary')}${datum('Round phase',round?.phase)}${datum('Evidence digest',c.evidence_digest)}${datum('Primary disposition',c.primary_disposition)}${datum('Final disposition',c.final_disposition)}${datum('Resolution basis',c.resolution_basis)}</dl>${list(round?.slots,(slot,i)=>`<div class="record"><span>${escape(slot.reviewer_id||`Reviewer slot ${i+1}`)}</span><span>${escape(slot.disposition|| (slot.commitment?'Committed':'Awaiting commitment'))}</span></div>`,'No round slots returned.')}`)}${panel('Challenge and settlement',`<dl>${datum('Challenge criterion',c.challenge?.criterion_id)}${datum('Counterexample digest',c.challenge?.counterexample_digest)}${datum('Payout status',c.payout?.status)}${datum('Payout recipient',c.payout?.recipient_id)}${datum('Attempt',c.payout?.attempt)}${datum('Callback result',c.payout?.last_attempt?.result)}</dl>`)}${panel('Contract activity',`${events?.gap?error('Earlier events are outside the contract event ring.'):''}${list(events?.items,e=>`<div class="record"><span>${escape(e.event||'Contract event')}</span><small>Sequence ${escape(e.data?.[0]?.seq||'Unavailable')}</small></div>`,'No events returned.')}`)}</div>`;
  const actions=[];
  if(c.state==='Draft'&&getAccount()===terms.beneficiary_id&&!c.beneficiary_accepted)actions.push(['accept_terms',{case_id:id,terms_digest:c.terms_digest},'1','Accept terms']);
  if(c.state==='Draft'&&getAccount()===c.creator_id){if(BigInt(terms.amount_yocto||'0')<=10n**24n&&c.beneficiary_accepted)actions.push(['fund_case',{case_id:id,terms_digest:c.terms_digest},terms.amount_yocto,'Fund case']);actions.push(['cancel_case',{case_id:id},'1','Cancel draft']);}
  if(['Submitted','ReviewCommit','ReviewReveal','ChallengeReview'].includes(c.state))actions.push(['advance_round',{case_id:id},'0','Advance eligible round']);
  if(['Provisional','Resolved','Unresolved'].includes(c.state))actions.push(['finalize_case',{case_id:id},'0','Check finality and settle']);
  if(c.state==='TransferFailed'&&c.payout)actions.push(['retry_payout',{case_id:id,payout_intent_id:c.payout.payout_intent_id,expected_attempt:Number(c.payout.attempt)},'0','Retry verified failed payout']);
  host.insertAdjacentHTML('beforeend',panel('Available contract actions',canSign()?actions.length?actions.map(([method,,deposit,label],i)=>`<button type="button" data-contract-action="${i}">${escape(label)}${BigInt(deposit)>1n?' · '+escape(deposit)+' yoctoNEAR':''}</button>`).join(''):note('No contract action is eligible for this wallet and state.'):note('Live signing is disabled by the server authority gate, or the signing wallet is disconnected. No transaction is dispatched.')));
  host.querySelectorAll('[data-contract-action]').forEach(button=>button.addEventListener('click',async()=>{const [method,args,deposit]=actions[Number(button.dataset.contractAction)];button.disabled=true;const result=button.closest('.workspace-panel').querySelector('.workspace-body');try{const receipt=await signCall(method,args,deposit);result.insertAdjacentHTML('beforeend',`<pre>${safeJson(receipt)}</pre>`);await detail(id)}catch(err){result.insertAdjacentHTML('beforeend',error(err.message));button.disabled=false}}));
  await loadCase(id,{quiet:true});
 }
 async function evidence(){
  const id=requireCase();if(!id){await caseBoard('Evidence Library',c=>['Funded','Submitted','ReviewCommit','ReviewReveal','Provisional','Challenged','ChallengeReview','Resolved','Settled'].includes(c.state),'Choose a case to inspect protected manifests, provenance and submission eligibility.');return}
  const [c,manifests,availability]=await Promise.all([caseRecord(id),maybe(`evidence/manifests?${query({case_id:id})}`),maybe(`availability?${query({case_id:id})}`)]);
  const items=manifests.items||[];
  host.innerHTML=panel('Evidence manifest',`${manifests.__error?error(manifests.__error):list(items,item=>`<div class="record"><div><strong>${escape(item.digest)}</strong><small>${escape(item.kind||item.body?.schema||'Manifest')} · ${escape(item.onchain?'Bound onchain':'Stored offchain')}</small></div><button type="button" data-artifact="${escape(item.digest)}">Inspect</button></div>`,'No authorised evidence manifests returned.')}<div id="artifact-result" aria-live="polite"></div>`,`${items.length} records`)+panel('Provenance and access',`${availability.__error?error(availability.__error):`<dl>${datum('Selected digest',c.evidence_digest)}${datum('Last observation',availability.observed_at)}${datum('Available records',Object.keys(availability.items||{}).length)}</dl>`}${note('Stored evidence is immutable. Its digest must be submitted by a separately authorised contract transaction before it becomes the selected onchain manifest.')}`);
  if(getAccount()&&[c.creator_id,c.terms?.beneficiary_id].includes(getAccount())){
   host.innerHTML+=panel('Store evidence',`<form id="evidence-form" class="workspace-form vertical"><label>Source text<textarea name="content" maxlength="30000" required rows="5"></textarea></label><label>Source origin<input name="origin" maxlength="512" required placeholder="Where this evidence came from"></label><label>Captured at<input name="captured" type="datetime-local" required></label>${(c.terms?.criteria||[]).map(criterion=>`<label>Criterion ${escape(criterion.criterion_id)} claim<input name="criterion-${escape(criterion.criterion_id)}" maxlength="2000" required></label>`).join('')}<button type="submit">Store immutable manifest</button></form><div id="evidence-result" aria-live="polite"></div>${note('This stores an offchain artifact. It does not submit evidence onchain or authorise a transaction.')}`);
   host.querySelector('#evidence-form').addEventListener('submit',async event=>{
    event.preventDefault();const form=event.target,data=new FormData(form),result=host.querySelector('#evidence-result');
    result.textContent='Storing immutable evidence';form.querySelector('button').disabled=true;
    try{const manifest=buildEvidenceManifest(data,c);const saved=await storeEvidence({post,caseId:id,manifest});result.innerHTML=note(`Stored digest: ${saved.digest}. This record is not selected onchain.`)+(canSign()&&getAccount()===c.terms?.beneficiary_id&&c.state==='Funded'?'<button type="button" id="submit-evidence-onchain">Submit evidence on Testnet</button>':'');result.querySelector('#submit-evidence-onchain')?.addEventListener('click',async event=>{event.target.disabled=true;try{const receipt=await signCall('submit_evidence',evidenceSubmissionArgs(id,c,saved.digest),'1');result.innerHTML=`<pre>${safeJson(receipt)}</pre>`;await loadCase(id,{quiet:true})}catch(err){result.insertAdjacentHTML('beforeend',error(err.message));event.target.disabled=false}});form.reset()}catch(e){result.innerHTML=error(e.message)}finally{form.querySelector('button').disabled=false}
   });
  }
  host.querySelectorAll('[data-artifact]').forEach(button=>button.addEventListener('click',async()=>{const result=host.querySelector('#artifact-result');result.textContent='Loading artifact';try{const data=await request(`artifact?${query({case_id:id,digest:button.dataset.artifact})}`);result.innerHTML=`<pre>${escape(data.text||JSON.stringify(data,null,2))}</pre>`}catch(e){result.innerHTML=error(e.message)}}));
 }
 async function challenges(){
  const id=requireCase();if(!id){await caseBoard('Challenges and appeals',c=>['Provisional','Challenged','ChallengeReview','Resolved','Unresolved'].includes(c.state),'Choose a case to inspect challenge eligibility, deadlines and fresh review.');return}
  const c=await caseRecord(id),fresh=await view('get_round',{case_id:id,round_id:1});
  host.innerHTML=panel('Challenge',`<dl>${datum('Case state',c.state)}${datum('Challenge deadline',date(c.terms?.challenge_end_ns))}${datum('Challenger',c.challenge?.challenger_id)}${datum('Criterion',c.challenge?.criterion_id)}${datum('Counterexample',c.challenge?.counterexample_digest)}${datum('Resolution basis',c.resolution_basis)}</dl>${c.challenge?note('The recorded challenge invokes the frozen fresh committee and its independent review window.'):note('No challenge has been recorded onchain. Storing a counterexample alone does not file a challenge.')}`)+panel('Fresh appeal',`<dl>${datum('Commit deadline',date(c.terms?.fresh_commit_end_ns))}${datum('Reveal deadline',date(c.terms?.fresh_reveal_end_ns))}${datum('Round phase',fresh?.phase)}</dl>${list(fresh?.slots,(slot,i)=>`<div class="record"><span>${escape(c.terms?.fresh_committee?.[i]?.reviewer_id||`Slot ${i+1}`)}</span><span>${escape(slot.disposition|| (slot.commitment?'Committed':'Awaiting'))}</span></div>`,'No fresh-round slots returned.')}`)+panel('Authority',note('Filing a challenge requires a signed contract call by the eligible losing party, an immutable counterexample digest, and the unexpired challenge window. Live financial signing is disabled.'));
  if(getAccount()&&[c.creator_id,c.terms?.beneficiary_id].includes(getAccount())&&!c.challenge){
   host.innerHTML+=panel('Store a counterexample',`<form id="counterexample-form" class="workspace-form vertical"><label>Frozen criterion<select name="criterion_id" required>${(c.terms?.criteria||[]).map(item=>`<option value="${escape(item.criterion_id)}">Criterion ${escape(item.criterion_id)} (${escape(item.kind)})</option>`).join('')}</select></label><label>Evidence-bound explanation<textarea name="text" required rows="5" maxlength="32768"></textarea></label><button type="submit">Store counterexample</button></form><div id="counterexample-result" aria-live="polite"></div>${note('This stores an immutable artifact only. It does not establish challenge eligibility or file the contract challenge.')}`);
   host.querySelector('#counterexample-form').addEventListener('submit',async event=>{event.preventDefault();const form=event.target,data=new FormData(form),result=host.querySelector('#counterexample-result');form.querySelector('button').disabled=true;result.textContent='Storing counterexample';try{const criterionId=Number(data.get('criterion_id')),saved=await post('counterexample',{case_id:id,criterion_id:criterionId,text:data.get('text')});const losing=c.primary_disposition==='ACCEPT'?c.creator_id:c.primary_disposition==='REJECT'?c.terms?.beneficiary_id:null,eligible=canSign()&&c.state==='Provisional'&&getAccount()===losing&&BigInt(c.terms.challenge_end_ns)>BigInt(Date.now())*1000000n;result.innerHTML=note(`Stored digest: ${saved.digest}. A signed challenge has not been filed.`)+(eligible?'<button type="button" id="file-challenge-onchain">File challenge on Testnet</button>':'');result.querySelector('#file-challenge-onchain')?.addEventListener('click',async buttonEvent=>{buttonEvent.target.disabled=true;try{const receipt=await signCall('file_challenge',{case_id:id,criterion_id:criterionId,counterexample_digest:saved.digest},'1');result.innerHTML=`<pre>${safeJson(receipt)}</pre>`;await loadCase(id,{quiet:true})}catch(err){result.insertAdjacentHTML('beforeend',error(err.message));buttonEvent.target.disabled=false}});form.reset()}catch(e){result.innerHTML=error(e.message)}finally{form.querySelector('button').disabled=false}});
  }
 }
 async function reviewers(){
  const [registry,disclosures,invitations]=await Promise.all([view('list_reviewers',{from_index:'0',limit:32}),getAccount()?maybe('reviewer/disclosures'):{__error:'Connect a wallet to inspect disclosures.'},getAccount()?maybe('reviewer/invitations'):{__error:'Connect a wallet to inspect invitations.'}]);
  host.innerHTML=panel('Reviewer registry',list(registry?.items,r=>`<div class="record"><div><strong>${escape(r.reviewer_id)}</strong><small>Revision ${escape(r.revision)} · Disclosure ${escape(r.disclosure_digest)}</small></div><span class="status-pill">${r.confirmed?'Confirmed':r.active?'Active':'Inactive'}</span></div>`,'No reviewers registered.'),`${registry?.items?.length||0} reviewers`)
   +panel('Control disclosures',`${disclosures.__error?error(disclosures.__error):list(disclosures.items,d=>`<div class="record"><span>${escape(d.reviewer_id||d.account||d.digest)}</span><small>${escape(d.digest||'Digest unavailable')}</small></div>`,'No disclosures returned.')}${note(disclosures.independence||'Distinct account IDs do not by themselves prove independent control.')}`)
   +panel('Invitations and consent',`${invitations.__error?error(invitations.__error):list(invitations.invitations,item=>`<div class="record"><div><strong>${escape(item.committee)} slot ${escape(item.slot)}</strong><small>${escape(item.digest)} · Expires ${escape(new Date(item.expires).toLocaleString())}</small></div><span>${escape(item.status)}</span></div>${item.status==='INVITED'?`<div class="workspace-controls"><button type="button" data-invite="${escape(item.digest)}" data-response="CONSENTED">Consent</button><button type="button" data-invite="${escape(item.digest)}" data-response="WITHDRAWN">Withdraw</button></div>`:''}`,'No invitations for this account.')}<div id="invitation-result" aria-live="polite"></div>`);
  host.querySelectorAll('[data-invite]').forEach(button=>button.addEventListener('click',async()=>{const result=host.querySelector('#invitation-result');button.disabled=true;result.textContent='Recording reviewer response';try{const response=await post('reviewer/respond',{digest:button.dataset.invite,reviewer_id:getAccount(),status:button.dataset.response,body:{acknowledged_at:new Date().toISOString()}});result.innerHTML=note(`Invitation ${response.status}. Your authenticated account is ${getAccount()}.`);await reviewers()}catch(e){result.innerHTML=error(e.message)}finally{button.disabled=false}}));
  const id=requireCase();if(!id)return;
  const [control,workspace,audit,caseData]=await Promise.all([maybe(`reviewer/control?${query({case_id:id})}`),maybe(`reviewer/workspace?${query({case_id:id,round_id:0})}`),maybe(`reviewer/audit?${query({case_id:id})}`),caseRecord(id)]);
  host.insertAdjacentHTML('beforeend',panel('Case committee control',control.__error?error(control.__error):`<pre>${safeJson(control)}</pre>`)+panel('My reviewer workspace',workspace.__error?error(workspace.__error):`<pre>${safeJson(workspace)}</pre>`)+panel('My audit history',audit.__error?error(audit.__error):list(audit.items,item=>`<div class="record"><span>${escape(item.action||item.kind)}</span><small>${escape(item.created_at||item.at||'Recorded')}</small></div>`,'No reviewer audit events returned.')));
  const roundId=caseData.challenge?1:0,round=await view('get_round',{case_id:id,round_id:roundId});
  if(round?.committee?.some(member=>member.reviewer_id===getAccount())&&round.evidence_digest){
   host.insertAdjacentHTML('beforeend',panel('Encrypted reveal recovery',`<p class="workspace-note">Only your authenticated reviewer account can retrieve a package stored for this case and round. Keep the decrypted nonce in your own custody.</p><button type="button" id="recover-review-package" class="text-button">Retrieve my package</button><div id="review-package-result" aria-live="polite"></div>`));
   host.querySelector('#recover-review-package').addEventListener('click',async event=>{const target=host.querySelector('#review-package-result');event.target.disabled=true;target.textContent='Retrieving encrypted package';try{const saved=await request(`reviewer/package?${query({case_id:id,round_id:roundId})}`);target.innerHTML=`<pre>${safeJson(saved.body||saved)}</pre>`}catch(err){target.innerHTML=error(err.message)}finally{event.target.disabled=false}});
   host.insertAdjacentHTML('beforeend',panel('Store human finding',`<form id="finding-form" class="workspace-form vertical"><label>Disposition<select name="disposition"><option>ACCEPT</option><option>REJECT</option><option>UNRESOLVED</option></select></label><label>Evidence citation digest<input name="citation" pattern="[0-9a-f]{64}" value="${escape(round.evidence_digest)}" required></label><label>Evidence-bound explanation<textarea name="explanation" maxlength="4000" rows="4" required></textarea></label><label>Limitations<textarea name="limitations" maxlength="4000" rows="2"></textarea></label><button type="submit">Store finding</button></form><div id="finding-result" aria-live="polite"></div>${note('This is an immutable human finding. A separate authorised commit and reveal determines the binding vote; signing remains disabled.')}`));
   host.querySelector('#finding-form').addEventListener('submit',async event=>{event.preventDefault();const form=event.target,data=new FormData(form),result=host.querySelector('#finding-result');form.querySelector('button').disabled=true;result.textContent='Storing human finding';try{const disposition=data.get('disposition'),saved=await post('finding',{case_id:id,round_id:roundId,disposition,citations:[data.get('citation')],explanation:data.get('explanation'),limitations:data.get('limitations')});result.innerHTML=note(`Stored finding ${saved.digest}. No vote has been cast.`);if(canSign()&&round.phase==='COMMIT'){
    const nonce=[...crypto.getRandomValues(new Uint8Array(32))].map(byte=>byte.toString(16).padStart(2,'0')).join('');
    const commitment=await voteCommitment({chain_id:caseData.terms.chain_id,contract_account:caseData.terms.contract_account,case_id:id,terms_digest:caseData.terms_digest,round_id:roundId,reviewer_account:getAccount(),disposition,evidence_digest:round.evidence_digest,finding_digest:saved.digest,nonce});
    result.insertAdjacentHTML('beforeend',`<p>Save this nonce and finding digest securely for reveal. They are not retained by this browser.</p><pre>${safeJson({nonce,finding_digest:saved.digest,disposition,commitment})}</pre><button type="button" id="commit-review">Commit review on Testnet</button>`);
    result.querySelector('#commit-review').addEventListener('click',async click=>{click.target.disabled=true;try{const receipt=await signCall('commit_vote',{case_id:id,round_id:roundId,commitment},'0');result.insertAdjacentHTML('beforeend',`<pre>${safeJson(receipt)}</pre>`)}catch(err){result.insertAdjacentHTML('beforeend',error(err.message));click.target.disabled=false}});
   }}catch(e){result.innerHTML=error(e.message)}finally{form.querySelector('button').disabled=false}});
   const ownSlot=round.slots?.find(slot=>slot.reviewer_id===getAccount());
   if(canSign()&&round.phase==='REVEAL'&&ownSlot?.commitment&&!ownSlot.revealed){
    host.insertAdjacentHTML('beforeend',panel('Reveal committed review',`<form id="reveal-review" class="workspace-form vertical"><label>Committed disposition<select name="disposition"><option>ACCEPT</option><option>REJECT</option><option>UNRESOLVED</option></select></label><label>Finding digest<input name="finding_digest" pattern="[0-9a-f]{64}" required></label><label>Saved nonce<input name="nonce" pattern="[0-9a-f]{64}" required></label><button type="submit">Verify and reveal on Testnet</button></form><div id="reveal-result" aria-live="polite"></div>`));
    host.querySelector('#reveal-review').addEventListener('submit',async event=>{event.preventDefault();const data=new FormData(event.target),result=host.querySelector('#reveal-result');event.target.querySelector('button').disabled=true;try{const disposition=data.get('disposition'),finding_digest=data.get('finding_digest'),nonce=data.get('nonce'),commitment=await voteCommitment({chain_id:caseData.terms.chain_id,contract_account:caseData.terms.contract_account,case_id:id,terms_digest:caseData.terms_digest,round_id:roundId,reviewer_account:getAccount(),disposition,evidence_digest:round.evidence_digest,finding_digest,nonce});if(commitment!==ownSlot.commitment)throw Error('The supplied disposition, finding and nonce do not match the onchain commitment.');const receipt=await signCall('reveal_vote',{case_id:id,round_id:roundId,disposition,evidence_digest:round.evidence_digest,finding_digest,nonce},'0');result.innerHTML=`<pre>${safeJson(receipt)}</pre>`}catch(err){result.innerHTML=error(err.message)}finally{event.target.querySelector('button').disabled=false}});
   }
  }
 }
 async function settlement(){
  const id=requireCase();if(!id){await caseBoard('Settlement board',c=>['Resolved','Unresolved','SettlementPending','TransferFailed','Settled'].includes(c.state),'Choose a case to inspect payout intent, finality, receipt and recovery.');return}
  const c=await caseRecord(id),payout=await view('get_payout',{case_id:id});
  host.innerHTML=panel('Payout',`<dl>${datum('Contract state',c.state)}${datum('Final disposition',c.final_disposition)}${datum('Resolution basis',c.resolution_basis)}${datum('Intent',payout?.payout_intent_id)}${datum('Recipient',payout?.recipient_id)}${datum('Amount',payout?.amount_yocto?`${payout.amount_yocto} yoctoNEAR`:null)}${datum('Status',payout?.status)}${datum('Attempt',payout?.attempt)}${datum('Last callback result',payout?.last_attempt?.result)}</dl>${note('A payout attempt can only be retried under the contract rules after verified failure. An UNKNOWN operation must be reconciled, never redispatched.')}`)+panel('Transaction inspection',`<form id="receipt-form" class="workspace-form"><label>Finalised Testnet transaction hash<input name="tx_hash" pattern="[1-9A-HJ-NP-Za-km-z]{32,64}" required></label><button type="submit">Inspect receipt</button></form><div id="receipt-result" aria-live="polite"></div>`)+panel('Operation recovery',`<form id="operation-form" class="workspace-form"><label>Persisted operation ID<input name="operation_id" required></label><button type="submit">Inspect operation</button></form><div id="operation-result" aria-live="polite"></div>`);
  host.querySelector('#receipt-form').addEventListener('submit',async e=>{e.preventDefault();const target=host.querySelector('#receipt-result');try{const data=await post('receipt',{tx_hash:new FormData(e.target).get('tx_hash')});target.innerHTML=`<pre>${safeJson(data)}</pre>`}catch(err){target.innerHTML=error(err.message)}});
  host.querySelector('#operation-form').addEventListener('submit',async e=>{e.preventDefault();const operationId=new FormData(e.target).get('operation_id'),target=host.querySelector('#operation-result');try{const data=await request(`operation?${query({id:operationId})}`);target.innerHTML=`<pre>${safeJson(data)}</pre>${data.status==='UNKNOWN'&&data.tx_hash?'<button type="button" id="reconcile-operation">Reconcile with chain</button>':''}${data.status==='UNKNOWN'&&!data.tx_hash?note('The transaction identity is unknown. Do not redispatch this operation.'):''}`;target.querySelector('#reconcile-operation')?.addEventListener('click',async event=>{event.target.disabled=true;try{const reconciled=await post('wallet/reconcile',{operation_id:operationId});target.innerHTML=`<pre>${safeJson(reconciled)}</pre>`}catch(err){target.innerHTML=error(err.message)}finally{event.target.disabled=false}})}catch(err){target.innerHTML=error(err.message)}});
 }
 async function providers(){
  const [config,jobs]=await Promise.all([maybe('config'),getAccount()?maybe('provider/jobs'):{__error:'Connect a wallet to inspect account-scoped provider jobs.'}]);
  const names=['Meta','Baseten','Modal'];
  const fixtureForm=config.provider_fixtures_enabled===true&&!jobs.__error
   ? `<form id="evaluation-fixture" class="workspace-form">
      <label>Case ID<input name="case_id" required pattern="[0-9a-fA-F]{64}" value="${escape(requireCase()||'')}"></label>
      <label>Provider ledger<select name="provider">${names.map(name=>`<option value="${name.toLowerCase()}">${name}</option>`).join('')}</select></label>
      <button type="submit">Run development fixture</button>
     </form><div id="evaluation-result" role="status"></div>`
   : note(config.provider_fixtures_enabled===true?'Connect a wallet to run a development fixture.':'This environment has development evaluations disabled.');
  host.innerHTML=panel('Provider readiness',`${config.__error?error(config.__error):names.map(name=>{const provider=config.providers?.[name.toLowerCase()];return `<div class="record"><div><strong>${name}</strong><small>${escape(provider?.model||'Model or function unverified')} · Programme ceiling $${escape(provider?.programme_ceiling_usd??'Unavailable')}</small></div><span class="status-pill">${escape(provider?.status||'Unavailable')}</span></div>${provider?`<details><summary>${name} readiness gates</summary><dl>${Object.entries(provider.gates||{}).map(([gate,passed])=>datum(gate.replaceAll('_',' '),passed?'Verified':'Pending')).join('')}</dl></details>`:''}`}).join('')}${note('Live inference is disabled until credentials, model access and spending controls are independently verified. AI proposals never become binding votes.')}`)+panel('Budget and job history',`${jobs.__error?error(jobs.__error):`<h3>Budgets</h3><pre>${safeJson(jobs.budgets||[])}</pre><h3>My jobs</h3><pre>${safeJson(jobs.jobs||[])}</pre>`}`);
  host.insertAdjacentHTML('afterbegin',panel('Primary evaluation',note('Development fixtures produce a persisted non-binding record without calling a provider.')+fixtureForm));
  const form=host.querySelector('#evaluation-fixture');
  form?.addEventListener('submit',async event=>{
   event.preventDefault();
   const data=new FormData(form),button=form.querySelector('button'),result=host.querySelector('#evaluation-result');
   const caseId=String(data.get('case_id')).toLowerCase(),provider=data.get('provider');
   const key=await digestText(JSON.stringify(['primary-development-fixture-v1',getAccount(),caseId,provider]));
   button.disabled=true;
   result.textContent='Submitting development fixture…';
   try{
    const job=await post('provider/jobs',{case_id:caseId,provider,mode:'fixture',idempotency_key:key,reservation_micro_usd:1,payload:{scenario:'primary-development-fixture-v1'},fixture_output:{scenario:'primary-development-fixture-v1'}});
    const history=await request('provider/jobs');
    const recorded=history.jobs?.find(item=>item.id===job.id)||job;
    result.innerHTML=`<dl>${datum('Development job',recorded.id)}${datum('Status',recorded.status)}${datum('Response digest',recorded.response_digest)}</dl>`;
   }catch(e){result.innerHTML=error(e.message)}
   finally{button.disabled=false}
  });
 }
 async function activity(){
  const id=requireCase(),page=await view('get_events',{case_id:id,after_seq:state.eventCursor,limit:30});
  host.innerHTML=panel(id?'Case activity':'Contract activity',`${page.gap?error('The contract ring no longer contains every earlier event.'):''}${list(page.items,e=>`<div class="record"><div><strong>${escape(e.event||'Contract event')}</strong><small>Sequence ${escape(e.data?.[0]?.seq||'Unavailable')} · ${escape(e.data?.[0]?.at_ns?date(e.data[0].at_ns):'Time unavailable')}</small></div>${caseIdValid(e.data?.[0]?.case_id)?caseLink(e.data[0].case_id):''}</div>`,'No events on this page.')}<button id="activity-next" type="button" ${page.items?.length!==30?'disabled':''}>Next events</button>`,`${page.items?.length||0} shown`);
  host.querySelector('#activity-next').addEventListener('click',()=>{state.eventCursor=page.next_after_seq;activity()});
 }
 async function settings(){
  const [health,config,session]=await Promise.all([maybe('health'),maybe('config'),getAccount()?maybe('session'):{__error:'No authenticated wallet session.'}]);
  host.innerHTML=panel('Account',`${session.__error?error(session.__error):`<dl>${datum('Account',session.account)}${datum('Session expires',session.expires?new Date(session.expires).toLocaleString():null)}</dl>`}`)+panel('Runtime and safety',`<dl>${datum('Network',config.network||health.network)}${datum('Contract account',config.contract_account)}${datum('Chain status',health.chain?.status||health.chain)}${datum('Live signing',config.external_wallet_signing_authorized===true?'Authorised':'Disabled')}${datum('Hosting',config.hosting?.plan)}</dl>${note('Wallet sessions use NEP-413 message signing. Private provider credentials remain on the server.')}`);
 }
 async function render(){
  const parts=readHash().split('/'),route=parts[0]||'overview';state.activeView=route;
  const isOverview=route==='overview';overview.hidden=!isOverview;dashboardKpis.hidden=!isOverview;dashboard.hidden=!isOverview;host.hidden=isOverview;
  document.getElementById('view-title').textContent=route[0].toUpperCase()+route.slice(1);
  document.querySelectorAll('.nav-link,.mobile-tabs a').forEach(link=>{const active=link.hash===location.hash||(!parts[1]&&(link.dataset.view||link.hash.slice(1))===route);link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')});
  document.querySelectorAll('.nav-group').forEach(group=>{if([...group.querySelectorAll('a[data-view]')].some(link=>link.dataset.view===route))group.open=true});
  if(isOverview){if(parts[1]==='activity')document.querySelector('.events-panel').scrollIntoView();if(parts[1]==='status')document.querySelector('.status-panel').scrollIntoView();return}
  busy();
  try{
   const path=parts;
   if(route==='cases')await (path[1]&&caseIdValid(path[1])?detail(path[1]):path[1]==='detail'&&caseIdValid(getCaseId())?detail(getCaseId()):cases());
   else if(route==='evidence')await evidence();
   else if(route==='challenges')await challenges();
   else if(route==='reviewers')await reviewers();
   else if(route==='settlement')await settlement();
   else if(route==='lab')await providers();
   else if(route==='activity')await activity();
   else if(route==='settings')await settings();
   else host.innerHTML=panel('Unknown view',note('Choose a destination from the navigation.'));
   const destinations={evidence:{submit:'Store evidence',provenance:'Provenance and access'},lab:{providers:'Provider readiness',history:'Budget and job history'},reviewers:{primary:'Case committee control',appeal:'My reviewer workspace'},challenges:{file:'Store a counterexample',appeal:'Fresh appeal'},settlement:{history:'Transaction inspection',recovery:'Operation recovery'},activity:{audit:'Case activity'},settings:{network:'Runtime and safety',preferences:'Account',admin:'Runtime and safety'}};
   const targetName=destinations[route]?.[path[1]];
   if(targetName){const target=[...host.querySelectorAll('.workspace-panel')].find(node=>node.querySelector('h2')?.textContent===targetName);if(target){target.scrollIntoView({block:'start'});target.setAttribute('tabindex','-1');target.focus({preventScroll:true})}}
   if(route==='cases'&&path[1]==='create'){const target=host.querySelector('#case-preview-form')||host.querySelector('.workspace-note');target?.scrollIntoView({block:'center'});if(!host.querySelector('#case-preview-form'))showNotice?.('Case creation requires an authorised creator wallet and contract signing. Check the live signing gate in Settings.')}
  }catch(e){host.innerHTML=panel('Unable to load',error(e.message));showNotice?.(e.message)}
 }
 window.addEventListener('hashchange',render);render();
 return {render,select};
}
