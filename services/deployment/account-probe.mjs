const UNKNOWN_ACCOUNT='UNKNOWN_ACCOUNT';

async function rpc(url,method,params,{transport=fetch,timeoutMs=10000}={}){
 let cause;
 for(let attempt=1;attempt<=3;attempt++){
  try{
   const response=await transport(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:'contra-m08-readonly',method,params}),signal:AbortSignal.timeout(timeoutMs)});
   if(!response.ok)throw Error(`Read-only RPC returned HTTP ${response.status}`);
   return response.json();
  }catch(error){cause=error;if(attempt<3)await new Promise(resolve=>setTimeout(resolve,250*attempt));}
 }
 throw new Error(`Read-only RPC ${url} failed after three attempts`,{cause});
}

export async function probeTestnetAccount(accountId,{endpoints=['https://rpc.testnet.near.org','https://test.rpc.fastnear.com'],transport=fetch,now=()=>new Date()}={}){
 if(typeof accountId!=='string'||!accountId.endsWith('.testnet'))throw Error('A testnet account ID is required');
 const observations=[];
 for(const rpcUrl of endpoints){
  const status=await rpc(rpcUrl,'status',[],{transport});
  if(status.error||status.result?.chain_id!=='testnet'||status.result?.sync_info?.syncing!==false)throw Error(`RPC ${rpcUrl} is not a synced NEAR testnet node`);
  const account=await rpc(rpcUrl,'query',{request_type:'view_account',finality:'final',account_id:accountId},{transport});
  if(account.error?.cause?.name===UNKNOWN_ACCOUNT){
   observations.push({rpc_url:rpcUrl,status:UNKNOWN_ACCOUNT,final_block_height:String(account.error.cause.info?.block_height||''),final_block_hash:account.error.cause.info?.block_hash||null});
   continue;
  }
  if(account.error)throw Error(`RPC ${rpcUrl} rejected the account query`);
  const keys=await rpc(rpcUrl,'query',{request_type:'view_access_key_list',finality:'final',account_id:accountId},{transport});
  if(keys.error)throw Error(`RPC ${rpcUrl} rejected the access-key query`);
  observations.push({rpc_url:rpcUrl,status:'EXISTS',final_block_height:String(account.result?.block_height||''),final_block_hash:account.result?.block_hash||null,amount_yocto:account.result?.amount||null,locked_yocto:account.result?.locked||null,storage_usage:account.result?.storage_usage??null,code_hash:account.result?.code_hash||null,public_keys:(keys.result?.keys||[]).map(entry=>({public_key:entry.public_key,permission:entry.access_key?.permission}))});
 }
 const statuses=new Set(observations.map(value=>value.status));
 if(statuses.size!==1)throw Error('Read-only RPC endpoints disagree about account existence');
 return {schema:'CONTRA_M08_ACCOUNT_PROBE_V1',account_id:accountId,network:'testnet',observed_at:now().toISOString(),status:observations[0].status,ownership_verified:false,observations};
}
