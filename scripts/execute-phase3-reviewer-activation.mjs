import {createHash} from 'node:crypto';
import {Account} from '@near-js/accounts';
import {KeyPair} from '@near-js/crypto';
import {JsonRpcProvider} from '@near-js/providers';
import {KeyPairSigner} from '@near-js/signers';
import {packet,packet_digest} from './build-phase3-reviewer-activation.mjs';

const APPROVED='340ea02123adf9ce9c8c0111c1c47e6847ea6d2ab378212d31fbb345b24258f9';
const RPC='https://rpc.testnet.near.org';
const provider=new JsonRpcProvider({url:RPC});
let secret='';for await(const chunk of process.stdin)secret+=chunk;secret=secret.trim();
if(secret.startsWith('{')){const parsed=JSON.parse(secret);secret=parsed.private_key||parsed.secret_key||parsed.secretKey||parsed.privateKey||'';}
const keyPair=KeyPair.fromString(secret);secret='';
if(packet_digest!==APPROVED)throw Error(`Packet digest mismatch: ${packet_digest}`);
if(Date.now()>=Date.parse(packet.expires_at))throw Error('Activation packet has expired');
if(keyPair.getPublicKey().toString()!==packet.signer_public_key)throw Error('Keychain credential does not match approved signer public key');
const signer=new KeyPairSigner(keyPair),account=new Account(packet.signer_account,provider,signer);

function assertSuccess(outcome){
 const status=outcome?.status;
 if(!status||typeof status!=='object'||(!('SuccessValue' in status)&&!('SuccessReceiptId' in status)))throw Error(`Transaction did not establish explicit success: ${JSON.stringify(status)}`);
}
async function view(method,args={}){return provider.callFunction(packet.contract_account,method,args,{finality:'final'});}
async function preflight(){
 const [state,key,config,reviewers,block]=await Promise.all([
  provider.viewAccount(packet.contract_account,{finality:'final'}),
  provider.viewAccessKey(packet.signer_account,packet.signer_public_key,{finality:'final'}),
  view('get_config'),view('list_reviewers',{from_index:'0',limit:32}),provider.viewBlock({finality:'final'})
 ]);
 const codeHash=state.code_hash||state.codeHash;
 if(codeHash!==packet.contract_code_hash)throw Error(`Contract code hash changed: ${codeHash}`);
 if(key.permission!=='FullAccess')throw Error('Approved signer key is not FullAccess');
 if(config.owner_id!==packet.signer_account||config.contract_account!==packet.contract_account)throw Error('Deployed owner or contract identity changed');
 const items=reviewers?.items||[],expected=new Set(packet.operations.map(({payload})=>payload.args.reviewer_id));
 for(const reviewer of items){
  if(!expected.has(reviewer.reviewer_id))throw Error(`Unexpected reviewer already registered: ${reviewer.reviewer_id}`);
  const operation=packet.operations.find(({payload})=>payload.args.reviewer_id===reviewer.reviewer_id);
  const args=operation.payload.args;
  if(reviewer.operator_id!==args.operator_id||reviewer.disclosure_digest!==args.disclosure_digest||reviewer.active!==true)throw Error(`Existing reviewer identity conflicts for ${reviewer.reviewer_id}`);
 }
 return {state,key,config,reviewers:items,block};
}
const initial=await preflight();
if(process.env.CONTRA_ACTIVATION_DRY_RUN==='true'){
 process.stdout.write(JSON.stringify({packet_digest,signer:packet.signer_account,contract:packet.contract_account,code_hash:initial.state.code_hash||initial.state.codeHash,final_block_height:initial.block.header.height,registered_reviewers:initial.reviewers},null,2)+'\n');
 process.exit(0);
}
const existing=new Map(initial.reviewers.map(value=>[value.reviewer_id,value]));
const receipts=[];
for(const operation of packet.operations){
 const args=operation.payload.args;
 if(existing.has(args.reviewer_id)){receipts.push({reviewer_id:args.reviewer_id,already_registered:true});continue;}
 let outcome;
 try{
  outcome=await account.callFunctionRaw({contractId:packet.contract_account,methodName:'set_reviewer',args,gas:30000000000000n,deposit:1n,waitUntil:'FINAL'});
 }catch(error){
  throw Error(`UNKNOWN after submitting ${args.reviewer_id}; do not redispatch. ${error?.message||error}`);
 }
 assertSuccess(outcome);
 const txHash=outcome.transaction?.hash;
 if(!txHash||outcome.transaction.signer_id!==packet.signer_account||outcome.transaction.receiver_id!==packet.contract_account)throw Error(`Final outcome identity mismatch for ${args.reviewer_id}`);
 const action=outcome.transaction.actions?.[0]?.FunctionCall;
 if(outcome.transaction.actions?.length!==1||!action||action.method_name!=='set_reviewer'||String(action.gas)!=='30000000000000'||String(action.deposit)!=='1')throw Error(`Final transaction action mismatch for ${args.reviewer_id}`);
 const observedArgs=JSON.parse(Buffer.from(action.args,'base64').toString('utf8'));
 if(createHash('sha256').update(JSON.stringify(observedArgs)).digest('hex')!==createHash('sha256').update(JSON.stringify(args)).digest('hex'))throw Error(`Final transaction arguments mismatch for ${args.reviewer_id}`);
 const reviewer=await view('get_reviewer',{reviewer_id:args.reviewer_id});
 if(!reviewer||reviewer.reviewer_id!==args.reviewer_id||reviewer.operator_id!==args.operator_id||reviewer.disclosure_digest!==args.disclosure_digest||reviewer.active!==true||reviewer.confirmed!==false||String(reviewer.revision)!=='1')throw Error(`Registered reviewer state mismatch for ${args.reviewer_id}`);
 receipts.push({reviewer_id:args.reviewer_id,transaction_hash:txHash,status:'FINAL_SUCCESS',reviewer});
}
const finalState=await preflight();
if(finalState.reviewers.length!==6)throw Error(`Expected six registered reviewers, observed ${finalState.reviewers.length}`);
process.stdout.write(JSON.stringify({packet_digest,signer:packet.signer_account,contract:packet.contract_account,final_block_height:finalState.block.header.height,receipts,reviewers:finalState.reviewers},null,2)+'\n');
