import {ApiError,canonical,sha256} from '../api/store.mjs';

const DIGEST=/^[0-9a-f]{64}$/;
const ACCESS=new Set(['CASE_PARTICIPANTS']);

function requiredText(value,name,max=512){
 if(typeof value!=='string'||!value.trim()||value.length>max)throw new ApiError(400,`Invalid ${name}`);
 return value.trim();
}

function iso(value,name){
 const text=requiredText(value,name,64),time=Date.parse(text);
 if(!Number.isFinite(time)||new Date(time).toISOString()!==text)throw new ApiError(400,`Invalid ${name}`);
 return text;
}

export function buildManifest({caseRecord,actor,input,putSource,readManifest}){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new ApiError(400,'Structured evidence manifest required');
 const frozen=new Set(caseRecord.terms.criteria.map(v=>v.criterion_id));
 if(!Array.isArray(input.criteria)||input.criteria.length!==frozen.size)throw new ApiError(400,'Manifest must cover every frozen criterion exactly once');
 if(!Array.isArray(input.sources)||input.sources.length<1||input.sources.length>64)throw new ApiError(400,'Manifest requires 1 to 64 sources');
 const sourceIds=new Set(),sources=input.sources.map((source,index)=>{
  if(!source||typeof source!=='object')throw new ApiError(400,'Invalid source');
  const source_id=requiredText(source.source_id,`source ${index+1} id`,64);
  if(sourceIds.has(source_id))throw new ApiError(400,'Duplicate source id');sourceIds.add(source_id);
  const media_type=requiredText(source.media_type,`source ${source_id} media type`,128);
  if(!['text/plain','application/json','text/markdown'].includes(media_type))throw new ApiError(400,'Unsupported source media type');
  const encoding=source.encoding||'utf8';
  if(!['utf8','base64'].includes(encoding)||typeof source.content!=='string')throw new ApiError(400,'Invalid source content');
  let bytes;try{bytes=Buffer.from(source.content,encoding);}catch{throw new ApiError(400,'Invalid source encoding');}
  if(!bytes.length)throw new ApiError(400,'Empty evidence source');
  const stored=putSource(bytes,media_type);
  if(source.digest&&source.digest!==stored.digest)throw new ApiError(409,'Declared source digest does not match uploaded bytes');
  const provenance=source.provenance;
  if(!provenance||typeof provenance!=='object')throw new ApiError(400,'Source provenance required');
  return {source_id,digest:stored.digest,size:stored.size,media_type,access:ACCESS.has(source.access)?source.access:'CASE_PARTICIPANTS',provenance:{origin:requiredText(provenance.origin,'provenance origin',512),captured_at:iso(provenance.captured_at,'provenance captured_at'),submitted_by:actor}};
 });
 const criteriaIds=new Set(),criteria=input.criteria.map(entry=>{
  if(!entry||!Number.isSafeInteger(entry.criterion_id)||!frozen.has(entry.criterion_id)||criteriaIds.has(entry.criterion_id))throw new ApiError(400,'Invalid or duplicate criterion evidence');
  criteriaIds.add(entry.criterion_id);
  if(!Array.isArray(entry.source_ids)||!entry.source_ids.length||entry.source_ids.some(id=>!sourceIds.has(id)))throw new ApiError(400,'Criterion must cite stored manifest sources');
  if(new Set(entry.source_ids).size!==entry.source_ids.length)throw new ApiError(400,'Duplicate criterion source citation');
  return {criterion_id:entry.criterion_id,claim:requiredText(entry.claim,'criterion claim',2000),source_ids:[...entry.source_ids]};
 }).sort((a,b)=>a.criterion_id-b.criterion_id);
 let correction=null;
 if(input.correction_of!==undefined&&input.correction_of!==null){
  if(!DIGEST.test(input.correction_of))throw new ApiError(400,'Invalid correction target');
  const prior=readManifest(input.correction_of);
  if(!prior||prior.case_id!==caseRecord.case_id)throw new ApiError(409,'Correction target is not a manifest for this case');
  correction={of:input.correction_of,reason:requiredText(input.correction_reason,'correction reason',1000)};
 }
 const manifest={schema:'CONTRA_EVIDENCE_V1',case_id:caseRecord.case_id,terms_digest:caseRecord.terms_digest,submitted_by:actor,created_at:iso(input.created_at,'created_at'),access:'CASE_PARTICIPANTS',criteria,sources,correction};
 const bytes=Buffer.from(canonical(manifest));
 return {manifest,bytes,digest:sha256(bytes)};
}

export function parseManifest(bytes){
 try{const value=JSON.parse(bytes.toString('utf8'));return value?.schema==='CONTRA_EVIDENCE_V1'?value:null;}catch{return null;}
}
