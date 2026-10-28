import {execFileSync} from 'node:child_process';
const limit=Number(execFileSync('bash',['-c','ulimit -Hn'],{encoding:'utf8'}).trim());
if(limit<65535){console.error(`BLOCKED: NEAR Sandbox requires 65535 file descriptors; host hard limit is ${limit}. Run on a compatible host. No Sandbox test or receipt has been verified.`);process.exit(2);}console.log('Sandbox file-descriptor preflight passed.');
