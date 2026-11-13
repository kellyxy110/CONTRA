// Headless operations retained from the retired dashboard. The connected wallet and
// Worker retain final authority. None of these helpers grants signing permission.
export function eligibleCaseActions(caseId, c, account) {
 const terms = c.terms || {};
 const actions = [];
 if (c.state === 'Draft' && account === terms.beneficiary_id && !c.beneficiary_accepted)
  actions.push(['accept_terms',{case_id:caseId,terms_digest:c.terms_digest},'1','Accept terms']);
 if (c.state === 'Draft' && account === c.creator_id) {
  if (BigInt(terms.amount_yocto || '0') <= 10n**24n && c.beneficiary_accepted)
   actions.push(['fund_case',{case_id:caseId,terms_digest:c.terms_digest},terms.amount_yocto,'Fund case']);
  actions.push(['cancel_case',{case_id:caseId},'1','Cancel draft']);
 }
 if (['Submitted','ReviewCommit','ReviewReveal','ChallengeReview'].includes(c.state))
  actions.push(['advance_round',{case_id:caseId},'0','Advance eligible round']);
 if (['Provisional','Resolved','Unresolved'].includes(c.state))
  actions.push(['finalize_case',{case_id:caseId},'0','Check finality and settle']);
 if (c.state === 'TransferFailed' && c.payout)
  actions.push(['retry_payout',{case_id:caseId,payout_intent_id:c.payout.payout_intent_id,expected_attempt:Number(c.payout.attempt)},'0','Retry verified failed payout']);
 return actions;
}

export async function readCaseDetails(view,caseId) {
 const c = await view('get_case',{case_id:caseId});
 if (!c) throw Error('Case not found');
 const round = await view('get_round',{case_id:caseId,round_id:c.challenge ? 1 : 0});
 const events = await view('get_events',{case_id:caseId,after_seq:'0',limit:20});
 return {caseRecord:c,round,events};
}

export async function readProtectedCaseRecords(request,caseId) {
 try {
  const encoded=encodeURIComponent(caseId);
  const [availability,manifests,counterexamples] = await Promise.all([
   request('availability?case_id='+encoded),
   request('evidence/manifests?case_id='+encoded),
   request('counterexample/records?case_id='+encoded),
  ]);
  return [
   {...availability.items,__status:'available',__manifest:availability.manifest,__criterion_evaluations:availability.criterion_evaluations,__observed_at:availability.observed_at},
   {items:[...(manifests.items||[]),...(counterexamples.items||[])]},
  ];
 } catch (error) {
  return [{__status:/401|403|authenticate|authorised|participant/i.test(error.message)?'inaccessible':'unavailable',__reason:error.message},null];
 }
}

export async function readPagedCases(view,{cursor='0',limit=50,maxPages=3}={}) {
 let items=[],pageCursor=cursor;
 for(let index=0;index<maxPages;index++){
  const page=await view('list_cases',{from_index:pageCursor,limit});
  items.push(...(page.items||[]));
  if(!page.next_index)break;
  pageCursor=page.next_index;
 }
 return items;
}

export function filterCases(items,{account=null,mine=false,state=null,search='',sort='newest'}={}){
 const filtered=(items||[]).filter(c=>
  (!mine || account && [c.creator_id,c.terms?.beneficiary_id].includes(account)) &&
  (!state || c.state===state) &&
  [c.case_id,c.creator_id,c.terms?.beneficiary_id,c.state].some(v=>String(v||'').toLowerCase().includes(search.toLowerCase())));
 if(sort==='state')filtered.sort((a,b)=>String(a.state).localeCompare(String(b.state)));
 if(sort==='newest')filtered.sort((a,b)=>BigInt(a.created_at_ns)>BigInt(b.created_at_ns)?-1:1);
 return filtered;
}
