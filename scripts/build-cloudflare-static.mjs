import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd(),destination=path.join(root,'dist','cloudflare-static');
fs.rmSync(destination,{recursive:true,force:true});
fs.mkdirSync(destination,{recursive:true});
for(const [source,target] of [['apps/web',''],['design/ux3a','design/ux3a'],['packages/protocol','packages/protocol']]){
 const from=path.join(root,source),to=path.join(destination,target);if(!fs.existsSync(from))throw Error(`Required static source is missing: ${source}`);
 fs.cpSync(from,to,{recursive:true});
}
console.log('Cloudflare static assets prepared from active frontend sources.');
