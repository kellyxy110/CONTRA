import test from 'node:test';
import assert from 'node:assert/strict';
import {buildReviewerInvitation,assessReviewerResponses} from '../services/reviewers/invitation.mjs';
import {createHash} from 'node:crypto';

const expiry='2099-01-01T00:00:00.000Z',contract_account='contra-contestation.testnet';
const invitations=['primary','fresh'].flatMap(committee=>[1,2,3].map(slot=>buildReviewerInvitation({slot,committee,contract_account,expires_at:expiry})));
const digest=value=>createHash('sha256').update(value).digest('hex');
const responses=invitations.map((value,index)=>({invitation_digest:value.invitation_digest,accepted:true,consent:true,reviewer_id:`reviewer-${index}.testnet`,operator_id:digest(`operator-${index}`),disclosure_digest:digest(`disclosure-${index}`),control_signature_verified:true,custody_attestation:'Key controlled by the named operator.',availability_attestation:'Available for both vote phases.',conflicts:[]}));

test('six disjoint consenting reviewer responses pass technical onboarding readiness',()=>{const result=assessReviewerResponses({invitations,responses,now:'2026-11-10T12:00:00.000Z'});assert.equal(result.ready,true);assert.equal(result.distinct_accounts,6);assert.equal(result.distinct_operators,6);assert.equal(result.independence_established,false);});
test('missing consent and reused operator fail readiness',()=>{const changed=structuredClone(responses);changed[0].consent=false;changed[5].operator_id=changed[0].operator_id;const result=assessReviewerResponses({invitations,responses:changed,now:'2026-11-10T12:00:00.000Z'});assert.equal(result.ready,false);assert.match(result.issues.join('\n'),/consent missing/);assert.match(result.issues.join('\n'),/operator reused/);});
test('invitation grants no transaction or settlement authority',()=>{for(const invitation of invitations){assert.equal(invitation.authority.can_settle,false);assert.equal(invitation.authority.can_authorise_transactions,false);assert.equal(invitation.authority.ai_output_is_non_binding,true);}});
test('onboarding rejects duplicate responses, forged invitations and unsigned control',()=>{const duplicates=[responses[0],responses[0],...responses.slice(1)],forged=structuredClone(invitations);forged[0].contract_account='other.testnet';assert.equal(assessReviewerResponses({invitations,responses:duplicates,now:'2026-11-10T12:00:00.000Z'}).ready,false);assert(assessReviewerResponses({invitations:forged,responses,now:'2026-11-10T12:00:00.000Z'}).issues.some(value=>value.includes('digest invalid')));const unsigned=structuredClone(responses);unsigned[2].control_signature_verified=false;assert(assessReviewerResponses({invitations,responses:unsigned,now:'2026-11-10T12:00:00.000Z'}).issues.some(value=>value.includes('signature unverified')));});
