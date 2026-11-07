import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const root=path.resolve(import.meta.dirname,'..'),baseline=JSON.parse(fs.readFileSync(path.join(root,'ci/dependency-audit-baseline.json'))),run=spawnSync('npm',['audit','--json'],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024,shell:process.platform==='win32'});
let audit;try{audit=JSON.parse(run.stdout);}catch{console.error(run.stderr||run.stdout||'npm audit did not return JSON');process.exit(1);}
const order={info:0,low:1,moderate:2,high:3,critical:4},current=audit.vulnerabilities||{},failures=[];
for(const [name,value]of Object.entries(current)){const accepted=baseline.vulnerabilities[name];if(!accepted)failures.push(`New vulnerable package: ${name} (${value.severity})`);else if(order[value.severity]>order[accepted])failures.push(`Severity increased: ${name} ${accepted} -> ${value.severity}`);}
const advisories=new Set();const walk=value=>{if(Array.isArray(value))for(const item of value)walk(item);else if(value&&typeof value==='object'){if(typeof value.url==='string'){const match=value.url.match(/GHSA-[0-9a-z-]+/i);if(match)advisories.add(match[0].toUpperCase());}for(const child of Object.values(value))walk(child);}};walk(current);
const acceptedAdvisories=new Set(baseline.advisories.map(value=>value.toUpperCase()));for(const advisory of advisories)if(!acceptedAdvisories.has(advisory))failures.push(`New advisory: ${advisory}`);
fs.mkdirSync(path.join(root,'ci-output'),{recursive:true});const report={baseline:baseline.source_commit,metadata:audit.metadata,current_packages:Object.fromEntries(Object.entries(current).map(([name,value])=>[name,value.severity])),advisories:[...advisories].sort(),failures,accepted_reason:baseline.accepted_reason,checked_at:new Date().toISOString()};fs.writeFileSync(path.join(root,'ci-output/npm-audit.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));if(failures.length)process.exit(1);
