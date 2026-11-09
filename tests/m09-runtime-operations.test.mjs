import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {acquireDataLease,dataLeasePath} from '../services/operations/data-lease.mjs';
import {startRuntime,stopRuntime} from '../services/api/server.mjs';

const directory=t=>{const value=fs.mkdtempSync(path.join(os.tmpdir(),'contra-m09-'));t.after(()=>fs.rmSync(value,{recursive:true,force:true}));return value;};

test('durable data lease rejects concurrent process ownership and verifies release identity',t=>{
 const root=directory(t),first=acquireDataLease(root,{purpose:'runtime',pid:100,host:'test-host',now:()=>new Date('2026-11-09T09:00:00Z')});
 assert.equal(JSON.parse(fs.readFileSync(dataLeasePath(root),'utf8')).purpose,'runtime');
 assert.throws(()=>acquireDataLease(root,{purpose:'backup',pid:200,host:'test-host',isProcessAlive:()=>true}),/already leased by runtime process 100/);
 const altered={...first.record,token:'different'};fs.writeFileSync(first.file,JSON.stringify(altered));assert.throws(()=>first.release(),/ownership changed/);
 fs.writeFileSync(first.file,JSON.stringify(first.record));first.release();assert.equal(fs.existsSync(first.file),false);
});

test('a terminated process lease on the same host is reclaimed without weakening live exclusion',t=>{
 const root=directory(t),first=acquireDataLease(root,{pid:101,host:'test-host'}),second=acquireDataLease(root,{pid:202,host:'test-host',isProcessAlive:pid=>pid!==101});
 assert.equal(second.record.pid,202);assert.notEqual(second.record.token,first.record.token);second.release();
});

test('runtime holds one durable directory lease and graceful shutdown permits a clean restart',async t=>{
 const root=directory(t),env={CONTRA_CHAIN_MODE:'unavailable',CONTRA_DATA_DIR:root,HOST:'127.0.0.1',PORT:'4174'};
 const first=await startRuntime(env);await new Promise(resolve=>first.app.server.listen(0,'127.0.0.1',resolve));
 await assert.rejects(startRuntime(env),/already leased by runtime process/);assert.equal(fs.existsSync(dataLeasePath(root)),true);
 await stopRuntime(first);assert.equal(fs.existsSync(dataLeasePath(root)),false);
 const second=await startRuntime(env);await new Promise(resolve=>second.app.server.listen(0,'127.0.0.1',resolve));await stopRuntime(second);
 assert.equal(fs.existsSync(dataLeasePath(root)),false);
});

test('failed runtime initialisation releases its durable directory lease',async t=>{
 const root=directory(t);fs.mkdirSync(path.join(root,'contra.sqlite'));
 await assert.rejects(startRuntime({CONTRA_CHAIN_MODE:'unavailable',CONTRA_DATA_DIR:root}),/directory|open/i);
 assert.equal(fs.existsSync(dataLeasePath(root)),false);
});
