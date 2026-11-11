import test from 'node:test';
import assert from 'node:assert/strict';
import {cloudflareProviderReadiness} from '../services/cloudflare/provider-readiness.mjs';

test('Cloudflare provider credentials remain independently gated',()=>{
 const report=cloudflareProviderReadiness({
  META_API_KEY:'secret-not-logged',META_API_BASE_URL:'https://api.meta.ai/v1/chat/completions',META_MODEL:'muse-spark-1.3',
  META_MODEL_VERIFIED:'1',META_ACCOUNT_VERIFIED:'1',META_CREDITS_VERIFIED:'1',META_PRICING_VERIFIED:'1',META_BILLING_LIMIT_VERIFIED:'0',META_SPEND_AUTHORISED:'0',META_LIVE_ENABLED:'false'
 });
 assert.equal(report.meta.status,'GATED');
 assert.equal(report.meta.gates.credential_installed,true);
 assert.equal(report.meta.gates.billing_limit_verified,false);
 assert.equal(report.baseten.status,'CREDENTIALS_PENDING');
 assert.equal(JSON.stringify(report).includes('secret-not-logged'),false);
});

test('Cloudflare provider readiness requires every external and financial gate',()=>{
 const common={META_API_KEY:'secret',META_API_BASE_URL:'https://api.meta.ai/v1/chat/completions',META_MODEL:'muse-spark-1.3',META_MODEL_VERIFIED:'1',META_ACCOUNT_VERIFIED:'1',META_CREDITS_VERIFIED:'1',META_PRICING_VERIFIED:'1',META_BILLING_LIMIT_VERIFIED:'1',META_SPEND_AUTHORISED:'1',META_LIVE_ENABLED:'true'};
 assert.equal(cloudflareProviderReadiness(common).meta.status,'READY');
 assert.equal(cloudflareProviderReadiness({...common,META_API_BASE_URL:'https://attacker.invalid/v1/chat/completions'}).meta.status,'GATED');
});

test('Modal requires both proxy-token components and an allowlisted function',()=>{
 const report=cloudflareProviderReadiness({MODAL_PROXY_KEY:'modal-key-present',MODAL_PROXY_SECRET:'modal-secret-present',MODAL_FUNCTION_ENDPOINT:'https://contra-verifier--verify.modal.run/check',MODAL_FUNCTION_ID:'contra-verifier-v1',MODAL_MODEL_VERIFIED:'1',MODAL_ACCOUNT_VERIFIED:'1',MODAL_CREDITS_VERIFIED:'1',MODAL_PRICING_VERIFIED:'1',MODAL_BILLING_LIMIT_VERIFIED:'1',MODAL_SPEND_AUTHORISED:'1',MODAL_LIVE_ENABLED:'true'});
 assert.equal(report.modal.status,'READY');
 assert.equal(JSON.stringify(report).includes('modal-key-present'),false);
 assert.equal(JSON.stringify(report).includes('modal-secret-present'),false);
});
