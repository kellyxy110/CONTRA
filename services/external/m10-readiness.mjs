import {createHash} from 'node:crypto';

const ACCOUNT=/^(?=.{2,64}$)[a-z0-9]+(?:[._-][a-z0-9]+)*\.testnet$/;
const HASH=/^[a-f0-9]{64}$/;
const SECRET_FIELD=/(api.?key|private|secret|seed|mnemonic|credential|token)/i;
const CAPS=Object.freeze({meta:3,modal:5});

function secretFields(value,prefix=''){
 const result=[];
 if(!value||typeof value!=='object')return result;
 for(const [key,entry] of Object.entries(value)){
  const location=prefix?`${prefix}.${key}`:key;
  if(SECRET_FIELD.test(key)&&key!=='server_secret_configured')result.push(location);
  result.push(...secretFields(entry,location));
 }
 return result;
}

function canonical(value){
 if(Array.isArray(value))return `[${value.map(canonical).join(',')}]`;
 if(value&&typeof value==='object')return `{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
 return JSON.stringify(value);
}

export function controlStatementDigest(statement){
 return createHash('sha256').update(canonical(statement)).digest('hex');
}

export function assessReviewerReadiness(input,{now=()=>new Date()}={}){
 const issues=[];
 if(input?.schema!=='CONTRA_REVIEWER_EXTERNAL_READINESS_V1')issues.push('unsupported reviewer readiness schema');
 const reviewers=Array.isArray(input?.reviewers)?input.reviewers:[];
 if(reviewers.length!==6)issues.push('exactly six reviewer controls are required');
 const accounts=new Set(),operators=new Set(),primary=[],fresh=[];
 for(const [index,reviewer] of reviewers.entries()){
  const label=`reviewer ${index+1}`;
  if(!ACCOUNT.test(reviewer?.account_id||''))issues.push(`${label} account is invalid`);else if(accounts.has(reviewer.account_id))issues.push(`${label} account is duplicated`);else accounts.add(reviewer.account_id);
  if(!HASH.test(reviewer?.operator_id||''))issues.push(`${label} operator identity is invalid`);else if(operators.has(reviewer.operator_id))issues.push(`${label} operator is not independent`);else operators.add(reviewer.operator_id);
  if(reviewer?.committee==='primary')primary.push(reviewer);else if(reviewer?.committee==='fresh')fresh.push(reviewer);else issues.push(`${label} committee is invalid`);
  if(!HASH.test(reviewer?.control_statement_digest||''))issues.push(`${label} control statement digest is missing`);
  if(reviewer?.control_signature_verified!==true)issues.push(`${label} account control is unverified`);
  if(reviewer?.conflict_declared!==false)issues.push(`${label} conflict clearance is missing`);
  const from=Date.parse(reviewer?.available_from||''),until=Date.parse(reviewer?.available_until||''),at=now().getTime();
  if(!Number.isFinite(from)||!Number.isFinite(until)||from>at||until<=at)issues.push(`${label} availability is invalid or expired`);
 }
 if(primary.length!==3||fresh.length!==3)issues.push('primary and fresh committees must each contain three reviewers');
 return {ready:issues.length===0,issues,reviewer_count:reviewers.length,distinct_account_count:accounts.size,distinct_operator_count:operators.size,primary_count:primary.length,fresh_count:fresh.length};
}

export function assessProviderReadiness(input){
 const forbidden=secretFields(input);
 if(forbidden.length)throw Error(`Provider readiness contains forbidden secret fields: ${forbidden.join(', ')}`);
 if(input?.schema!=='CONTRA_PROVIDER_EXTERNAL_READINESS_V1')throw Error('Unsupported provider readiness schema');
 const providers={};
 for(const name of Object.keys(CAPS)){
  const value=input.providers?.[name]||{},issues=[];
  if(value.documentation_verified!==true)issues.push('official documentation not verified');
  if(value.account_access_verified!==true)issues.push('provider account access not verified');
  if(typeof value.model_identifier!=='string'||!value.model_identifier.trim())issues.push('exact model or function identifier not selected');
  if(value.interface_smoke_verified!==true)issues.push('non-billable interface smoke test not verified');
  if(value.credits_verified!==true)issues.push('credits not verified');
  if(value.pricing_verified!==true)issues.push('pricing not verified');
  if(value.billing_limit_verified!==true)issues.push('provider-side billing limit not verified');
  if(value.owner_authorised!==true)issues.push('owner usage authorisation missing');
  if(value.server_secret_configured!==true)issues.push('server-side secret not configured');
  if(typeof value.maximum_authorised_usd!=='number'||value.maximum_authorised_usd<=0||value.maximum_authorised_usd>CAPS[name])issues.push(`authorised amount must be within USD ${CAPS[name]}`);
  providers[name]={ready:issues.length===0,issues,maximum_programme_usd:CAPS[name],maximum_authorised_usd:value.maximum_authorised_usd??null,model_identifier:value.model_identifier||null};
 }
 return {ready:Object.values(providers).every(value=>value.ready),providers};
}

export function assessM10Readiness(input,options){
 const reviewer=assessReviewerReadiness(input?.reviewers,options),provider=assessProviderReadiness(input?.providers);
 return {ready:reviewer.ready&&provider.ready,reviewer,provider};
}
