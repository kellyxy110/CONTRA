import {createApiClient} from './api-client.mjs';
import {readPagedCases, readProtectedCaseRecords} from './contract-operations.mjs';
import {openAuthenticatedWallet, recoverWallet} from './wallet-operations.mjs';

const byId = id => document.getElementById(id);
const routes = {overview:'Overview',cases:'Cases',evidence:'Evidence',lab:'Evaluations',challenges:'Challenges',reviewers:'The Bench',settlement:'Settlement',constellations:'Constellations',activity:'Activity',settings:'Settings'};
let token = sessionStorage.getItem('contra-session');
const {request, view} = createApiClient(() => token);
let cases = [], caseRequest = 0;
const colours = ['#285845','#5b8d77','#93afa0','#c4bc9c','#ba655b','#667e76'];

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
 ring.append(element('strong', String(total)));
 let previous = 0;
 ring.style.background = 'conic-gradient(' + entries.map(([, count], i) => {
  const start = previous;
  previous += count / total * 100;
  return `${colours[i % colours.length]} ${start}% ${previous}%`;
 }).join(',') + ')';
 const legend = element('ul', '');
 legend.setAttribute('aria-label', `${total} ${unit}`);
 entries.forEach(([name, count], i) => {
  const item = element('li', '');
  const dot = element('i', '');
  dot.style.background = colours[i % colours.length];
  item.append(dot, element('span', name), element('b', new Intl.NumberFormat('en-GB', {style:'percent', maximumFractionDigits:1}).format(count / total)));
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
  values.forEach(value => row.append(element('td', String(value ?? 'Unavailable'))));
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
 [...byId('timeline').children].forEach((item, i) => item.toggleAttribute('data-reached', step >= [0,2,3,8][i]));
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
 table('evidence', records.map(item => [item.kind ?? 'Manifest', item.digest?.slice(0,12), item.body?.sources?.[0]?.provenance?.origin, item.onchain ? 'Bound on-chain' : 'Stored off-chain']), 4, 'No authorised evidence records returned.');
}

function renderCases() {
 const days = Number(byId('period').value);
 const cutoff = BigInt(Date.now() - days * 86400000) * 1000000n;
 const filtered = days ? cases.filter(item => BigInt(item.created_at_ns) >= cutoff) : cases;
 const states = new Map();
 filtered.forEach(item => states.set(item.state, (states.get(item.state) ?? 0) + 1));
 byId('funded').textContent = near(filtered.reduce((sum,item) => sum + BigInt(item.funded_principal_yocto ?? 0), 0n));
 byId('challenges').textContent = (states.get('Challenged') ?? 0) + (states.get('ChallengeReview') ?? 0);
 byId('payouts').textContent = `${states.get('Settled') ?? 0} cases`;
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
 byId('navigation').append(link);
});
function updateNavigation() {
 const route = location.hash.slice(1).split('/')[0] || 'overview';
 [...byId('navigation').children].forEach(link => {
  if (link.hash === '#' + route) link.setAttribute('aria-current','page');
  else link.removeAttribute('aria-current');
 });
 byId('status').textContent = route === 'overview' ? '' : `${routes[route] ?? 'Destination'} is pending integration in this preview.`;
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
  sessionStorage.setItem('contra-session',token);
  button.textContent = session.account;
  await selectCase();
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
  byId('wallet').textContent = session.account;
 } catch {
  token = null;
  sessionStorage.removeItem('contra-session');
 }
}
