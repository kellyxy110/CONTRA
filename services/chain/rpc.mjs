import {ApiError} from '../api/store.mjs';
export function rpcAdapter({url,contractAccount,network='testnet',transport=fetch}){
 if(network!=='testnet')throw Error('Mainnet is prohibited');
 async function rpc(method,params){const r=await transport(url,{method:'POST',signal:AbortSignal.timeout(10000),headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:'contra',method,params})});const x=await r.json();if(x.error)throw new ApiError(503,'NEAR RPC request failed');return x.result;}
 return {network,contractAccount,async view(method,args={}){const r=await rpc('query',{request_type:'call_function',account_id:contractAccount,method_name:method,args_base64:Buffer.from(JSON.stringify(args)).toString('base64'),finality:'final'});return JSON.parse(Buffer.from(r.result).toString());},async hasAccessKey(account,publicKey){try{await rpc('query',{request_type:'view_access_key',account_id:account,public_key:publicKey,finality:'final'});return true;}catch{return false;}},async receipt(hash,account){return rpc('tx',{tx_hash:hash,sender_account_id:account,wait_until:'FINAL'});}};
}
