import {ApiError,canonical,sha256} from '../api/store.mjs';

function text(value,name,max=1000){if(typeof value!=='string'||!value.trim()||value.length>max)throw new ApiError(400,`Invalid ${name}`);return value.trim();}
function list(value,name,max=16){if(!Array.isArray(value)||value.length>max||value.some(v=>typeof v!=='string'||!v.trim()||v.length>512))throw new ApiError(400,`Invalid ${name}`);return value.map(v=>v.trim());}

export function buildDisclosure({actor,input}){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new ApiError(400,'Structured reviewer disclosure required');
 const attested_at=text(input.attested_at,'attestation time',64);
 if(new Date(attested_at).toISOString()!==attested_at)throw new ApiError(400,'Invalid attestation time');
 const operator_label=text(input.operator_label,'operator label',256),operator_id=sha256(canonical({domain:'CONTRA:OPERATOR:v1',operator_label}));
 const control=input.control;if(!control||typeof control!=='object')throw new ApiError(400,'Control disclosure required');
 const procedure=input.procedure;if(!procedure||typeof procedure!=='object')throw new ApiError(400,'Review procedure required');
 const disclosure={schema:'CONTRA_REVIEWER_DISCLOSURE_V1',reviewer_id:actor,operator_id,operator_label,control:{common_control:text(control.common_control,'common control'),key_custody:text(control.key_custody,'key custody'),signer_control:text(control.signer_control,'signer control')},procedure:{provider:text(procedure.provider,'provider',256),model:text(procedure.model,'model',256),human_role:text(procedure.human_role,'human role')},conflicts:list(input.conflicts,'conflicts'),limitations:list(input.limitations,'limitations'),verification_sources:list(input.verification_sources,'verification sources'),attested_at};
 const bytes=Buffer.from(canonical(disclosure));return {disclosure,bytes,digest:sha256(bytes),operator_id};
}
