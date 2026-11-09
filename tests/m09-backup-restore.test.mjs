import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {Store} from '../services/api/store.mjs';
import {acquireDataLease} from '../services/operations/data-lease.mjs';
import {backupManifestName,createBackup,verifyBackup} from '../services/operations/backup.mjs';

const root=t=>{const value=fs.mkdtempSync(path.join(os.tmpdir(),'contra-backup-'));t.after(()=>fs.rmSync(value,{recursive:true,force:true}));return value;};
const seed=directory=>{const store=new Store(directory),blob=store.put(Buffer.from('immutable backup evidence'),'text/plain');store.link('case-a',blob.digest,'alice.testnet','evidence-source');store.close();return blob;};

test('offline backup copies the complete storage unit and verifies a clean restore',t=>{
 const parent=root(t),source=path.join(parent,'source'),backup=path.join(parent,'backup'),blob=seed(source),manifest=createBackup(source,backup,{now:()=>new Date('2026-11-09T10:00:00Z')});
 assert.equal(manifest.schema,'CONTRA_BACKUP_V1');assert.match(manifest.manifest_sha256,/^[0-9a-f]{64}$/);assert.equal(manifest.storage.checkpointed,true);assert.ok(manifest.files.some(item=>item.path==='contra.sqlite'));assert.ok(manifest.files.some(item=>item.path===`objects/${blob.digest}`));
 assert.equal(fs.existsSync(path.join(backup,backupManifestName)),true);const verified=verifyBackup(backup);assert.equal(verified.verified,true);assert.equal(verified.manifest_sha256,manifest.manifest_sha256);assert.equal(verified.storage.integrity,'ok');
 const restored=new Store(backup);assert.equal(restored.read(blob.digest).bytes.toString(),'immutable backup evidence');restored.close();
});

test('backup refuses live ownership, nested paths and non-empty destinations',t=>{
 const parent=root(t),source=path.join(parent,'source'),destination=path.join(parent,'destination');seed(source);const lease=acquireDataLease(source,{purpose:'runtime'});
 assert.throws(()=>createBackup(source,destination),/already leased by runtime process/);assert.equal(fs.existsSync(destination),false);lease.release();
 assert.throws(()=>createBackup(source,path.join(source,'nested')),/separate non-nested/);fs.mkdirSync(destination);fs.writeFileSync(path.join(destination,'existing'),'x');assert.throws(()=>createBackup(source,destination),/must not exist or must be empty/);
});

test('restore verification rejects changed, missing and extra files',t=>{
 const parent=root(t),source=path.join(parent,'source');seed(source);
 for(const mode of ['changed','missing','extra']){const backup=path.join(parent,mode);createBackup(source,backup);const object=fs.readdirSync(path.join(backup,'objects'))[0],file=path.join(backup,'objects',object);if(mode==='changed')fs.appendFileSync(file,'tamper');if(mode==='missing')fs.unlinkSync(file);if(mode==='extra')fs.writeFileSync(path.join(backup,'extra'),'unexpected');assert.throws(()=>verifyBackup(backup),/inventory or checksum/);}
});

test('symbolic links are rejected instead of followed when supported',t=>{
 const parent=root(t),source=path.join(parent,'source'),backup=path.join(parent,'backup');seed(source);try{fs.symlinkSync(path.join(source,'contra.sqlite'),path.join(source,'linked.sqlite'));}catch(error){if(['EPERM','EACCES'].includes(error.code))return;throw error;}assert.throws(()=>createBackup(source,backup),/Symbolic link is forbidden/);
});
