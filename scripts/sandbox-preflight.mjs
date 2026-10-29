import {execFileSync} from 'node:child_process';
const limit=Number(execFileSync('bash',['-c','ulimit -Hn'],{encoding:'utf8'}).trim());
if(limit<65535){console.error(`BLOCKED ON THIS HOST: NEAR Sandbox requires 65535 file descriptors; local hard limit is ${limit}. This attempt executed no Sandbox tests. Prior compatible-host receipts remain valid evidence.`);process.exit(2);}console.log('Sandbox file-descriptor preflight passed.');
