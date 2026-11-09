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
 const missing=[];
 if(!plan?.signer_public_key)missing.push('signer public key');
 if(!plan?.artifact_sha256)missing.push('production artifact SHA-256');
 if(!plan?.owner_authorisation)missing.push('owner authorisation bound to the final deployment intent digest');
 if(packet.hosting?.deployment_authorised!==true)missing.push('hosting destination and deployment authority');
 if(packet.providers?.spending_authorised!==true)missing.push('separate provider spending authorisation');
 return {packet_sha256:authorisationPacketDigest(packet),deployment_intent_sha256:deploymentIntentDigest(plan),ready_for_external_execution:missing.length===0,missing};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const file=process.argv[2]||'config/testnet-authorisation-proposal.json';
 const packet=JSON.parse(fs.readFileSync(file,'utf8'));
 process.stdout.write(`${JSON.stringify(inspectAuthorisationPacket(packet),null,2)}\n`);
}
