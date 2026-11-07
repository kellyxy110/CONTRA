import {setupWalletSelector} from '@near-wallet-selector/core';
import {setupMyNearWallet} from '@near-wallet-selector/my-near-wallet';
export async function connectWallet({network,contractAccount,authorized}){
 if(network!=='testnet'||authorized!==true)throw Error('Testnet wallet use requires separate owner authorization.');
 const selector=await setupWalletSelector({network:'testnet',modules:[setupMyNearWallet()]});
 const wallet=await selector.wallet('my-near-wallet');await wallet.signIn({contractId:contractAccount,methodNames:[]});return {selector,wallet};
}
async function api(path,{token,method='GET',body}={}){const response=await fetch('/api/'+path,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined}),value=await response.json();if(!response.ok){const error=Error(value.error||'Wallet operation failed');error.status=response.status;throw error;}return value;}
export async function recoverWalletSession(token){return api('session',{token});}
export async function renewWalletSession(token){return api('session/renew',{token,method:'POST',body:{}});}
export async function disconnectWalletSession({token,wallet}){try{await api('session/disconnect',{token,method:'POST',body:{}});}finally{await wallet?.signOut?.();}}
export function createWalletOperationId(){return 'wallet-'+crypto.randomUUID();}
export function pendingWalletOperations(){try{return JSON.parse(localStorage.getItem('contra-wallet-operations')||'{}');}catch{return {};}}
function saveOperation(operation){const items=pendingWalletOperations();items[operation.operation_id]={operation_id:operation.operation_id,status:operation.status,tx_hash:operation.tx_hash||null,updated_at:Date.now()};localStorage.setItem('contra-wallet-operations',JSON.stringify(items));}
function clearOperation(operationId){const items=pendingWalletOperations();delete items[operationId];localStorage.setItem('contra-wallet-operations',JSON.stringify(items));}
export async function prepareWalletTransaction({token,operationId=createWalletOperationId(),call}){const prepared=await api('wallet/prepare',{token,method:'POST',body:{operation_id:operationId,call}});saveOperation(prepared.operation);return prepared;}
export async function sendPreparedWalletTransaction(wallet,{token,operation}){
 if(operation?.signing_request?.operation_id===undefined)throw Error('A server-validated signing request is required.');
 let result;try{result=await wallet.signAndSendTransaction(operation.signing_request.transaction);}catch(error){const operationId=operation.signing_request.operation_id,route=/reject|declin|cancel/i.test(error?.message||'')?'wallet/reject':'wallet/interrupt';try{const recorded=await api(route,{token,method:'POST',body:{operation_id:operationId}});if(recorded.status==='UNKNOWN')saveOperation(recorded);else clearOperation(operationId);}catch{}throw error;}
 const txHash=result?.transaction?.hash||result?.transaction_outcome?.id||result?.transactionHash;if(!txHash)throw Error('Wallet returned without a transaction hash. Recover the redirect before deciding whether to retry.');
 try{const persisted=await api('wallet/broadcast',{token,method:'POST',body:{operation_id:operation.signing_request.operation_id,tx_hash:txHash}});saveOperation(persisted);}catch(error){error.txHash=txHash;throw error;}return result;
}
export async function reconcileWalletTransaction({token,operationId}){const operation=await api('wallet/reconcile',{token,method:'POST',body:{operation_id:operationId}});if(['CONFIRMED','FAILED','UNKNOWN'].includes(operation.status))clearOperation(operationId);else saveOperation(operation);return operation;}
export async function authenticateWallet(wallet,accountId){const challenge=await fetch('/api/session/challenge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({account:accountId})}).then(r=>r.json());if(challenge.error)throw Error(challenge.error);if(!wallet.signMessage)throw Error('Wallet does not support NEP-413.');const signed=await wallet.signMessage({message:challenge.message,nonce:Uint8Array.from(atob(challenge.nonce),c=>c.charCodeAt(0)),recipient:challenge.recipient});const response=await fetch('/api/session/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...signed,challenge_id:challenge.id})});const result=await response.json();if(!response.ok)throw Error(result.error);return result;}
