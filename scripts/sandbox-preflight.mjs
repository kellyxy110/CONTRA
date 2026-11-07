import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),binary=path.join(root,'.tools','Linux-x86_64','near-sandbox');
function blocked(reason){console.error(`BLOCKED ON THIS HOST: ${reason} This attempt executed no Sandbox tests. Prior compatible-host receipts remain valid evidence.`);process.exit(2);}
if(process.platform!=='linux')blocked('NEAR Sandbox must run from a native Linux Node process, not Windows.');
let limit;
try{limit=Number(execFileSync('bash',['-c','ulimit -Hn'],{encoding:'utf8'}).trim());}catch{blocked('Unable to read the Linux hard open-file limit.');}
if(limit<65535)blocked(`NEAR Sandbox requires 65535 file descriptors; local hard limit is ${limit}.`);
try{execFileSync('ps',['-eo','pid=,args='],{stdio:'ignore'});}catch{blocked('The required Linux ps utility is unavailable.');}
if(!fs.existsSync(binary))blocked('Pinned NEAR Sandbox 2.13.4 is not installed. Run node scripts/setup-sandbox.mjs.');
try{execFileSync(binary,['--version'],{stdio:'pipe'});}catch(error){const detail=String(error.stderr||error.message).trim().split('\n')[0];blocked(`Pinned NEAR Sandbox cannot execute: ${detail}`);}
console.log(`Sandbox preflight passed on Linux with hard open-file limit ${limit}.`);
