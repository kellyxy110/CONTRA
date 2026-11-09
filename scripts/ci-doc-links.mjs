import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root=path.resolve(import.meta.dirname,'..');
const files=execFileSync('git',['ls-files','*.md'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
const failures=[];
for(const file of files){
 const source=fs.readFileSync(path.join(root,file),'utf8');
 for(const match of source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)){
  const raw=match[1].trim().replace(/^<|>$/g,'');
  if(!raw||raw.startsWith('#')||/^(?:https?:|mailto:|data:)/i.test(raw))continue;
  const target=decodeURIComponent(raw.split('#')[0]);
  if(!target)continue;
  const resolved=path.resolve(path.dirname(path.join(root,file)),target);
  if(!resolved.startsWith(root+path.sep)||!fs.existsSync(resolved))failures.push(`${file}: missing local link target ${raw}`);
 }
}
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(`Documentation link checks passed for ${files.length} Markdown files.`);
