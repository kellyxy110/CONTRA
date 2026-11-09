import {DurableObject} from 'cloudflare:workers';

const HASH=/^[0-9a-f]{64}$/;
const TX_HASH=/^[1-9A-HJ-NP-Za-km-z]{32,60}$/;
const FINAL=new Set(['CONFIRMED','FAILED']);

function fail(message){throw new Error(message);}
function required(value,name){if(typeof value!=='string'||!value)fail(`${name} is required`);return value;}
function hash(value,name){if(!HASH.test(value||''))fail(`${name} must be a SHA-256 digest`);return value;}
function row(cursor){return cursor.toArray()[0]||null;}
function storageFailure(error){
 const message=error instanceof Error?error.message:String(error);
 if(message.includes('SQLITE_FULL'))return new Error('Cloudflare Free storage capacity reached; the write was rejected');
 return error;
}

async function sha256(bytes){
 const value=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);
 const digest=await crypto.subtle.digest('SHA-256',value);
 return [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
}

export class ContraState extends DurableObject{
 constructor(ctx,env){
  super(ctx,env);
  ctx.blockConcurrencyWhile(async()=>{
   this.ctx.storage.sql.exec(`
    CREATE TABLE IF NOT EXISTS operations(
      id TEXT PRIMARY KEY,account TEXT NOT NULL,payload_hash TEXT NOT NULL,
      contract_account TEXT NOT NULL,status TEXT NOT NULL,tx_hash TEXT UNIQUE,
      highest_block INTEGER NOT NULL DEFAULT 0,error TEXT,
      created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS operation_events(
      seq INTEGER PRIMARY KEY AUTOINCREMENT,operation_id TEXT NOT NULL,
      status TEXT NOT NULL,tx_hash TEXT,error TEXT,observed_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions(
      token_hash TEXT PRIMARY KEY,account TEXT NOT NULL,expires INTEGER NOT NULL,
      revoked INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS artifacts(
      digest TEXT PRIMARY KEY,media_type TEXT NOT NULL,size INTEGER NOT NULL,
      bytes BLOB NOT NULL,created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS chain_observations(
      singleton INTEGER PRIMARY KEY CHECK(singleton=1),network TEXT NOT NULL,
      contract_account TEXT NOT NULL,block_height INTEGER NOT NULL,
      block_hash TEXT NOT NULL,observed_at INTEGER NOT NULL
    );
   `);
  });
 }

 health(){
  const tables=this.ctx.storage.sql.exec("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('operations','sessions','artifacts','chain_observations') ORDER BY name").toArray();
  if(tables.length!==4)fail('Cloudflare durable storage schema is incomplete');
  return {storage:'cloudflare-durable-object-sqlite',integrity:'ok',schema_version:1,database_size:this.ctx.storage.sql.databaseSize,hosting_cost_ceiling_usd:0,automatic_paid_upgrade:false};
 }

 operation(id){return row(this.ctx.storage.sql.exec('SELECT * FROM operations WHERE id=?',id));}

 prepareOperation(input){
  const id=required(input?.id,'operation id'),account=required(input?.account,'account'),payloadHash=hash(input?.payload_hash,'payload hash'),contract=required(input?.contract_account,'contract account'),now=Date.now();
  const existing=this.operation(id);
  if(existing){
   if(existing.account!==account||existing.payload_hash!==payloadHash||existing.contract_account!==contract)fail('Operation identity conflict');
   return {...existing,replayed:true};
  }
  this.ctx.storage.sql.exec('INSERT INTO operations(id,account,payload_hash,contract_account,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?)',id,account,payloadHash,contract,'PREPARED',now,now);
  this.ctx.storage.sql.exec('INSERT INTO operation_events(operation_id,status,observed_at) VALUES(?,?,?)',id,'PREPARED',now);
  return {...this.operation(id),replayed:false};
 }

 handoffOperation(id){
  const operation=this.operation(id);if(!operation)fail('Operation not found');
  if(FINAL.has(operation.status)||operation.status==='UNKNOWN'||operation.status==='PENDING'||operation.status==='SIGNING')return {...operation,replayed:true};
  if(operation.status!=='PREPARED')fail('Operation cannot enter signing handoff');
  const now=Date.now();
  this.ctx.storage.sql.exec("UPDATE operations SET status='SIGNING',updated_at=? WHERE id=? AND status='PREPARED'",now,id);
  this.ctx.storage.sql.exec('INSERT INTO operation_events(operation_id,status,observed_at) VALUES(?,?,?)',id,'SIGNING',now);
  return {...this.operation(id),replayed:false};
 }

 attachTransactionHash(id,txHash){
  if(!TX_HASH.test(txHash||''))fail('Invalid NEAR transaction hash');
  const operation=this.operation(id);if(!operation)fail('Operation not found');
  if(operation.tx_hash&&operation.tx_hash!==txHash)fail('Operation transaction identity conflict');
  if(FINAL.has(operation.status))return {...operation,replayed:true};
  if(!['SIGNING','UNKNOWN','PENDING'].includes(operation.status))fail('Transaction hash can be attached only after signing handoff');
  const claimed=row(this.ctx.storage.sql.exec('SELECT id FROM operations WHERE tx_hash=? AND id<>?',txHash,id));if(claimed)fail('Transaction hash is already bound to another operation');
  const now=Date.now();
  this.ctx.storage.sql.exec("UPDATE operations SET tx_hash=?,status='PENDING',error=NULL,updated_at=? WHERE id=?",txHash,now,id);
  this.ctx.storage.sql.exec('INSERT INTO operation_events(operation_id,status,tx_hash,observed_at) VALUES(?,?,?,?)',id,'PENDING',txHash,now);
  return {...this.operation(id),replayed:operation.status==='PENDING'};
 }

 markUnknown(id,reason='Signing outcome is uncertain'){
  const operation=this.operation(id);if(!operation)fail('Operation not found');
  if(FINAL.has(operation.status))return {...operation,replayed:true};
  if(operation.status==='PREPARED')fail('A pre-handoff operation cannot be marked broadcast-unknown');
  const now=Date.now();
  this.ctx.storage.sql.exec("UPDATE operations SET status='UNKNOWN',error=?,updated_at=? WHERE id=?",reason,now,id);
  this.ctx.storage.sql.exec('INSERT INTO operation_events(operation_id,status,tx_hash,error,observed_at) VALUES(?,?,?,?,?)',id,'UNKNOWN',operation.tx_hash,reason,now);
  return {...this.operation(id),replayed:operation.status==='UNKNOWN'};
 }

 reconcileReceipt(input){
  const id=required(input?.id,'operation id'),operation=this.operation(id);if(!operation)fail('Operation not found');
  if(FINAL.has(operation.status))return {...operation,replayed:true};
  if(!operation.tx_hash||operation.tx_hash!==input.tx_hash)fail('Receipt transaction identity does not match the operation');
  if(input.network!=='testnet'||input.contract_account!==operation.contract_account)fail('Receipt network or contract identity mismatch');
  if(!Number.isSafeInteger(input.block_height)||input.block_height<=0||!TX_HASH.test(input.block_hash||''))fail('Final block identity is invalid');
  const prior=row(this.ctx.storage.sql.exec('SELECT * FROM chain_observations WHERE singleton=1'));
  if(prior&&(prior.network!==input.network||prior.contract_account!==input.contract_account||input.block_height<prior.block_height))fail('Final chain observation is stale or contradictory');
  const outcome=input.outcome,now=Date.now();
  if(!['SUCCESS','FAILURE'].includes(outcome)){
   this.ctx.storage.sql.exec("UPDATE operations SET status='UNKNOWN',error='Final receipt outcome is ambiguous',highest_block=?,updated_at=? WHERE id=?",input.block_height,now,id);
   this.ctx.storage.sql.exec('INSERT INTO operation_events(operation_id,status,tx_hash,error,observed_at) VALUES(?,?,?,?,?)',id,'UNKNOWN',operation.tx_hash,'Final receipt outcome is ambiguous',now);
   return this.operation(id);
  }
  this.ctx.storage.sql.exec('INSERT INTO chain_observations(singleton,network,contract_account,block_height,block_hash,observed_at) VALUES(1,?,?,?,?,?) ON CONFLICT(singleton) DO UPDATE SET network=excluded.network,contract_account=excluded.contract_account,block_height=excluded.block_height,block_hash=excluded.block_hash,observed_at=excluded.observed_at',input.network,input.contract_account,input.block_height,input.block_hash,now);
  const status=outcome==='SUCCESS'?'CONFIRMED':'FAILED';
  this.ctx.storage.sql.exec('UPDATE operations SET status=?,error=NULL,highest_block=?,updated_at=? WHERE id=?',status,input.block_height,now,id);
  this.ctx.storage.sql.exec('INSERT INTO operation_events(operation_id,status,tx_hash,observed_at) VALUES(?,?,?,?)',id,status,operation.tx_hash,now);
  return this.operation(id);
 }

 saveSession({token_hash,account,expires}){
  hash(token_hash,'session token hash');required(account,'account');if(!Number.isSafeInteger(expires)||expires<=Date.now())fail('Session expiry must be in the future');
  const existing=row(this.ctx.storage.sql.exec('SELECT * FROM sessions WHERE token_hash=?',token_hash));if(existing&&existing.account!==account)fail('Session token identity conflict');
  this.ctx.storage.sql.exec('INSERT INTO sessions(token_hash,account,expires,revoked) VALUES(?,?,?,0) ON CONFLICT(token_hash) DO UPDATE SET expires=excluded.expires,revoked=0',token_hash,account,expires);
  return {token_hash,account,expires,revoked:false};
 }

 session(tokenHash,account,now=Date.now()){
  if(!HASH.test(tokenHash||'')||typeof account!=='string')return null;
  const value=row(this.ctx.storage.sql.exec('SELECT * FROM sessions WHERE token_hash=? AND account=?',tokenHash,account));
  return !value||value.revoked||value.expires<=now?null:{...value,revoked:false};
 }

 revokeSession(tokenHash,account){
  this.ctx.storage.sql.exec('UPDATE sessions SET revoked=1 WHERE token_hash=? AND account=?',tokenHash,account);
  return {revoked:true};
 }

 async putArtifact({digest,bytes,media_type='application/octet-stream'}){
  hash(digest,'artifact digest');const value=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes||[]);if(!value.length||value.length>1_000_000)fail('Artifact size is invalid');
  if(await sha256(value)!==digest)fail('Artifact digest does not match bytes');
  const existing=row(this.ctx.storage.sql.exec('SELECT digest,size,media_type FROM artifacts WHERE digest=?',digest));
  if(existing){if(existing.size!==value.length||existing.media_type!==media_type)fail('Artifact identity conflict');return {...existing,replayed:true};}
  try{this.ctx.storage.sql.exec('INSERT INTO artifacts(digest,media_type,size,bytes,created_at) VALUES(?,?,?,?,?)',digest,media_type,value.length,value,Date.now());}
  catch(error){throw storageFailure(error);}
  return {digest,media_type,size:value.length,replayed:false};
 }

 async readArtifact(digest){
  hash(digest,'artifact digest');const value=row(this.ctx.storage.sql.exec('SELECT * FROM artifacts WHERE digest=?',digest));if(!value)fail('Artifact not found');
  const bytes=new Uint8Array(value.bytes);if(await sha256(bytes)!==digest)fail('Stored artifact integrity failure');return {...value,bytes};
 }
}

function json(body,status=200){return Response.json(body,{status,headers:{'Cache-Control':'no-store'}});}

export default{
 async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/api/live')return json({live:true,runtime:'cloudflare-workers',deployment_authorised:false});
  if(url.pathname==='/api/ready'){
   try{return json({ready:true,...await env.CONTRA_STATE.getByName('contra-testnet').health(),network:'testnet'});}
   catch(error){console.error(JSON.stringify({message:'durable storage unavailable',error:error instanceof Error?error.message:String(error)}));return json({ready:false,error:'Durable storage unavailable; no transaction is confirmed'},503);}
  }
  if(url.pathname.startsWith('/api/'))return json({error:'Cloudflare API migration incomplete; this route is unavailable and no transaction is confirmed'},503);
  return env.ASSETS.fetch(request);
 }
};
