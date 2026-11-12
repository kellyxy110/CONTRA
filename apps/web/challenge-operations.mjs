// Contract challenge authority remains enforced by the server and Testnet contract.
export function counterexampleRequest(caseId, data) {
 return {case_id:caseId,criterion_id:Number(data.get('criterion_id')),text:data.get('text')};
}
export function challengeEligibility(c, account, signingEnabled, now = Date.now()) {
 const losing=c.primary_disposition==='ACCEPT'?c.creator_id:c.primary_disposition==='REJECT'?c.terms?.beneficiary_id:null;
 return Boolean(signingEnabled&&c.state==='Provisional'&&account===losing&&BigInt(c.terms.challenge_end_ns)>BigInt(now)*1000000n);
}
export function challengeSubmissionArgs(caseId,criterionId,digest) {
 return {case_id:caseId,criterion_id:criterionId,counterexample_digest:digest};
}
