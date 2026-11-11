import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {build} from 'esbuild';

const root=process.cwd(),destination=path.join(root,'dist','cloudflare-static');
const meteorCommit='ef1be35fc3712f2de60a7563aed543d78e73f763';
const meteorSha256='96210256a89cb382bb7fe95f29d6a2489319da87472fe77018b4cdcbf1672b50';
const meteorUrl=`https://raw.githubusercontent.com/Meteor-Wallet/meteor_wallet_sdk/${meteorCommit}/storage/meteor-near-connect-latest.js`;
await build({entryPoints:[path.join(root,'apps/web/wallet-source.mjs')],bundle:true,format:'esm',outfile:path.join(root,'apps/web/wallet.bundle.js')});
fs.rmSync(destination,{recursive:true,force:true});
fs.mkdirSync(destination,{recursive:true});
for(const [source,target] of [['apps/web',''],['design/ux3a','design/ux3a'],['packages/protocol','packages/protocol']]){
 const from=path.join(root,source),to=path.join(destination,target);if(!fs.existsSync(from))throw Error(`Required static source is missing: ${source}`);
 fs.cpSync(from,to,{recursive:true});
}
const meteorResponse=await fetch(meteorUrl);
if(!meteorResponse.ok)throw Error(`Pinned Meteor executor download failed with HTTP ${meteorResponse.status}.`);
const meteorExecutor=Buffer.from(await meteorResponse.arrayBuffer());
const actualMeteorSha256=crypto.createHash('sha256').update(meteorExecutor).digest('hex');
if(actualMeteorSha256!==meteorSha256)throw Error(`Pinned Meteor executor checksum mismatch: ${actualMeteorSha256}.`);
fs.mkdirSync(path.join(destination,'vendor'),{recursive:true});
fs.writeFileSync(path.join(destination,'vendor','meteor-near-connect.js'),meteorExecutor);
console.log('Cloudflare static assets prepared from active frontend sources.');
