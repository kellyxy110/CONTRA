import test from 'node:test';
import assert from 'node:assert/strict';

function storage(seed={}){const values=new Map(Object.entries(seed));return {getItem:key=>values.has(key)?values.get(key):null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key),value:key=>values.get(key)};}

test('UNKNOWN browser recovery records retain operation and account identity',async()=>{
 globalThis.localStorage=storage({'contra-wallet-operations':JSON.stringify({'wallet-unknown':{operation_id:'wallet-unknown',account_id:'creator.testnet',status:'PENDING',tx_hash:null}})});globalThis.fetch=async()=>new Response(JSON.stringify({operation_id:'wallet-unknown',status:'UNKNOWN',tx_hash:null,payload:{signerId:'creator.testnet'}}),{status:200,headers:{'Content-Type':'application/json'}});const module=await import('../apps/web/wallet-source.mjs?unknown-recovery');const operation=await module.reconcileWalletTransaction({token:'token',operationId:'wallet-unknown',accountId:'creator.testnet'});assert.equal(operation.status,'UNKNOWN');const saved=module.pendingWalletOperations('creator.testnet');assert.equal(saved['wallet-unknown'].account_id,'creator.testnet');assert.equal(saved['wallet-unknown'].status,'UNKNOWN');
});

test('corrupt local storage is ignored without making a server request',async()=>{
 let requests=0;globalThis.localStorage=storage({'contra-wallet-operations':'{broken'});globalThis.fetch=async()=>{requests++;throw Error('should not run');};const module=await import('../apps/web/wallet-source.mjs?corrupt-recovery');assert.deepEqual(module.pendingWalletOperations('creator.testnet'),{});assert.equal(requests,0);
});

test('wallet invocation occurs only after persisted handoff and rejection remains UNKNOWN',async()=>{
 const requests=[];globalThis.localStorage=storage();globalThis.fetch=async(url)=>{requests.push(url);const interrupted=url.endsWith('/api/wallet/interrupt'),body={operation_id:'wallet-handoff',status:interrupted?'UNKNOWN':'SIGNING',tx_hash:null,payload:{signerId:'creator.testnet'}};return new Response(JSON.stringify(interrupted?body:{operation:body,signing_request:{operation_id:'wallet-handoff',transaction:{receiverId:'contra.testnet'}}}),{status:200,headers:{'Content-Type':'application/json'}});};const module=await import('../apps/web/wallet-source.mjs?handoff-order');let walletCalls=0;const wallet={signAndSendTransaction:async()=>{walletCalls++;throw Error('User rejected');}};await assert.rejects(module.sendPreparedWalletTransaction(wallet,{token:'token',operation:{operation_id:'wallet-handoff'}}),/rejected/);assert.deepEqual(requests,['/api/wallet/handoff','/api/wallet/interrupt']);assert.equal(walletCalls,1);assert.equal(module.pendingWalletOperations('creator.testnet')['wallet-handoff'].status,'UNKNOWN');
});

test('reload restoration inspects only the authenticated account records',async()=>{
 globalThis.localStorage=storage({'contra-wallet-operations':JSON.stringify({alice:{operation_id:'alice',account_id:'alice.testnet',status:'UNKNOWN',tx_hash:null},bob:{operation_id:'bob',account_id:'bob.testnet',status:'UNKNOWN',tx_hash:null}})});const requests=[];globalThis.fetch=async url=>{requests.push(url);return new Response(JSON.stringify({operation_id:'alice',status:'UNKNOWN',tx_hash:null,payload:{signerId:'alice.testnet'}}),{status:200,headers:{'Content-Type':'application/json'}});};const module=await import('../apps/web/wallet-source.mjs?account-restore');const restored=await module.restoreWalletOperations({token:'token',accountId:'alice.testnet'});assert.equal(restored.length,1);assert.deepEqual(requests,['/api/operation?id=alice']);assert.equal(module.pendingWalletOperations('bob.testnet').bob.account_id,'bob.testnet');
});

test('wallet hash survives a failed server callback and reload attaches it for receipt-only recovery',async()=>{
 const hash='11111111111111111111111111111111111111111111',operation={operation_id:'wallet-delayed-hash',status:'SIGNING',tx_hash:null,payload:{signerId:'creator.testnet'}},requests=[];globalThis.localStorage=storage();globalThis.fetch=async(url,options={})=>{requests.push(url);if(url.endsWith('/api/wallet/handoff'))return new Response(JSON.stringify({operation,signing_request:{operation_id:operation.operation_id,transaction:{receiverId:'contra.testnet'}}}),{status:200,headers:{'Content-Type':'application/json'}});if(url.endsWith('/api/wallet/broadcast')&&requests.filter(value=>value.endsWith('/api/wallet/broadcast')).length===1)return new Response(JSON.stringify({error:'offline'}),{status:503,headers:{'Content-Type':'application/json'}});if(url.includes('/api/operation?id='))return new Response(JSON.stringify(operation),{status:200,headers:{'Content-Type':'application/json'}});if(url.endsWith('/api/wallet/broadcast'))return new Response(JSON.stringify({...operation,status:'PENDING',tx_hash:hash}),{status:200,headers:{'Content-Type':'application/json'}});throw Error('Unexpected request '+url+' '+options.method);};const module=await import('../apps/web/wallet-source.mjs?delayed-hash');await assert.rejects(module.sendPreparedWalletTransaction({signAndSendTransaction:async()=>({transaction:{hash}})},{token:'token',operation}),error=>error.status===503&&error.txHash===hash);assert.equal(module.pendingWalletOperations('creator.testnet')[operation.operation_id].tx_hash,hash);const restored=await module.restoreWalletOperations({token:'token',accountId:'creator.testnet'});assert.equal(restored[0].status,'PENDING');assert.equal(restored[0].tx_hash,hash);assert.equal(requests.filter(value=>value.endsWith('/api/wallet/broadcast')).length,2);
});

test('testnet wallet accounts are filtered and account switching requires reauthentication',async()=>{
 globalThis.localStorage=storage();const module=await import('../apps/web/wallet-source.mjs?account-switch');const wallet={getAccounts:async()=>[{accountId:'creator.testnet',publicKey:'ed25519:11111111111111111111111111111111'},{accountId:'creator.near',publicKey:'ed25519:22222222222222222222222222222222'}]},accounts=await module.getWalletAccounts(wallet);assert.equal(accounts.length,1);assert.equal(module.selectWalletAccount(accounts).accountId,'creator.testnet');await assert.rejects(module.assertWalletAccount(wallet,'beneficiary.testnet'),/selected wallet account is unavailable/i);
});

test('account discovery permits an omitted key until NEP-413 proves control',async()=>{
 globalThis.localStorage=storage();
 const module=await import('../apps/web/wallet-source.mjs?account-discovery-without-key');
 const structuredKey={keyType:0,data:{0:1}};
 const wallet={getAccounts:async()=>[{accountId:'disposable.testnet'},{accountId:'structured.testnet',publicKey:structuredKey},{accountId:'mainnet.near'}]};
 assert.deepEqual(await module.getWalletAccounts(wallet),[{accountId:'disposable.testnet'},{accountId:'structured.testnet',publicKey:structuredKey}]);
});

test('NEP-413 browser flow binds the exact challenge and propagates rejection',async()=>{
 globalThis.localStorage=storage();const requests=[];globalThis.fetch=async(url,options={})=>{requests.push({url,body:options.body&&JSON.parse(options.body)});if(url.endsWith('/api/session/challenge'))return new Response(JSON.stringify({id:'challenge',message:'Sign in',nonce:btoa(String.fromCharCode(...new Uint8Array(32))),recipient:'localhost'}),{status:200,headers:{'Content-Type':'application/json'}});return new Response(JSON.stringify({token:'session'}),{status:200,headers:{'Content-Type':'application/json'}});};const module=await import('../apps/web/wallet-source.mjs?nep413-flow');const signed={accountId:'creator.testnet',publicKey:'ed25519:11111111111111111111111111111111',signature:'signature'},wallet={signMessage:async payload=>{assert.equal(payload.message,'Sign in');assert.equal(payload.recipient,'localhost');assert.equal(payload.nonce.length,32);return signed;}};assert.deepEqual(await module.authenticateWallet(wallet,'creator.testnet'),{token:'session'});assert.equal(requests[1].body.challenge_id,'challenge');assert.equal(requests[1].body.accountId,'creator.testnet');await assert.rejects(module.authenticateWallet({signMessage:async()=>{throw Error('User rejected signature');}},'creator.testnet'),/rejected signature/);
});

test('browser connector selects a Testnet NEP-413 wallet without financial authority',async()=>{
 const calls=[];
 const wallet={getAccounts:async()=>[{accountId:'disposable.testnet',publicKey:'ed25519:11111111111111111111111111111111'}]};
 const connector={connect:async options=>{calls.push(options);return wallet;}};
 const module=await import('../apps/web/wallet-source.mjs?near-connect-selection');
 const connected=await module.connectWallet({network:'testnet',contractAccount:'contra-contestation.testnet',authenticationAuthorized:true,connectorFactory:options=>{calls.push(options);return connector;}});
 assert.equal(connected.wallet,wallet);
 assert.deepEqual(connected.accounts,await wallet.getAccounts());
 assert.equal(calls[0].network,'testnet');
 assert.deepEqual(calls[0].features,{signMessage:true,testnet:true});
 assert.equal(calls[0].autoConnect,false);
 assert.equal(calls[0].manifest.wallets.length,1);
 assert.equal(calls[0].manifest.wallets[0].id,'meteor-wallet');
 assert.equal(calls[0].manifest.wallets[0].executor,'https://contra-near.pages.dev/vendor/meteor-near-connect.js');
 assert.equal(module.METEOR_EXECUTOR_SHA256,'96210256a89cb382bb7fe95f29d6a2489319da87472fe77018b4cdcbf1672b50');
 assert.deepEqual(calls[1],{walletId:'meteor-wallet'});
 assert.equal(calls.some(value=>value?.addFunctionCallKey),false);
});

test('browser connector explicitly signs in a new Testnet wallet without adding a key',async()=>{
 const calls=[];
 const account={accountId:'new-disposable.testnet',publicKey:'ed25519:11111111111111111111111111111111'};
 const wallet={getAccounts:async()=>[],signIn:async options=>{calls.push(options);return [account];}};
 const connector={connect:async options=>{calls.push(options);return wallet;}};
 const module=await import('../apps/web/wallet-source.mjs?near-connect-explicit-sign-in');
 const connected=await module.connectWallet({network:'testnet',contractAccount:'contra-contestation.testnet',authenticationAuthorized:true,connectorFactory:()=>connector});
 assert.deepEqual(connected.accounts,[account]);
 assert.deepEqual(calls,[{walletId:'meteor-wallet'},{network:'testnet'}]);
 assert.equal(calls.some(value=>value?.addFunctionCallKey||value?.contractId),false);
});

test('Cloudflare prepared operations are normalised for browser recovery',async()=>{
 globalThis.localStorage=storage();
 globalThis.fetch=async()=>new Response(JSON.stringify({id:'wallet-cloudflare',status:'PREPARED',tx_hash:null,payload_json:JSON.stringify({signerId:'creator.testnet'})}),{status:201,headers:{'Content-Type':'application/json'}});
 const module=await import('../apps/web/wallet-source.mjs?cloudflare-prepare');
 const operation=await module.prepareWalletTransaction({token:'token',accountId:'creator.testnet',operationId:'wallet-cloudflare',call:{method:'create_case',args:{}}});
 assert.equal(operation.operation_id,'wallet-cloudflare');
 assert.equal(operation.payload.signerId,'creator.testnet');
 assert.equal(module.pendingWalletOperations('creator.testnet')['wallet-cloudflare'].status,'PREPARED');
});
