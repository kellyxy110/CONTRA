import {createHash} from 'node:crypto';
import {KeyPair} from '@near-js/crypto';
import {nep413Bytes} from '../services/api/auth.mjs';
import {buildLiveReviewerInvitations} from '../services/reviewers/live-invitations.mjs';

const base=process.env.CONTRA_PUBLIC_ORIGIN||'https://contra-near.pages.dev';
const account='contra-creator.testnet';
const publicKey=process.env.CONTRA_CREATOR_PUBLIC_KEY;
const accounts=String(process.env.CONTRA_REVIEWER_ACCOUNTS||'').split(',').map(value=>value.trim()).filter(Boolean);
const expires=Number(process.env.CONTRA_INVITATION_EXPIRES_MS);
if(publicKey!=='ed25519:61VyeNdx9dTGwvQB6QFW8ZjNDejkXwP7qFhqGx6iz1AZ')throw Error('Approved creator public key is required');

let raw='';
for await(const chunk of process.stdin)raw+=chunk;
raw=raw.trim();
if(raw.startsWith('{')){const parsed=JSON.parse(raw);raw=parsed.private_key||parsed.secret_key||parsed.secretKey||parsed.privateKey||'';}
if(!raw.startsWith('ed25519:'))throw Error('OS-keychain credential has an unsupported format');
const keyPair=KeyPair.fromString(raw);raw='';
if(keyPair.getPublicKey().toString()!==publicKey)throw Error('OS-keychain credential does not match the approved creator key');

async function api(path,{token,body}={}){
 const response=await fetch(`${base}/api/${path}`,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});
 const value=await response.json();
 if(!response.ok)throw Error(value.error||`HTTP ${response.status}`);
 return value;
}

const challenge=await api('session/challenge',{body:{account}});
const bytes=nep413Bytes({message:challenge.message,nonce:challenge.nonce,recipient:challenge.recipient,callbackUrl:challenge.callbackUrl});
const signature=Buffer.from(keyPair.sign(createHash('sha256').update(bytes).digest()).signature).toString('base64');
const session=await api('session/verify',{body:{accountId:account,publicKey,signature,challenge_id:challenge.id}});
const invitations=buildLiveReviewerInvitations({accounts,expires});
const created=[];
try{
 for(const invitation of invitations)created.push(await api('reviewer/invitations',{token:session.token,body:invitation}));
}finally{
 await api('session/disconnect',{token:session.token,body:{}}).catch(()=>{});
}
process.stdout.write(JSON.stringify({schema:'CONTRA_PHASE3_INVITATIONS_V1',created_at:new Date().toISOString(),transaction_broadcast:false,invitations:created.map(value=>({digest:value.digest,reviewer_id:value.reviewer_id,operator_id:value.operator_id,committee:value.committee,slot:value.slot,status:value.status,expires:value.expires,replayed:value.replayed}))},null,2)+'\n');
