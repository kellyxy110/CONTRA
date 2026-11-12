import {createApiClient} from './api-client.mjs';
import {readPagedCases, readProtectedCaseRecords} from './contract-operations.mjs';
import {openAuthenticatedWallet, recoverWallet} from './wallet-operations.mjs';
import {inspectReceipt, inspectOperation, operationRecoveryState, reconcileKnownOperation} from './settlement-operations.mjs';

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
   show(records.filter(record=>!states||states.includes(record.state)).map(record=>`${record.case_id} · ${readable(record.state)}`));
   if(route==='settlement'&&generation===routeRequest)settlementTools(panel);
  } else if (route === 'activity') {
   const activity = await view('get_events',{case_id:null,after_seq:'0',limit:50});
   show(activity.items.map(event=>`${event.data?.[0]?.seq ?? '?'} · ${event.event} · ${event.data?.[0]?.case_id ?? 'Global'}`));
  } else if (route === 'reviewers') {
   const registry = await view('list_reviewers',{from_index:'0',limit:32});
   show(registry.items.map(reviewer=>`${reviewer.reviewer_id} · ${reviewer.confirmed?'Confirmed':reviewer.active?'Active':'Inactive'}`));
  } else if (route === 'settings' || route === 'lab') {
   const config = await request('config');
   show(route === 'settings' ? [`Network: ${config.network ?? 'Unavailable'}`,`Account: ${account ?? 'Disconnected'}`,`Contract: ${config.contract_account ?? 'Unavailable'}`] :
    ['Meta','Modal'].map(name=>`${name}: ${config.providers?.[name.toLowerCase()]?.status ?? 'Unavailable'}`));
  } else if (route === 'evidence' || route === 'constellations') {
   const caseId = byId('case').value;
   if (!caseId) return show(['Select a case on the Overview to inspect its evidence.']);
   const [, records] = await readProtectedCaseRecords(request,caseId);
   show((records?.items ?? []).map(item=>`${item.kind ?? 'Manifest'} · ${item.digest ?? 'Digest unavailable'}`));
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
  const {session} = await openAuthenticatedWallet({network:config.network,contractAccount:config.contract_account,...sdk});
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
 } catch {
  token = null;
  sessionStorage.removeItem('contra-session');
 }
}
