import {ApiError,canonical,sha256} from '../api/store.mjs';

const ACCOUNT_ID=/^(?=.{2,64}$)[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const HASH32=/^[0-9a-f]{64}$/;
const TX_HASH=/^[1-9A-HJ-NP-Za-km-z]{32,64}$/;
const ZERO='0';
const ONE='1';
const DISPOSITIONS=new Set(['ACCEPT','REJECT','UNRESOLVED']);

export const walletMethods=Object.freeze({
 sponsor_storage:{gas:'30000000000000',deposit:'positive',role:'owner'},
 set_reviewer:{gas:'30000000000000',deposit:ONE,role:'owner'},
 confirm_reviewer:{gas:'30000000000000',deposit:ONE,role:'self'},
 create_case:{gas:'50000000000000',deposit:ONE,role:'creator'},
 accept_terms:{gas:'30000000000000',deposit:ONE,role:'beneficiary'},
 cancel_case:{gas:'30000000000000',deposit:ONE,role:'creator'},
 fund_case:{gas:'50000000000000',deposit:'case-amount',role:'creator'},
 submit_evidence:{gas:'30000000000000',deposit:ONE,role:'beneficiary'},
 advance_round:{gas:'50000000000000',deposit:ZERO,role:'any'},
 commit_vote:{gas:'30000000000000',deposit:ZERO,role:'reviewer'},
 reveal_vote:{gas:'30000000000000',deposit:ZERO,role:'reviewer'},
 file_challenge:{gas:'30000000000000',deposit:ONE,role:'losing-party'},
 finalize_case:{gas:'100000000000000',deposit:ZERO,role:'any'},
 retry_payout:{gas:'100000000000000',deposit:ZERO,role:'any'}
});

function object(value,name){if(!value||typeof value!=='object'||Array.isArray(value))throw new ApiError(400,`${name} must be an object`);return value;}
function account(value,name){if(!ACCOUNT_ID.test(value||''))throw new ApiError(400,`Invalid ${name}`);return value;}
function amount(value){if(typeof value!=='string'||!/^\d+$/.test(value))throw new ApiError(400,'Attached deposit must be a decimal yoctoNEAR string');return value;}
function committee(caseRecord,roundId){return roundId===0?caseRecord.terms.primary_committee:roundId===1?caseRecord.terms.fresh_committee:null;}
function exact(args,names){const keys=Object.keys(args).sort(),expected=[...names].sort();if(keys.length!==expected.length||keys.some((key,index)=>key!==expected[index]))throw new ApiError(400,`Method arguments must be exactly: ${expected.join(', ')||'(none)'}`);}
function hash(value,name){if(!HASH32.test(value||''))throw new ApiError(400,`Invalid ${name}`);}
function integer(value,name,max=Number.MAX_SAFE_INTEGER){if(!Number.isInteger(value)||value<0||value>max)throw new ApiError(400,`Invalid ${name}`);}
function decimal(value,name){if(typeof value!=='string'||!/^\d+$/.test(value))throw new ApiError(400,`Invalid ${name}`);}
export function validateWalletArgs(method,args){
 const caseHash=()=>hash(args.case_id,'case_id');
 if(method==='sponsor_storage'){exact(args,[]);return;}
 if(method==='set_reviewer'){exact(args,['reviewer_id','operator_id','disclosure_digest','active']);account(args.reviewer_id,'reviewer_id');hash(args.operator_id,'operator_id');hash(args.disclosure_digest,'disclosure_digest');if(typeof args.active!=='boolean')throw new ApiError(400,'Invalid active flag');return;}
 if(method==='confirm_reviewer'){exact(args,['revision','disclosure_digest']);decimal(args.revision,'revision');hash(args.disclosure_digest,'disclosure_digest');return;}
 if(method==='create_case'){exact(args,['request_id','terms','expected_terms_digest']);hash(args.request_id,'request_id');object(args.terms,'terms');hash(args.expected_terms_digest,'expected_terms_digest');return;}
 if(method==='accept_terms'||method==='fund_case'){exact(args,['case_id','terms_digest']);caseHash();hash(args.terms_digest,'terms_digest');return;}
 if(['cancel_case','advance_round','finalize_case'].includes(method)){exact(args,['case_id']);caseHash();return;}
 if(method==='submit_evidence'){exact(args,['case_id','terms_digest','manifest_digest']);caseHash();hash(args.terms_digest,'terms_digest');hash(args.manifest_digest,'manifest_digest');return;}
 if(method==='commit_vote'){exact(args,['case_id','round_id','commitment']);caseHash();integer(args.round_id,'round_id',1);hash(args.commitment,'commitment');return;}
 if(method==='reveal_vote'){exact(args,['case_id','round_id','disposition','evidence_digest','finding_digest','nonce']);caseHash();integer(args.round_id,'round_id',1);if(!DISPOSITIONS.has(args.disposition))throw new ApiError(400,'Invalid disposition');for(const name of ['evidence_digest','finding_digest','nonce'])hash(args[name],name);return;}
 if(method==='file_challenge'){exact(args,['case_id','criterion_id','counterexample_digest']);caseHash();integer(args.criterion_id,'criterion_id',65535);hash(args.counterexample_digest,'counterexample_digest');return;}
 if(method==='retry_payout'){exact(args,['case_id','payout_intent_id','expected_attempt']);caseHash();hash(args.payout_intent_id,'payout_intent_id');integer(args.expected_attempt,'expected_attempt',4294967295);}
}

export function walletTxHash(value){if(!TX_HASH.test(value||''))throw new ApiError(400,'Invalid NEAR transaction hash');return value;}

export function validateWalletCall({network,contractAccount,signerId,call,caseRecord=null,configRecord=null,previewRecord=null}){
 if(network!=='testnet')throw new ApiError(403,'External wallet calls are testnet-only');
 account(contractAccount,'contract account');account(signerId,'signer account');
 if(!contractAccount.endsWith('.testnet')||!signerId.endsWith('.testnet'))throw new ApiError(400,'External wallet contract and signer must be testnet accounts');
 object(call,'Wallet call');const policy=walletMethods[call.method];if(!policy)throw new ApiError(400,'Contract method is not allowed for external signing');
 if(call.receiverId!==contractAccount)throw new ApiError(400,'Wallet transaction target does not match the configured contract');
 const args=object(call.args??{},'Method arguments'),deposit=amount(call.deposit??ZERO);validateWalletArgs(call.method,args);
 let expected=policy.deposit;
 if(expected==='positive'&&BigInt(deposit)<=0n)throw new ApiError(400,'Storage sponsorship requires a positive deposit');
 if(expected==='case-amount'){if(!caseRecord)throw new ApiError(409,'Finalized case state is required to validate funding');expected=String(caseRecord.terms.amount_yocto);}
 if(expected!=='positive'&&deposit!==expected)throw new ApiError(400,`Attached deposit must equal ${expected} yoctoNEAR for ${call.method}`);
 if(policy.role==='owner'&&signerId!==configRecord?.owner_id)throw new ApiError(403,'Configured contract owner must sign this method');
 if(policy.role==='creator'){
  if(call.method==='create_case'){if(!configRecord?.creator_allowlist?.includes(signerId))throw new ApiError(403,'Signer is not an admitted creator');if(!previewRecord||previewRecord.terms_digest!==args.expected_terms_digest)throw new ApiError(409,'Contract preview does not match the requested terms digest');}
  else if(signerId!==caseRecord?.creator_id)throw new ApiError(403,'Case creator must sign this method');
 }
 if(policy.role==='beneficiary'&&signerId!==caseRecord?.terms?.beneficiary_id)throw new ApiError(403,'Case beneficiary must sign this method');
 if(['accept_terms','fund_case','submit_evidence'].includes(call.method)&&args.terms_digest!==caseRecord?.terms_digest)throw new ApiError(409,'Method terms digest does not match the immutable case terms');
 if(policy.role==='reviewer'){
  const roundId=args.round_id;if(!Number.isInteger(roundId)||![0,1].includes(roundId))throw new ApiError(400,'Reviewer call requires round_id 0 or 1');
  if(!committee(caseRecord,roundId)?.some(v=>v.reviewer_id===signerId))throw new ApiError(403,'Signer is not appointed to this review round');
 }
 if(policy.role==='losing-party'){
  const expectedSigner=caseRecord?.primary_disposition==='ACCEPT'?caseRecord.creator_id:caseRecord?.primary_disposition==='REJECT'?caseRecord.terms.beneficiary_id:null;
  if(!expectedSigner||signerId!==expectedSigner)throw new ApiError(403,'Only the party disadvantaged by the primary disposition may challenge');
  if(!caseRecord.terms.criteria?.some(item=>item.criterion_id===args.criterion_id))throw new ApiError(400,'Challenge criterion is not frozen in this case');
 }
 if(call.method==='retry_payout'&&(caseRecord?.payout?.payout_intent_id!==args.payout_intent_id||Number(caseRecord?.payout?.attempt)!==args.expected_attempt))throw new ApiError(409,'Retry arguments do not match the current payout intent and attempt');
 if(policy.role==='self'){
  if(configRecord?.reviewer_id!==signerId)throw new ApiError(403,'Reviewer confirmation must be signed by a registered matching reviewer');
  if(configRecord.active!==true||String(configRecord.revision)!==args.revision||configRecord.disclosure_digest!==args.disclosure_digest)throw new ApiError(409,'Reviewer confirmation must match the active registry revision and disclosure digest');
 }
 const request={network,receiverId:contractAccount,signerId,methodName:call.method,args,gas:policy.gas,deposit};
 return {...request,payload_hash:sha256(canonical(request))};
}

export function classifyWalletError(error){
 const message=String(error?.message||error||'Wallet request failed');
 const code=error?.code==='USER_REJECTED'||/reject|declin|cancel/i.test(message)?'WALLET_REJECTION_UNVERIFIED':'WALLET_INTERRUPTED';
 return {status:'UNKNOWN',code,message:'Wallet signing did not return a transaction hash. Broadcast status is unknown and the operation must not be redispatched.'};
}

export function receiptState(receipt){
 if(!receipt||receipt.final!==true)return {status:'PENDING',confirmed:false,reason:receipt?.status||'NOT_FINAL'};
 if(receipt.execution_status==='Failure'&&receipt.success===false&&receipt.status==='FAILED')return {status:'FAILED',confirmed:false,reason:'FINAL_FAILURE'};
 if(['SuccessValue','SuccessReceiptId'].includes(receipt.execution_status)&&receipt.success===true&&receipt.status==='CONFIRMED')return {status:'CONFIRMED',confirmed:true,reason:'FINAL_SUCCESS'};
 return {status:'UNKNOWN',confirmed:false,reason:'FINAL_STATUS_AMBIGUOUS'};
}

export function verifyReceiptIntent(receipt,payload,{expectedHash=null}={}){
 if(receipt?.final!==true||receipt?.finality!=='final')throw new ApiError(409,'Receipt does not establish finalized execution');
 if(receipt?.stale===true||receipt?.regressed===true)throw new ApiError(409,'Stale or regressed finalized receipt observation rejected');
 if(!receipt?.finalized_block_hash||receipt?.finalized_block_height===null||receipt?.finalized_block_height===undefined)throw new ApiError(502,'Finalized receipt omitted block identity');
 if(receipt?.network!==payload.network)throw new ApiError(409,'Finalized receipt network does not match the prepared operation');
 if(expectedHash&&receipt?.tx_hash!==expectedHash)throw new ApiError(409,'Finalized receipt hash does not match the persisted transaction hash');
 const transaction=receipt?.result?.transaction;if(!transaction)throw new ApiError(502,'Finalized receipt omitted the signed transaction');
 if(!TX_HASH.test(transaction.hash||'')||transaction.hash!==receipt.tx_hash||(expectedHash&&transaction.hash!==expectedHash))throw new ApiError(409,'Finalized signed transaction hash is missing, malformed or does not match the persisted transaction hash');
 if(transaction.signer_id!==payload.signerId||transaction.receiver_id!==payload.receiverId)throw new ApiError(409,'Finalized transaction signer or contract does not match the prepared operation');
 const actions=transaction.actions;if(!Array.isArray(actions)||actions.length!==1||!actions[0]?.FunctionCall)throw new ApiError(409,'Finalized transaction action does not match the prepared operation');
 const action=actions[0].FunctionCall;let decoded;try{if(typeof action.args!=='string'||!action.args.length)throw Error();decoded=JSON.parse(Buffer.from(action.args,'base64').toString('utf8'));}catch{throw new ApiError(409,'Finalized transaction arguments are malformed');}
 if(action.method_name!==payload.methodName||String(action.gas)!==payload.gas||String(action.deposit)!==payload.deposit||canonical(decoded)!==canonical(payload.args))throw new ApiError(409,'Finalized transaction method, arguments, gas or deposit do not match the prepared operation');
 return true;
}

export function walletSigningRequest(operation){
 if(!operation?.payload||operation.status!=='SIGNING')throw new ApiError(409,'Persisted signing request is unavailable');
 return {operation_id:operation.operation_id,status:operation.status,transaction:{signerId:operation.payload.signerId,receiverId:operation.payload.receiverId,actions:[{type:'FunctionCall',params:{methodName:operation.payload.methodName,args:operation.payload.args,gas:operation.payload.gas,deposit:operation.payload.deposit}}]}};
}
