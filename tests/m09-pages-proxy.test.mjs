import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest} from '../pages/functions/api/[[path]].mjs';

test('Pages API proxy uses public origin without leaking backend host to its response',async()=>{
 let forwarded;
 const backend={fetch:async request=>{forwarded=request;return new Response(JSON.stringify({ready:true}),{headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'https://personal.workers.dev'}});}};
 const response=await onRequest({env:{BACKEND:backend},request:new Request('https://contra-near.pages.dev/api/config',{headers:{Origin:'https://contra-near.pages.dev'}})});
 assert.equal(forwarded.url,'https://contra-near.pages.dev/api/config');
 assert.equal(forwarded.headers.get('Origin'),'https://contra-near.pages.dev');
 assert.equal(response.headers.get('Access-Control-Allow-Origin'),null);
 assert.match(response.headers.get('Content-Security-Policy'),/connect-src 'self'/);
 assert.equal(await response.text(),'{"ready":true}');
});

test('Pages API proxy fails closed without its private service binding',async()=>{
 const response=await onRequest({env:{},request:new Request('https://contra-near.pages.dev/api/config')});
 assert.equal(response.status,503);
 assert.match(await response.text(),/service binding unavailable/i);
});

