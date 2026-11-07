import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const MAP_PATH=path.join(ROOT,'ci','integration-risk-map.json');
function regexFor(glob){const escaped=glob.replace(/[.+^${}()|[\]\\]/g,'\\$&').replaceAll('**','\0').replaceAll('*','[^/]*').replaceAll('\0','.*');return new RegExp('^'+escaped+'$');}
function matches(file,patterns){return patterns.some(pattern=>regexFor(pattern).test(file));}
function matchesAny(files,patterns){return files.some(file=>matches(file,patterns));}
export function classifyIntegrationRisk(files,map,{event='pull_request',baseRef='',requested='auto'}={}){
 const changed=[...new Set(files.map(file=>file.replaceAll('\\','/')).filter(Boolean))].sort();
 if(requested==='full'||event==='schedule'||event==='push'&&baseRef.startsWith('release/'))return {level:'full',reason:'Comprehensive verification explicitly required by event policy.',changed,focused_patterns:[]};
 if(baseRef==='main')return {level:'full',reason:'Integration into main defaults to comprehensive verification.',changed,focused_patterns:[]};
 if(requested==='focused')return {level:'focused',reason:'Focused verification explicitly requested.',changed,focused_patterns:[...new Set(map.focused.map(group=>group.test_pattern))]};
 if(!changed.length)return {level:'full',reason:'No changed-file classification was available, so ambiguous risk defaults to comprehensive verification.',changed,focused_patterns:[]};
 const full=map.full.filter(group=>matchesAny(changed,group.paths));
 if(full.length)return {level:'full',reason:'Comprehensive mapping matched: '+full.map(group=>group.name).join(', ')+'.',changed,focused_patterns:[]};
 const focused=map.focused.filter(group=>matchesAny(changed,group.paths));
 const known=file=>matches(file,map.fast_only)||map.full.some(group=>matches(file,group.paths))||map.focused.some(group=>matches(file,group.paths));
 const unclassified=changed.filter(file=>!known(file));
 if(unclassified.length)return {level:'full',reason:'Unclassified risk defaults to comprehensive verification: '+unclassified.join(', ')+'.',changed,focused_patterns:[]};
 if(focused.length)return {level:'focused',reason:'Focused mapping matched: '+focused.map(group=>group.name).join(', ')+'.',changed,focused_patterns:[...new Set(focused.map(group=>group.test_pattern))]};
 return {level:'fast',reason:'All changed paths are explicitly covered by the fast PR gate.',changed,focused_patterns:[]};
}
function arg(name,fallback=''){const index=process.argv.indexOf('--'+name);return index>=0?process.argv[index+1]:fallback;}
function changedFiles(){
 const explicit=arg('files');if(explicit)return explicit.split(',').map(value=>value.trim()).filter(Boolean);
 const eventPath=process.env.GITHUB_EVENT_PATH;
 if(eventPath&&fs.existsSync(eventPath)){
  const payload=JSON.parse(fs.readFileSync(eventPath,'utf8')),base=payload.pull_request?.base?.sha||payload.before,head=payload.pull_request?.head?.sha||payload.after||process.env.GITHUB_SHA;
  if(base&&head&&!/^0+$/.test(base))return execFileSync('git',['diff','--name-only',base+'...'+head],{cwd:ROOT,encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
 }
 return [];
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const map=JSON.parse(fs.readFileSync(MAP_PATH,'utf8'));
 const result=classifyIntegrationRisk(changedFiles(),map,{event:arg('event',process.env.GITHUB_EVENT_NAME||'pull_request'),baseRef:arg('base-ref',process.env.GITHUB_BASE_REF||process.env.GITHUB_REF_NAME||''),requested:arg('requested','auto')});
 const pattern=result.focused_patterns.join('|');console.log(JSON.stringify({...result,focused_pattern:pattern},null,2));
 if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,`level=${result.level}\nreason=${result.reason}\nfocused_pattern=${pattern}\n`);
 fs.mkdirSync(path.join(ROOT,'ci-output'),{recursive:true});fs.writeFileSync(path.join(ROOT,'ci-output','integration-policy.json'),JSON.stringify({...result,focused_pattern:pattern},null,2)+'\n');
}
