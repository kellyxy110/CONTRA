import {createHash} from 'node:crypto';
import {KeyPair} from '@near-js/crypto';
import {nep413Bytes} from '../services/api/auth.mjs';

const origin=process.env.CONTRA_PUBLIC_ORIGIN||'https://contra-near.pages.dev';
const account='contra-creator.testnet';
const publicKey='ed25519:61VyeNdx9dTGwvQB6QFW8ZjNDejkXwP7qFhqGx6iz1AZ';
let secret='';for await(const chunk of process.stdin)secret+=chunk;secret=secret.trim();
if(secret.startsWith('{')){const parsed=JSON.parse(secret);secret=parsed.private_key||parsed.secret_key||parsed.secretKey||parsed.privateKey||'';}
const keyPair=KeyPair.fromString(secret);secret='';
if(keyPair.getPublicKey().toString()!==publicKey)throw Error('Creator credential does not match the approved public key');
async function api(path,{token,body}={}){
 const response=await fetch(`${origin}/api/${path}`,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined});
 const value=await response.json();if(!response.ok)throw Error(value.error||`HTTP ${response.status}`);return value;
}
const challenge=await api('session/challenge',{body:{account}}),digest=createHash('sha256').update(nep413Bytes(challenge)).digest(),signature=Buffer.from(keyPair.sign(digest).signature).toString('base64');
const session=await api('session/verify',{body:{accountId:account,publicKey,signature,challenge_id:challenge.id}});
try{process.stdout.write(JSON.stringify(await api('reviewer/activation-readiness',{token:session.token}),null,2)+'\n');}
finally{await api('session/disconnect',{token:session.token,body:{}}).catch(()=>{});}
