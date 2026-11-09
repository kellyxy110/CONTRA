import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const OUTPUT=path.join(ROOT,'ci-output','judge-quickstart');
const CONTROLLED=path.join(ROOT,'ci-output','m06-controlled-workflow','report.json');
const ONE_NEAR='1000000000000000000000000';

export function verifyJudgeEvidence(report){
 if(report?.environment?.contract_path!=='real local NEAR Sandbox')throw Error('Controlled journey did not use real local NEAR Sandbox');
 if(!String(report.environment.external_wallet_path||'').includes('simulated'))throw Error('External-wallet boundary is not explicit');
 if(!String(report.environment.provider_path||'').includes('mocked'))throw Error('Provider-fixture boundary is not explicit');
 if(report.wallet?.dispatch_count!==0||report.wallet?.restart_status!=='UNKNOWN'||report.wallet?.recovered_status!=='PENDING')throw Error('Wallet restart recovery or zero-redispatch proof is missing');
 if(report.trust_boundary?.ai_commitments_before!==0||report.trust_boundary?.ai_commitments_after!==0||report.trust_boundary?.ai_status!=='proposal-only')throw Error('AI trust-boundary proof is missing');
 if(!/^[0-9a-f]{64}$/.test(report.trust_boundary?.modal_proposal_digest||'')||!/^[0-9a-f]{64}$/.test(report.trust_boundary?.verified_proposal_digest||''))throw Error('Modal proposal binding is missing');
 if(report.settlement?.final_disposition!=='REJECT'||report.settlement?.resolution_basis!=='FRESH'||report.settlement?.recipient_id!=='creator.test.near'||report.settlement?.balance_delta_yocto!==ONE_NEAR||report.settlement?.result!=='SUCCESS')throw Error('Exact challenged settlement evidence is missing');
 if(report.timeout?.resolution_basis!=='BASE_REFUND'||report.timeout?.final_disposition==='ACCEPT')throw Error('Timeout fallback evidence is missing');
 if(!(report.counts?.sandbox_receipts>0)||!(report.counts?.persisted_operations>0))throw Error('Receipt and operation evidence is missing');
 return {verified:true,sandbox_receipts:report.counts.sandbox_receipts,persisted_operations:report.counts.persisted_operations,settlement:report.settlement,wallet:report.wallet,trust_boundary:report.trust_boundary,timeout:report.timeout};
}

function command(file,args,label,results){
 const started=Date.now();console.log(`\n[JUDGE] ${label}`);execFileSync(file,args,{cwd:ROOT,stdio:'inherit',env:{...process.env,CI:'1'}});results.push({label,command:[file,...args].join(' '),duration_ms:Date.now()-started,status:'PASS'});
}

export function runJudgeQuickstart(){
 if(process.platform!=='linux'||process.arch!=='x64')throw Error('Judge quick-start requires Ubuntu 24.04 x86_64. See docs/testing/REPRODUCIBILITY.md.');
 fs.rmSync(OUTPUT,{recursive:true,force:true});fs.mkdirSync(OUTPUT,{recursive:true});
 const results=[],started=new Date().toISOString();
 try{
  command('npm',['ci','--ignore-scripts','--no-audit','--no-fund'],'Clean dependency installation',results);
  command('npm',['test'],'Repository unit and service tests',results);
  command('npm',['run','test:contract'],'Rust contract tests',results);
  command('node',['scripts/build-contracts.mjs'],'Production and fault WASM builds',results);
  command('node',['scripts/ci-contract-abi.mjs'],'Contract ABI and export verification',results);
  command('node',['scripts/ci-commitment-vectors.mjs'],'Commitment vectors',results);
  command('npm',['run','build:wallet'],'Wallet production bundle',results);
  command('node',['scripts/setup-sandbox.mjs'],'Pinned NEAR Sandbox installation',results);
  command('node',['scripts/sandbox-preflight.mjs'],'Sandbox host preflight',results);
  command('node',['scripts/run-m06-controlled-workflow.mjs'],'Controlled Contestation journey',results);
  const evidence=verifyJudgeEvidence(JSON.parse(fs.readFileSync(CONTROLLED,'utf8'))),report={schema:'CONTRA_JUDGE_QUICKSTART_V1',started_at:started,completed_at:new Date().toISOString(),environment:{platform:process.platform,arch:process.arch,node:process.version,external_wallet:'simulated only',providers:'mocked only',network:'local NEAR Sandbox'},commands:results,evidence,status:'PASS'};
  fs.writeFileSync(path.join(OUTPUT,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(`\n[JUDGE] PASS: ${evidence.sandbox_receipts} Sandbox receipts, exact ${ONE_NEAR} yoctoNEAR creator refund, zero wallet redispatch and zero AI-created commitments.`);return report;
 }catch(error){fs.writeFileSync(path.join(OUTPUT,'report.json'),JSON.stringify({schema:'CONTRA_JUDGE_QUICKSTART_V1',started_at:started,failed_at:new Date().toISOString(),commands:results,status:'FAIL',error:error.message},null,2)+'\n');throw error;}
}

if(process.argv[1]===fileURLToPath(import.meta.url))runJudgeQuickstart();
