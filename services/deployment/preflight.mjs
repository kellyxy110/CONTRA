import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const ACCOUNT_ID=/^(?=.{2,64}$)[a-z0-9]+(?:[._-][a-z0-9]+)*\.testnet$/;
const PUBLIC_KEY=/^ed25519:[1-9A-HJ-NP-Za-km-z]{32,60}$/;
const HASH=/^[a-f0-9]{64}$/;
const CODE_HASH=/^[1-9A-HJ-NP-Za-km-z]{32,60}$/;
const SECRET_FIELD=/(private|secret|seed|mnemonic|phrase|credential)/i;
const ARTIFACT='contracts/contestation/target/wasm32-unknown-unknown/release/contra_contestation.wasm';

function digest(bytes){return createHash('sha256').update(bytes).digest('hex');}
function secretFields(value,prefix=''){
 const found=[];
 if(!value||typeof value!=='object')return found;
 for(const [key,entry]of Object.entries(value)){
  const location=prefix?`${prefix}.${key}`:key;
  if(SECRET_FIELD.test(key))found.push(location);
  found.push(...secretFields(entry,location));
 }
 return found;
}
function account(value){return typeof value==='string'&&ACCOUNT_ID.test(value);}
function positiveYocto(value){return typeof value==='string'&&/^[1-9][0-9]*$/.test(value);}
function rpcError(body){if(body?.error)throw Error(`NEAR RPC rejected preflight: ${body.error.message||JSON.stringify(body.error)}`);return body?.result;}

export function deploymentIntentDigest(plan){
 const intent={schema:plan.schema,network:plan.network,rpc_url:plan.rpc_url,contract_account:plan.contract_account,signer_account:plan.signer_account,signer_public_key:plan.signer_public_key,custody_method:plan.custody_method,artifact_path:plan.artifact_path,artifact_sha256:plan.artifact_sha256,expected_current_code_hash:plan.expected_current_code_hash,max_total_cost_yocto:plan.max_total_cost_yocto,minimum_account_balance_yocto:plan.minimum_account_balance_yocto,initial_owner_account:plan.initial_owner_account,creator_allowlist:plan.creator_allowlist};
 return digest(Buffer.from(JSON.stringify(intent)));
}

export function inspectProductionArtifact(bytes,{exports:providedExports,abi}={}){
 if(!Buffer.isBuffer(bytes)&&!(bytes instanceof Uint8Array))throw Error('Production WASM bytes are required');
 const buffer=Buffer.from(bytes);
 if(buffer.length<8||buffer.subarray(0,4).toString('hex')!=='0061736d')throw Error('Production artifact is not a valid WebAssembly binary');
 const names=providedExports||WebAssembly.Module.exports(new WebAssembly.Module(buffer)).map(item=>item.name);
 if(!abi)throw Error('Contract ABI baseline is required');
 const expected=[...abi.production_exports].sort(),actual=[...names].sort();
 if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('Production artifact exports do not match the frozen ABI baseline');
 if(abi.fault_only_exports.some(name=>names.includes(name)))throw Error('Production artifact contains a fault-only export');
 return {sha256:digest(buffer),exports:names};
}

export function assessDeploymentPlan(plan,{root=process.cwd(),now=()=>new Date(),artifactBytes,artifactExports,abi}={}){
 if(!plan||typeof plan!=='object'||Array.isArray(plan))throw Error('Deployment plan must be a JSON object');
 const forbidden=secretFields(plan);if(forbidden.length)throw Error(`Deployment plan contains forbidden secret fields: ${forbidden.join(', ')}`);
 if(plan.schema!=='CONTRA_TESTNET_DEPLOYMENT_V1')throw Error('Unsupported deployment plan schema');
 if(plan.network!=='testnet')throw Error('Deployment network must be testnet');
 let rpc;try{rpc=new URL(plan.rpc_url);}catch{throw Error('Deployment RPC URL must be absolute');}
 if(rpc.protocol!=='https:')throw Error('Deployment RPC URL must use HTTPS');
 if(plan.artifact_path!==ARTIFACT)throw Error(`Production artifact path must be ${ARTIFACT}`);
 const absolute=path.resolve(root,plan.artifact_path),rootPath=path.resolve(root)+path.sep;
 if(!absolute.startsWith(rootPath))throw Error('Production artifact must remain inside the repository');
 const bytes=artifactBytes|| (fs.existsSync(absolute)?fs.readFileSync(absolute):null);
 const blockers=[];
 if(!account(plan.contract_account))blockers.push('authorised contract account');
 if(!account(plan.signer_account))blockers.push('authorised signer account');
 if(account(plan.contract_account)&&account(plan.signer_account)&&plan.contract_account!==plan.signer_account)throw Error('Deployment signer must be the contract account full-access signer');
 if(!PUBLIC_KEY.test(plan.signer_public_key||''))blockers.push('signer public key');
 if(!['os-keychain','ledger','offline-custody'].includes(plan.custody_method))blockers.push('approved custody method');
 const expectedArtifactHash=HASH.test(plan.artifact_sha256||'');
 if(!expectedArtifactHash)blockers.push('production artifact SHA-256');
 if(!bytes)blockers.push('built production artifact');
 let artifact=null;
 if(bytes){
  const baseline=abi||JSON.parse(fs.readFileSync(path.join(root,'ci/contract-abi-baseline.json'),'utf8'));
  artifact=inspectProductionArtifact(bytes,{exports:artifactExports,abi:baseline});
  if(expectedArtifactHash&&artifact.sha256!==plan.artifact_sha256)throw Error('Production artifact SHA-256 does not match the deployment plan');
 }
 if(plan.expected_current_code_hash!=='EMPTY'&&!CODE_HASH.test(plan.expected_current_code_hash||''))blockers.push('expected current contract code hash or EMPTY');
 if(!positiveYocto(plan.max_total_cost_yocto))blockers.push('authorised testnet cost ceiling');
 if(!positiveYocto(plan.minimum_account_balance_yocto))blockers.push('minimum funded account balance');
 if(!account(plan.initial_owner_account))blockers.push('initial contract owner account');
 if(!Array.isArray(plan.creator_allowlist)||!plan.creator_allowlist.length||plan.creator_allowlist.some(value=>!account(value)))blockers.push('initial creator allowlist');
 const authorisation=plan.owner_authorisation;
 if(!authorisation?.id||!authorisation?.approved_by||!authorisation?.approved_at||!authorisation?.expires_at||!authorisation?.approved_plan_sha256)blockers.push('explicit owner deployment authorisation');
 else{
  const approved=Date.parse(authorisation.approved_at),expires=Date.parse(authorisation.expires_at),at=now().getTime();
  if(!Number.isFinite(approved)||!Number.isFinite(expires)||approved>at||expires<=at)throw Error('Owner deployment authorisation dates are invalid or expired');
  if(authorisation.approved_plan_sha256!==deploymentIntentDigest(plan))throw Error('Owner authorisation does not bind the current deployment plan');
 }
 return {ready:blockers.length===0,blockers,network:'testnet',artifact,contract_account:plan.contract_account||null,signer_account:plan.signer_account||null};
}

export async function verifyDeploymentTarget(plan,{transport=fetch,now=()=>new Date(),staleAfterMs=120000,timeoutMs=10000}={}){
 if(plan?.network!=='testnet'||!account(plan.contract_account)||plan.signer_account!==plan.contract_account||!PUBLIC_KEY.test(plan.signer_public_key||'')||!positiveYocto(plan.minimum_account_balance_yocto))throw Error('Deployment target plan is incomplete or unsafe');
 const call=async(method,params)=>{
  const response=await transport(plan.rpc_url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:'contra-deployment-preflight',method,params}),signal:AbortSignal.timeout(timeoutMs)});
  if(!response.ok)throw Error(`NEAR RPC preflight failed with HTTP ${response.status}`);
  return rpcError(await response.json());
 };
 const status=await call('status',[]);if(status?.chain_id!=='testnet'||status?.sync_info?.syncing!==false)throw Error('RPC is not a synced NEAR testnet node');
 const accountState=await call('query',{request_type:'view_account',finality:'final',account_id:plan.contract_account});
 const keys=await call('query',{request_type:'view_access_key_list',finality:'final',account_id:plan.signer_account});
 const key=keys?.keys?.find(entry=>entry.public_key===plan.signer_public_key);
 if(!key||key.access_key?.permission!=='FullAccess')throw Error('Approved signer public key is not a full-access key');
 const current=accountState?.code_hash==='11111111111111111111111111111111'?'EMPTY':accountState?.code_hash;
 if(current!==plan.expected_current_code_hash)throw Error('Current contract code hash contradicts the deployment plan');
 if(BigInt(accountState?.amount||0)<BigInt(plan.minimum_account_balance_yocto))throw Error('Contract account balance is below the approved deployment minimum');
 const block=await call('block',{finality:'final'}),timestamp=BigInt(block?.header?.timestamp_nanosec||0),age=now().getTime()-Number(timestamp/1_000_000n);
 if(!block?.header?.hash||age<0||age>staleAfterMs)throw Error('Final testnet block is missing or stale');
 return {network:'testnet',contract_account:plan.contract_account,signer_public_key:plan.signer_public_key,current_code_hash:current,block_height:String(block.header.height),block_hash:block.header.hash,block_timestamp_ns:String(timestamp),observed_at:now().toISOString()};
}

export function deploymentCommand(plan){
 const args=JSON.stringify({owner_id:plan.initial_owner_account,chain_id:'testnet',creator_allowlist:plan.creator_allowlist});
 return `near contract deploy ${plan.contract_account} use-file ${ARTIFACT} with-init-call new json-args '${args}' prepaid-gas '100 Tgas' attached-deposit '0 NEAR' network-config testnet sign-with-keychain send`;
}

export const deploymentArtifactPath=ARTIFACT;
