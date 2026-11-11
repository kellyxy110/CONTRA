import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import http from 'node:http';
import {Store,sha256} from '../services/api/store.mjs';
import {rpcAdapter} from '../services/chain/rpc.mjs';
import {loadRuntimeConfig} from '../services/runtime/config.mjs';
import {createApp} from '../services/api/server.mjs';
import {RateLimiter} from '../services/api/rate-limit.mjs';

function directory(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'contra-m05-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;}
function response(result,{ok=true,status=200}={}){return new Response(JSON.stringify(result),{status:ok?status:status||503,headers:{'Content-Type':'application/json'}});}

test('runtime configuration has explicit unavailable, Sandbox and validated testnet modes',t=>{
 const root=directory(t);
 assert.equal(loadRuntimeConfig({},{root}).mode,'unavailable');
 assert.equal(loadRuntimeConfig({CONTRA_CHAIN_MODE:'sandbox'},{root}).mode,'sandbox');
 const config=loadRuntimeConfig({CONTRA_CHAIN_MODE:'testnet',CONTRA_RPC_URL:'https://rpc.testnet.near.org',CONTRA_CONTRACT_ACCOUNT:'contra.testnet',CONTRA_DATA_DIR:path.join(root,'durable')},{root});
 assert.equal(config.contractAccount,'contra.testnet');assert.equal(config.rpcUrl,'https://rpc.testnet.near.org');
 assert.throws(()=>loadRuntimeConfig({CONTRA_CHAIN_MODE:'testnet',CONTRA_RPC_URL:'https://rpc.testnet.near.org',CONTRA_CONTRACT_ACCOUNT:'contra.near'},{root}),/testnet account/);
 assert.throws(()=>loadRuntimeConfig({CONTRA_CHAIN_MODE:'mainnet'},{root}),/sandbox, testnet or unavailable/);
 assert.throws(()=>loadRuntimeConfig({CONTRA_CHAIN_MODE:'testnet',CONTRA_RPC_URL:'http://public.invalid',CONTRA_CONTRACT_ACCOUNT:'contra.testnet'},{root}),/HTTPS/);
});

test('testnet RPC adapter validates network and contract then returns finalized metadata',async()=>{
 const blockTime='1794020400000000000',calls=[],transport=async(_url,options)=>{const request=JSON.parse(options.body);calls.push(request);if(request.method==='status')return response({jsonrpc:'2.0',result:{chain_id:'testnet',sync_info:{syncing:false},version:{version:'TEST'}}});if(request.method==='query'&&request.params.request_type==='view_account')return response({jsonrpc:'2.0',result:{code_hash:'DEPLOYED',block_height:42,block_hash:'BLOCK42'}});if(request.method==='query'&&request.params.request_type==='call_function')return response({jsonrpc:'2.0',result:{result:[...Buffer.from(JSON.stringify({state:'Funded'}))],block_height:42,block_hash:'BLOCK42'}});if(request.method==='block')return response({jsonrpc:'2.0',result:{header:{height:42,hash:'BLOCK42',timestamp_nanosec:blockTime}}});throw Error('Unexpected RPC request');},now=()=>new Date(Number(BigInt(blockTime)/1_000_000n)+1000),rpc=rpcAdapter({url:'https://rpc.testnet.near.org',contractAccount:'contra.testnet',transport,now,staleAfterMs:120000});
 const startup=await rpc.validate();assert.equal(startup.network,'testnet');assert.equal(startup.block_height,'42');
 const envelope=await rpc.viewWithMeta('get_case',{case_id:'case'});assert.equal(envelope.value.state,'Funded');assert.equal(envelope.source.finality,'final');assert.equal(envelope.source.block_timestamp_ns,blockTime);assert.equal(envelope.source.stale,false);assert(calls.some(call=>call.method==='status'));assert(calls.some(call=>call.method==='query'&&call.params.request_type==='view_account'));
});

test('testnet RPC adapter rejects wrong networks, undeployed accounts and stale health',async()=>{
 const transport=async(_url,options)=>{const request=JSON.parse(options.body);if(request.method==='status')return response({jsonrpc:'2.0',result:{chain_id:'mainnet',sync_info:{syncing:false}}});throw Error('Unexpected request');};
 await assert.rejects(rpcAdapter({url:'https://rpc.testnet.near.org',contractAccount:'contra.testnet',transport}).validate(),/network mismatch/);
 const noCode=async(_url,options)=>{const request=JSON.parse(options.body);if(request.method==='status')return response({jsonrpc:'2.0',result:{chain_id:'testnet',sync_info:{syncing:false}}});if(request.method==='query')return response({jsonrpc:'2.0',result:{code_hash:'11111111111111111111111111111111'}});throw Error('Unexpected request');};
 await assert.rejects(rpcAdapter({url:'https://rpc.testnet.near.org',contractAccount:'contra.testnet',transport:noCode}).validate(),/no deployed contract/);
});

test('RPC failure is explicit and finalized receipt inspection never promotes pending or failed results',async()=>{
 const unavailable=rpcAdapter({url:'https://rpc.testnet.near.org',contractAccount:'contra.testnet',transport:async()=>{throw Error('offline');}});assert.equal((await unavailable.health()).status,'unavailable');
 const hash='11111111111111111111111111111111',timestamp=String(BigInt(Date.now())*1_000_000n);for(const [execution,status,expected]of [['NONE',{SuccessValue:''},'PENDING'],['FINAL',{Failure:{error_message:'failed'}},'FAILED'],['FINAL',{SuccessValue:''},'CONFIRMED']]){const rpc=rpcAdapter({url:'https://rpc.testnet.near.org',contractAccount:'contra.testnet',transport:async(_url,options)=>{const request=JSON.parse(options.body);if(request.method==='tx')return response({jsonrpc:'2.0',result:{final_execution_status:execution,status,transaction:{hash,signer_id:'alice.testnet',receiver_id:'contra.testnet',actions:[]},transaction_outcome:{block_hash:'BLOCK42'}}});if(request.method==='block')return response({jsonrpc:'2.0',result:{header:{height:42,hash:'BLOCK42',timestamp_nanosec:timestamp}}});throw Error('Unexpected RPC request');}}),receipt=await rpc.receipt(hash,'alice.testnet');assert.equal(receipt.status,expected);assert.equal(receipt.success,expected==='CONFIRMED');}
});

test('finalized RPC receipt requires explicit recognised success and matching transaction identity',async()=>{
 const hash='11111111111111111111111111111111',timestamp=String(BigInt(Date.now())*1_000_000n),outcome=status=>({final_execution_status:'FINAL',status,transaction:{hash,signer_id:'alice.testnet',receiver_id:'contra.testnet',actions:[]},transaction_outcome:{block_hash:'BLOCK42'}}),run=async result=>rpcAdapter({url:'https://rpc.testnet.near.org',contractAccount:'contra.testnet',transport:async(_url,options)=>{const request=JSON.parse(options.body);if(request.method==='tx')return response({jsonrpc:'2.0',result});if(request.method==='block')return response({jsonrpc:'2.0',result:{header:{height:42,hash:'BLOCK42',timestamp_nanosec:timestamp}}});throw Error('Unexpected RPC request');}}).receipt(hash,'alice.testnet');
 assert.equal((await run(outcome({SuccessValue:''}))).status,'CONFIRMED');assert.equal((await run(outcome({SuccessReceiptId:'22222222222222222222222222222222'}))).status,'CONFIRMED');assert.equal((await run(outcome({Failure:{error_message:'failed'}}))).status,'FAILED');assert.equal((await run(outcome({Unknown:'value'}))).status,'UNKNOWN');assert.equal((await run({...outcome({SuccessValue:''}),status:undefined})).status,'UNKNOWN');assert.equal((await run({...outcome({SuccessValue:''}),final_execution_status:'EXECUTED'})).status,'PENDING');
 for(const transaction of [{signer_id:'alice.testnet',receiver_id:'contra.testnet',actions:[]},{hash:'',signer_id:'alice.testnet',receiver_id:'contra.testnet',actions:[]},{hash:'not-a-near-hash',signer_id:'alice.testnet',receiver_id:'contra.testnet',actions:[]},{hash:'22222222222222222222222222222222',signer_id:'alice.testnet',receiver_id:'contra.testnet',actions:[]}])await assert.rejects(run({...outcome({SuccessValue:''}),transaction}),/hash/);
 await assert.rejects(run({...outcome({SuccessValue:''}),transaction:{hash,signer_id:'mallory.testnet',receiver_id:'contra.testnet',actions:[]}}),/signer or contract/);await assert.rejects(run({...outcome({SuccessValue:''}),transaction:{hash,signer_id:'alice.testnet',receiver_id:'other.testnet',actions:[]}}),/signer or contract/);
 await assert.rejects(run({final_execution_status:'FINAL',status:{SuccessValue:''}}),/incomplete/);
});

test('finalized RPC receipt rejects contradictory block identity and regressed height',async()=>{
 const hash='11111111111111111111111111111111',timestamp=String(BigInt(Date.now())*1_000_000n),result=height=>({final_execution_status:'FINAL',status:{SuccessValue:''},transaction:{hash,signer_id:'alice.testnet',receiver_id:'contra.testnet',actions:[]},transaction_outcome:{block_hash:'BLOCK'+height}});let height=43,wrongHash=false;const rpc=rpcAdapter({url:'https://rpc.testnet.near.org',contractAccount:'contra.testnet',transport:async(_url,options)=>{const request=JSON.parse(options.body);if(request.method==='tx')return response({jsonrpc:'2.0',result:result(height)});if(request.method==='block')return response({jsonrpc:'2.0',result:{header:{height,hash:wrongHash?'OTHER':'BLOCK'+height,timestamp_nanosec:timestamp}}});throw Error('Unexpected RPC request');}});assert.equal((await rpc.receipt(hash,'alice.testnet')).status,'CONFIRMED');height=42;const regressed=await rpc.receipt(hash,'alice.testnet');assert.equal(regressed.regressed,true);assert.equal(regressed.stale,true);assert.equal(regressed.status,'UNKNOWN');assert.equal(regressed.success,false);wrongHash=true;await assert.rejects(rpc.receipt(hash,'alice.testnet'),/block identity/);
});

test('lower finalized block heights are marked stale as RPC regression or index lag',async()=>{
 let height=43;const timestamp=String(BigInt(Date.now())*1_000_000n),transport=async(_url,options)=>{const request=JSON.parse(options.body);if(request.method==='query')return response({jsonrpc:'2.0',result:{result:[...Buffer.from('{}')],block_height:height,block_hash:'BLOCK'+height}});if(request.method==='block')return response({jsonrpc:'2.0',result:{header:{height,hash:'BLOCK'+height,timestamp_nanosec:timestamp}}});throw Error('Unexpected request');},rpc=rpcAdapter({url:'https://rpc.testnet.near.org',contractAccount:'contra.testnet',transport,staleAfterMs:120000});assert.equal((await rpc.viewWithMeta('get_case')).source.stale,false);height=42;const lagged=await rpc.viewWithMeta('get_case');assert.equal(lagged.source.regressed,true);assert.equal(lagged.source.stale,true);
});

test('SQLite migrations, object integrity and interrupted operation recovery survive restart',t=>{
 const dir=directory(t);let store=new Store(dir),blob=store.put(Buffer.from('durable evidence'),'text/plain'),attempt=store.beginTx('restart-operation','alice.testnet',{method:'fund_case'});store.updateTx(attempt.id,'BROADCAST',{tx_hash:'HASH'});assert.equal(store.audit().schema_version,5);store.close();
 store=new Store(dir);assert.equal(store.read(blob.digest).bytes.toString(),'durable evidence');assert.equal(store.recoverInterrupted().locked,1);const recovered=store.tx('restart-operation','alice.testnet');assert.equal(recovered.status,'UNKNOWN');assert.equal(recovered.tx_hash,'HASH');assert.match(recovered.error,/restarted/);assert.equal(store.beginTx('restart-operation','alice.testnet',{method:'fund_case'}).replayed,true);store.close();
});

test('offline durable-volume backup restores SQLite and content-addressed objects',t=>{
 const source=directory(t),restore=directory(t);let store=new Store(source),blob=store.put(Buffer.from('backup evidence'),'text/plain');store.link('case-a',blob.digest,'alice.testnet','evidence-source');const prepared=store.prepareBackup();assert.equal(prepared.checkpointed,true);store.close();fs.cpSync(source,restore,{recursive:true,force:true});store=new Store(restore);assert.equal(store.audit().integrity,'ok');assert.equal(store.read(blob.digest).bytes.toString(),'backup evidence');assert.equal(store.links('case-a').length,1);store.close();
});

test('artifact audit fails closed when a database row loses its object file',t=>{
 const dir=directory(t),store=new Store(dir),blob=store.put(Buffer.from('must remain'));fs.unlinkSync(path.join(dir,'objects',blob.digest));assert.throws(()=>store.audit(),/Artifact store integrity/);store.close();
});

test('abrupt child-process exit preserves artifacts and reservations while locking broadcast operations',t=>{
 const dir=directory(t),moduleUrl=new URL('../services/api/store.mjs',import.meta.url).href,code=`import {Store} from ${JSON.stringify(moduleUrl)};const store=new Store(process.argv[1]);store.put(Buffer.from('crash durable bytes'),'text/plain');const attempt=store.beginTx('crash-operation','alice.testnet',{method:'fund_case'});store.updateTx(attempt.id,'BROADCAST',{tx_hash:'CRASH-HASH'});store.reserve({actor:'alice.testnet',case_id:'case',round_id:0,key:'crash-budget',provider:'meta',payload:{test:true},maxCostMicro:100});process.exit(99);`,child=spawnSync(process.execPath,['--input-type=module','-e',code,dir],{encoding:'utf8'});assert.equal(child.status,99,child.stderr);const store=new Store(dir);assert.equal(store.audit().integrity,'ok');assert.equal(store.read(sha256('crash durable bytes')).bytes.toString(),'crash durable bytes');assert.equal(store.budgets().find(v=>v.provider==='meta').reserved_micro_usd,100);assert.equal(store.recoverInterrupted().locked,1);const operation=store.tx('crash-operation','alice.testnet');assert.equal(operation.status,'UNKNOWN');assert.equal(operation.tx_hash,'CRASH-HASH');store.close();
});

test('two SQLite connections preserve one idempotent budget reservation',t=>{
 const dir=directory(t),a=new Store(dir),b=new Store(dir),args={actor:'reviewer.testnet',case_id:sha256('case'),round_id:0,key:'shared-request',provider:'meta',payload:{evidence:'digest'},maxCostMicro:100};const first=a.reserve(args),second=b.reserve(args);assert.equal(second.replayed,true);assert.equal(second.id,first.id);assert.equal(a.budgets().find(v=>v.provider==='meta').reserved_micro_usd,100);a.close();b.close();
});

test('health reports genuine chain identity and persistence while unavailable mode stays explicit',async t=>{
 const store=new Store(directory(t)),source={network:'testnet',finality:'final',block_height:'42',block_hash:'BLOCK',block_timestamp_ns:'1794010800000000000',observed_at:'2026-11-07T03:00:01.000Z',age_ms:1000,stale:false},chain={network:'testnet',contractAccount:'contra.testnet',health:async()=>({status:'ready',network:'testnet',contract_account:'contra.testnet',source}),view:async()=>null},app=createApp({store,chain});await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+app.server.address().port,health=await fetch(base+'/api/health');assert.equal(health.status,200);const body=await health.json();assert.equal(body.network,'testnet');assert.equal(body.contract_account,'contra.testnet');assert.equal(body.chain_health.source.finality,'final');assert.equal(body.persistence.schema_version,5);assert.deepEqual(body.wallet,{preparation_enabled:true,signing_authorized:false});for(const asset of ['/','/app.mjs','/workflow.css']){const response=await fetch(base+asset);assert.equal(response.status,200,asset);await response.arrayBuffer();}for(const removed of ['/avatar.svg','/design/ux3a/style.css','/design/ux3a/logo.png']){const response=await fetch(base+removed);assert.equal(response.status,404,removed);await response.arrayBuffer();}const unsupported=await fetch(base+'/api/view',{method:'POST',body:'{}'});assert.equal(unsupported.status,415);await unsupported.arrayBuffer();app.server.closeAllConnections();await new Promise(resolve=>app.server.close(resolve));store.close();
});

test('Pages tombstones prevent removed presentation assets from surviving CDN caches',()=>{
 for(const file of ['pages/functions/avatar.svg.mjs','pages/functions/design/ux3a/[[path]].mjs']){
  const source=fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');assert.match(source,/status:404/);assert.match(source,/Cache-Control':'no-store/);
 }
});

test('receipt API requires authentication and preserves failed finality',async t=>{
 const store=new Store(directory(t)),hash='11111111111111111111111111111111',chain={network:'testnet',contractAccount:'contra.testnet',receipt:async(tx,account)=>({network:'testnet',tx_hash:tx,signer_id:account,final:true,success:false,status:'FAILED',result:{status:{Failure:{}}}})},app=createApp({store,chain});await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+app.server.address().port,request=token=>fetch(base+'/api/receipt',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify({tx_hash:hash})});assert.equal((await request()).status,401);const response=await request(store.session('alice.testnet'));assert.equal(response.status,200);const receipt=await response.json();assert.equal(receipt.status,'FAILED');assert.equal(receipt.success,false);assert.equal(store.db.prepare('SELECT COUNT(*) AS count FROM receipts').get().count,1);await new Promise(resolve=>app.server.close(resolve));store.close();
});

test('rate limiter is bounded per scope, serializes concurrent calls and resets after its window',async()=>{
 let now=1000;const limiter=new RateLimiter({now:()=>now});limiter.consume('evaluate:alice',{limit:2,windowMs:1000});limiter.consume('evaluate:alice',{limit:2,windowMs:1000});assert.throws(()=>limiter.consume('evaluate:alice',{limit:2,windowMs:1000}),error=>error.status===429&&error.retryAfterMs===1000);const accepted=await Promise.all(Array.from({length:12},async()=>{try{limiter.consume('challenge:bob',{limit:5,windowMs:1000});return true;}catch{return false;}}));assert.equal(accepted.filter(Boolean).length,5);now=2001;assert.equal(limiter.consume('evaluate:alice',{limit:2,windowMs:1000}).remaining,1);
});

test('expired challenges and sessions are pruned without removing active records',t=>{
 const store=new Store(directory(t)),expiredChallenge=store.challenge('expired.testnet','localhost'),activeChallenge=store.challenge('active.testnet','localhost'),expiredSession=store.session('expired.testnet'),activeSession=store.session('active.testnet');store.db.prepare('UPDATE challenges SET expires=0 WHERE id=?').run(expiredChallenge.id);store.db.prepare('UPDATE sessions SET expires=0 WHERE token_hash=?').run(sha256(expiredSession));const result=store.pruneExpired();assert.deepEqual(result,{challenges:1,sessions:1});assert.equal(store.db.prepare('SELECT COUNT(*) AS count FROM challenges WHERE id=?').get(activeChallenge.id).count,1);assert.equal(store.account(activeSession),'active.testnet');store.close();
});

test('configured public origin defeats forged Host matching and challenge limits return 429',async t=>{
 const store=new Store(directory(t)),chain={network:'testnet',contractAccount:'contra.testnet'},limiter=new RateLimiter(),app=createApp({store,chain,publicOrigin:'https://bench.example',limiter});await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+app.server.address().port,body=JSON.stringify({account:'alice.testnet'}),headers={'Content-Type':'application/json',Origin:'https://evil.example',Host:'evil.example'};assert.equal((await fetch(base+'/api/session/challenge',{method:'POST',headers,body})).status,403);const valid={'Content-Type':'application/json',Origin:'https://bench.example'};for(let index=0;index<10;index++)assert.equal((await fetch(base+'/api/session/challenge',{method:'POST',headers:valid,body})).status,200);const limited=await fetch(base+'/api/session/challenge',{method:'POST',headers:valid,body});assert.equal(limited.status,429);assert.equal(limited.headers.get('retry-after'),'60');await new Promise(resolve=>app.server.close(resolve));store.close();
});

test('aborted JSON request writes no challenge and service remains healthy',async t=>{
 const store=new Store(directory(t)),chain={network:'testnet',contractAccount:'contra.testnet'},app=createApp({store,chain});await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));const port=app.server.address().port;await new Promise(resolve=>{const request=http.request({host:'127.0.0.1',port,path:'/api/session/challenge',method:'POST',headers:{'Content-Type':'application/json'}},()=>resolve());request.on('error',()=>resolve());request.write('{"account":');request.destroy();});await new Promise(resolve=>setTimeout(resolve,25));assert.equal(store.db.prepare('SELECT COUNT(*) AS count FROM challenges').get().count,0);assert.equal((await fetch(`http://127.0.0.1:${port}/api/health`)).status,200);await new Promise(resolve=>app.server.close(resolve));store.close();
});

test('case participant cannot read an artifact linked only to another case',async t=>{
 const store=new Store(directory(t)),blob=store.put(Buffer.from('case A private evidence'),'text/plain');store.link('case-a',blob.digest,'alice.testnet','evidence-source');const cases=new Map([['case-a',{case_id:'case-a',creator_id:'alice.testnet',terms:{beneficiary_id:'beneficiary-a.testnet',primary_committee:[],fresh_committee:[],criteria:[]}}],['case-b',{case_id:'case-b',creator_id:'alice.testnet',terms:{beneficiary_id:'beneficiary-b.testnet',primary_committee:[],fresh_committee:[],criteria:[]}}]]),chain={view:async(_method,args)=>cases.get(args.case_id)},app=createApp({store,chain});await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+app.server.address().port,token=store.session('alice.testnet'),response=await fetch(`${base}/api/artifact?case_id=case-b&digest=${blob.digest}`,{headers:{Authorization:'Bearer '+token}});assert.equal(response.status,404);await new Promise(resolve=>app.server.close(resolve));store.close();
});
