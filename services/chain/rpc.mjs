import {ApiError} from '../api/store.mjs';

const ACCOUNT_ID=/^(?=.{2,64}$)[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const ZERO_CODE_HASH='11111111111111111111111111111111';

function rpcFailure(cause){
 if(cause instanceof ApiError)return cause;
 return new ApiError(503,'NEAR RPC unavailable; no finalized result is implied');
}

function parseJson(bytes){
 try{return JSON.parse(Buffer.from(bytes).toString('utf8'));}
 catch{throw new ApiError(502,'NEAR contract returned invalid JSON');}
}

export function rpcAdapter({url,contractAccount,network='testnet',transport=fetch,timeoutMs=10000,staleAfterMs=120000,now=()=>new Date()}={}){
 if(network!=='testnet')throw Error('Only NEAR testnet RPC is supported');
 if(!ACCOUNT_ID.test(contractAccount||'')||!contractAccount.endsWith('.testnet'))throw Error('A valid testnet contract account is required');
 let endpoint;
 try{endpoint=new URL(url);}catch{throw Error('A valid NEAR RPC URL is required');}
 if(!['http:','https:'].includes(endpoint.protocol))throw Error('NEAR RPC URL must use HTTP or HTTPS');
 let id=0,lastBlockHeight=null;
 async function rpc(method,params){
  let response,payload;
  try{
   response=await transport(endpoint,{method:'POST',signal:AbortSignal.timeout(timeoutMs),headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:`contra-${++id}`,method,params})});
   if(!response.ok)throw new ApiError(503,'NEAR RPC returned HTTP '+response.status);
   payload=await response.json();
  }catch(cause){throw rpcFailure(cause);}
  if(payload?.error)throw new ApiError(503,'NEAR RPC rejected '+method);
  if(!payload||!Object.hasOwn(payload,'result'))throw new ApiError(502,'NEAR RPC response is incomplete');
  return payload.result;
 }
 const block=async blockId=>rpc('block',blockId?{block_id:blockId}:{finality:'final'});
 const source=async result=>{
  const finalized=await block(result.block_hash);
  const timestamp=String(finalized.header.timestamp_nanosec);
  const observed=now();
  const ageMs=Math.max(0,observed.getTime()-Number(BigInt(timestamp)/1_000_000n)),height=BigInt(result.block_height),regressed=lastBlockHeight!==null&&height<lastBlockHeight;if(lastBlockHeight===null||height>lastBlockHeight)lastBlockHeight=height;
  return {network,finality:'final',block_height:String(result.block_height),block_hash:result.block_hash,block_timestamp_ns:timestamp,observed_at:observed.toISOString(),age_ms:ageMs,regressed,stale:ageMs>staleAfterMs||regressed};
 };
 const query=async(method,args={})=>rpc('query',{request_type:'call_function',account_id:contractAccount,method_name:method,args_base64:Buffer.from(JSON.stringify(args)).toString('base64'),finality:'final'});
 const adapter={
  network,contractAccount,url:endpoint.toString(),
  async validate(){
   const status=await rpc('status',[]);
   if(status.chain_id!==network)throw new ApiError(503,`NEAR RPC network mismatch: expected ${network}`);
   if(status.sync_info?.syncing)throw new ApiError(503,'NEAR RPC node is still syncing');
   const account=await rpc('query',{request_type:'view_account',account_id:contractAccount,finality:'final'});
   if(!account.code_hash||account.code_hash===ZERO_CODE_HASH)throw new ApiError(503,'Configured testnet account has no deployed contract');
   const final=await block();
   return {network,contract_account:contractAccount,rpc_chain_id:status.chain_id,rpc_version:status.version?.version||null,block_height:String(final.header.height),block_hash:final.header.hash,block_timestamp_ns:String(final.header.timestamp_nanosec),observed_at:now().toISOString()};
  },
  async health(){
   try{const status=await rpc('status',[]),final=await block(),meta=await source({block_hash:final.header.hash,block_height:final.header.height});return {status:status.chain_id===network&&!status.sync_info?.syncing&&!meta.stale?'ready':'degraded',network,contract_account:contractAccount,rpc_chain_id:status.chain_id,syncing:!!status.sync_info?.syncing,source:meta};}
   catch(error){return {status:'unavailable',network,contract_account:contractAccount,error:error.message};}
  },
  async view(method,args={}){const result=await query(method,args);return parseJson(result.result);},
  async viewWithMeta(method,args={}){const result=await query(method,args);return {value:parseJson(result.result),source:await source(result)};},
  async observation(){const final=await block();return source({block_hash:final.header.hash,block_height:final.header.height});},
  async hasAccessKey(account,publicKey){try{await rpc('query',{request_type:'view_access_key',account_id:account,public_key:publicKey,finality:'final'});return true;}catch{return false;}},
  async receipt(hash,account){
   const result=await rpc('tx',{tx_hash:hash,sender_account_id:account,wait_until:'FINAL'});
   const final=result.final_execution_status==='FINAL';
   const failure=result.status&&typeof result.status==='object'&&Object.hasOwn(result.status,'Failure');
   return {network,tx_hash:hash,signer_id:account,final,success:final&&!failure,status:failure?'FAILED':final?'CONFIRMED':'PENDING',result,observed_at:now().toISOString()};
  }
 };
 return adapter;
}
