import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Store,ApiError} from './store.mjs';
import {verifySession} from './auth.mjs';
import {evaluate,providerConfig} from '../evaluators/provider.mjs';
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const mutations=new Set(['create_case','accept_terms','cancel_case','fund_case','submit_evidence','advance_round','commit_vote','reveal_vote','file_challenge','finalize_case','retry_payout','confirm_reviewer','set_reviewer','sponsor_storage']);
const reads=new Set(['get_case','list_cases','get_round','get_events','list_reviewers','get_reviewer','get_committee','get_creation','get_payout','get_config','preview_case']);
export function createApp({store=new Store(path.join(ROOT,'.data')),chain=null,config=providerConfig(),sandbox=false}={}){
 const json=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value,(_,v)=>typeof v==='bigint'?v.toString():v));};
 const server=http.createServer(async(req,res)=>{try{
  const u=new URL(req.url,'http://localhost');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  if(u.pathname.startsWith('/api/')){
   if(!['GET','POST'].includes(req.method))throw new ApiError(405,'Method not allowed');
   if(req.method==='POST'&&req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)throw new ApiError(403,'Cross-origin write rejected');
   let body={};if(req.method==='POST'){const chunks=[];let n=0;for await(const chunk of req){n+=chunk.length;if(n>1_000_000)throw new ApiError(413,'Request too large');chunks.push(chunk);}try{body=JSON.parse(Buffer.concat(chunks).toString()||'{}');}catch{throw new ApiError(400,'Invalid JSON');}}
   const account=store.account(req.headers.authorization?.replace(/^Bearer /,''));
   const authenticated=()=>{if(!account)throw new ApiError(401,'Connect and authenticate an account');return account;};
   const connected=()=>{if(!chain)throw new ApiError(503,'NEAR Sandbox unavailable. No chain state or transaction result is being simulated.');};
   const record=async(id)=>{connected();const c=await chain.view('get_case',{case_id:id});if(!c)throw new ApiError(404,'Case not found');return c;};
   const authorized=c=>{const a=authenticated();if(a!==c.creator_id&&a!==c.terms.beneficiary_id&&![...c.terms.primary_committee,...c.terms.fresh_committee].some(r=>r.reviewer_id===a))throw new ApiError(403,'Account is not a case participant');return a;};
   if(u.pathname==='/api/health')return json(res,200,{service:'CONTRA',chain:chain?'connected':'unavailable',network:chain?(sandbox?'sandbox':'testnet'):null,contract_account:chain?.contract?.accountId||null,paid_inference:Object.values(config).some(c=>c.available),implementation_started:'2026-10-28',independence:sandbox?'Sandbox accounts controlled by one process; not independent operators':'Pilot operator independence requires disclosures'});
   if(u.pathname==='/api/config')return json(res,200,{network:sandbox?'sandbox':null,external_wallet_enabled:false,accounts:sandbox&&chain?chain.accounts.map(a=>a.accountId):[],providers:Object.values(config).map(c=>({name:c.name,available:c.available})),budgets:store.budgets()});
   if(u.pathname==='/api/session/sandbox'&&req.method==='POST'){connected();if(!sandbox||!chain.accounts.some(a=>a.accountId===body.account))throw new ApiError(403,'Local sandbox account required');return json(res,200,{token:store.session(body.account),account:body.account});}
   if(u.pathname==='/api/session/challenge'&&req.method==='POST'){connected();if(!/^[a-z0-9._-]{2,64}$/.test(body.account||''))throw new ApiError(400,'Invalid account');return json(res,200,store.challenge(body.account,req.headers.host));}
   if(u.pathname==='/api/session/verify'&&req.method==='POST'){connected();if(!chain.hasAccessKey)throw new ApiError(503,'Wallet authentication unavailable');return json(res,200,{token:await verifySession(store,body,chain.hasAccessKey)});}
   if(u.pathname==='/api/view'&&req.method==='POST'){connected();if(!reads.has(body.method))throw new ApiError(400,'Unknown view method');return json(res,200,await chain.view(body.method,body.args||{}));}
   if(u.pathname==='/api/transaction'&&req.method==='POST'){connected();authenticated();if(!mutations.has(body.method))throw new ApiError(400,'Unknown transaction method');if(!sandbox)throw new ApiError(403,'External wallet must sign its own transaction');if(!/^\d+$/.test(body.deposit||'0'))throw new ApiError(400,'Invalid attached deposit');const receipt=await chain.call(account,body.method,body.args||{},body.deposit||'0');store.receipt(receipt);return json(res,200,receipt);}
   if(u.pathname==='/api/evidence'&&req.method==='POST'){const c=await record(body.case_id),actor=authorized(c);if(typeof body.text!=='string'||!body.text.trim())throw new ApiError(400,'Text evidence required');const blob=store.put(Buffer.from(body.text),'text/plain');store.link(body.case_id,blob.digest,actor,'evidence');return json(res,201,{...blob,onchain:false,note:'Stored immutably; submit digest in a separate signed transaction.'});}
   if(u.pathname==='/api/terms'&&req.method==='POST'){connected();const actor=authenticated(),cfg=await chain.view('get_config',{});if(!cfg.creator_allowlist.includes(actor))throw new ApiError(403,'Creator admission required');if(typeof body.text!=='string'||!body.text.trim())throw new ApiError(400,'Terms text required');return json(res,201,store.put(Buffer.from(body.text),'text/plain'));}
   if(u.pathname==='/api/artifact'){const c=await record(u.searchParams.get('case_id'));authorized(c);const digest=u.searchParams.get('digest');if(!store.links(c.case_id).some(l=>l.digest===digest))throw new ApiError(404,'Artifact not linked to case');const b=store.read(digest);return json(res,200,{digest,text:b.bytes.toString('utf8')});}
   if(u.pathname==='/api/evaluate'&&req.method==='POST'){const c=await record(body.case_id),actor=authorized(c);if(![0,1].includes(body.round_id))throw new ApiError(400,'Invalid round');return json(res,200,await evaluate({store,config,actor,caseRecord:c,round_id:body.round_id,role:body.role,key:body.key}));}
   throw new ApiError(404,'Endpoint not found');
  }
  if(req.method!=='GET')throw new ApiError(405,'Method not allowed');
  let file;if(u.pathname.startsWith('/design/ux3a/'))file=path.join(ROOT,u.pathname);else if(u.pathname.startsWith('/packages/protocol/'))file=path.join(ROOT,u.pathname);else file=path.join(ROOT,'apps/web',u.pathname==='/'?'index.html':u.pathname);
  const allowed=[path.join(ROOT,'apps/web')+path.sep,path.join(ROOT,'design/ux3a')+path.sep,path.join(ROOT,'packages/protocol')+path.sep];if(!allowed.some(p=>file.startsWith(p)))throw new ApiError(403,'Path rejected');const ext=path.extname(file);const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf'};if(!types[ext])throw new ApiError(404,'Not found');const data=await fs.promises.readFile(file);res.writeHead(200,{'Content-Type':types[ext]});res.end(data);
 }catch(e){json(res,e.status|| (e.code==='ENOENT'?404:502),{error:e.status?e.message:'Service operation failed; no successful transaction is implied.'});}});
 return {server,store};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){let chain=null;if(process.env.CONTRA_SANDBOX==='1'){const {startSandbox}=await import('../chain/sandbox.mjs');chain=await startSandbox();}const app=createApp({chain,sandbox:!!chain});app.server.listen(Number(process.env.PORT||4173),'0.0.0.0',()=>console.log('CONTRA http://localhost:'+(process.env.PORT||4173)+' - '+(chain?'NEAR Sandbox':'chain unavailable')));for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{app.server.close();app.store.close();await chain?.close();process.exit();});}
