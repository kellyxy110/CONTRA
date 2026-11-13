// The client constructs arguments; authenticated APIs and contract enforce authority.
export function invitationResponseArgs(digest,reviewerId,status,now=new Date()) {
 return {digest,reviewer_id:reviewerId,status,body:{acknowledged_at:now.toISOString()}};
}
export function reviewerControlStatement(invitation,reviewerId,input) {
 const conflicts=String(input.conflicts||'').split('\n').map(value=>value.trim()).filter(Boolean);
 return {
  schema:'CONTRA_REVIEWER_CONTROL_V1',reviewer_id:reviewerId,invitation_digest:invitation.digest,
  operator_id:String(input.operator_id||'').trim(),disclosure_digest:String(input.disclosure_digest||'').trim(),
  custody:'independently-controlled',conflicts,available_from:new Date(input.available_from).toISOString(),
  available_until:new Date(input.available_until).toISOString()
 };
}
export async function signReviewerConsent({post,wallet,invitation,reviewerId,input}) {
 if(!wallet?.signMessage)throw Error('Reconnect a NEP-413 wallet before consenting. A recovered session cannot sign reviewer control.');
 const statement=reviewerControlStatement(invitation,reviewerId,input);
 const challenge=await post('reviewer/control-challenge',{invitation_digest:invitation.digest,statement});
 const signed=await wallet.signMessage({message:challenge.message,nonce:Uint8Array.from(atob(challenge.nonce),value=>value.charCodeAt(0)),recipient:challenge.recipient});
 if(signed.accountId!==reviewerId)throw Error('Reviewer control signature account does not match the invitation.');
 return post('reviewer/respond',{digest:invitation.digest,reviewer_id:reviewerId,status:'CONSENTED',body:statement,control_challenge_id:challenge.id,publicKey:signed.publicKey,control_signature:signed.signature});
}
export async function signCommitteeAssignment({post,wallet,invitation,reviewerId,assignment,selectionDigest}) {
 if(!wallet?.signMessage)throw Error('Reconnect a NEP-413 wallet before acknowledging the committee assignment.');
 const statement={schema:'CONTRA_COMMITTEE_ASSIGNMENT_V1',reviewer_id:reviewerId,invitation_digest:invitation.digest,registry_selection_digest:selectionDigest,committee:assignment.committee,slot:assignment.slot};
 const challenge=await post('reviewer/control-challenge',{invitation_digest:invitation.digest,statement});
 const signed=await wallet.signMessage({message:challenge.message,nonce:Uint8Array.from(atob(challenge.nonce),value=>value.charCodeAt(0)),recipient:challenge.recipient});
 if(signed.accountId!==reviewerId)throw Error('Committee acknowledgement account does not match the selected reviewer.');
 return post('reviewer/respond',{digest:invitation.digest,reviewer_id:reviewerId,status:'ASSIGNMENT_ACKNOWLEDGED',body:statement,control_challenge_id:challenge.id,publicKey:signed.publicKey,control_signature:signed.signature});
}
export async function storeReviewerDisclosure(post,invitation,reviewerId,input) {
 const conflicts=String(input.conflicts||'').split('\n').map(value=>value.trim()).filter(Boolean);
 return post('reviewer/disclosure',{schema:'CONTRA_REVIEWER_DISCLOSURE_V1',reviewer_id:reviewerId,operator_id:invitation.operator_id,custody:'independently-controlled',conflicts,available_from:new Date(input.available_from).toISOString(),available_until:new Date(input.available_until).toISOString(),attested_at:new Date().toISOString()});
}
export function findingArgs(caseId,roundId,data) {
 return {case_id:caseId,round_id:roundId,disposition:data.get('disposition'),citations:[data.get('citation')],explanation:data.get('explanation'),limitations:data.get('limitations')};
}
export function reviewerCommitmentArgs(caseData,caseId,roundId,account,disposition,evidenceDigest,findingDigest,nonce) {
 return {chain_id:caseData.terms.chain_id,contract_account:caseData.terms.contract_account,case_id:caseId,terms_digest:caseData.terms_digest,round_id:roundId,reviewer_account:account,disposition,evidence_digest:evidenceDigest,finding_digest: findingDigest,nonce};
}
export function commitmentTransactionArgs(caseId,roundId,commitment) {
 return {case_id:caseId,round_id:roundId,commitment};
}
export function revealTransactionArgs(caseId,roundId,disposition,evidenceDigest,findingDigest,nonce) {
 return {case_id:caseId,round_id:roundId,disposition,evidence_digest:evidenceDigest,finding_digest:findingDigest,nonce};
}
export async function verifyReviewerReveal({voteCommitment,caseData,caseId,roundId,account,disposition,evidenceDigest,findingDigest,nonce,expectedCommitment}) {
 const commitment=await voteCommitment(reviewerCommitmentArgs(caseData,caseId,roundId,account,disposition,evidenceDigest,findingDigest,nonce));
 if(commitment!==expectedCommitment)throw Error('The supplied disposition, finding and nonce do not match the onchain commitment.');
 return revealTransactionArgs(caseId,roundId,disposition,evidenceDigest,findingDigest,nonce);
}

export async function respondToInvitation(post,digest,reviewerId,status,now=new Date()) {
 return post('reviewer/respond',invitationResponseArgs(digest,reviewerId,status,now));
}
export async function storeReviewerFinding(post,caseId,roundId,data) {
 return post('finding',findingArgs(caseId,roundId,data));
}
export async function commitReviewerVote(signCall,caseId,roundId,commitment) {
 return signCall('commit_vote',commitmentTransactionArgs(caseId,roundId,commitment),'0');
}
export async function revealReviewerVote(signCall,args) {
 return signCall('reveal_vote',args,'0');
}
