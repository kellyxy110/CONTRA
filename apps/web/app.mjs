import {authenticateWallet,connectWallet,disconnectWalletSession,recoverWalletSession,selectWalletAccount} from './wallet.bundle.js';
const byId=id=>document.getElementById(id),show=(id,value)=>{byId(id).textContent=typeof value==='string'?value:JSON.stringify(value,null,2);};
let wallet=null,token=sessionStorage.getItem('contra-session'),account=sessionStorage.getItem('contra-account');
async function request(path,options={}){const headers={...(options.headers||{})};if(token)headers.Authorization=`Bearer ${token}`;const response=await fetch(`/api/${path}`,{...options,headers}),result=await response.json();if(!response.ok)throw Error(result.error||`HTTP ${response.status}`);return result;}
async function refresh(){const [live,ready]=await Promise.all([request('live'),request('ready').catch(error=>({ready:false,error:error.message}))]);show('status',{live,ready});}
function controls(){byId('disconnect').disabled=!token;byId('check-session').disabled=!token;show('session',token?{account,authenticated:true}:{authenticated:false});}
byId('refresh').addEventListener('click',()=>refresh().catch(error=>show('status',error.message)));
byId('connect').addEventListener('click',async()=>{try{const connected=await connectWallet({network:'testnet',contractAccount:'contra-contestation.testnet',authenticationAuthorized:true}),selected=selectWalletAccount(connected.accounts);wallet=connected.wallet;const session=await authenticateWallet(wallet,selected.accountId);token=session.token;account=session.account;sessionStorage.setItem('contra-session',token);sessionStorage.setItem('contra-account',account);controls();}catch(error){show('session',error.message);}});
byId('disconnect').addEventListener('click',async()=>{try{await disconnectWalletSession({token,wallet});}finally{wallet=null;token=null;account=null;sessionStorage.removeItem('contra-session');sessionStorage.removeItem('contra-account');controls();}});
byId('check-session').addEventListener('click',async()=>{try{show('api-result',await recoverWalletSession(token));}catch(error){show('api-result',error.message);}});
controls();await refresh().catch(error=>show('status',error.message));
