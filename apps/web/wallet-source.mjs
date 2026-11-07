import {setupWalletSelector} from '@near-wallet-selector/core';
import {setupMyNearWallet} from '@near-wallet-selector/my-near-wallet';
export async function connectWallet({network,contractAccount,authorized}){
 if(network!=='testnet'||authorized!==true)throw Error('Testnet wallet use requires separate owner authorization.');
 const selector=await setupWalletSelector({network:'testnet',modules:[setupMyNearWallet()]});
 const wallet=await selector.wallet('my-near-wallet');await wallet.signIn({contractId:contractAccount,methodNames:[]});return {selector,wallet};
}
export async function sendContractTransaction(wallet,{receiverId,methodName,args,deposit='0'}){return wallet.signAndSendTransaction({receiverId,actions:[{type:'FunctionCall',params:{methodName,args,gas:'100000000000000',deposit}}]});}
export async function authenticateWallet(wallet,accountId){const challenge=await fetch('/api/session/challenge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({account:accountId})}).then(r=>r.json());if(challenge.error)throw Error(challenge.error);if(!wallet.signMessage)throw Error('Wallet does not support NEP-413.');const signed=await wallet.signMessage({message:challenge.message,nonce:Uint8Array.from(atob(challenge.nonce),c=>c.charCodeAt(0)),recipient:challenge.recipient});const response=await fetch('/api/session/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...signed,challenge_id:challenge.id})});const result=await response.json();if(!response.ok)throw Error(result.error);return result;}
