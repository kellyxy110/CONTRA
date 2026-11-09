import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {randomUUID} from 'node:crypto';

const LOCK_NAME='.contra-data.lock';

function processAlive(pid){try{process.kill(pid,0);return true;}catch(error){return error.code==='EPERM';}}

export function acquireDataLease(directory,{purpose='runtime',pid=process.pid,host=os.hostname(),now=()=>new Date(),isProcessAlive=processAlive}={}){
 const root=path.resolve(directory);fs.mkdirSync(root,{recursive:true,mode:0o700});
 const file=path.join(root,LOCK_NAME),token=randomUUID(),record={schema:'CONTRA_DATA_LEASE_V1',purpose,pid,host,token,acquired_at:now().toISOString()};
 let descriptor;
 try{descriptor=fs.openSync(file,'wx',0o600);fs.writeFileSync(descriptor,JSON.stringify(record)+'\n');fs.fsyncSync(descriptor);}
 catch(error){if(error.code==='EEXIST'){let value;try{value=JSON.parse(fs.readFileSync(file,'utf8'));}catch{throw Error('CONTRA data directory is already leased by an unreadable lease');}if(value.host===host&&Number.isInteger(value.pid)&&!isProcessAlive(value.pid)){const stale=`${file}.stale-${token}`;try{fs.renameSync(file,stale);fs.unlinkSync(stale);}catch(reclaimError){if(reclaimError.code!=='ENOENT')throw reclaimError;}return acquireDataLease(root,{purpose,pid,host,now,isProcessAlive});}throw Error(`CONTRA data directory is already leased by ${value.purpose||'unknown'} process ${value.pid||'unknown'}`);}throw error;}
 finally{if(descriptor!==undefined)fs.closeSync(descriptor);}
 let released=false;
 return {file,record,release(){if(released)return;let current;try{current=JSON.parse(fs.readFileSync(file,'utf8'));}catch{throw Error('CONTRA data lease cannot be verified for release');}if(current.token!==token)throw Error('CONTRA data lease ownership changed');fs.unlinkSync(file);released=true;}};
}

export function dataLeasePath(directory){return path.join(path.resolve(directory),LOCK_NAME);}
