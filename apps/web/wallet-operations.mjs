// Presentation-free wallet orchestration. Server-authorised handoff and wallet
// custody are mandatory; recovered session tokens are never signing authority.
export function createWalletOperations({
 request, getToken, getAccount, getWallet, prepareWalletTransaction,
 sendPreparedWalletTransaction, reconcileWalletTransaction, refresh=async()=>{}
}) {
 async function prepareCase(args) {
  const token=getToken(),accountId=getAccount();
  if(!token||!accountId)throw Error('Connect and authenticate a Testnet wallet before preparing a case.');
  const config=await request('config');
  if(config.network!=='testnet')throw Error('Testnet case creation is unavailable.');
  return (await prepareWalletTransaction({token,accountId,call:{
   method:'create_case',args,deposit:'1',receiverId:config.contract_account
  }})).operation;
 }
 async function signCall(method,args,deposit='0',preparedOperation=null) {
  const token=getToken(),accountId=getAccount(),wallet=getWallet();
  if(!token||!accountId)throw Error('Connect and authenticate a Testnet wallet before signing.');
  if(!wallet)throw Error('Reconnect the signing wallet. Session recovery alone cannot sign transactions.');
  const config=await request('config');
  if(config.network!=='testnet'||!config.external_wallet_signing_authorized)
   throw Error('Live Testnet wallet signing is disabled by the server authority gate.');
  const operation=preparedOperation||(await prepareWalletTransaction({token,accountId,call:{
   method,args,deposit,receiverId:config.contract_account
  }})).operation;
  try {
   const sent=await sendPreparedWalletTransaction(wallet,{token,operation});
   const reconciled=await reconcileWalletTransaction({token,accountId,operationId:operation.operation_id});
   await refresh();
   return {transaction_hash:sent?.transaction?.hash||sent?.transaction_outcome?.id||sent?.transactionHash,operation:reconciled};
  } catch(error) {
   throw Error(`${error.message} Operation ${operation.operation_id} is persisted. Inspect it in Settlement recovery before any retry.`);
  }
 }
 return {prepareCase,signCall};
}

export async function openAuthenticatedWallet({
 network='testnet',contractAccount,connectWallet,selectWalletAccount,authenticateWallet
}) {
 if(network!=='testnet')throw Error('Only a Testnet wallet may authenticate through this flow.');
 const connected=await connectWallet({network,contractAccount,authenticationAuthorized:true});
 const selected=selectWalletAccount(connected.accounts);
 const session=await authenticateWallet(connected.wallet,selected.accountId);
 return {wallet:connected.wallet,session};
}

export async function recoverWallet({token,accountId,recoverWalletSession,restoreWalletOperations}) {
 const session=await recoverWalletSession(token);
 await restoreWalletOperations({token,accountId:accountId||session.account});
 return session; // Never return an active signer; the original wallet must reconnect.
}
