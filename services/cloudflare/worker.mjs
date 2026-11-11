import {DurableObject} from 'cloudflare:workers';
import {rpcAdapter} from '../chain/rpc.mjs';
import {validateWalletCall,verifyReceiptIntent,receiptState} from '../wallet/lifecycle.mjs';
import {assessCreatorEligibility} from '../deployment/creator-eligibility.mjs';

const HASH=/^[0-9a-f]{64}$/;
const TX_HASH=/^[1-9A-HJ-NP-Za-km-z]{32,60}$/;
const FINAL=new Set(['CONFIRMED','FAILED']);
const ACCOUNT=/^(?=.{2,64}$)[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const READS=new Set(['get_config','get_case','get_round','get_committee','get_reviewer','get_creation','get_events','get_payout','list_cases','list_reviewers','preview_case']);

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

function base58(value){
 const alphabet='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';let number=0n;
 for(const character of value){const index=alphabet.indexOf(character);if(index<0)fail('Invalid base58 value');number=number*58n+BigInt(index);}
 const bytes=[];while(number){bytes.unshift(Number(number&255n));number>>=8n;}for(const character of value){if(character!=='1')break;bytes.unshift(0);}return new Uint8Array(bytes);
}

export async function verifyEd25519(publicKey,signature,message){
 if(typeof publicKey!=='string'||!publicKey.startsWith('ed25519:'))return false;
 try{const raw=base58(publicKey.slice(8));if(raw.length!==32)return false;const key=await crypto.subtle.importKey('raw',raw,{name:'Ed25519'},false,['verify']);return crypto.subtle.verify('Ed25519',key,signature,message);}catch{return false;}
}

function concat(...values){const length=values.reduce((sum,value)=>sum+value.length,0),out=new Uint8Array(length);let offset=0;for(const value of values){out.set(value,offset);offset+=value.length;}return out;}
function u32(value){const bytes=new Uint8Array(4);new DataView(bytes.buffer).setUint32(0,value,true);return bytes;}
function borshString(value){const bytes=new TextEncoder().encode(value);return concat(u32(bytes.length),bytes);}
export function nep413Bytes({message,nonce,recipient,callbackUrl}){const raw=Uint8Array.from(atob(nonce),character=>character.charCodeAt(0));if(raw.length!==32)fail('Invalid nonce');return concat(u32(2147484061),borshString(message),raw,borshString(recipient),callbackUrl?concat(new Uint8Array([1]),borshString(callbackUrl)):new Uint8Array([0]));}

export class ContraState extends DurableObject{
 constructor(ctx,env){
  super(ctx,env);
  ctx.blockConcurrencyWhile(async()=>{
   this.ctx.storage.sql.exec(`
    CREATE TABLE IF NOT EXISTS operations(
      id TEXT PRIMARY KEY,account TEXT NOT NULL,payload_hash TEXT NOT NULL,
      contract_account TEXT NOT NULL,status TEXT NOT NULL,tx_hash TEXT UNIQUE,
      payload_json TEXT,highest_block INTEGER NOT NULL DEFAULT 0,error TEXT,
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
    CREATE TABLE IF NOT EXISTS challenges(
      id TEXT PRIMARY KEY,account TEXT NOT NULL,nonce TEXT NOT NULL,message TEXT NOT NULL,
      recipient TEXT NOT NULL,expires INTEGER NOT NULL,used INTEGER NOT NULL DEFAULT 0
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
    CREATE TABLE IF NOT EXISTS records(
      digest TEXT PRIMARY KEY,kind TEXT NOT NULL,case_id TEXT,account TEXT NOT NULL,
      body TEXT NOT NULL,created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS case_links(
      case_id TEXT NOT NULL,digest TEXT NOT NULL,account TEXT NOT NULL,kind TEXT NOT NULL,
      created_at INTEGER NOT NULL,PRIMARY KEY(case_id,digest,kind)
    );
    CREATE TABLE IF NOT EXISTS provider_budgets(
      provider TEXT PRIMARY KEY,cap_micro_usd INTEGER NOT NULL,reserved_micro_usd INTEGER NOT NULL DEFAULT 0,
      used_micro_usd INTEGER NOT NULL DEFAULT 0,updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS provider_jobs(
      id TEXT PRIMARY KEY,idempotency_key TEXT UNIQUE NOT NULL,provider TEXT NOT NULL,account TEXT NOT NULL,
      case_id TEXT NOT NULL,payload_digest TEXT NOT NULL,reservation_micro_usd INTEGER NOT NULL,
      status TEXT NOT NULL,response_digest TEXT,error TEXT,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS provider_events(
      seq INTEGER PRIMARY KEY AUTOINCREMENT,job_id TEXT NOT NULL,status TEXT NOT NULL,
      response_digest TEXT,error TEXT,observed_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reviewer_invitations(
      digest TEXT PRIMARY KEY,reviewer_id TEXT NOT NULL,operator_id TEXT NOT NULL,committee TEXT NOT NULL,
      slot INTEGER NOT NULL,status TEXT NOT NULL,body TEXT NOT NULL,expires INTEGER NOT NULL,created_at INTEGER NOT NULL,
      UNIQUE(committee,slot),UNIQUE(reviewer_id),UNIQUE(operator_id)
    );
    CREATE TABLE IF NOT EXISTS reviewer_events(
      seq INTEGER PRIMARY KEY AUTOINCREMENT,invitation_digest TEXT NOT NULL,reviewer_id TEXT NOT NULL,
      status TEXT NOT NULL,body TEXT NOT NULL,observed_at INTEGER NOT NULL
    );
   `);
   const now=Date.now();
   for(const [provider,cap] of [['meta',3000000],['baseten',3000000],['modal',5000000]])this.ctx.storage.sql.exec('INSERT OR IGNORE INTO provider_budgets(provider,cap_micro_usd,updated_at) VALUES(?,?,?)',provider,cap,now);
  });
 }

 health(){
  const tables=this.ctx.storage.sql.exec("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('operations','sessions','challenges','artifacts','chain_observations','records','case_links','provider_budgets','provider_jobs','provider_events','reviewer_invitations','reviewer_events') ORDER BY name").toArray();
  if(tables.length!==12)fail('Cloudflare durable storage schema is incomplete');
  return {storage:'cloudflare-durable-object-sqlite',integrity:'ok',schema_version:3,database_size:this.ctx.storage.sql.databaseSize,hosting_cost_ceiling_usd:0,automatic_paid_upgrade:false};
 }

 operation(id){return row(this.ctx.storage.sql.exec('SELECT * FROM operations WHERE id=?',id));}

 prepareOperation(input){
  const id=required(input?.id,'operation id'),account=required(input?.account,'account'),payloadHash=hash(input?.payload_hash,'payload hash'),contract=required(input?.contract_account,'contract account'),now=Date.now();
  const existing=this.operation(id);
  if(existing){
   if(existing.account!==account||existing.payload_hash!==payloadHash||existing.contract_account!==contract)fail('Operation identity conflict');
   return {...existing,replayed:true};
  }
  const payload=input.payload?JSON.stringify(input.payload):null;
  this.ctx.storage.sql.exec('INSERT INTO operations(id,account,payload_hash,contract_account,status,payload_json,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)',id,account,payloadHash,contract,'PREPARED',payload,now,now);
  this.ctx.storage.sql.exec('INSERT INTO operation_events(operation_id,status,observed_at) VALUES(?,?,?)',id,'PREPARED',now);
  return {...this.operation(id),replayed:false};
 }

 rejectOperation(id,preHandoffVerified=false){
  const operation=this.operation(id);if(!operation)fail('Operation not found');
  if(FINAL.has(operation.status))return {...operation,replayed:true};
  if(operation.status!=='PREPARED'||preHandoffVerified!==true)return this.markUnknown(id,'Wallet rejection cannot rule out broadcast after signing handoff');
  const now=Date.now();this.ctx.storage.sql.exec("UPDATE operations SET status='FAILED',error='Verified rejection before signing handoff',updated_at=? WHERE id=?",now,id);
  this.ctx.storage.sql.exec('INSERT INTO operation_events(operation_id,status,error,observed_at) VALUES(?,?,?,?)',id,'FAILED','Verified rejection before signing handoff',now);
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

 sessionByToken(tokenHash,now=Date.now()){
  if(!HASH.test(tokenHash||''))return null;const value=row(this.ctx.storage.sql.exec('SELECT * FROM sessions WHERE token_hash=?',tokenHash));
  return !value||value.revoked||value.expires<=now?null:{...value,revoked:false};
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

 saveChallenge(challenge){
  required(challenge?.id,'challenge id');required(challenge?.account,'account');required(challenge?.nonce,'nonce');required(challenge?.recipient,'recipient');
  if(!Number.isSafeInteger(challenge.expires)||challenge.expires<=Date.now())fail('Challenge expiry must be in the future');
  this.ctx.storage.sql.exec('INSERT INTO challenges(id,account,nonce,message,recipient,expires) VALUES(?,?,?,?,?,?)',challenge.id,challenge.account,challenge.nonce,challenge.message,challenge.recipient,challenge.expires);
  return challenge;
 }

 consumeChallenge(id,account){
  const value=row(this.ctx.storage.sql.exec('SELECT * FROM challenges WHERE id=?',id));
  if(!value||value.used||value.expires<=Date.now()||value.account!==account)fail('Expired, used or mismatched challenge');
  const changed=this.ctx.storage.sql.exec('UPDATE challenges SET used=1 WHERE id=? AND used=0 AND expires>? RETURNING id',id,Date.now()).toArray();
  if(changed.length!==1)fail('Challenge replay');return value;
 }

 challenge(id,account){
  const value=row(this.ctx.storage.sql.exec('SELECT * FROM challenges WHERE id=?',id));
  return !value||value.used||value.expires<=Date.now()||value.account!==account?null:value;
 }

 recordChainObservation(input){
  if(input.network!=='testnet'||!Number.isSafeInteger(Number(input.block_height))||!TX_HASH.test(input.block_hash||''))fail('Invalid chain observation');
  const height=Number(input.block_height),prior=row(this.ctx.storage.sql.exec('SELECT * FROM chain_observations WHERE singleton=1'));
  if(prior&&height<prior.block_height)fail('Final chain observation is stale or contradictory');
  this.ctx.storage.sql.exec('INSERT INTO chain_observations(singleton,network,contract_account,block_height,block_hash,observed_at) VALUES(1,?,?,?,?,?) ON CONFLICT(singleton) DO UPDATE SET network=excluded.network,contract_account=excluded.contract_account,block_height=excluded.block_height,block_hash=excluded.block_hash,observed_at=excluded.observed_at',input.network,input.contract_account,height,input.block_hash,Date.now());
  return row(this.ctx.storage.sql.exec('SELECT * FROM chain_observations WHERE singleton=1'));
 }

 async saveRecord({kind,case_id=null,account,body}){
  required(kind,'record kind');required(account,'account');const text=JSON.stringify(body),bytes=new TextEncoder().encode(text),digest=await sha256(bytes);
  await this.putArtifact({digest,bytes,media_type:'application/json'});
  const existing=row(this.ctx.storage.sql.exec('SELECT * FROM records WHERE digest=?',digest));
  if(existing&&existing.account!==account)fail('Record identity conflict');
  this.ctx.storage.sql.exec('INSERT OR IGNORE INTO records(digest,kind,case_id,account,body,created_at) VALUES(?,?,?,?,?,?)',digest,kind,case_id,account,text,Date.now());
  if(case_id)this.ctx.storage.sql.exec('INSERT OR IGNORE INTO case_links(case_id,digest,account,kind,created_at) VALUES(?,?,?,?,?)',case_id,digest,account,kind,Date.now());
  return {digest,kind,case_id,account,body,replayed:!!existing};
 }

 records({kind=null,case_id=null,account=null}={}){
  let sql='SELECT * FROM records WHERE 1=1',args=[];if(kind){sql+=' AND kind=?';args.push(kind);}if(case_id){sql+=' AND case_id=?';args.push(case_id);}if(account){sql+=' AND account=?';args.push(account);}sql+=' ORDER BY created_at';
  return this.ctx.storage.sql.exec(sql,...args).toArray().map(value=>({...value,body:JSON.parse(value.body)}));
 }

 reserveProviderJob(input){
  const provider=required(input?.provider,'provider'),key=required(input?.idempotency_key,'idempotency key'),account=required(input?.account,'account'),caseId=hash(input?.case_id,'case id'),payloadDigest=hash(input?.payload_digest,'payload digest'),reservation=Number(input?.reservation_micro_usd);
  if(!['meta','baseten','modal'].includes(provider)||!Number.isSafeInteger(reservation)||reservation<=0)fail('Provider reservation is invalid');
  const existing=row(this.ctx.storage.sql.exec('SELECT * FROM provider_jobs WHERE idempotency_key=?',key));
  if(existing){if(existing.provider!==provider||existing.account!==account||existing.case_id!==caseId||existing.payload_digest!==payloadDigest||existing.reservation_micro_usd!==reservation)fail('Provider idempotency conflict');return {...existing,replayed:true};}
  const budget=row(this.ctx.storage.sql.exec('SELECT * FROM provider_budgets WHERE provider=?',provider));if(!budget||budget.reserved_micro_usd+budget.used_micro_usd+reservation>budget.cap_micro_usd)fail('Provider budget exhausted');
  const id=crypto.randomUUID(),now=Date.now();
  this.ctx.storage.sql.exec('UPDATE provider_budgets SET reserved_micro_usd=reserved_micro_usd+?,updated_at=? WHERE provider=?',reservation,now,provider);
  this.ctx.storage.sql.exec('INSERT INTO provider_jobs(id,idempotency_key,provider,account,case_id,payload_digest,reservation_micro_usd,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)',id,key,provider,account,caseId,payloadDigest,reservation,'RESERVED',now,now);
  this.ctx.storage.sql.exec('INSERT INTO provider_events(job_id,status,observed_at) VALUES(?,?,?)',id,'RESERVED',now);return {...row(this.ctx.storage.sql.exec('SELECT * FROM provider_jobs WHERE id=?',id)),replayed:false};
 }

 completeProviderJob({id,response_digest,actual_micro_usd}){
  const job=row(this.ctx.storage.sql.exec('SELECT * FROM provider_jobs WHERE id=?',id));if(!job)fail('Provider job not found');if(job.status==='PROPOSED')return {...job,replayed:true};if(job.status!=='RESERVED')fail('Provider job cannot complete from its current state');
  hash(response_digest,'provider response digest');const actual=Number(actual_micro_usd);if(!Number.isSafeInteger(actual)||actual<0||actual>job.reservation_micro_usd)fail('Provider usage exceeds its reservation');const now=Date.now();
  this.ctx.storage.sql.exec('UPDATE provider_budgets SET reserved_micro_usd=reserved_micro_usd-?,used_micro_usd=used_micro_usd+?,updated_at=? WHERE provider=?',job.reservation_micro_usd,actual,now,job.provider);
  this.ctx.storage.sql.exec("UPDATE provider_jobs SET status='PROPOSED',response_digest=?,updated_at=? WHERE id=?",response_digest,now,id);this.ctx.storage.sql.exec('INSERT INTO provider_events(job_id,status,response_digest,observed_at) VALUES(?,?,?,?)',id,'PROPOSED',response_digest,now);return {...row(this.ctx.storage.sql.exec('SELECT * FROM provider_jobs WHERE id=?',id)),replayed:false};
 }

 unknownProviderJob(id,reason='Provider outcome is uncertain'){
  const job=row(this.ctx.storage.sql.exec('SELECT * FROM provider_jobs WHERE id=?',id));if(!job)fail('Provider job not found');if(['PROPOSED','UNKNOWN'].includes(job.status))return {...job,replayed:true};const now=Date.now();this.ctx.storage.sql.exec("UPDATE provider_jobs SET status='UNKNOWN',error=?,updated_at=? WHERE id=?",reason,now,id);this.ctx.storage.sql.exec('INSERT INTO provider_events(job_id,status,error,observed_at) VALUES(?,?,?,?)',id,'UNKNOWN',reason,now);return {...row(this.ctx.storage.sql.exec('SELECT * FROM provider_jobs WHERE id=?',id)),replayed:false};
 }

 providerState(account){return {budgets:this.ctx.storage.sql.exec('SELECT * FROM provider_budgets ORDER BY provider').toArray(),jobs:this.ctx.storage.sql.exec('SELECT * FROM provider_jobs WHERE account=? ORDER BY created_at',account).toArray()};}

 async createReviewerInvitation(input){
  const digest=hash(input?.digest,'invitation digest'),reviewer=required(input?.reviewer_id,'reviewer id'),operator=hash(input?.operator_id,'operator id'),committee=input?.committee,slot=Number(input?.slot),expires=Number(input?.expires),now=Date.now();
  if(!ACCOUNT.test(reviewer)||!['primary','fresh'].includes(committee)||!Number.isInteger(slot)||slot<1||slot>3||!Number.isSafeInteger(expires)||expires<=now)fail('Reviewer invitation is invalid');
  const body=canonical(input.body||{}),calculated=await textHash(body);if(calculated!==digest)fail('Reviewer invitation digest does not match its body');
  const existing=row(this.ctx.storage.sql.exec('SELECT * FROM reviewer_invitations WHERE digest=?',digest));if(existing)return {...existing,replayed:true};
  this.ctx.storage.sql.exec('INSERT INTO reviewer_invitations(digest,reviewer_id,operator_id,committee,slot,status,body,expires,created_at) VALUES(?,?,?,?,?,?,?,?,?)',digest,reviewer,operator,committee,slot,'INVITED',body,expires,now);this.ctx.storage.sql.exec('INSERT INTO reviewer_events(invitation_digest,reviewer_id,status,body,observed_at) VALUES(?,?,?,?,?)',digest,reviewer,'INVITED',body,now);return {...row(this.ctx.storage.sql.exec('SELECT * FROM reviewer_invitations WHERE digest=?',digest)),replayed:false};
 }

 respondReviewer({digest,reviewer_id,status,body}){
  const invitation=row(this.ctx.storage.sql.exec('SELECT * FROM reviewer_invitations WHERE digest=?',digest));if(!invitation||invitation.reviewer_id!==reviewer_id)fail('Reviewer invitation not found');if(invitation.expires<=Date.now())fail('Reviewer invitation expired');if(!['CONSENTED','WITHDRAWN'].includes(status))fail('Reviewer response is invalid');if(invitation.status==='WITHDRAWN'||invitation.status==='FROZEN')fail('Reviewer invitation is immutable in its current state');const now=Date.now(),encoded=canonical(body||{});this.ctx.storage.sql.exec('UPDATE reviewer_invitations SET status=? WHERE digest=?',status,digest);this.ctx.storage.sql.exec('INSERT INTO reviewer_events(invitation_digest,reviewer_id,status,body,observed_at) VALUES(?,?,?,?,?)',digest,reviewer_id,status,encoded,now);return row(this.ctx.storage.sql.exec('SELECT * FROM reviewer_invitations WHERE digest=?',digest));
 }

 reviewerLifecycle(reviewerId){return {invitations:this.ctx.storage.sql.exec('SELECT * FROM reviewer_invitations WHERE reviewer_id=? ORDER BY created_at',reviewerId).toArray(),events:this.ctx.storage.sql.exec('SELECT * FROM reviewer_events WHERE reviewer_id=? ORDER BY seq',reviewerId).toArray()};}

 async backup(){
  const tables=['operations','operation_events','sessions','challenges','artifacts','chain_observations','records','case_links','provider_budgets','provider_jobs','provider_events','reviewer_invitations','reviewer_events'],data={};
  for(const table of tables)data[table]=this.ctx.storage.sql.exec(`SELECT * FROM ${table} ORDER BY rowid`).toArray().map(value=>Object.fromEntries(Object.entries(value).map(([key,item])=>[key,item instanceof ArrayBuffer||ArrayBuffer.isView(item)?btoa(String.fromCharCode(...new Uint8Array(item instanceof ArrayBuffer?item:item.buffer))):item])));
  const payload={schema:'CONTRA_CLOUDFLARE_BACKUP_V1',created_at:new Date().toISOString(),tables:data},digest=await textHash(canonical(payload));return {...payload,digest};
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

function json(body,status=200,headers={}){return Response.json(body,{status,headers:{'Cache-Control':'no-store',...headers}});}
function canonical(value){if(Array.isArray(value))return `[${value.map(canonical).join(',')}]`;if(value&&typeof value==='object')return `{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;return JSON.stringify(value);}
function randomBase64(bytes=32){const value=new Uint8Array(bytes);crypto.getRandomValues(value);return btoa(String.fromCharCode(...value));}
function token(){return `${crypto.randomUUID()}${crypto.randomUUID()}`.replaceAll('-','');}
async function textHash(value){return sha256(new TextEncoder().encode(value));}
async function body(request){
 const length=Number(request.headers.get('content-length')||0);if(length>1_000_000)fail('Request body exceeds the one-megabyte application limit');
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))fail('JSON content type required');
 return request.json();
}
function rpc(env){return rpcAdapter({url:env.NEAR_RPC_URL,contractAccount:env.CONTRA_CONTRACT_ACCOUNT,network:'testnet',timeoutMs:Number(env.CONTRA_RPC_TIMEOUT_MS||8000)});}
function state(env){return env.CONTRA_STATE.getByName('contra-testnet');}
async function session(request,env){
 const raw=request.headers.get('authorization')?.replace(/^Bearer /,'');if(!raw)fail('Authentication required');
 const value=await state(env).sessionByToken(await textHash(raw));if(!value)fail('Session expired or unavailable');return {raw,...value};
}
function assertOrigin(request,env){
 if(['GET','HEAD','OPTIONS'].includes(request.method))return;
 const expected=env.CONTRA_PUBLIC_ORIGIN;if(!expected)fail('Public origin is not configured');
 const origin=request.headers.get('origin');if(origin!==expected)fail('Origin is not authorised');
}
async function chainCase(adapter,caseId){if(!HASH.test(caseId||''))fail('Invalid case id');return adapter.view('get_case',{case_id:caseId});}
function participant(record,account){return record?.creator_id===account||record?.terms?.beneficiary_id===account||[...(record?.terms?.primary_committee||[]),...(record?.terms?.fresh_committee||[])].some(item=>item.reviewer_id===account);}
function party(record,account){return record?.creator_id===account||record?.terms?.beneficiary_id===account;}
function appointed(record,account,roundId){const committee=roundId===0?record?.terms?.primary_committee:roundId===1?record?.terms?.fresh_committee:[];return committee.some(item=>item.reviewer_id===account);}
async function authorisedCase(adapter,caseId,account){const record=await chainCase(adapter,caseId);if(!participant(record,account))fail('Account is not authorised for this case');return record;}
function publicError(error){
 const message=error instanceof Error?error.message:String(error);
 if(/Authentication|Session/.test(message))return [401,message];
 if(/authorised|appointed|Creator admission|signing is disabled/.test(message))return [403,message];
 if(/not found/i.test(message))return [404,message];
 if(/conflict|stale|replay|UNKNOWN/.test(message))return [409,message];
 if(/unavailable|RPC|storage|capacity|configured/.test(message))return [503,message];
 return [400,message];
}

async function api(request,env){
 const url=new URL(request.url),store=state(env),adapter=rpc(env),path=url.pathname;
 if(path==='/api/live'){if(request.method!=='GET')fail('Operational probes are read-only');return json({service:'CONTRA',live:true,runtime:'cloudflare-workers',observed_at:new Date().toISOString()});}
 if(path==='/api/ready'||path==='/api/health'){
  if(request.method!=='GET')fail('Operational probes are read-only');
  const storage=await store.health(),chain=await adapter.health(),ready=chain.status==='ready'&&chain.source?.stale===false;
  if(ready)await store.recordChainObservation({network:'testnet',contract_account:env.CONTRA_CONTRACT_ACCOUNT,block_height:Number(chain.source.block_height),block_hash:chain.source.block_hash});
  const response={ready,storage,chain,network:'testnet',contract_account:env.CONTRA_CONTRACT_ACCOUNT,live_signing_authorised:false};
  return json(response,path==='/api/ready'&&!ready?503:200);
 }
 if(path==='/api/config'){
  const config=await adapter.view('get_config',{}),eligibility=assessCreatorEligibility(config);
  return json({network:'testnet',contract_account:env.CONTRA_CONTRACT_ACCOUNT,external_wallet_enabled:false,external_wallet_preparation_enabled:true,external_wallet_signing_authorized:false,providers:[],hosting:{plan:'cloudflare-free',cost_ceiling_usd:0,automatic_paid_upgrade:false},creator_eligibility:eligibility});
 }
 if(path==='/api/session/sandbox')return json({error:'Sandbox sessions are unavailable in the testnet Worker'},403);
 if(path==='/api/session/challenge'&&request.method==='POST'){
  const input=await body(request);if(!ACCOUNT.test(input.account||''))fail('Invalid account');
  const id=crypto.randomUUID(),expires=Date.now()+120000,recipient=new URL(env.CONTRA_PUBLIC_ORIGIN).host,challenge={id,account:input.account,nonce:randomBase64(),recipient,expires};
  challenge.message=`Sign in to CONTRA The Bench. Account: ${input.account}. Challenge: ${id}. Expires: ${expires}. This does not authorize a transaction.`;
  return json(await store.saveChallenge(challenge),201);
 }
 if(path==='/api/session/verify'&&request.method==='POST'){
  const input=await body(request),challenge=await store.challenge(input.challenge_id,input.accountId);if(!challenge)fail('Expired, used or mismatched challenge');
  const digest=await crypto.subtle.digest('SHA-256',nep413Bytes(challenge)),signature=Uint8Array.from(atob(input.signature||''),char=>char.charCodeAt(0));
  const valid=await verifyEd25519(input.publicKey,signature,digest);
  if(!valid||!await adapter.hasAccessKey(input.accountId,input.publicKey))fail('Signature or account ownership invalid');
  await store.consumeChallenge(input.challenge_id,input.accountId);const raw=token(),expires=Date.now()+3600000;await store.saveSession({token_hash:await textHash(raw),account:input.accountId,expires});return json({token:raw,account:input.accountId,expires});
 }
 if(path==='/api/session'&&request.method==='GET'){const auth=await session(request,env);return json({account:auth.account,expires:auth.expires,reconnect_required:false});}
 if(path==='/api/session/renew'&&request.method==='POST'){const auth=await session(request,env),raw=token(),expires=Date.now()+3600000;await store.revokeSession(await textHash(auth.raw),auth.account);await store.saveSession({token_hash:await textHash(raw),account:auth.account,expires});return json({token:raw,account:auth.account,expires});}
 if(path==='/api/session/disconnect'&&request.method==='POST'){const auth=await session(request,env);await store.revokeSession(await textHash(auth.raw),auth.account);return json({disconnected:true});}
 if(path==='/api/view'&&request.method==='POST'){const input=await body(request);if(!READS.has(input.method))fail('Unknown view method');return json(input.envelope?await adapter.viewWithMeta(input.method,input.args||{}):await adapter.view(input.method,input.args||{}));}
 if(path==='/api/template'&&request.method==='GET'){await session(request,env);return json({config:await adapter.view('get_config',{}),source:'contract',note:'Case-specific immutable deadlines are established by preview_case and create_case.'});}
 if(path==='/api/receipt'&&request.method==='POST'){const auth=await session(request,env),input=await body(request);return json(await adapter.receipt(input.tx_hash,auth.account));}
 if(path==='/api/transaction')return json({error:'Server-side transaction dispatch is disabled on the Cloudflare testnet runtime'},403);
 if(path==='/api/wallet/prepare'&&request.method==='POST'){
  const auth=await session(request,env),input=await body(request),config=await adapter.view('get_config',{}),call=input.call;
  let caseRecord=null,previewRecord=null,configRecord=config;
  if(call?.args?.case_id)caseRecord=await chainCase(adapter,call.args.case_id);
  if(call?.method==='create_case')previewRecord=await adapter.view('preview_case',{creator_id:auth.account,request_id:call.args.request_id,terms:call.args.terms});
  if(call?.method==='confirm_reviewer')configRecord=await adapter.view('get_reviewer',{reviewer_id:auth.account});
  const payload=validateWalletCall({network:'testnet',contractAccount:env.CONTRA_CONTRACT_ACCOUNT,signerId:auth.account,call,caseRecord,configRecord,previewRecord});
  const operation=await store.prepareOperation({id:input.operation_id,account:auth.account,payload_hash:payload.payload_hash,contract_account:env.CONTRA_CONTRACT_ACCOUNT,payload});return json(operation,201);
 }
 if(path==='/api/wallet/handoff')return json({error:'Live wallet signing is disabled pending creator-eligibility remediation and separate authority'},403);
 if(path==='/api/wallet/reject'&&request.method==='POST'){const auth=await session(request,env),input=await body(request),operation=await store.operation(input.operation_id);if(operation?.account!==auth.account)fail('Operation not found');return json(await store.rejectOperation(input.operation_id,input.pre_handoff_verified===true));}
 if(path==='/api/wallet/interrupt'&&request.method==='POST'){const auth=await session(request,env),input=await body(request),operation=await store.operation(input.operation_id);if(operation?.account!==auth.account)fail('Operation not found');return json(await store.markUnknown(input.operation_id,input.reason));}
 if(path==='/api/wallet/broadcast'&&request.method==='POST'){const auth=await session(request,env),input=await body(request),operation=await store.operation(input.operation_id);if(operation?.account!==auth.account)fail('Operation not found');return json(await store.attachTransactionHash(input.operation_id,input.tx_hash));}
 if(path==='/api/wallet/reconcile'&&request.method==='POST'){
  const auth=await session(request,env),input=await body(request),operation=await store.operation(input.operation_id);if(operation?.account!==auth.account)fail('Operation not found');
  const receipt=await adapter.receipt(operation.tx_hash,auth.account),payload=JSON.parse(operation.payload_json);verifyReceiptIntent(receipt,payload,{expectedHash:operation.tx_hash});const result=receiptState(receipt);
  return json(await store.reconcileReceipt({id:operation.id,tx_hash:operation.tx_hash,network:'testnet',contract_account:env.CONTRA_CONTRACT_ACCOUNT,outcome:result.status==='CONFIRMED'?'SUCCESS':result.status==='FAILED'?'FAILURE':'UNKNOWN',block_height:Number(receipt.finalized_block_height),block_hash:receipt.finalized_block_hash}));
 }
 if(path==='/api/operation'&&request.method==='GET'){const auth=await session(request,env),operation=await store.operation(url.searchParams.get('id'));if(!operation||operation.account!==auth.account)fail('Operation not found');return json(operation);}
 if(path==='/api/terms'&&request.method==='POST'){const auth=await session(request,env),input=await body(request),config=await adapter.view('get_config',{});if(!assessCreatorEligibility(config).eligible_creators.includes(auth.account))fail('Creator admission unavailable');return json(await store.saveRecord({kind:'terms',account:auth.account,body:{text:required(input.text,'terms text')}}),201);}
 if(['/api/evidence','/api/finding','/api/counterexample','/api/reviewer/disclosure'].includes(path)&&request.method==='POST'){
  const auth=await session(request,env),input=await body(request),caseId=input.case_id||null;let caseRecord=null;
  if(caseId)caseRecord=await authorisedCase(adapter,caseId,auth.account);
  if((path==='/api/evidence'||path==='/api/counterexample')&&!party(caseRecord,auth.account))fail('Only a case party may store this artifact');
  if(path==='/api/finding'&&(![0,1].includes(input.round_id)||!appointed(caseRecord,auth.account,input.round_id)))fail('Only an appointed reviewer may store a finding');
  const kind=path.split('/').at(-1),record=await store.saveRecord({kind,case_id:caseId,account:auth.account,body:input});return json(record,201);
 }
 if(path==='/api/reviewer/package'&&request.method==='POST'){const auth=await session(request,env),input=await body(request),record=await authorisedCase(adapter,input.case_id,auth.account);if(![0,1].includes(input.round_id)||!appointed(record,auth.account,input.round_id))fail('Only an appointed reviewer may store a recovery package');return json(await store.saveRecord({kind:'reviewer-package',case_id:input.case_id,account:auth.account,body:input}),201);}
 if(path==='/api/reviewer/package'&&request.method==='GET'){const auth=await session(request,env),caseId=url.searchParams.get('case_id'),roundId=Number(url.searchParams.get('round_id')),record=await authorisedCase(adapter,caseId,auth.account);if(!appointed(record,auth.account,roundId))fail('Only an appointed reviewer may recover this package');const items=await store.records({kind:'reviewer-package',case_id:caseId,account:auth.account});if(!items.length)fail('Reviewer package not found');return json(items.at(-1));}
 if(path==='/api/evidence/manifests'||path==='/api/reviewer/control'||path==='/api/reviewer/workspace'||path==='/api/availability'){
  const auth=await session(request,env),caseId=url.searchParams.get('case_id');const record=await authorisedCase(adapter,caseId,auth.account);
  if(path==='/api/evidence/manifests')return json({case_id:caseId,onchain_digest:record.evidence_digest||null,items:await store.records({kind:'evidence',case_id:caseId})});
  if(path==='/api/availability')return json({case_id:caseId,observed_at:new Date().toISOString(),items:(await store.records({case_id:caseId})).map(item=>({digest:item.digest,kind:item.kind,available:true}))});
  return json({case:record,round_id:url.searchParams.get('round_id'),records:await store.records({case_id:caseId}),source:'contract-and-durable-storage'});
 }
 if(path==='/api/reviewer/disclosures'){await session(request,env);return json({items:await store.records({kind:'disclosure'}),independence:'Operator independence requires separately controlled signed accounts.'});}
 if(path==='/api/reviewer/audit'){const auth=await session(request,env);return json({reviewer_id:auth.account,items:await store.records({account:auth.account})});}
 if(path==='/api/reviewer/invitations'&&request.method==='POST'){
  const auth=await session(request,env);if(auth.account!=='contra-creator.testnet')fail('Only the authorised creator may issue reviewer invitations');const input=await body(request);return json(await store.createReviewerInvitation(input),201);
 }
 if(path==='/api/reviewer/invitations'&&request.method==='GET'){const auth=await session(request,env);return json(await store.reviewerLifecycle(auth.account));}
 if(path==='/api/reviewer/respond'&&request.method==='POST'){
  const auth=await session(request,env),input=await body(request);if(input.reviewer_id!==auth.account)fail('Reviewer response account does not match the authenticated NEP-413 identity');return json(await store.respondReviewer(input));
 }
 if(path==='/api/artifact'&&request.method==='GET'){const auth=await session(request,env),caseId=url.searchParams.get('case_id');await authorisedCase(adapter,caseId,auth.account);const value=await store.readArtifact(url.searchParams.get('digest'));return json({digest:value.digest,media_type:value.media_type,text:new TextDecoder().decode(value.bytes)});}
 if(path==='/api/provider/jobs'&&request.method==='POST'){
  const auth=await session(request,env),input=await body(request);await authorisedCase(adapter,input.case_id,auth.account);
  if(input.mode!=='fixture'||env.CONTRA_PROVIDER_FIXTURES_ENABLED!=='true')return json({error:'Live and paid provider execution is disabled; deterministic fixtures are not enabled in production'},403);
  const payloadDigest=await textHash(canonical(input.payload)),job=await store.reserveProviderJob({provider:input.provider,idempotency_key:input.idempotency_key,account:auth.account,case_id:input.case_id,payload_digest:payloadDigest,reservation_micro_usd:input.reservation_micro_usd});
  if(job.replayed)return json(job);const record=await store.saveRecord({kind:'provider-proposal',case_id:input.case_id,account:auth.account,body:{provider:input.provider,payload_digest:payloadDigest,output:input.fixture_output,status:'AI proposed',binding_authority:false}});return json(await store.completeProviderJob({id:job.id,response_digest:record.digest,actual_micro_usd:0}),201);
 }
 if(path==='/api/provider/jobs'&&request.method==='GET'){const auth=await session(request,env);return json(await store.providerState(auth.account));}
 if(path==='/api/evaluate')return json({error:'Use the authenticated provider jobs API. Live and paid execution remains disabled.'},403);
 return json({error:'API route or method is not supported by the Cloudflare runtime'},404);
}

export default{
 async fetch(request,env){
  const url=new URL(request.url),requestId=crypto.randomUUID();
  try{
   if(url.pathname.startsWith('/api/')){assertOrigin(request,env);const response=await api(request,env);console.log(JSON.stringify({message:'request complete',request_id:requestId,path:url.pathname,method:request.method,status:response.status}));return response;}
   return env.ASSETS.fetch(request);
  }catch(error){const [status,message]=publicError(error);console.error(JSON.stringify({message:'request failed',request_id:requestId,path:url.pathname,status,error:message}));return json({error:message,request_id:requestId},status);}
 }
};
