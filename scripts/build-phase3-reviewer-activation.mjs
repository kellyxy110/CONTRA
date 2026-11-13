import {createHash} from 'node:crypto';
import {canonical} from '../services/api/primitives.mjs';
import {validateWalletCall} from '../services/wallet/lifecycle.mjs';

const signerId='contra-contestation.testnet',contractAccount='contra-contestation.testnet',configRecord={owner_id:signerId};
const reviewers=[
 ['primary1.testnet','8ee3c635944bdf3722fa738cdbe655e72f850a6daa8d656828c1736d8e75732e','6780c7c2fc3cd52fe6b1f24259d88cc1d1ca21835dcd5a74871a83d2cea81378','primary',1],
 ['primary2.testnet','b7a2188fd4f2fb1ac9c5ce1a8d0f24724babdc210515a8d3eee77619bf91a5cc','fd3a502300c92694c92a0ab928637787b0ad7e4f073dc86b7d201373f144d194','primary',2],
 ['primary3.testnet','1ad2eb67e407de2897dc309024f734d9f02778e0b0f756ec85ff8a0e74f4aa9a','c67e79cb5eb2ec7572b0d95ae15c49ab06b07e667e21fc90c592573b74407d20','primary',3],
 ['appeal.testnet','fc6ffbfb43932de1c309a38cc7f23d73c5440126e6fb0d1ce5753f37d3dcb1eb','07e78c5f8154aacbde2800bd0793430e17c445d615226b567bdabbbc2eb73351','fresh',1],
 ['appeal2.testnet','8a6be4fc391c366734f61903b1257c5a29203c8582e155617439d81ab0cd3ff8','6a298c073d5235ea159e0d33ef3457b9a9a15885d76f399dff99a2439a444ea4','fresh',2],
 ['appeal3.testnet','eae6a5bb7638a3664527be7b3ba52613fce01f7de755433eb13e390c7231e47c','291cdb97676b5e6055d4effb6599507148738a81cd95872a37ca3ba681cab1fb','fresh',3]
];
const operations=reviewers.map(([reviewer_id,operator_id,disclosure_digest,committee,slot])=>{
 const call={receiverId:contractAccount,method:'set_reviewer',args:{reviewer_id,operator_id,disclosure_digest,active:true},deposit:'1'};
 const payload=validateWalletCall({network:'testnet',contractAccount,signerId,call,configRecord});
 return {operation_id:`phase3-set-reviewer-${reviewer_id}-v1`,committee,slot,payload};
});
export const packet={schema:'CONTRA_PHASE3_REVIEWER_ACTIVATION_V1',network:'testnet',contract_account:contractAccount,contract_code_hash:'EtUc3f99vfTwVoRJfS9MNCirxpQ5KpNFNen7XZUD7LA2',signer_account:signerId,signer_public_key:'ed25519:Ecmz6dGRxCXaLqJSjqbQf5XkjoCjF158ovj7XZ2upX2y',maximum_attached_deposit_per_transaction_yocto:'1',maximum_total_attached_deposit_yocto:'6',expires_at:'2026-11-15T12:00:00.000Z',operations};
export const packet_digest=createHash('sha256').update(canonical(packet)).digest('hex');
if(process.argv[1]&&import.meta.url===new URL(`file:///${process.argv[1].replaceAll('\\','/')}`).href){
 process.stdout.write(JSON.stringify({...packet,packet_digest},null,2)+'\n');
}
