import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

if(process.platform!=='linux')throw Error('The clean wallet build helper requires Linux.');

const root=path.resolve(import.meta.dirname,'..');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'contra-wallet-build.'));
const run=(bin,args)=>{
 const result=spawnSync(bin,args,{cwd:temporary,encoding:'utf8',maxBuffer:64000000});
 process.stdout.write(result.stdout||'');
 process.stderr.write(result.stderr||'');
 if(result.error)throw result.error;
 if(result.status!==0)throw Error(`${bin} ${args.join(' ')} exited ${result.status}`);
};

try{
 fs.mkdirSync(path.join(temporary,'apps/web'),{recursive:true});
 for(const file of['package.json','package-lock.json'])fs.copyFileSync(path.join(root,file),path.join(temporary,file));
 fs.copyFileSync(path.join(root,'apps/web/wallet-source.mjs'),path.join(temporary,'apps/web/wallet-source.mjs'));
 console.log(`Clean Linux wallet build directory: ${temporary}`);
 run('npm',['ci','--ignore-scripts','--no-audit','--no-fund']);
 run('npm',['rebuild','esbuild']);
 run('npm',['run','build:wallet']);
 const bundle=fs.readFileSync(path.join(temporary,'apps/web/wallet.bundle.js'));
 console.log(`Wallet bundle SHA-256: ${createHash('sha256').update(bundle).digest('hex')}`);
 console.log(`Build platform: ${process.platform} ${process.arch} ${process.version}`);
}finally{
 fs.rmSync(temporary,{recursive:true,force:true});
}
