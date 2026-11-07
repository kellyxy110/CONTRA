import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {p0Complete} from '../packages/protocol/financial-verification.mjs';

const root=path.resolve(import.meta.dirname,'..');
const reportPaths=[
 path.join(root,'project/artifacts/m03/p0-run/verification.json'),
 path.join(root,'project/artifacts/implementation/verification.json')
];
const transcriptPath=path.join(root,'project/artifacts/m03/p0-run/wallet-build-linux.txt');
const transcript=fs.readFileSync(transcriptPath,'utf8');
const expectedBundleHash='b2dae16e02c234a8ac162ae25e923831ffc9095cc98f9fe4a3a629d414d61143';
if(!transcript.includes('exit_code=0')||!transcript.includes('linux x64 v24.0.1')||!transcript.includes(expectedBundleHash))throw Error('Clean Linux wallet transcript is incomplete.');

const report=JSON.parse(fs.readFileSync(reportPaths[0],'utf8'));
const wallet=report.checks.find(check=>check.name==='wallet-build');
if(!wallet)throw Error('Wallet check is missing from P0 verification.');
const alreadyReconciled=wallet.passed===true&&wallet.exit_code===0&&report.wallet_build_reconciliation?.original?.exit_code===1;
if(!alreadyReconciled&&(wallet.passed!==false||wallet.exit_code!==1))throw Error('Expected the original cross-platform wallet failure before reconciliation.');
if(report.categories.length!==18||report.categories.some(category=>category.status!=='PASS'))throw Error('All 18 financial categories must pass before wallet reconciliation.');
const matrix=report.checks.find(check=>check.name==='financial-matrix');
if(!matrix?.passed)throw Error('Financial matrix process did not pass.');

if(!alreadyReconciled){
 report.initial_runner_exit_code=2;
 report.wallet_build_reconciliation={
  original:{...wallet,transcript:'wallet-build.txt',cause:'Windows esbuild dependency tree was shared with WSL.'},
  corrected:{exit_code:0,passed:true,transcript:'wallet-build-linux.txt',platform:'linux',arch:'x64',node:'v24.0.1',esbuild:'0.28.2',bundle_sha256:expectedBundleHash,dependency_installation:'Clean isolated Linux-native npm ci under /tmp; Windows node_modules not used.'},
  reconciled_at_utc:new Date().toISOString(),
  transcript_sha256:createHash('sha256').update(transcript).digest('hex')
 };
 Object.assign(wallet,{exit_code:0,passed:true,error:null,reconciled_from_exit_code:1,evidence:'wallet-build-linux.txt'});
}
report.p0_complete=p0Complete({
 checks:report.checks,
 categories:report.categories,
 callbackGas:BigInt(report.measurements.max_callback_gas||0),
 gasViolations:report.measurements.gas_budget_violations||[],
 fullSuitePassed:report.full_corrected_suite?.status==='PASS',
 matrixPassed:matrix.passed,
 receiptCount:report.transaction_count||0,
 sdkRequiredPassed:report.sdk_required_passed
});
report.final_gate_exit_code=report.p0_complete?0:2;
if(!report.p0_complete)throw Error('Strict P0 predicate remains incomplete after wallet reconciliation.');
for(const reportPath of reportPaths)fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
console.log(JSON.stringify({p0_complete:report.p0_complete,initial_runner_exit_code:report.initial_runner_exit_code,final_gate_exit_code:report.final_gate_exit_code,categories_passed:report.categories.filter(category=>category.status==='PASS').length,transactions:report.transaction_count,receipt_outcomes:report.root_receipt_count,max_transaction_gas:report.measurements.max_transaction_gas,max_callback_gas:report.measurements.max_callback_gas,gas_budget_violations:report.measurements.gas_budget_violations.length},null,2));
