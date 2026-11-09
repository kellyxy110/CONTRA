import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {Store} from '../api/store.mjs';
import {acquireDataLease} from './data-lease.mjs';

const MANIFEST='contra-backup-manifest.json';
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const inside=(parent,child)=>child===parent||child.startsWith(parent+path.sep);

function files(root){
 const output=[];
 function visit(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){if(entry.name==='.contra-data.lock'||entry.name===MANIFEST)continue;const absolute=path.join(directory,entry.name),relative=path.relative(root,absolute).replaceAll('\\','/');if(entry.isSymbolicLink())throw Error(`Symbolic link is forbidden in CONTRA storage: ${relative}`);if(entry.isDirectory())visit(absolute);else if(entry.isFile())output.push({path:relative,size:entry.size,sha256:hash(absolute)});else throw Error(`Unsupported storage entry: ${relative}`);}}visit(root);return output;
}

function roots(source,destination){
 const from=path.resolve(source),to=path.resolve(destination);
 if(from===path.parse(from).root||to===path.parse(to).root)throw Error('Backup paths must not be filesystem roots');
 if(inside(from,to)||inside(to,from))throw Error('Backup source and destination must be separate non-nested directories');
 return {from,to};
}

export function createBackup(source,destination,{now=()=>new Date()}={}){
 const {from,to}=roots(source,destination);if(!fs.existsSync(from))throw Error('Backup source does not exist');
 if(fs.existsSync(to)&&fs.readdirSync(to).length)throw Error('Backup destination must not exist or must be empty');
 const lease=acquireDataLease(from,{purpose:'backup'});let store;fs.mkdirSync(to,{recursive:true,mode:0o700});
 try{
  store=new Store(from);const storage=store.prepareBackup();store.close();store=null;
  for(const item of files(from)){const sourceFile=path.join(from,...item.path.split('/')),target=path.join(to,...item.path.split('/'));fs.mkdirSync(path.dirname(target),{recursive:true,mode:0o700});fs.copyFileSync(sourceFile,target,fs.constants.COPYFILE_EXCL);}
  const copied=files(to),manifest={schema:'CONTRA_BACKUP_V1',created_at:now().toISOString(),storage,files:copied},manifestPath=path.join(to,MANIFEST);fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n',{mode:0o600,flag:'wx'});
  verifyBackup(to);return {...manifest,manifest_sha256:hash(manifestPath)};
 }catch(error){try{store?.close();}catch{}throw error;}finally{lease.release();}
}

export function verifyBackup(directory){
 const root=path.resolve(directory),manifestPath=path.join(root,MANIFEST);if(!fs.existsSync(manifestPath))throw Error('CONTRA backup manifest is missing');
 const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));if(manifest.schema!=='CONTRA_BACKUP_V1'||!Array.isArray(manifest.files))throw Error('CONTRA backup manifest is invalid');
 const actual=files(root);if(JSON.stringify(actual)!==JSON.stringify(manifest.files))throw Error('CONTRA backup file inventory or checksum does not match its manifest');
 const lease=acquireDataLease(root,{purpose:'restore-verification'});let store;try{store=new Store(root);const storage=store.audit();return {verified:true,manifest_sha256:hash(manifestPath),manifest,storage};}finally{store?.close();lease.release();}
}

export const backupManifestName=MANIFEST;
