import fs from 'node:fs';
import {digest,voteBytes,caseBytes,termsBytes,payoutBytes} from '../packages/protocol/encoding.mjs';

const doc=fs.readFileSync(new URL('../docs/COMMITMENT_TEST_VECTORS.md',import.meta.url),'utf8'),blocks=[...doc.matchAll(/```json\n([\s\S]*?)\n```/g)].map(match=>JSON.parse(match[1])),vote=blocks[0],golden=blocks[1];
const actualVote=await digest(voteBytes({chain_id:vote.chain,contract_account:vote.contract,case_id:vote.case,terms_digest:vote.terms,round_id:vote.round,reviewer_account:vote.reviewer,disposition:'ACCEPT',evidence_digest:vote.evidence,finding_digest:vote.finding,nonce:vote.nonce}));
if(actualVote!=='699b4c6db3682d7d671ac420251073d8008bc46fa0fcb4852b4c1f7a79a5a63c')throw Error('Vote commitment vector mismatch');
if(await digest(caseBytes(golden.key))!==golden.payout_intent.case_id)throw Error('Case vector mismatch');
if(await digest(termsBytes({chain_id:golden.key.chain_id,contract_account:golden.key.contract_account,request_id:golden.key.request_id,creator_id:golden.key.creator_id,...golden.terms_input,primary_committee:golden.primary_committee,fresh_committee:golden.fresh_committee}))!==golden.payout_intent.terms_digest)throw Error('Terms vector mismatch');
if(await digest(payoutBytes(golden.payout_intent))!=='124236de5e8e68eb3f366382b4c5b0e8d335ecfc83543cb6e2c647ae9415ba9c')throw Error('Payout vector mismatch');
console.log('Exact Node commitment, case, terms and payout vectors match the frozen v1 values.');
