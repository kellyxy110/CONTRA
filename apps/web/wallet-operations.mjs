// Presentation-free wallet orchestration. Server-authorised handoff and wallet
// custody are mandatory; recovered session tokens are never signing authority.
export function createWalletOperations({
 request, getToken, getAccount, getWallet, prepareWalletTransaction,
 sendPreparedWalletTransaction, reconcileWalletTransaction, refresh=async()=>{}
}) {
 function stableOperationId(method,args,accountId){
  const anchor=args?.case_id||args?.request_id||args?.reviewer_id||args?.disclosure_digest||'operation';
  const base=`contra-${method}-${String(anchor).replace(/[^a-zA-Z0-9-]/g,'').slice(0,24)}`;
  if(!['commit_vote','reveal_vote'].includes(method))return base;
  const reviewer=String(accountId||'reviewer').replace(/[^a-zA-Z0-9-]/g,'-').slice(0,24);
  return `${base}-${reviewer}-r${args.round_id}`;
 }
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
  const scopedReviewerConfirmation=method==='confirm_reviewer'&&config.reviewer_confirmation_signing_authorized===true;
  if(config.network!=='testnet')throw Error('Live Testnet wallet signing is unavailable on this network.');
  const operation=preparedOperation||(await prepareWalletTransaction({token,accountId,operationId:stableOperationId(method,args,accountId),call:{
   method,args,deposit,receiverId:config.contract_account
  }})).operation;
  if(!config.external_wallet_signing_authorized&&!scopedReviewerConfirmation)
   throw Error(`Operation ${operation.operation_id} is prepared but signing is disabled by the server authority gate. No transaction was released.`);
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
 network='testnet',contractAccount,connectWallet,selectWalletAccount,authenticateWallet,walletId,connector
}) {
 if(network!=='testnet')throw Error('Only a Testnet wallet may authenticate through this flow.');
 const connected=await connectWallet({network,contractAccount,authenticationAuthorized:true,walletId,connector});
 const selected=selectWalletAccount(connected.accounts);
 const session=await authenticateWallet(connected.wallet,selected.accountId);
 return {wallet:connected.wallet,session:{...session,account:session.account||selected.accountId}};
}

export async function recoverWallet({token,accountId,recoverWalletSession,restoreWalletOperations}) {
 const session=await recoverWalletSession(token);
 await restoreWalletOperations({token,accountId:accountId||session.account});
 return session; // Never return an active signer; the original wallet must reconnect.
}
