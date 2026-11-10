import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {KeyPair} from '@near-js/crypto';
import {Store} from '../services/api/store.mjs';
import {createApp} from '../services/api/server.mjs';
import {nep413Bytes} from '../services/api/auth.mjs';
import {rpcAdapter} from '../services/chain/rpc.mjs';

const account=process.env.CONTRA_LIVE_ACCOUNT;
const expectedPublicKey=process.env.CONTRA_LIVE_PUBLIC_KEY;
if(!/^[a-z0-9._-]+\.testnet$/.test(account||'')||!expectedPublicKey?.startsWith('ed25519:'))throw Error('Exact testnet account and public key are required');

let raw='';
for await(const chunk of process.stdin)raw+=chunk;
raw=raw.trim();
if(raw.startsWith('{')){
 const parsed=JSON.parse(raw);
 raw=parsed.private_key||parsed.secret_key||parsed.secretKey||parsed.privateKey||'';
}
if(!raw.startsWith('ed25519:'))throw Error('Keychain credential has an unsupported format');
const keyPair=KeyPair.fromString(raw);
raw='';
if(keyPair.getPublicKey().toString()!==expectedPublicKey)throw Error('Keychain credential does not match the approved public key');

const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'contra-m09-live-auth-'));
const store=new Store(dataDir);
const chain=rpcAdapter({url:'https://rpc.testnet.near.org',contractAccount:'contra-contestation.testnet'});
let server;
try{
 await chain.validate();
 const app=createApp({store,chain});
 server=app.server;
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const base=`http://127.0.0.1:${server.address().port}`;
 const post=async(route,body)=>{const response=await fetch(base+'/api/'+route,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return {response,value:await response.json()};};
 const challengeResult=await post('session/challenge',{account});
 if(!challengeResult.response.ok)throw Error(challengeResult.value.error);
 const challenge=challengeResult.value;
 const bytes=nep413Bytes({message:challenge.message,nonce:challenge.nonce,recipient:challenge.recipient,callbackUrl:challenge.callbackUrl});
 const signature=Buffer.from(keyPair.sign(createHash('sha256').update(bytes).digest()).signature).toString('base64');
 const verified=await post('session/verify',{accountId:account,publicKey:expectedPublicKey,signature,challenge_id:challenge.id});
 if(!verified.response.ok)throw Error(verified.value.error);
 const token=verified.value.token;
 const recovered=await fetch(base+'/api/session',{headers:{Authorization:'Bearer '+token}});
 if(!recovered.ok||(await recovered.json()).account!==account)throw Error('Authenticated session did not recover');
 const renewed=await fetch(base+'/api/session/renew',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:'{}'});
 if(!renewed.ok)throw Error('Authenticated session did not renew');
 const renewedToken=(await renewed.json()).token;
 const replay=await post('session/verify',{accountId:account,publicKey:expectedPublicKey,signature,challenge_id:challenge.id});
 if(replay.response.status!==401)throw Error('NEP-413 challenge replay was not rejected');
 const disconnect=await fetch(base+'/api/session/disconnect',{method:'POST',headers:{Authorization:'Bearer '+renewedToken,'Content-Type':'application/json'},body:'{}'});
 if(!disconnect.ok)throw Error('Authenticated session did not disconnect');
 const afterDisconnect=await fetch(base+'/api/session',{headers:{Authorization:'Bearer '+renewedToken}});
 if(afterDisconnect.status!==401)throw Error('Disconnected session remained usable');
 const observation=await chain.observation();
 process.stdout.write(JSON.stringify({account,public_key:expectedPublicKey,network:'testnet',contract_account:'contra-contestation.testnet',nep413_signature_verified:true,session_recovered:true,session_renewed:true,replay_rejected:true,disconnect_verified:true,transaction_broadcast:false,observation},null,2)+'\n');
}finally{
 if(server?.listening)await new Promise(resolve=>server.close(resolve));
 store.close();
 fs.rmSync(dataDir,{recursive:true,force:true});
}
