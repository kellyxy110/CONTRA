import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {deploymentIntentDigest} from '../services/deployment/preflight.mjs';

function canonical(value){
 if(Array.isArray(value))return `[${value.map(canonical).join(',')}]`;
 if(value&&typeof value==='object')return `{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
 return JSON.stringify(value);
}

export function authorisationPacketDigest(packet){
 const copy=structuredClone(packet);
 delete copy.packet_sha256;
 delete copy.deployment_intent_sha256;
 return createHash('sha256').update(canonical(copy)).digest('hex');
}

export function inspectAuthorisationPacket(packet){
 if(packet?.schema!=='CONTRA_EXTERNAL_AUTHORISATION_PACKET_V1')throw Error('Unsupported external authorisation packet');
 const plan=packet.deployment_plan;
 const m08=[];
 if(packet.account_observation?.status!=='EXISTS')m08.push('existing authorised contract account');
 if(!plan?.signer_public_key)m08.push('signer public key');
 if(!plan?.artifact_sha256)m08.push('production artifact SHA-256 from the supported Linux runner');
 if(!plan?.owner_authorisation)m08.push('owner authorisation bound to the final deployment intent digest');
 const m09=[];
 if(packet.hosting?.deployment_authorised!==true)m09.push('hosting destination and deployment authority');
 const m10=[];
 if(packet.providers?.spending_authorised!==true)m10.push('separate provider spending authorisation');
 const readiness={
  m08_contract_deployment:{ready:m08.length===0,missing:m08},
  m09_hosting:{ready:m09.length===0,missing:m09},
  m10_provider_usage:{ready:m10.length===0,missing:m10}
 };
 return {packet_sha256:authorisationPacketDigest(packet),deployment_intent_sha256:deploymentIntentDigest(plan),readiness};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const file=process.argv[2]||'config/testnet-authorisation-proposal.json';
 const packet=JSON.parse(fs.readFileSync(file,'utf8'));
 process.stdout.write(`${JSON.stringify(inspectAuthorisationPacket(packet),null,2)}\n`);
}
