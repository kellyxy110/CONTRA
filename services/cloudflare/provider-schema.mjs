const HASH32=/^[0-9a-f]{64}$/;
const DISPOSITIONS=new Set(['ACCEPT','REJECT','UNRESOLVED']);
const STATES=new Set(['SUPPORTED','CONTRADICTORY','INSUFFICIENT']);
const OUTCOMES=new Set(['SATISFIED','UNSATISFIED','UNRESOLVED']);
const FINDING_KEYS=['citations','criteria','disposition','evidence_state','explanation','limitations','schema'];
const VERIFY_KEYS=['checked_finding_digest','citations','issues','schema','valid'];

const findingSchema={type:'object',additionalProperties:false,required:FINDING_KEYS,properties:{schema:{const:'CONTRA_PROVIDER_FINDING_V2'},disposition:{enum:[...DISPOSITIONS]},evidence_state:{enum:[...STATES]},criteria:{type:'array',minItems:1,maxItems:64,items:{type:'object',additionalProperties:false,required:['criterion_id','outcome','citations','rationale'],properties:{criterion_id:{type:'integer',minimum:1},outcome:{enum:[...OUTCOMES]},citations:{type:'array',minItems:1,maxItems:16,items:{type:'string',pattern:'^[0-9a-f]{64}$'}},rationale:{type:'string',minLength:1,maxLength:2000}}}},citations:{type:'array',minItems:1,maxItems:16,items:{type:'string',pattern:'^[0-9a-f]{64}$'}},explanation:{type:'string',minLength:1,maxLength:4000},limitations:{type:'string',maxLength:4000}}};
const verificationSchema={type:'object',additionalProperties:false,required:VERIFY_KEYS,properties:{schema:{const:'CONTRA_PROVIDER_VERIFICATION_V1'},valid:{type:'boolean'},checked_finding_digest:{type:'string',pattern:'^[0-9a-f]{64}$'},citations:{type:'array',minItems:1,maxItems:16,items:{type:'string',pattern:'^[0-9a-f]{64}$'}},issues:{type:'array',maxItems:32,items:{type:'string',minLength:1,maxLength:1000}}}};

export function providerRequest(provider,cfg,messages,{kind='finding'}={}){
 const schema=kind==='verification'?verificationSchema:findingSchema,response_format={type:'json_schema',json_schema:{name:kind==='verification'?'contra_provider_verification':'contra_provider_finding',strict:true,schema}},input={messages,max_tokens:kind==='verification'?384:1024,temperature:0,response_format};
 if(provider==='meta')return {model:cfg.model,...input};
 if(provider==='modal')return {model:cfg.model,input};
 throw new Error('Unsupported provider');
}

export function providerOutput(provider,raw){
 const value=provider==='meta'?raw?.choices?.[0]?.message?.content:provider==='modal'?(raw?.result??raw?.output??raw?.choices?.[0]?.message?.content):null;
 if(typeof value==='string')return JSON.parse(value);
 if(value&&typeof value==='object'&&!Array.isArray(value))return value;
 throw new Error('Provider response has no structured output');
}

function exactKeys(value,keys){return value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).sort().join('\0')===keys.join('\0');}
function text(value,max,required=true){return typeof value==='string'&&value.length<=max&&(!required||value.trim().length>0);}
function citations(values,allowed){return Array.isArray(values)&&values.length>0&&values.length<=16&&new Set(values).size===values.length&&values.every(value=>HASH32.test(value)&&allowed.has(value));}

export function validateFinding(value,{criteria,allowedCitations}){
 if(!exactKeys(value,FINDING_KEYS)||value.schema!=='CONTRA_PROVIDER_FINDING_V2'||!DISPOSITIONS.has(value.disposition)||!STATES.has(value.evidence_state)||!text(value.explanation,4000)||!text(value.limitations,4000,false)||!citations(value.citations,allowedCitations))throw new Error('Invalid provider finding envelope');
 if(!Array.isArray(value.criteria)||value.criteria.length!==criteria.length)throw new Error('Provider finding must cover every frozen criterion');
 const expected=new Set(criteria.map(item=>item.criterion_id)),seen=new Set();
 for(const item of value.criteria){if(!exactKeys(item,['citations','criterion_id','outcome','rationale'])||!Number.isInteger(item.criterion_id)||!expected.has(item.criterion_id)||seen.has(item.criterion_id)||!OUTCOMES.has(item.outcome)||!citations(item.citations,allowedCitations)||!text(item.rationale,2000))throw new Error('Invalid criterion finding');seen.add(item.criterion_id);}
 const outcomes=value.criteria.map(item=>item.outcome),disposition=outcomes.includes('UNRESOLVED')?'UNRESOLVED':outcomes.includes('UNSATISFIED')?'REJECT':'ACCEPT';
 if(value.disposition!==disposition)throw new Error('Provider disposition contradicts criterion findings');
 if(value.evidence_state!=='SUPPORTED'&&(value.disposition!=='UNRESOLVED'||!outcomes.includes('UNRESOLVED')))throw new Error('Contradictory or insufficient evidence must remain unresolved');
 return value;
}

export function validateVerification(value,{proposalDigest,allowedCitations}){
 if(!exactKeys(value,VERIFY_KEYS)||value.schema!=='CONTRA_PROVIDER_VERIFICATION_V1'||typeof value.valid!=='boolean'||value.checked_finding_digest!==proposalDigest||!citations(value.citations,allowedCitations)||!Array.isArray(value.issues)||value.issues.length>32||value.issues.some(issue=>!text(issue,1000)))throw new Error('Invalid provider verification envelope');
 if(value.valid&&value.issues.length)throw new Error('A valid verification cannot contain unresolved issues');
 if(!value.valid&&!value.issues.length)throw new Error('An invalid verification must explain at least one issue');
 return value;
}
