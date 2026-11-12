import {authenticateWallet,connectWallet,disconnectWalletSession,recoverWalletSession,renewWalletSession,restoreWalletOperations,selectWalletAccount,prepareWalletTransaction,sendPreparedWalletTransaction,reconcileWalletTransaction} from './wallet.bundle.js';
import {coverage} from './coverage.mjs';
import {mountWorkspaces} from './workspaces.mjs';

const $=id=>document.getElementById(id),text=(id,value)=>{$(id).textContent=value;};
let wallet=null,token=sessionStorage.getItem('contra-session'),account=sessionStorage.getItem('contra-account'),lens='overall',currentMetrics=null,selectedCase=null,manifestItems=[],manifestFilter='all',runtimeConfig=null,sessionExpires=null;
const metricNames=['Evidence','Provenance','Review','Finality','Challenge','Quorum','Checks','Criteria'];
const lenses={overall:metricNames,evidence:['Evidence','Provenance','Review','Quorum'],criteria:['Evidence','Provenance','Checks','Criteria']};
const blankMetrics=()=>metricNames.map(name=>({name,status:'unavailable',numerator:null,denominator:null,source:'Connect to an authorised case'}));

async function request(path,options={}){
 const headers={...(options.headers||{})};if(token)headers.Authorization=`Bearer ${token}`;
 const response=await fetch(`/api/${path}`,{...options,headers}),body=await response.json();
 if(!response.ok)throw Error(body.error||`HTTP ${response.status}`);return body;
}
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));}
function compact(value){const s=String(value||'');return s.length>22?`${s.slice(0,10)}…${s.slice(-8)}`:s;}
function valueOrUnavailable(value){return value===null||value===undefined||value===''?'Unavailable':String(value);}
function chartValue(metric){return metric.status==='measured'?`${metric.numerator}/${metric.denominator}`:metric.status==='not-applicable'?'N/A':metric.status==='inaccessible'?'Locked':metric.status==='missing'?'Missing':'Unavailable';}
function adaptMetrics(caseRecord,availability){return coverage(caseRecord,'Overall',availability).map(metric=>({...metric,name:metric.label==='Keyboard'?'Checks':metric.label}));}
function selectButtons(selector,active){document.querySelectorAll(selector).forEach(button=>button.classList.toggle('selected',button.dataset.lens===active||button.dataset.themeChoice===active));}
function setTheme(theme){document.documentElement.dataset.theme=theme;try{localStorage.setItem('contra.theme',theme)}catch{}selectButtons('[data-theme-choice]',theme);}
function updateWalletUi(){
 $('connect').textContent=token?compact(account):'Connect wallet';$('disconnect').disabled=!token;
 $('session').textContent=token?JSON.stringify({account,authenticated:true,expires:sessionExpires?new Date(sessionExpires).toISOString():null},null,2):'Not authenticated';
 $('renew-session').hidden=!token;
}
function walletState(state,message){$('wallet-dialog').dataset.state=state;$('wallet-status').textContent=message;}
function persistSession(session){token=session.token;account=session.account;sessionExpires=session.expires||null;sessionStorage.setItem('contra-session',token);sessionStorage.setItem('contra-account',account);updateWalletUi();window.dispatchEvent(new Event('hashchange'));}
async function recoverSession(){
 if(!token)return;
 try{const session=await recoverWalletSession(token);account=session.account;sessionExpires=session.expires;updateWalletUi();window.dispatchEvent(new Event('hashchange'));walletState('connected',`Connected as ${account}. The session expires ${new Date(sessionExpires).toLocaleString()}.`);await restoreWalletOperations({token,accountId:account});}
 catch{token=null;account=null;sessionExpires=null;sessionStorage.removeItem('contra-session');sessionStorage.removeItem('contra-account');updateWalletUi();window.dispatchEvent(new Event('hashchange'));walletState('expired','The session has expired. Reconnect your wallet to sign in again.');}
}
function polar(cx,cy,r,angle){const rad=(angle-90)*Math.PI/180;return [cx+Math.cos(rad)*r,cy+Math.sin(rad)*r];}
function wedge(cx,cy,inner,outer,start,end){
 const [a,b]=[polar(cx,cy,outer,start),polar(cx,cy,outer,end)], [c,d]=[polar(cx,cy,inner,end),polar(cx,cy,inner,start)];
 return `M ${a[0]} ${a[1]} A ${outer} ${outer} 0 0 1 ${b[0]} ${b[1]} L ${c[0]} ${c[1]} A ${inner} ${inner} 0 0 0 ${d[0]} ${d[1]} Z`;
}
function renderRadar(metrics=blankMetrics()){
 currentMetrics=metrics;
 const host=$('radar'),activeSet=new Set(lenses[lens]),cx=280,cy=235,outer=170,inner=12;
 const svg=['<svg viewBox="0 0 560 470" aria-hidden="true"><circle cx="280" cy="235" r="178" fill="#0b1110"/>'];
 Array.from({length:10},(_,index)=>(index+1)*17).forEach(r=>svg.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#9baaa433" stroke-dasharray="3 5"/>`));
 for(let i=0;i<8;i++){const angle=i*45;const [x,y]=polar(cx,cy,outer,angle);svg.push(`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#9baaa455"/>`);}
 metrics.forEach((metric,index)=>{
  const start=index*45,end=(index+1)*45,inLens=activeSet.has(metric.name);
  const valid=metric.status==='measured'&&Number.isFinite(metric.numerator)&&Number.isFinite(metric.denominator)&&metric.denominator>0;
  const fraction=valid?Math.max(0,Math.min(1,metric.numerator/metric.denominator)):0;
  const required=metric.name==='Review'?2/3:1;
  const colour=metric.name==='Challenge'?'#ff8678':valid&&fraction>=required?'#00ec97':'#f4bd68';
  const outline=metric.status==='missing'?'#ff8678':'#9baaa4';
  if(inLens){if(valid){svg.push(`<path d="${wedge(cx,cy,inner,inner+(outer-inner)*required,start,end)}" fill="${colour}" opacity="0.34"/>`);if(fraction>0)svg.push(`<path d="${wedge(cx,cy,inner,inner+(outer-inner)*fraction,start,end)}" fill="${colour}"/>`);}else svg.push(`<path d="${wedge(cx,cy,inner,outer,start,end)}" fill="none" stroke="${outline}" stroke-dasharray="4 5"/>`);}
 });
 svg.push(`<circle cx="${cx}" cy="${cy}" r="${inner}" fill="#f5f7f5"/></svg>`);
 const labels=metrics.map((metric,index)=>{const [x,y]=polar(cx,cy,215,index*45+22.5);const active=activeSet.has(metric.name);const value=active?chartValue(metric):'N/A';return `<span class="radar-label" style="left:${x/5.6}%;top:${y/4.7}%"><span>${metric.name}</span><strong>${value}</strong></span>`;}).join('');
 host.innerHTML=`<div class="radar-wrap">${svg.join('')}${labels}</div>`;
 $('radar').setAttribute('aria-label',`Eight-sector contestation readiness chart. ${metrics.map(metric=>`${metric.name}: ${activeSet.has(metric.name)?chartValue(metric):'N/A in this lens'}`).join('. ')}`);
 $('metric-chips').innerHTML=metrics.map((metric,index)=>{const inLens=activeSet.has(metric.name),value=inLens?chartValue(metric):'N/A';return `<button class="metric-chip" data-metric="${index}">${metric.name}<small>${value}</small></button>`;}).join('');
 document.querySelectorAll('[data-metric]').forEach(button=>button.addEventListener('click',()=>{const metric=metrics[Number(button.dataset.metric)];document.querySelectorAll('[data-metric]').forEach(node=>node.classList.remove('active'));button.classList.add('active');$('readiness-readout').textContent=`${metric.name}: ${activeSet.has(metric.name)?chartValue(metric):'N/A in this lens'}. ${metric.status==='measured'?`${metric.numerator} of ${metric.denominator} records.`:''} Source: ${metric.source||'unavailable'}. ${metric.reason||''}`;}));
}
function renderLifecycle(phase='UNKNOWN'){
 const labels=['Created','Evidence','Committee','Resolution'];
 const stages={Draft:0,Funded:0,Submitted:1,ReviewCommit:2,ReviewReveal:2,Provisional:2,Challenged:2,ChallengeReview:2,Unresolved:3,Resolved:3,SettlementPending:3,TransferFailed:3,Settled:4};
 const current=stages[phase];
 $('lifecycle').innerHTML=labels.map((label,index)=>`<span data-label="${label}" class="${current===undefined?'unknown':index<current?'complete':index===current?'current':'pending'}"></span>`).join('');
 text('lifecycle-state',phase.replaceAll('_',' '));
}
function setUnavailable(){
 renderRadar();renderLifecycle();$('actions-list').innerHTML='<div class="action"><b>Connect an authorised wallet</b><span>Case actions remain unavailable until the session and chain state are verified.</span></div>';
 selectedCase=null;manifestItems=[];renderManifest();text('manifest-count','0 records');text('case-phase','No case');text('escrow-value','Unavailable');text('review-value','Unavailable');text('reveal-value','Unavailable');text('challenge-value','Unavailable');text('committee-count','0 slots');text('event-count','0');$('case-facts').innerHTML='<div><dt>Wallet</dt><dd>Connect to inspect protected records</dd></div>';$('deadline-list').innerHTML='<li class="muted"><i></i><div><b>No case selected</b><span>Deadlines appear after an authorised case read.</span></div></li>';$('committee-list').textContent='Reviewer controls require an authorised case.';$('events-list').textContent='No events loaded.';$('terms-list').innerHTML='';
}
function renderCase(record,round,availability,manifests){
 const phase=record.state||'UNKNOWN',terms=record.terms||{},challenge=record.challenge;
 text('case-phase',phase.replaceAll('_',' '));text('escrow-value',record.funded_principal_yocto?formatNear(record.funded_principal_yocto):'Unavailable');text('escrow-note',record.funded_principal_yocto?'Funded principal recorded':'Escrow balance unavailable');
 text('review-value',round?.phase||'Unavailable');text('review-note',round?.phase?'Onchain round state':'Round data unavailable');
 const revealed=(round?.slots||[]).filter(slot=>slot.disposition).length,total=(round?.slots||[]).length;text('reveal-value',round?`${revealed} of ${total}`:'Unavailable');text('reveal-note',round?'Recorded reveals':'No round selected');
 text('challenge-value',challenge?'Filed':'Not open');text('challenge-note',challenge?'Counterexample recorded':'No counterexample recorded');
 const facts=[['Case ID',record.case_id],['Track',terms.chain_id],['Escrow',record.funded_principal_yocto?formatNear(record.funded_principal_yocto):null],['Creator',record.creator_id],['Beneficiary',terms.beneficiary_id],['Criterion',Array.isArray(terms.criteria)?`${terms.criteria.length} frozen`:null],['Quorum',2],['Fallbacks',`${terms.base_fallback||'Unavailable'} / ${terms.challenge_fallback||'Unavailable'}`]];$('case-facts').innerHTML=facts.map(([name,value])=>`<div><dt>${escapeHtml(name)}</dt><dd>${escapeHtml(valueOrUnavailable(value))}</dd></div>`).join('');
 const deadlines=Object.fromEntries(['fund_by_ns','submit_by_ns','primary_commit_end_ns','primary_reveal_end_ns','challenge_end_ns','fresh_commit_end_ns','fresh_reveal_end_ns'].filter(name=>terms[name]).map(name=>[name,terms[name]]));$('deadline-list').innerHTML=Object.entries(deadlines).length?Object.entries(deadlines).map(([name,value])=>`<li class="${name.includes('challenge')?'challenge':''}"><i></i><div><b>${escapeHtml(name.replaceAll('_',' ').replace(' ns',''))}</b><span>${escapeHtml(new Date(Number(BigInt(value)/1000000n)).toLocaleString())}</span></div></li>`).join(''):'<li class="muted"><i></i><div><b>No deadlines returned</b><span>Onchain terms did not include deadlines.</span></div></li>';
 const committee=terms.primary_committee||[];text('committee-count',`${committee.length} slots`);$('committee-list').innerHTML=committee.length?committee.map((member,index)=>`<div class="event"><i>${index+1}</i><div><b>${escapeHtml(member.reviewer_id)}</b><span>Appointed primary reviewer</span></div></div>`).join(''):'<div class="empty-state">No primary committee returned.</div>';
 renderLifecycle(record.state||phase);renderRadar(adaptMetrics(record,availability));
 const actions=[];if(round?.phase==='COMMIT')actions.push(['Commit review','The commitment window is open. Use the approved reviewer workspace to prepare a signed action.','due']);if(phase==='Provisional')actions.push(['File a challenge','A counterexample must bind to a frozen criterion.','challenge']);actions.push(['Inspect case','The latest case and event state can be refreshed above.','']);
 $('actions-list').innerHTML=actions.map(([title,detail,kind])=>`<div class="action ${kind}"><b>${title}</b><span>${detail}</span></div>`).join('');
 selectedCase=record;
 $('terms-list').innerHTML=Object.entries(terms).map(([name,value])=>`<div><dt>${escapeHtml(name.replaceAll('_',' '))}</dt><dd>${escapeHtml(typeof value==='object'?JSON.stringify(value):valueOrUnavailable(value))}</dd></div>`).join('');
 manifestItems=manifests?.items||[];text('manifest-count',`${manifestItems.length} records`);renderManifest();
}
function renderManifest(){
 const items=manifestFilter==='counterexample'?manifestItems.filter(item=>item.kind==='counterexample'):manifestFilter==='evidence'?manifestItems.filter(item=>item.kind!=='counterexample'):manifestItems;
 $('manifest-table').innerHTML=items.length?items.map(item=>`<div class="manifest-row"><b>${escapeHtml(item.kind==='counterexample'?'Counterexample':'Manifest')}</b><span>${escapeHtml(item.kind==='counterexample'?'Counterexample':'Evidence')}</span><code title="${escapeHtml(item.digest)}">${escapeHtml(item.digest)}</code><span>${escapeHtml(item.created_at||item.body?.created_at||'Recorded')}</span><span>${item.onchain||item.digest===selectedCase?.challenge?.counterexample_digest?'Bound':'Stored'}</span></div>`).join(''):`<div class="empty-state ${manifestFilter==='counterexample'?'coral-empty':''}">No ${manifestFilter==='all'?'authorised manifests':manifestFilter+' records'} returned.</div>`;
}
function formatNear(value){try{const amount=BigInt(value),whole=amount/10n**24n,fraction=(amount%10n**24n).toString().padStart(24,'0').replace(/0+$/,'');return `${whole}${fraction?'.'+fraction:''} NEAR`;}catch{return `${value} yoctoNEAR`;}}
async function refresh(){
 try{
  runtimeConfig=await request('config');const ready=await request('ready');text('network-pill',ready.network||'Chain unavailable');
  const sandbox=runtimeConfig.network==='sandbox';$('sandbox-accounts').hidden=!sandbox;$('dialog-connect').hidden=sandbox;$('dialog-connect').disabled=!ready.ready;
  if(sandbox)$('sandbox-account').innerHTML=(runtimeConfig.accounts||[]).map(value=>`<option>${escapeHtml(value)}</option>`).join('');
  if(!ready.ready)walletState('unavailable','The chain is unavailable. Wallet sign-in is disabled until readiness is restored.');
  else if(sandbox)walletState('sandbox','This local Sandbox uses a local test session. It does not connect a Testnet wallet.');
  $('runtime-notice').hidden=Boolean(ready.ready);
  if(!ready.ready)$('runtime-notice').textContent='The chain is unavailable. Case data is not simulated.';
  if($('case-id').value.trim())await loadCase();
 }catch(error){text('network-pill','Chain unavailable');$('dialog-connect').disabled=true;$('runtime-notice').hidden=false;$('runtime-notice').textContent='The NEAR chain is unavailable. Case data and transaction results are not simulated.';walletState('unavailable',`Wallet sign-in is unavailable until the chain is ready. ${error.message}`);}finally{await loadDashboard()}
}
async function view(method,args){return (await request('view',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({method,args,envelope:true})})).value;}
async function signCall(method,args,deposit='0'){
 if(!token||!account)throw Error('Connect and authenticate a Testnet wallet before signing.');
 if(!wallet)throw Error('Reconnect the signing wallet. Session recovery alone cannot sign transactions.');
 const config=await request('config');
 if(config.network!=='testnet'||!config.external_wallet_signing_authorized)throw Error('Live Testnet wallet signing is disabled by the server authority gate.');
 const prepared=await prepareWalletTransaction({token,accountId:account,call:{method,args,deposit,receiverId:config.contract_account}});
 const operation=prepared.operation;
 try{
  const sent=await sendPreparedWalletTransaction(wallet,{token,operation});
  const reconciled=await reconcileWalletTransaction({token,accountId:account,operationId:operation.operation_id});
  await refresh();
  return {transaction_hash:sent?.transaction?.hash||sent?.transaction_outcome?.id||sent?.transactionHash,operation:reconciled};
 }catch(error){throw Error(`${error.message} Operation ${operation.operation_id} is persisted. Inspect it in Settlement recovery before any retry.`)}
}
let dashboardRequest = 0;
async function loadDashboard(){
 const requestId = ++dashboardRequest;
 const range = $('case-range').value;
 const days = range === 'all' ? 0 : Number(range);
 const values=['total-escrow','active-challenges','settled-value','awaiting-review'];
 try{
  let cursor='0',page,items=[];
  for(let batch=0;batch<20;batch++){
   page=await view('list_cases',{from_index:cursor,limit:50});items.push(...(page?.items||[]));
   if(!page?.next_index)break;
   cursor=page.next_index;
  }
  const reserves=(await view('get_config',{}))?.reserve_summary||{};
  if(requestId !== dashboardRequest)return;
  const cutoff=BigInt(Date.now()-days*86400000)*1000000n;
  const visible=days?items.filter(item=>{try{return BigInt(item.created_at_ns)>=cutoff}catch{return false}}):items;
  const groups=new Map();for(const item of visible)groups.set(item.state,(groups.get(item.state)||0)+1);
  const challengeStates=new Set(['Challenged','ChallengeReview']);
  text('active-challenges',String(visible.filter(item=>challengeStates.has(item.state)).length));
  text('awaiting-review',String(visible.filter(item=>['ReviewCommit','ReviewReveal','ChallengeReview'].includes(item.state)).length));
  text('total-escrow',/^\d+$/.test(String(reserves.held_escrow_yocto||''))?formatNear(reserves.held_escrow_yocto):'Unavailable');
  text('settled-value',/^\d+$/.test(String(reserves.paid_yocto||''))?formatNear(reserves.paid_yocto):'Unavailable');
  const colours=['#54889a','#77a899','#b2b89c','#27535a','#ff8678','#f4bd68'];let chartCursor=0;
  const segments=[...groups].map(([state,count],index)=>{const start=chartCursor;chartCursor+=visible.length?count/visible.length*100:0;return {state,count,colour:colours[index%colours.length],start,end:chartCursor}});
  const chart = $('status-chart');
  const share = new Intl.NumberFormat('en', {style:'percent', maximumFractionDigits:1});
  chart.innerHTML = visible.length ? `
    <div class="donut" style="background:conic-gradient(${segments.map(segment=>`${segment.colour} ${segment.start}% ${segment.end}%`).join(',')})">
      <div><strong>${visible.length}</strong><small>Cases returned</small></div>
    </div>
    <ul aria-label="Filter cases by status">
      ${segments.map(({state,count,colour}) => {
        const percentage = share.format(count / visible.length);
        const countLabel = `${count} ${count === 1 ? 'case' : 'cases'}`;
        return `<li><a class="status-legend-link" href="#cases/state/${encodeURIComponent(state)}" aria-label="${escapeHtml(state)}, ${percentage}, ${countLabel}" title="${countLabel}">
          <i aria-hidden="true" style="background:${colour}"></i><span>${escapeHtml(state)}</span><b>${percentage}</b>
        </a></li>`;
      }).join('')}
    </ul>` : '<p class="empty-state">No contract cases returned for this period.</p>';
  text('distribution-scope',page?.next_index?`First ${items.length} cases`:days?`Last ${days} days`:'All contract cases');
 }catch(error){if(requestId !== dashboardRequest)return;
  for(const id of values)text(id,'Unavailable');$('status-chart').innerHTML=`<p class="empty-state">Case distribution unavailable: ${escapeHtml(error.message)}</p>`;text('distribution-scope','Chain unavailable')}
}
async function loadEvents(caseId,afterSeq='0'){
 try{
  const page=await view('get_events',{case_id:caseId,after_seq:afterSeq,limit:20});
  const items=page?.items||[];text('event-count',`${items.length} shown`);
  $('events-list').innerHTML=(page.gap?'<p class="event-gap">Earlier events have left the contract ring.</p>':'')+(items.length?items.map(event=>{
   const data=event.data?.[0]||{};
   return `<div class="event"><i>●</i><div><b>${escapeHtml(event.event||'Contract event')}</b><span>Sequence ${escapeHtml(data.seq||'Unavailable')}</span></div>${/^[0-9a-f]{64}$/i.test(data.case_id||'')?`<a href="#cases/${escapeHtml(data.case_id)}">Open case</a>`:''}</div>`;
  }).join(''):'<div class="empty-state">No events returned for this page.</div>')+
  (items.length===20?`<button class="text-button event-next" data-next="${escapeHtml(page.next_after_seq)}">Next events</button>`:'');
  $('events-list').querySelector('.event-next')?.addEventListener('click',()=>loadEvents(caseId,page.next_after_seq));
 }catch(error){$('events-list').innerHTML=`<div class="empty-state">Event history unavailable: ${escapeHtml(error.message)}</div>`;}
}
async function protectedReads(caseId){
 try{
  const [availability,manifests,counterexamples]=await Promise.all([request(`availability?case_id=${encodeURIComponent(caseId)}`),request(`evidence/manifests?case_id=${encodeURIComponent(caseId)}`),request(`counterexample/records?case_id=${encodeURIComponent(caseId)}`)]);
  return [{...availability.items,__status:'available',__manifest:availability.manifest,__criterion_evaluations:availability.criterion_evaluations,__observed_at:availability.observed_at},{items:[...(manifests.items||[]),...(counterexamples.items||[])]}];
 }catch(error){return [{__status:/401|403|authenticate|participant/i.test(error.message)?'inaccessible':'unavailable',__reason:error.message},null];}
}
async function loadCase(caseId=$('case-id').value.trim(),{quiet=false}={}){
 if(!caseId)return;
 if(!/^[0-9a-f]{64}$/i.test(caseId)){$('runtime-notice').hidden=false;$('runtime-notice').textContent='A case ID must be a 64-character hexadecimal digest.';return;}
 try{
  const record=await view('get_case',{case_id:caseId});if(!record)throw Error('Case not found');$('case-id').value=caseId;
  const roundId=record.challenge?1:0;
  const round=await view('get_round',{case_id:caseId,round_id:roundId});
  const [availability,manifests]=await protectedReads(caseId);
  const caseWithRound={...record,rounds:roundId?[null,round?.slots||null]:[round?.slots||null,null]};
  renderCase(caseWithRound,round,availability,manifests);
  await loadEvents(caseId);
  try{localStorage.setItem('contra.case-id',caseId)}catch{}
  if(!quiet)$('runtime-notice').hidden=true;
 }catch(error){$('runtime-notice').hidden=false;$('runtime-notice').textContent=`The selected case could not be read: ${error.message}`;}
}
async function connect(){
 if(runtimeConfig?.network!=='testnet'||$('dialog-connect').disabled)return;
 $('dialog-connect').disabled=true;
 try{walletState('choose','Choose an eligible Testnet account in your wallet.');const connected=await connectWallet({network:'testnet',contractAccount:runtimeConfig.contract_account,authenticationAuthorized:true}),selected=selectWalletAccount(connected.accounts);wallet=connected.wallet;walletState('sign','Sign the NEP-413 message to authenticate. This does not move funds.');const session=await authenticateWallet(wallet,selected.accountId);persistSession(session);walletState('connected',`Connected as ${account}. Protected case records are available to authorised participants.`);await loadCase();}catch(error){walletState(/reject|declin|cancel/i.test(error.message)?'declined':'unavailable',error.message);}finally{$('dialog-connect').disabled=false;}}
async function disconnect(){try{if(token)await disconnectWalletSession({token,wallet});}finally{wallet=null;token=null;account=null;sessionStorage.removeItem('contra-session');sessionStorage.removeItem('contra-account');updateWalletUi();setUnavailable();window.dispatchEvent(new Event('hashchange'));}}
async function renewSession(){if(!token)return;try{const session=await renewWalletSession(token);persistSession(session);walletState('connected',`Session renewed. Signed in as ${account}.`);}catch(error){walletState('expired',error.message);await recoverSession();}}
async function connectSandbox(){if(runtimeConfig?.network!=='sandbox')return;try{const session=await request('session/sandbox',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({account:$('sandbox-account').value})});persistSession(session);walletState('connected',`Local Sandbox session: ${account}. This is not an independently controlled reviewer.`);await loadCase();}catch(error){walletState('unavailable',error.message);}}
document.querySelectorAll('[data-theme-choice]').forEach(button=>button.addEventListener('click',()=>setTheme(button.dataset.themeChoice)));
document.querySelectorAll('[data-lens]').forEach(button=>button.addEventListener('click',()=>{lens=button.dataset.lens;selectButtons('[data-lens]',lens);renderRadar(currentMetrics||blankMetrics());}));
document.querySelectorAll('[data-action-tab]').forEach(button=>button.addEventListener('click',()=>{const terms=button.dataset.actionTab==='terms';$('terms-list').hidden=!terms;$('actions-list').hidden=terms;document.querySelectorAll('[data-action-tab]').forEach(node=>node.classList.toggle('selected',node===button));}));
document.querySelectorAll('[data-manifest-filter]').forEach(button=>button.addEventListener('click',()=>{manifestFilter=button.dataset.manifestFilter;document.querySelectorAll('[data-manifest-filter]').forEach(node=>node.classList.toggle('selected',node===button));renderManifest();}));
$('case-search').addEventListener('submit',event=>{event.preventDefault();const id=$('case-id').value.trim();if(!/^[0-9a-f]{64}$/i.test(id)){$('runtime-notice').hidden=false;$('runtime-notice').textContent='A case ID must be a 64-character hexadecimal digest.';return}location.hash=`#cases/${id}`;});
$('connect').addEventListener('click',()=>{$('wallet-dialog').showModal();});$('dialog-connect').addEventListener('click',connect);$('disconnect').addEventListener('click',disconnect);$('mobile-wallet').addEventListener('click',()=>$('wallet-dialog').showModal());document.querySelector('.dialog-close').addEventListener('click',()=>$('wallet-dialog').close());$('refresh').addEventListener('click',refresh);
$('renew-session').addEventListener('click',renewSession);$('sandbox-connect').addEventListener('click',connectSandbox);
$('case-range').addEventListener('change',loadDashboard);
$('mobile-case-range').addEventListener('change',event=>{$('case-range').value=event.target.value;loadDashboard();$('mobile-menu').close()});
$('mobile-more').addEventListener('click',()=>$('mobile-menu').showModal());
$('mobile-menu').querySelector('.dialog-close').addEventListener('click',()=>$('mobile-menu').close());
const mobileNavigation=document.querySelector('.rail nav').cloneNode(true);
mobileNavigation.className='mobile-navigation';mobileNavigation.setAttribute('aria-label','All destinations');
$('mobile-menu').querySelector('.more-links').replaceWith(mobileNavigation);
$('mobile-menu').querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>$('mobile-menu').close()));
try{$('case-id').value=localStorage.getItem('contra.case-id')||''}catch{}
setTheme(document.documentElement.dataset.theme||'system');updateWalletUi();setUnavailable();recoverSession().then(refresh);
mountWorkspaces({request,view,loadCase,signCall,canSign:()=>runtimeConfig?.network==='testnet'&&runtimeConfig?.external_wallet_signing_authorized===true&&Boolean(wallet&&token),getAccount:()=>account,getCaseId:()=>$('case-id').value.trim(),showNotice:message=>{$('runtime-notice').hidden=false;$('runtime-notice').textContent=message;}});

// Persist the desktop navigation preference independently from wallet state.
const sidebarToggle=document.getElementById("sidebar-collapse");
sidebarToggle?.addEventListener("click",()=>{const collapsed=document.body.classList.toggle("sidebar-collapsed");sidebarToggle.setAttribute("aria-expanded",String(!collapsed));sidebarToggle.textContent=collapsed?"Expand sidebar":"Collapse sidebar";});
