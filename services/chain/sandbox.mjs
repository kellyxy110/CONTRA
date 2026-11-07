import {Worker} from 'near-workspaces';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash,randomBytes} from 'node:crypto';
import {voteCommitment} from '../../packages/protocol/encoding.mjs';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import os from 'node:os';
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export const GAS=100_000_000_000_000n;
export const ONE=1n;
export const NEAR=10n**24n;
export const sha=s=>createHash('sha256').update(s).digest('hex');
const sandboxPids=bin=>new Set(execFileSync('ps',['-eo','pid=,args='],{encoding:'utf8'}).split('\n').map(line=>line.trim().match(/^(\d+)\s+(.+)$/)).filter(match=>match?.[2].startsWith(bin+' --home ')).map(match=>Number(match[1])));
const closedWorkers=new WeakSet();
const closeWorker=async worker=>{
 if(closedWorkers.has(worker))return;closedWorkers.add(worker);
 const child=worker.server?.subprocess,home=worker.config?.homeDir;
 let exited=child?.exitCode!==null;
 const exit=new Promise(resolve=>{if(!child||exited)return resolve();child.once('exit',()=>{exited=true;resolve();});});
 await worker.tearDown();
 await Promise.race([exit,new Promise(resolve=>setTimeout(resolve,15_000))]);
 if(child&&!exited){child.kill('SIGKILL');await exit;}
 if(home)fs.rmSync(home,{recursive:true,force:true});
};
export async function startSandbox({faults=false,onReceipt=()=>{},longAccounts=false}={}){
 const hard=Number(execFileSync('bash',['-c','ulimit -Hn'],{encoding:'utf8'}).trim());if(hard<65535)throw Error('NEAR Sandbox blocked: host hard open-file limit '+hard+' is below 65535.');
 const bin=path.join(ROOT,'.tools/Linux-x86_64');if(!fs.existsSync(path.join(bin,'near-sandbox')))throw Error('Run node scripts/setup-sandbox.mjs to install pinned NEAR Sandbox 2.13.4.');
 process.env.NEAR_SANDBOX_BIN_PATH=path.join(bin,'near-sandbox');process.env.NEAR_SANDBOX_BINARY_PATH=bin;
 let worker,lastError;for(let attempt=0;attempt<3&&!worker;attempt++){const before=sandboxPids(path.join(bin,'near-sandbox'));try{worker=await Worker.init({network:'sandbox'});}catch(error){lastError=error;for(const pid of sandboxPids(path.join(bin,'near-sandbox')))if(!before.has(pid))try{process.kill(pid,'SIGTERM');}catch{}fs.rmSync(path.join(os.tmpdir(),'near-sandbox-worker-sync.txt.lock'),{recursive:true,force:true});if(attempt<2)await new Promise(resolve=>setTimeout(resolve,2_000));}}if(!worker)throw lastError;try{
 const root=worker.rootAccount;
 const localName=label=>longAccounts?(label+'-').padEnd(64-root.accountId.length-1,'x'):label;
 const creator=await root.createSubAccount(localName('creator'),{initialBalance:100n*NEAR});
 const beneficiary=await root.createSubAccount(localName('beneficiary'),{initialBalance:100n*NEAR});
 const outsider=await root.createSubAccount(localName('outsider'),{initialBalance:100n*NEAR});
 const contract=await root.devDeploy(path.join(ROOT,'contracts/adjudication/target/wasm32-unknown-unknown',faults?'faults.wasm':'release/contra_adjudication.wasm'),{initialBalance:100n*NEAR});
 await contract.call(contract,'new',{owner_id:creator.accountId,chain_id:'testnet',creator_allowlist:[creator.accountId]},{gas:GAS});
 const reviewers=[];for(let i=0;i<6;i++){const r=await root.createSubAccount(localName('reviewer'+i),{initialBalance:10n*NEAR});reviewers.push(r);const disclosure=sha('Sandbox controlled operator '+i);await creator.call(contract,'set_reviewer',{reviewer_id:r.accountId,operator_id:sha('sandbox-operator-'+i),disclosure_digest:disclosure,active:true},{gas:GAS,attachedDeposit:ONE});await r.call(contract,'confirm_reviewer',{revision:'1',disclosure_digest:disclosure},{gas:GAS,attachedDeposit:ONE});}
 const accounts=[creator,beneficiary,...reviewers,outsider];const byId=new Map(accounts.map(a=>[a.accountId,a]));
 const receipts=[];
 const call=async(account,method,args={},deposit=0n,{gas=GAS}={})=>{const a=typeof account==='string'?byId.get(account):account;if(!a)throw Error('Unknown sandbox signer');const tx=await a.callRaw(contract,method,args,{gas,attachedDeposit:BigInt(deposit)});const row={tx_hash:tx.transactionReceipt.hash,network:'sandbox',contract_account:contract.accountId,signer_id:a.accountId,method,args,deposit_yocto:String(deposit),prepaid_gas:String(gas),success:!tx.failed&&tx.receiptFailures.length===0,failures:tx.receiptFailureMessages,result:tx.result,gas_burnt:tx.gas_burnt,logs:tx.logs,observed_at_utc:new Date().toISOString()};receipts.push(row);await onReceipt(row);return row;};
 const view=(method,args={})=>contract.view(method,args);
 const observation=async()=>{const block=await worker.provider.block({finality:'final'});return {network:'sandbox',finality:'final',block_height:String(block.header.height),block_hash:block.header.hash,block_timestamp_ns:String(block.header.timestamp_nanosec),observed_at:new Date().toISOString()};};
 const clock=async()=>{let error;for(let attempt=0;attempt<5;attempt++)try{return BigInt((await worker.provider.block({finality:'final'})).header.timestamp_nanosec);}catch(cause){error=cause;await new Promise(resolve=>setTimeout(resolve,250*(attempt+1)));}throw error;};
 const fastTo=async(ns)=>{
  const target=BigInt(ns);
  let current=await clock();
  while(current<target){
   const remainingSeconds=Number((target-current)/1_000_000_000n);
   const estimatedBlocks=remainingSeconds>60?Math.max(1,Math.floor((remainingSeconds-60)/30)):1;
   const blocks=Math.min(50,estimatedBlocks),before=current;
   try{await worker.provider.fastForward(blocks);}catch(error){await new Promise(resolve=>setTimeout(resolve,500));current=await clock();if(current>=target)break;if(current<=before)throw error;continue;}
   for(let attempt=0;attempt<120;attempt++){current=await clock();if(current>before)break;await new Promise(resolve=>setTimeout(resolve,250));}
   if(current<=before)throw Error('Sandbox final block did not advance after fast-forward');
  }
  return current;
 };
 const terms=async()=>{const t=await clock();const dates={};['fund_by_ns','submit_by_ns','primary_commit_end_ns','primary_reveal_end_ns','challenge_end_ns','fresh_commit_end_ns','fresh_reveal_end_ns'].forEach((k,i)=>dates[k]=(t+BigInt((i+1)*610)*1_000_000_000n).toString());return {beneficiary_id:beneficiary.accountId,creator_operator_id:sha('creator'),beneficiary_operator_id:sha('beneficiary'),amount_yocto:NEAR.toString(),...dates,criteria:[{criterion_id:1,kind:'KEYBOARD',requirement_digest:sha('No keyboard traps')}],evidence_policy_digest:sha('contra-evidence-v1'),policy_version:1,base_fallback:'BASE_REFUND_V1',challenge_fallback:'KEEP_PRIMARY_V1'};};
 const create=async(overrides={})=>{const t={...await terms(),...overrides},request_id=randomBytes(32).toString('hex');const p=await view('preview_case',{creator_id:creator.accountId,request_id,terms:t});const tx=await call(creator,'create_case',{request_id,terms:t,expected_terms_digest:p.terms_digest},ONE);if(!tx.success)throw Error(JSON.stringify(tx.failures));return {case_id:p.case_id,terms_digest:p.terms_digest,terms:t,request_id,tx};};
 const votes=async(id,round,choice,finding=sha('sandbox-only-finding'))=>{const c=await view('get_case',{case_id:id});const committee=round?c.terms.fresh_committee:c.terms.primary_committee;const evidence=round?c.challenge.round_evidence_digest:c.evidence_digest;const reveals=[];for(const m of committee.slice(0,2)){const v={case_id:id,round_id:round,reviewer_account:m.reviewer_id,chain_id:'testnet',contract_account:contract.accountId,terms_digest:c.terms_digest,disposition:choice,evidence_digest:evidence,finding_digest:finding,nonce:randomBytes(32).toString('hex')};const tx=await call(m.reviewer_id,'commit_vote',{case_id:id,round_id:round,commitment:await voteCommitment(v)});if(!tx.success)throw Error(JSON.stringify(tx.failures));reveals.push(v);}await fastTo(round?c.terms.fresh_commit_end_ns:c.terms.primary_commit_end_ns);await call(outsider,'advance_round',{case_id:id});for(const v of reveals){const {reviewer_account,chain_id,contract_account,terms_digest,...args}=v;const tx=await call(reviewer_account,'reveal_vote',args);if(!tx.success){const state=await view('get_case',{case_id:id});throw Error(JSON.stringify({failures:tx.failures,chain_time_ns:String(await clock()),phase:state.phase,state:state.state,commitment:(await view('get_round',{case_id:id,round_id:round})).slots.find(x=>x.reviewer_id===reviewer_account)?.commitment,reveal_end_ns:round?c.terms.fresh_reveal_end_ns:c.terms.primary_reveal_end_ns}));}}await fastTo(round?c.terms.fresh_reveal_end_ns:c.terms.primary_reveal_end_ns);await call(outsider,'advance_round',{case_id:id});return view('get_case',{case_id:id});};
 const snapshot=async(label)=>({label,chain_time_ns:String(await clock()),contract:await contract.accountView(),root:await root.accountView(),reserves:(await view('get_config')).reserve_summary,accounts:Object.fromEntries(await Promise.all(accounts.map(async a=>[a.accountId,await a.exists()?await a.accountView():null])))});
 return {worker,root,creator,beneficiary,outsider,contract,reviewers,accounts,receipts,call,view,observation,clock,fastTo,terms,create,votes,snapshot,addAccount:a=>{byId.set(a.accountId,a);if(!accounts.some(x=>x.accountId===a.accountId))accounts.push(a);},close:()=>closeWorker(worker)};
 }catch(e){await closeWorker(worker);throw e;}
}
