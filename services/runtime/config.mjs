import path from 'node:path';

const ACCOUNT_ID=/^(?=.{2,64}$)[a-z0-9]+(?:[._-][a-z0-9]+)*$/;

function integer(value,name,{minimum,maximum}){
 const parsed=Number(value);
 if(!Number.isSafeInteger(parsed)||parsed<minimum||parsed>maximum)throw Error(`${name} must be an integer from ${minimum} to ${maximum}`);
 return parsed;
}

function url(value,name,{https=false}={}){
 let parsed;
 try{parsed=new URL(value);}catch{throw Error(`${name} must be an absolute URL`);}
 if(!['http:','https:'].includes(parsed.protocol))throw Error(`${name} must use HTTP or HTTPS`);
 if(https&&parsed.protocol!=='https:'&&!['127.0.0.1','localhost','[::1]'].includes(parsed.hostname))throw Error(`${name} must use HTTPS outside localhost`);
 parsed.username='';parsed.password='';parsed.hash='';parsed.search='';
 return parsed.toString().replace(/\/$/,'');
}

export function loadRuntimeConfig(env=process.env,{root=process.cwd()}={}){
 const legacySandbox=env.CONTRA_SANDBOX==='1';
 const mode=env.CONTRA_CHAIN_MODE|| (legacySandbox?'sandbox':'unavailable');
 if(!['sandbox','testnet','unavailable'].includes(mode))throw Error('CONTRA_CHAIN_MODE must be sandbox, testnet or unavailable');
 if(legacySandbox&&mode!=='sandbox')throw Error('CONTRA_SANDBOX conflicts with CONTRA_CHAIN_MODE');
 const dataDir=path.resolve(env.CONTRA_DATA_DIR||path.join(root,'.data'));
 if(dataDir===path.parse(dataDir).root||dataDir===path.resolve(root))throw Error('CONTRA_DATA_DIR must be a dedicated directory');
 const publicOrigin=env.CONTRA_PUBLIC_ORIGIN?url(env.CONTRA_PUBLIC_ORIGIN,'CONTRA_PUBLIC_ORIGIN',{https:mode==='testnet'}):null;
 const allowedOrigins=(env.CONTRA_ALLOWED_ORIGINS||'').split(',').map(v=>v.trim()).filter(Boolean).map(v=>url(v,'CONTRA_ALLOWED_ORIGINS',{https:mode==='testnet'}));
 const base={mode,dataDir,publicOrigin,allowedOrigins,port:integer(env.PORT||4173,'PORT',{minimum:1,maximum:65535}),host:env.HOST||'127.0.0.1'};
 if(mode!=='testnet')return base;
 const rpcUrl=url(env.CONTRA_RPC_URL||'','CONTRA_RPC_URL',{https:true});
 const contractAccount=env.CONTRA_CONTRACT_ACCOUNT||'';
 if(!ACCOUNT_ID.test(contractAccount)||!contractAccount.endsWith('.testnet'))throw Error('CONTRA_CONTRACT_ACCOUNT must be a valid testnet account');
 return {...base,rpcUrl,contractAccount,rpcTimeoutMs:integer(env.CONTRA_RPC_TIMEOUT_MS||10000,'CONTRA_RPC_TIMEOUT_MS',{minimum:1000,maximum:60000}),staleAfterMs:integer(env.CONTRA_STALE_AFTER_MS||120000,'CONTRA_STALE_AFTER_MS',{minimum:10000,maximum:3600000})};
}
