import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),manifest=path.join(root,'contracts/adjudication/Cargo.toml'),dir=path.join(root,'contracts/adjudication/target/wasm32-unknown-unknown');
execFileSync('cargo',['build','--manifest-path',manifest,'--target','wasm32-unknown-unknown','--release','--features','sandbox-faults'],{stdio:'inherit'});fs.copyFileSync(path.join(dir,'release/contra_adjudication.wasm'),path.join(dir,'faults.wasm'));
execFileSync('cargo',['build','--manifest-path',manifest,'--target','wasm32-unknown-unknown','--release'],{stdio:'inherit'});const production=fs.readFileSync(path.join(dir,'release/contra_adjudication.wasm')),fault=fs.readFileSync(path.join(dir,'faults.wasm'));const exports=b=>WebAssembly.Module.exports(new WebAssembly.Module(b)).map(x=>x.name);if(exports(production).includes('set_callback_fault')||!exports(fault).includes('set_callback_fault'))throw Error('Artifact feature separation failed');console.log('Production/fault Wasm feature separation verified. This is not a Sandbox execution.');
