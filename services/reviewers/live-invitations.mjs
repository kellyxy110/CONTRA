import {createHash} from 'node:crypto';
import {canonical} from '../api/primitives.mjs';

const ACCOUNT=/^[a-z0-9._-]+\.testnet$/;
const sha=value=>createHash('sha256').update(value).digest('hex');

export function buildLiveReviewerInvitations({accounts,expires,contractAccount='contra-contestation.testnet'}) {
 if(!Array.isArray(accounts)||accounts.length!==6)throw Error('Exactly six reviewer accounts are required');
 if(new Set(accounts).size!==6||accounts.some(account=>!ACCOUNT.test(account)))throw Error('Reviewer accounts must be six distinct Testnet accounts');
 if(!Number.isSafeInteger(expires)||expires<=Date.now())throw Error('Invitation expiry must be in the future');
 return accounts.map((reviewer_id,index)=>{
  const committee=index<3?'primary':'fresh',slot=index%3+1;
  const operator_id=sha(`CONTRA_DECLARED_OPERATOR_V1\n${reviewer_id}`);
  const body={schema:'CONTRA_REVIEWER_INVITATION_V1',network:'testnet',contract_account:contractAccount,reviewer_id,operator_id,committee,slot,expires};
  return {digest:sha(canonical(body)),reviewer_id,operator_id,committee,slot,expires,body};
 });
}
