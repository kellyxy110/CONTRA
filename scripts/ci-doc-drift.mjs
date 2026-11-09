import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(import.meta.dirname,'..');
const groups=[
 ['contract interface',/^(contracts\/contestation\/src\/|ci\/contract-abi-baseline\.json|packages\/protocol\/encoding\.mjs)/,/^(README\.md|docs\/(?:protocol\/|PROTOCOL|CONTRACT_ABI|STATE_MACHINE|COMMITMENT))/],
 ['public API',/^(services\/(?:api|wallet|reviewers|evidence)\/|apps\/web\/wallet-source\.mjs)/,/^(README\.md|docs\/(?:architecture\/|operations\/|judges\/|ARCHITECTURE|DURABLE_STORAGE))/],
 ['runtime configuration',/^(services\/runtime\/|\.env\.example$)/,/^(README\.md|docs\/operations\/)/],
 ['deployment',/^(scripts\/.*deploy|\.github\/workflows\/.*deploy)/,/^(README\.md|docs\/operations\/)/],
 ['tests and CI',/^(tests\/|package\.json$|\.github\/workflows\/|scripts\/ci-)/,/^(README\.md|docs\/(?:testing\/|CI_RISK_POLICY))/],
 ['security boundary',/^(services\/api\/(?:auth|rate-limit|store)\.mjs|\.github\/workflows\/security\.yml|scripts\/ci-policy\.mjs)/,/^(README\.md|docs\/(?:security\/|THREAT_MODEL))/],
 ['provider availability',/^services\/evaluators\//,/^(README\.md|docs\/(?:operations\/|judges\/|M06_PROVIDER))/],
 ['judge and public access',/^(docs\/judges\/|services\/runtime\/)/,/^(README\.md|docs\/judges\/)/]
];

function changedFiles(){
 const explicit=process.argv.find(value=>value.startsWith('--files='));
 if(explicit)return explicit.slice(8).split(',').map(value=>value.trim()).filter(Boolean);
 const eventPath=process.env.GITHUB_EVENT_PATH;
 if(eventPath&&fs.existsSync(eventPath)){
  const event=JSON.parse(fs.readFileSync(eventPath,'utf8'));
  const base=event.pull_request?.base?.sha||event.before;
  const head=event.pull_request?.head?.sha||event.after||process.env.GITHUB_SHA;
  if(base&&head&&!/^0+$/.test(base))return execFileSync('git',['diff','--name-only',`${base}...${head}`],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
 }
 return [];
}

function justification(){
 const eventPath=process.env.GITHUB_EVENT_PATH;
 if(!eventPath||!fs.existsSync(eventPath))return '';
 const body=JSON.parse(fs.readFileSync(eventPath,'utf8')).pull_request?.body||'';
 return body.match(/Documentation impact:\s*none\s*-\s*(.+)/i)?.[1]?.trim()||'';
}

export function assessDocumentation(files,noChangeJustification=''){
 const changed=[...new Set(files.map(file=>file.replaceAll('\\','/')).filter(Boolean))];
 const missing=[];
 for(const [name,source,documentation]of groups){
  if(changed.some(file=>source.test(file))&&!changed.some(file=>documentation.test(file)))missing.push(name);
 }
 return {changed,missing,justified:missing.length>0&&noChangeJustification.length>=12,justification:noChangeJustification};
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
 const result=assessDocumentation(changedFiles(),justification());
 fs.mkdirSync(path.join(root,'ci-output'),{recursive:true});
 fs.writeFileSync(path.join(root,'ci-output','documentation-drift.json'),JSON.stringify(result,null,2)+'\n');
 if(result.missing.length&&!result.justified){
  console.error(`Documentation update or PR justification required for: ${result.missing.join(', ')}`);
  console.error('Use `Documentation impact: none - <specific reason>` in the PR body only when no document changes are required.');
  process.exit(1);
 }
 console.log(result.missing.length?`Documentation no-change justification accepted for: ${result.missing.join(', ')}`:'Documentation impact coverage passed.');
}
