import test from 'node:test';
import assert from 'node:assert/strict';
import {readPersistentSession,writePersistentSession,clearPersistentSession,saveWorkspaceDraft,restoreWorkspaceDraft} from '../apps/web/browser-state.mjs';

function storage(seed={}){const values=new Map(Object.entries(seed));return {getItem:key=>values.has(key)?values.get(key):null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key),value:key=>values.get(key)};}
function root(controls){return {querySelectorAll:()=>controls};}

test('authenticated browser session survives reload and explicit disconnect removes it',()=>{
 const persistent=storage(),transient=storage();
 writePersistentSession({token:'durable-token',account:'creator.testnet',expires:2000},{persistent,transient});
 assert.deepEqual(readPersistentSession({persistent,transient,now:1000}),{token:'durable-token',account:'creator.testnet',expires:2000});
 clearPersistentSession({persistent,transient});
 assert.equal(readPersistentSession({persistent,transient,now:1000}),null);
});

test('expired sessions fail closed and are removed',()=>{
 const persistent=storage({'contra-auth-session-v1':JSON.stringify({token:'expired',account:'creator.testnet',expires:999})}),transient=storage();
 assert.equal(readPersistentSession({persistent,transient,now:1000}),null);
 assert.equal(persistent.value('contra-auth-session-v1'),undefined);
});

test('workspace drafts retain ordinary fields but never recovery secrets',()=>{
 const storageArea=storage(),controls=[
  {name:'explanation',type:'textarea',value:'Evidence explanation',disabled:false},
  {name:'disposition',type:'select-one',value:'ACCEPT',disabled:false},
  {name:'recovery_passphrase',type:'password',value:'must-not-persist',disabled:false},
  {name:'control_signature',type:'text',value:'must-not-persist',disabled:false},
 ];
 const context={route:'reviewers',account:'appeal.testnet',caseId:'abc'};
 assert.equal(saveWorkspaceDraft(root(controls),context,{storage:storageArea}),true);
 controls.forEach(control=>control.value='');
 assert.equal(restoreWorkspaceDraft(root(controls),context,{storage:storageArea}),true);
 assert.equal(controls[0].value,'Evidence explanation');assert.equal(controls[1].value,'ACCEPT');
 assert.equal(controls[2].value,'');assert.equal(controls[3].value,'');
});
