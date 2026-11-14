const SESSION_KEY='contra-auth-session-v1';
const DRAFT_PREFIX='contra-workspace-draft-v1:';
const SENSITIVE=/(passphrase|password|signature|nonce|secret|token|private|seed|recovery)/i;

function available(storage){try{const key='__contra_storage_probe__';storage.setItem(key,'1');storage.removeItem(key);return true;}catch{return false;}}

export function readPersistentSession({persistent=localStorage,transient=sessionStorage,now=Date.now()}={}){
 let value=null;
 try{value=JSON.parse(persistent.getItem(SESSION_KEY)||'null');}catch{}
 if(!value){
  const token=transient?.getItem?.('contra-session'),expires=Number(transient?.getItem?.('contra-session-expires'))||0,account=transient?.getItem?.('contra-session-account');
  if(token)value={token,expires,account};
 }
 if(!value||typeof value.token!=='string'||!value.token||!Number.isFinite(Number(value.expires))||Number(value.expires)<=now){clearPersistentSession({persistent,transient});return null;}
 return {token:value.token,expires:Number(value.expires),account:typeof value.account==='string'?value.account:null};
}

export function writePersistentSession(session,{persistent=localStorage,transient=sessionStorage}={}){
 if(!session||typeof session.token!=='string'||!session.token||typeof session.account!=='string'||!session.account||!Number.isFinite(Number(session.expires)))throw Error('Persistent session is invalid');
 if(!available(persistent))throw Error('Browser storage is unavailable. Wallet authentication cannot be retained safely.');
 persistent.setItem(SESSION_KEY,JSON.stringify({token:session.token,account:session.account,expires:Number(session.expires)}));
 transient?.removeItem?.('contra-session');transient?.removeItem?.('contra-session-expires');transient?.removeItem?.('contra-session-account');
 return session;
}

export function clearPersistentSession({persistent=localStorage,transient=sessionStorage}={}){
 try{persistent?.removeItem?.(SESSION_KEY);}catch{}
 try{transient?.removeItem?.('contra-session');transient?.removeItem?.('contra-session-expires');transient?.removeItem?.('contra-session-account');}catch{}
}

function safeControl(control){
 const name=control?.name||control?.id||'';
 return name&&!SENSITIVE.test(name)&&!['password','file','hidden','submit','button'].includes(control.type)&&!control.disabled;
}
function draftKey({route,account,caseId}){return `${DRAFT_PREFIX}${account||'anonymous'}:${route||'overview'}:${caseId||'none'}`;}

export function saveWorkspaceDraft(root,context,{storage=localStorage}={}){
 if(!root||!available(storage))return false;
 const values={};
 for(const control of root.querySelectorAll('input,textarea,select')){
  if(!safeControl(control))continue;
  const name=control.name||control.id;
  values[name]=control.type==='checkbox'||control.type==='radio'?Boolean(control.checked):String(control.value??'');
 }
 try{storage.setItem(draftKey(context),JSON.stringify(values));return true;}catch{return false;}
}

export function restoreWorkspaceDraft(root,context,{storage=localStorage}={}){
 let values;try{values=JSON.parse(storage.getItem(draftKey(context))||'null');}catch{return false;}
 if(!values||typeof values!=='object'||Array.isArray(values))return false;
 for(const control of root.querySelectorAll('input,textarea,select')){
  if(!safeControl(control))continue;
  const name=control.name||control.id;if(!Object.hasOwn(values,name))continue;
  if(control.type==='checkbox'||control.type==='radio')control.checked=Boolean(values[name]);else control.value=String(values[name]);
 }
 return true;
}

export function clearWorkspaceDraft(context,{storage=localStorage}={}){try{storage.removeItem(draftKey(context));}catch{}}
