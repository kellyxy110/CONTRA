const CAPS=Object.freeze({meta:3,modal:5});

function enabled(value){return value==='1'||value==='true';}
function allowedEndpoint(provider,value){
 if(!value)return false;
 try{
  const url=new URL(value);
  if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)return false;
  if(provider==='meta')return url.hostname==='api.meta.ai'&&url.pathname==='/v1/chat/completions';
  return provider==='modal'&&url.hostname.endsWith('.modal.run')&&(url.pathname==='/'||url.pathname.length>1);
 }catch{return false;}
}

export function cloudflareProviderReadiness(env){
 return Object.fromEntries(Object.entries(CAPS).map(([provider,cap])=>{
  const prefix=provider.toUpperCase();
  const endpoint=provider==='modal'?env.MODAL_FUNCTION_ENDPOINT:env[`${prefix}_API_BASE_URL`];
  const model=provider==='modal'?env.MODAL_FUNCTION_ID:env[`${prefix}_MODEL`];
  const secretPresent=provider==='modal'?Boolean(env.MODAL_PROXY_KEY&&env.MODAL_PROXY_SECRET):Boolean(env[`${prefix}_API_KEY`]);
  const gates={
   credential_installed:secretPresent,
   endpoint_allowed:allowedEndpoint(provider,endpoint),
   model_verified:enabled(env[`${prefix}_MODEL_VERIFIED`]),
   account_access_verified:enabled(env[`${prefix}_ACCOUNT_VERIFIED`]),
   credits_verified:enabled(env[`${prefix}_CREDITS_VERIFIED`]),
   pricing_verified:enabled(env[`${prefix}_PRICING_VERIFIED`]),
   billing_limit_verified:enabled(env[`${prefix}_BILLING_LIMIT_VERIFIED`]),
   server_budget_verified:enabled(env[`${prefix}_SERVER_BUDGET_VERIFIED`]),
   owner_spend_authorised:enabled(env[`${prefix}_SPEND_AUTHORISED`]),
   live_enabled:enabled(env[`${prefix}_LIVE_ENABLED`])
  };
  const spendControl=gates.billing_limit_verified||gates.server_budget_verified;
  const ready=Object.entries(gates).every(([name,value])=>name==='billing_limit_verified'||name==='server_budget_verified'?true:Boolean(value))&&spendControl;
  return [provider,{status:ready?'READY':secretPresent?'GATED':'CREDENTIALS_PENDING',model:model||null,endpoint_configured:Boolean(endpoint),programme_ceiling_usd:cap,gates}];
 }));
}

