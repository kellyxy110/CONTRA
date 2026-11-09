import fs from 'node:fs';
import path from 'node:path';
import {assessDeploymentPlan,deploymentCommand,verifyDeploymentTarget} from '../services/deployment/preflight.mjs';

const root=path.resolve(import.meta.dirname,'..'),file=process.argv[2],online=process.argv.includes('--online-readonly');
if(!file)throw Error('Usage: node scripts/testnet-deployment-preflight.mjs <plan.json> [--online-readonly]');
const plan=JSON.parse(fs.readFileSync(path.resolve(file),'utf8')),assessment=assessDeploymentPlan(plan,{root}),report={generated_at:new Date().toISOString(),mode:online?'online-readonly':'offline',assessment};
if(online){
 if(!assessment.ready)throw Error(`Deployment is blocked: ${assessment.blockers.join(', ')}`);
 report.target=await verifyDeploymentTarget(plan);
 report.authorised_command=deploymentCommand(plan);
 report.warning='Command generated only. This preflight does not sign or broadcast it.';
}
fs.mkdirSync(path.join(root,'ci-output'),{recursive:true});
fs.writeFileSync(path.join(root,'ci-output','testnet-deployment-preflight.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(!assessment.ready)process.exitCode=2;
