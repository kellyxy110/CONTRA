import fs from 'node:fs';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';

const root=path.resolve(import.meta.dirname,'..'),mode=process.argv[2]||'core';
const git=(args,options={})=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:128*1024*1024,...options});
const files=git(['ls-files','-z']).split('\0').filter(Boolean),failures=[];
const textFiles=[];
for(const file of files){const bytes=fs.readFileSync(path.join(root,file));if(bytes.includes(0))continue;const text=bytes.toString('utf8');textFiles.push({file,text});if(text.includes('\u2014'))failures.push(`${file}: em dash character`);}
const currentFiles=textFiles.filter(({file})=>!file.startsWith('project/artifacts/'));
const obsoleteTerm=new RegExp('adjudic'+'at','i'),inventedActor=new RegExp('contes'+'tator','i');
for(const {file,text}of currentFiles){if(obsoleteTerm.test(text))failures.push(`${file}: obsolete contestation terminology`);if(inventedActor.test(text))failures.push(`${file}: invented contestation actor term`);}
for(const file of files.filter(file=>!file.startsWith('project/artifacts/'))){if(obsoleteTerm.test(file))failures.push(`${file}: obsolete terminology in tracked path`);}
for(const file of files.filter(v=>/\.(?:m?js|cjs)$/.test(v))){const checked=spawnSync(process.execPath,['--check',file],{cwd:root,encoding:'utf8'});if(checked.status!==0)failures.push(`${file}: JavaScript syntax check failed\n${checked.stderr}`);}

if(mode==='security'){
 const allowedEnvironmentTemplates=new Set([
  '.env.example',
  '.env.local.example',
  '.env.providers.example',
  '.env.testnet.example'
 ]);
 const forbidden=files.filter(file=>/(^|\/)(?:\.env(?:\..+)?|credentials?(?:\..+)?|secrets?(?:\..+)?|id_rsa(?:\..+)?|.*\.(?:pem|key))$/i.test(file)&&!allowedEnvironmentTemplates.has(file));
 for(const file of forbidden)failures.push(`${file}: restricted credential filename is tracked`);
 const patterns=[
  ['private key block',/-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/g],
  ['GitHub token',/\bgh[pousr]_[A-Za-z0-9]{20,}\b/g],
  ['AWS access key',/\bAKIA[0-9A-Z]{16}\b/g],
  ['OpenAI-style secret',/\bsk-[A-Za-z0-9_-]{20,}\b/g],
  ['Meta Model API key',/\bLLM_[0-9]{6,}_[A-Za-z0-9_-]{20,}\b/g],
  ['Baseten API key',/\bb10_[A-Za-z0-9]{8}\.[A-Za-z0-9]{32}\b/g],
  ['Modal API token',/\b(?:ak|as|wk|ws)-[A-Za-z0-9]{8,}\b/g],
  ['NEAR private key JSON',/["']private_key["']\s*:\s*["']ed25519:/gi]
 ];
 const scan=(label,text)=>{for(const [name,re]of patterns){re.lastIndex=0;if(re.test(text))failures.push(`${label}: detected ${name}`);}};
 for(const {file,text}of textFiles)scan(file,text);
 const history=git(['log','-p','--all','--full-history','--','.',' :(exclude)project/artifacts/**',' :(exclude)design/reference/**',' :(exclude)design/approved/**'].map(v=>v.trim()));
 scan('Git history outside archived artifacts and immutable references',history);
 const baseline=JSON.parse(fs.readFileSync(path.join(root,'ci/contract-abi-baseline.json'))),allowed=new Set([...baseline.production_exports,...baseline.fault_only_exports].filter(v=>v!=='memory'&&v!=='contract_source_metadata'));
 const source=fs.readFileSync(path.join(root,'contracts/contestation/src/lib.rs'),'utf8'),methods=[...source.matchAll(/pub fn\s+([A-Za-z0-9_]+)/g)].map(v=>v[1]);for(const method of methods)if(!allowed.has(method))failures.push(`contracts/contestation/src/lib.rs: unauthorized public method ${method}`);
}

fs.mkdirSync(path.join(root,'ci-output'),{recursive:true});
const report={mode,tracked_files:files.length,text_files:textFiles.length,failures,checked_at:new Date().toISOString()};fs.writeFileSync(path.join(root,'ci-output',`policy-${mode}.json`),JSON.stringify(report,null,2));
if(failures.length){console.error(failures.join('\n'));process.exit(1);}console.log(`CI ${mode} policy checks passed for ${files.length} tracked files.`);
