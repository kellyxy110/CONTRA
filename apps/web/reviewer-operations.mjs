// The client constructs arguments; authenticated APIs and contract enforce authority.
export function invitationResponseArgs(digest,reviewerId,status,now=new Date()) {
 return {digest,reviewer_id:reviewerId,status,body:{acknowledged_at:now.toISOString()}};
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
