import test from 'node:test';
import assert from 'node:assert/strict';
import {probeTestnetAccount} from '../services/deployment/account-probe.mjs';

function transport({exists=true,disagree=false}={}){let endpoint=0;return async(url,{body})=>{const request=JSON.parse(body);if(url.endsWith('two'))endpoint=1;let payload;if(request.method==='status')payload={result:{chain_id:'testnet',sync_info:{syncing:false}}};else if(request.params.request_type==='view_account'&&(!exists||disagree&&endpoint)){payload={error:{cause:{name:'UNKNOWN_ACCOUNT',info:{block_height:42,block_hash:'BLOCK42'}}}};}else if(request.params.request_type==='view_account')payload={result:{block_height:41,block_hash:'BLOCK41',amount:'8000000000000000000000000',locked:'0',storage_usage:100,code_hash:'11111111111111111111111111111111'}};else payload={result:{keys:[{public_key:'ed25519:key',access_key:{permission:'FullAccess'}}]}};return new Response(JSON.stringify({jsonrpc:'2.0',...payload}));};}

test('account probe reports matching existence, balance, code and public keys without inferring ownership',async()=>{const report=await probeTestnetAccount('contra.testnet',{endpoints:['https://one','https://two'],transport:transport(),now:()=>new Date('2026-11-09T18:00:00.000Z')});assert.equal(report.status,'EXISTS');assert.equal(report.ownership_verified,false);assert.equal(report.observations[0].amount_yocto,'8000000000000000000000000');assert.equal(report.observations[0].public_keys[0].permission,'FullAccess');});

test('account probe reports matching UNKNOWN_ACCOUNT observations',async()=>{const report=await probeTestnetAccount('contra.testnet',{endpoints:['https://one','https://two'],transport:transport({exists:false})});assert.equal(report.status,'UNKNOWN_ACCOUNT');assert.equal(report.observations.length,2);assert.equal(report.observations[0].final_block_hash,'BLOCK42');});

test('account probe fails closed when RPC endpoints disagree',async()=>{await assert.rejects(probeTestnetAccount('contra.testnet',{endpoints:['https://one','https://two'],transport:transport({disagree:true})}),/disagree/);});
