import fs from 'node:fs';
import path from 'node:path';
import {probeTestnetAccount} from '../services/deployment/account-probe.mjs';

const accountId=process.argv[2];
if(!accountId)throw Error('Usage: node scripts/probe-testnet-account.mjs <account.testnet>');
const report=await probeTestnetAccount(accountId);
const output=path.resolve('ci-output','m08-account-probe.json');
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,`${JSON.stringify(report,null,2)}\n`);
process.stdout.write(`${JSON.stringify(report,null,2)}\n`);
