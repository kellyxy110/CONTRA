import fs from 'node:fs';
import path from 'node:path';
import {build} from 'esbuild';

const root=process.cwd(),destination=path.join(root,'dist','cloudflare-static');
await build({entryPoints:[path.join(root,'apps/web/wallet-source.mjs')],bundle:true,format:'esm',outfile:path.join(root,'apps/web/wallet.bundle.js')});
fs.rmSync(destination,{recursive:true,force:true});
fs.mkdirSync(destination,{recursive:true});
for(const [source,target] of [['apps/web',''],['design/ux3a','design/ux3a'],['packages/protocol','packages/protocol']]){
 const from=path.join(root,source),to=path.join(destination,target);if(!fs.existsSync(from))throw Error(`Required static source is missing: ${source}`);
 fs.cpSync(from,to,{recursive:true});
}
console.log('Cloudflare static assets prepared from active frontend sources.');
