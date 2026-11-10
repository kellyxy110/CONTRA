import {createHash} from 'node:crypto';

const ACCOUNT=/^(?=.{2,64}$)[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const KEY=/^ed25519:[1-9A-HJ-NP-Za-km-z]{32,64}$/;
const HASH=/^[1-9A-HJ-NP-Za-km-z]{32,64}$/;
const YOCTO=/^(0|[1-9][0-9]*)$/;

export function assessWalletAuthority(packet,{now=new Date(),chain={}}={}){
 const blockers=[];
 if(packet?.network!=='testnet')blockers.push('testnet network');
 if(packet?.contract_account!=='contra-contestation.testnet')blockers.push('exact contract account');
 if(!HASH.test(packet?.contract_code_hash||'')||(chain.code_hash&&chain.code_hash!==packet.contract_code_hash))blockers.push('verified contract code hash');
 if(!ACCOUNT.test(packet?.creator_account||'')||!packet.creator_public_keys?.length||packet.creator_public_keys.some(key=>!KEY.test(key)))blockers.push('verified creator identity');
 if(!ACCOUNT.test(packet?.beneficiary_account||'')||!packet.beneficiary_public_keys?.length||packet.beneficiary_public_keys.some(key=>!KEY.test(key)))blockers.push('verified beneficiary identity');
 if(packet?.beneficiary_account&&[packet.creator_account,packet.contract_account].includes(packet.beneficiary_account))blockers.push('distinct beneficiary identity');
 if(packet?.authentication_evidence?.browser_wallet_verified!==true)blockers.push('live browser wallet proof');
 if(!HASH.test(packet?.participant_control?.creator_operator_id||'')||!HASH.test(packet?.participant_control?.beneficiary_operator_id||'')||packet?.participant_control?.creator_operator_id===packet?.participant_control?.beneficiary_operator_id||packet?.participant_control?.beneficiary_consent_verified!==true)blockers.push('distinct participant control and consent');
 if(packet?.reviewer_readiness?.required_active_confirmed_distinct_operators!==6||packet?.reviewer_readiness?.verified<6)blockers.push('six eligible reviewer operators');
 if(!YOCTO.test(packet?.maximum_deposit_per_transaction_yocto||'')||!YOCTO.test(packet?.maximum_total_journey_expenditure_yocto||'')||BigInt(packet.maximum_total_journey_expenditure_yocto||0)<BigInt(packet.maximum_deposit_per_transaction_yocto||0))blockers.push('bounded expenditure limits');
 if(!packet?.expires_at||new Date(packet.expires_at)<=now)blockers.push('unexpired authority');
 if(!packet?.owner_authorisation?.approved_packet_sha256)blockers.push('owner approval');
 if(packet?.live_signing_enabled!==true)blockers.push('live signing gate');
 const approvalPayload={...packet,owner_authorisation:null,live_signing_enabled:false};
 const packet_sha256=createHash('sha256').update(JSON.stringify(approvalPayload)).digest('hex');
 if(packet?.owner_authorisation?.approved_packet_sha256&&packet.owner_authorisation.approved_packet_sha256!==packet_sha256)blockers.push('packet digest');
 const nonFinancialBlockers=new Set(['verified beneficiary identity','live browser wallet proof','distinct participant control and consent','six eligible reviewer operators','owner approval','live signing gate','packet digest']);
 return {ready:blockers.length===0,non_financial_ready:blockers.every(value=>nonFinancialBlockers.has(value))&&chain.code_hash===packet.contract_code_hash,blockers,packet_sha256};
}
