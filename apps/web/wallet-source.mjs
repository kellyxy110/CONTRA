import {NearConnector} from '@hot-labs/near-connect';
export {voteCommitment} from '../../packages/protocol/encoding.mjs';
const METEOR_EXECUTOR_COMMIT='ef1be35fc3712f2de60a7563aed543d78e73f763';
export const METEOR_EXECUTOR_SHA256='96210256a89cb382bb7fe95f29d6a2489319da87472fe77018b4cdcbf1672b50';
const METEOR_EXECUTOR_URL=`https://raw.githubusercontent.com/Meteor-Wallet/meteor_wallet_sdk/${METEOR_EXECUTOR_COMMIT}/storage/meteor-near-connect-latest.js`;
export const METEOR_MANIFEST={version:'1.0.0',wallets:[{id:'meteor-wallet',name:'Meteor Wallet',icon:'https://raw.githubusercontent.com/Meteor-Wallet/meteor_wallet_sdk/main/assets/meteor-logo-svg.svg',description:'Browser-isolated NEAR wallet authentication.',website:'https://meteorwallet.app/',version:'1.1.1',executor:METEOR_EXECUTOR_URL,type:'sandbox',features:{signMessage:true,signInWithoutAddKey:true,signInAndSignMessage:true,signAndSendTransaction:true,signAndSendTransactions:true,signInWithFunctionCallKey:true,signDelegateActions:true,mainnet:true,testnet:true},platform:{web:'https://wallet.meteorwallet.app',chrome:'https://chromewebstore.google.com/detail/meteor-wallet/pcndjhkinnkaohffealmlmhaepkpmgkb',android:'https://play.google.com/store/apps/details?id=app.meteorwallet.v2',ios:'https://apps.apple.com/us/app/meteor-wallet/id6739558223'},permissions:{storage:true,allowsOpen:['https://chromewebstore.google.com','https://wallet.meteorwallet.app','https://meteorwallet.app','meteorwallet://','meteorwalletdev://'],external:['meteorCom','meteorComV2']}}]};
let sharedConnector;
const BROWSER_WALLET_MATRIX={
 'meteor-wallet':{verification:'Genuine CONTRA Testnet NEP-413 flow verified'},
 'intear-wallet':{verification:'Connector compatibility verified, account authentication pending'},
 'nightly-wallet':{verification:'Connector compatibility verified, account authentication pending'},
};
export async function createWalletConnector({network='testnet',connectorFactory=options=>new NearConnector(options)}={}){
 if(sharedConnector)return sharedConnector;
 const metaNonce=typeof document==='object'?document.querySelector('meta[name="csp-nonce"]')?.content||undefined:undefined;
 const cspNonce=metaNonce&&metaNonce!=='__CONTRA_CSP_NONCE__'?metaNonce:undefined;
 const connector=connectorFactory({network,features:{testnet:true,signMessage:true},autoConnect:true,footerBranding:null,cspNonce});
 await connector.whenManifestLoaded?.catch(()=>{});
 if(Array.isArray(connector.wallets))connector.wallets=connector.wallets.filter(value=>value.manifest?.id!=='meteor-wallet');
 if(Array.isArray(connector.manifest?.wallets))connector.manifest.wallets=connector.manifest.wallets.filter(value=>value.id!=='meteor-wallet');
 await connector.registerWallet?.(METEOR_MANIFEST.wallets[0]);
 sharedConnector=connector;
 return connector;
}
export async function listCompatibleWallets({network='testnet',connectorFactory}={}){
 const connector=await createWalletConnector({network,connectorFactory});
 return {connector,wallets:(connector.availableWallets||[]).filter(value=>BROWSER_WALLET_MATRIX[value.manifest?.id]&&value.manifest?.features?.testnet===true&&value.manifest?.features?.signMessage===true).map(value=>({id:value.manifest.id,name:value.manifest.name,icon:value.manifest.icon,description:value.manifest.description||'NEAR Testnet wallet',website:value.manifest.website,verification:BROWSER_WALLET_MATRIX[value.manifest.id].verification}))};
}
export async function connectWallet({network,contractAccount,authenticationAuthorized,connectorFactory,walletId='meteor-wallet',connector=null}){
 if(network!=='testnet'||authenticationAuthorized!==true)throw Error('Testnet wallet authentication is not authorized.');
 if(contractAccount!=='contra-contestation.testnet')throw Error('Unexpected Testnet contract account.');
 connector=connector||await createWalletConnector({network:'testnet',connectorFactory});
 const wallet=await connector.connect({walletId});
 let accounts=await getWalletAccounts(wallet);
 if(!accounts.length){
  if(typeof wallet?.signIn!=='function')throw Error('The browser wallet returned no eligible Testnet account.');
  const signedIn=await wallet.signIn({network:'testnet'});
  accounts=filterWalletAccounts(Array.isArray(signedIn)?signedIn:await wallet.getAccounts?.());
 }
 if(!accounts.length)throw Error('The browser wallet returned no eligible Testnet account.');
 return {selector:connector,connector,wallet,accounts};
}
function filterWalletAccounts(accounts){if(!Array.isArray(accounts))throw Error('Wallet account discovery failed.');return accounts.filter(value=>/^[a-z0-9._-]+\.testnet$/.test(value?.accountId||''));}
export async function getWalletAccounts(wallet){return filterWalletAccounts(await wallet?.getAccounts?.());}
export function selectWalletAccount(accounts,accountId=null){if(!Array.isArray(accounts)||!accounts.length)throw Error('No testnet wallet account is connected.');const selected=accountId?accounts.find(value=>value.accountId===accountId):accounts[0];if(!selected)throw Error('The selected wallet account is unavailable. Reauthenticate after switching accounts.');return selected;}
export async function assertWalletAccount(wallet,expectedAccount){const selected=selectWalletAccount(await getWalletAccounts(wallet),expectedAccount);if(selected.accountId!==expectedAccount)throw Error('Wallet account changed. Reauthenticate before continuing.');return selected;}
async function api(path,{token,method='GET',body}={}){const response=await fetch('/api/'+path,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});if(!(response.headers.get('content-type')||'').toLowerCase().includes('application/json'))throw Error('The CONTRA API proxy is unavailable. Your wallet remains connected; refresh after deployment completes.');const value=await response.json();if(!response.ok){const error=Error(value.error||'Wallet operation failed');error.status=response.status;throw error;}return value;}
export async function recoverWalletSession(token){return api('session',{token});}
export async function renewWalletSession(token){return api('session/renew',{token,method:'POST',body:{}});}
export async function disconnectWalletSession({token,wallet}){try{await api('session/disconnect',{token,method:'POST',body:{}});}finally{await wallet?.signOut?.();}}
const WALLET_IDENTITY_KEY='contra-wallet-identity';
export function rememberWalletIdentity({walletId,accountId}){
 if(!walletId||!accountId)return false;
 try{localStorage.setItem(WALLET_IDENTITY_KEY,JSON.stringify({walletId,accountId}));return true;}catch{return false;}
}
export function recalledWalletIdentity(){
 try{const value=JSON.parse(localStorage.getItem(WALLET_IDENTITY_KEY)||'null');return value&&typeof value.walletId==='string'&&/^[a-z0-9._-]+\.testnet$/.test(value.accountId||'')?value:null;}catch{return null;}
}
export function forgetWalletIdentity(){try{localStorage.removeItem(WALLET_IDENTITY_KEY);}catch{}}
export async function restoreConnectedWallet({network='testnet',connectorFactory}={}){
 const identity=recalledWalletIdentity();
 if(!identity)return null;
 const connector=await createWalletConnector({network,connectorFactory});
 let wallet;
 try{wallet=await connector.wallet?.(identity.walletId);}catch{return null;}
 if(!wallet)return null;
 const selected=selectWalletAccount(await getWalletAccounts(wallet),identity.accountId);
 return {connector,wallet,account:selected,walletId:identity.walletId};
}
export async function getTestnetAccountBalance(accountId,{transport=fetch,rpcUrl='https://rpc.testnet.near.org'}={}){
 if(!/^[a-z0-9._-]+\.testnet$/.test(accountId||''))throw Error('A valid Testnet account is required.');
 const response=await transport(rpcUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:'contra-wallet-balance',method:'query',params:{request_type:'view_account',finality:'final',account_id:accountId}})});
 const body=await response.json();
 if(!response.ok||body.error)throw Error(body.error?.cause?.name==='UNKNOWN_ACCOUNT'?'The Testnet account does not exist.':'Wallet balance is unavailable.');
 const amount=String(body.result?.amount||'');
 if(!/^\d+$/.test(amount))throw Error('Wallet balance is unavailable.');
 return {accountId,availableYocto:amount,blockHeight:body.result.block_height??null,blockHash:body.result.block_hash??null};
}
export function createWalletOperationId(){return 'wallet-'+crypto.randomUUID();}
function readOperations(){try{const value=JSON.parse(localStorage.getItem('contra-wallet-operations')||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return {};}}
function writeOperations(items){try{localStorage.setItem('contra-wallet-operations',JSON.stringify(items));return true;}catch{return false;}}
export function pendingWalletOperations(accountId=null){const items=readOperations();if(!accountId)return items;return Object.fromEntries(Object.entries(items).filter(([,item])=>item?.account_id===accountId));}
function saveOperation(operation,accountId=operation?.payload?.signerId){if(!operation?.operation_id||!accountId)return false;const items=readOperations();items[operation.operation_id]={operation_id:operation.operation_id,account_id:accountId,status:operation.status,tx_hash:operation.tx_hash||null,updated_at:Date.now()};return writeOperations(items);}
function clearOperation(operationId,accountId){const items=readOperations(),item=items[operationId];if(!item||item.account_id!==accountId)return false;delete items[operationId];return writeOperations(items);}
export async function prepareWalletTransaction({token,accountId,operationId=createWalletOperationId(),call}){const prepared=await api('wallet/prepare',{token,method:'POST',body:{operation_id:operationId,call}}),operation=prepared.operation||prepared,normalised={...operation,operation_id:operation.operation_id||operation.id,payload:operation.payload||(operation.payload_json?JSON.parse(operation.payload_json):null)};saveOperation(normalised,accountId||normalised.payload?.signerId);return prepared.operation?{...prepared,operation:normalised}:normalised;}
export async function sendPreparedWalletTransaction(wallet,{token,operation}){
 const operationId=operation?.operation_id||operation?.operation?.operation_id;if(!operationId)throw Error('A persisted wallet operation is required.');
 const handed=await api('wallet/handoff',{token,method:'POST',body:{operation_id:operationId}}),accountId=handed.operation?.payload?.signerId;if(!handed.signing_request)throw Error('A server-authorized signing request is required.');saveOperation(handed.operation,accountId);
 let result;try{result=await wallet.signAndSendTransaction(handed.signing_request.transaction);}catch(error){try{saveOperation(await api('wallet/interrupt',{token,method:'POST',body:{operation_id:operationId}}),accountId);}catch{}throw error;}
 const txHash=result?.transaction?.hash||result?.transaction_outcome?.id||result?.transactionHash;if(!txHash){try{saveOperation(await api('wallet/interrupt',{token,method:'POST',body:{operation_id:operationId}}),accountId);}catch{}throw Error('Wallet returned without a transaction hash. Recover the redirect before deciding whether to retry.');}saveOperation({...handed.operation,tx_hash:txHash},accountId);
 try{const persisted=await api('wallet/broadcast',{token,method:'POST',body:{operation_id:operationId,tx_hash:txHash}});saveOperation(persisted,accountId);}catch(error){error.txHash=txHash;throw error;}return result;
}
export async function cancelPreparedWalletTransaction({token,operationId,accountId,preHandoffVerified=false}){const operation=await api('wallet/reject',{token,method:'POST',body:{operation_id:operationId,pre_handoff_verified:preHandoffVerified===true}});if(operation.status==='FAILED')clearOperation(operationId,accountId);else saveOperation(operation,accountId);return operation;}
export async function reconcileWalletTransaction({token,operationId,accountId}){const operation=await api('wallet/reconcile',{token,method:'POST',body:{operation_id:operationId}}),owner=accountId||operation?.payload?.signerId;if(['CONFIRMED','FAILED'].includes(operation.status))clearOperation(operationId,owner);else saveOperation(operation,owner);return operation;}
export async function restoreWalletOperations({token,accountId}){const recovered=[];for(const item of Object.values(pendingWalletOperations(accountId))){try{let operation=await api('operation?id='+encodeURIComponent(item.operation_id),{token});if(item.tx_hash&&!operation.tx_hash&&['SIGNING','UNKNOWN'].includes(operation.status)){try{operation=await api('wallet/broadcast',{token,method:'POST',body:{operation_id:item.operation_id,tx_hash:item.tx_hash}});}catch{saveOperation({...operation,tx_hash:item.tx_hash},accountId);recovered.push(operation);continue;}}saveOperation(operation,accountId);recovered.push(operation);}catch(error){if(error.status===404)clearOperation(item.operation_id,accountId);}}return recovered;}
export async function authenticateWallet(wallet,accountId){const challenge=await api('session/challenge',{method:'POST',body:{account:accountId}});if(!wallet.signMessage)throw Error('Wallet does not support NEP-413.');const signed=await wallet.signMessage({message:challenge.message,nonce:Uint8Array.from(atob(challenge.nonce),c=>c.charCodeAt(0)),recipient:challenge.recipient});return api('session/verify',{method:'POST',body:{...signed,challenge_id:challenge.id}});}
