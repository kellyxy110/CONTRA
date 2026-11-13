import {reviewerCommitmentArgs,revealTransactionArgs} from './reviewer-operations.mjs';

const encoder=new TextEncoder(),decoder=new TextDecoder();
const canonical=value=>Array.isArray(value)?`[${value.map(canonical).join(',')}]`:value&&typeof value==='object'?`{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`:JSON.stringify(value);
const hex=bytes=>[...bytes].map(value=>value.toString(16).padStart(2,'0')).join('');
const base64=bytes=>btoa(String.fromCharCode(...bytes));
const bytes=value=>Uint8Array.from(atob(value),character=>character.charCodeAt(0));
const digest=async value=>hex(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value))));

export function reviewPackageBody(record){
 const value=record?.body??record;
 if(!value||typeof value!=='object'||typeof value.ciphertext!=='string'||typeof value.commitment!=='string')throw Error('The durable review package is malformed.');
 return value;
}

async function key(passphrase,salt){
 if(typeof passphrase!=='string'||passphrase.length<12)throw Error('Use a recovery passphrase of at least 12 characters. It is never sent to CONTRA.');
 const material=await crypto.subtle.importKey('raw',encoder.encode(passphrase),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations:210000},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}

async function encrypt(payload,passphrase){
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),secret=await key(passphrase,salt),plaintext=encoder.encode(canonical(payload)),sealed=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},secret,plaintext));
 return {ciphertext:base64(encoder.encode(JSON.stringify({schema:'CONTRA_REVIEW_RECOVERY_V1',salt:base64(salt),iv:base64(iv),sealed:base64(sealed)}))),payload_digest:await digest(canonical(payload))};
}

async function decrypt(ciphertext,passphrase){
 let envelope;try{envelope=JSON.parse(decoder.decode(bytes(ciphertext)))}catch{throw Error('The encrypted recovery package is malformed.');}
 if(envelope?.schema!=='CONTRA_REVIEW_RECOVERY_V1')throw Error('The encrypted recovery package version is unsupported.');
 try{return JSON.parse(decoder.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(envelope.iv)},await key(passphrase,bytes(envelope.salt)),bytes(envelope.sealed))))}catch{throw Error('The recovery passphrase is incorrect or the package was changed.');}
}

export async function createReviewRecoveryPackage({caseRecord,round,account,findingDigest,disposition,passphrase,voteCommitment}){
 const roundId=Number(round?.round_id),evidenceDigest=round?.evidence_digest;
 if(![0,1].includes(roundId)||!evidenceDigest||!findingDigest)throw Error('A frozen reviewer round and finding are required.');
 const nonce=hex(crypto.getRandomValues(new Uint8Array(32))),reveal=revealTransactionArgs(caseRecord.case_id,roundId,disposition,evidenceDigest,findingDigest,nonce),commitment=await voteCommitment(reviewerCommitmentArgs(caseRecord,caseRecord.case_id,roundId,account,disposition,evidenceDigest,findingDigest,nonce)),payload={...reveal,reviewer_id:account,commitment};
 const encrypted=await encrypt(payload,passphrase);
 return {case_id:caseRecord.case_id,round_id:roundId,commitment,payload_digest:encrypted.payload_digest,finding_digest:findingDigest,evidence_digest:evidenceDigest,disposition,encryption:'aes-256-gcm',ciphertext:encrypted.ciphertext};
}

export async function recoverReviewReveal({stored,caseRecord,account,passphrase,voteCommitment}){
 stored=reviewPackageBody(stored);
 const payload=await decrypt(stored.ciphertext,passphrase),payloadDigest=await digest(canonical(payload));
 if(payloadDigest!==stored.payload_digest||payload.case_id!==stored.case_id||payload.round_id!==stored.round_id||payload.reviewer_id!==account||payload.finding_digest!==stored.finding_digest||payload.evidence_digest!==stored.evidence_digest||payload.disposition!==stored.disposition||payload.commitment!==stored.commitment)throw Error('The recovered review package does not match its durable identity.');
 const calculated=await voteCommitment(reviewerCommitmentArgs(caseRecord,payload.case_id,payload.round_id,account,payload.disposition,payload.evidence_digest,payload.finding_digest,payload.nonce));
 if(calculated!==stored.commitment)throw Error('The recovered review package does not match the frozen commitment.');
 return revealTransactionArgs(payload.case_id,payload.round_id,payload.disposition,payload.evidence_digest,payload.finding_digest,payload.nonce);
}
