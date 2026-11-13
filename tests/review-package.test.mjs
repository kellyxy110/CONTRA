import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createReviewRecoveryPackage,recoverReviewReveal} from '../apps/web/review-package.mjs';

globalThis.crypto??=webcrypto;
globalThis.btoa??=value=>Buffer.from(value,'binary').toString('base64');
globalThis.atob??=value=>Buffer.from(value,'base64').toString('binary');

const hash=async value=>Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(value)))).toString('hex');
const record={case_id:'a'.repeat(64),terms_digest:'b'.repeat(64),terms:{chain_id:'testnet',contract_account:'contra-contestation.testnet'}},round={round_id:0,evidence_digest:'c'.repeat(64)},account='reviewer.testnet';

test('encrypted reviewer package recovers the exact reveal without exposing its nonce',async()=>{
 const stored=await createReviewRecoveryPackage({caseRecord:record,round,account,findingDigest:'d'.repeat(64),disposition:'ACCEPT',passphrase:'correct horse battery staple',voteCommitment:hash});
 assert.match(stored.ciphertext,/^[A-Za-z0-9+/=]+$/);assert.equal(stored.ciphertext.includes('nonce'),false);assert.equal(stored.payload_digest.length,64);
 const reveal=await recoverReviewReveal({stored,caseRecord:record,account,passphrase:'correct horse battery staple',voteCommitment:hash});
 assert.equal(reveal.case_id,record.case_id);assert.equal(reveal.disposition,'ACCEPT');assert.equal(reveal.nonce.length,64);
 await assert.rejects(recoverReviewReveal({stored,caseRecord:record,account,passphrase:'wrong passphrase value',voteCommitment:hash}),/incorrect|changed/);
});

test('reviewer package recovery rejects a changed durable identity',async()=>{
 const stored=await createReviewRecoveryPackage({caseRecord:record,round,account,findingDigest:'d'.repeat(64),disposition:'REJECT',passphrase:'another secure phrase',voteCommitment:hash});
 await assert.rejects(recoverReviewReveal({stored:{...stored,evidence_digest:'e'.repeat(64)},caseRecord:record,account,passphrase:'another secure phrase',voteCommitment:hash}),/does not match/);
});
