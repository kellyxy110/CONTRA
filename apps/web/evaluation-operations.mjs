// Development fixtures are non-binding and distinct from live model inference.
// Baseten is historical audit evidence only, never an active runtime selection.
const ACTIVE_PROVIDERS=new Set(['meta','modal']);
export function evaluationFixtureArgs({caseId,provider,account,idempotencyKey}) {
 if(!/^[0-9a-f]{64}$/i.test(caseId))throw Error('A valid case digest is required.');
 if(!ACTIVE_PROVIDERS.has(provider))throw Error('Only Meta and Modal are active providers.');
 if(!account||!idempotencyKey)throw Error('Authenticated owner and idempotency key are required.');
 return {case_id:caseId.toLowerCase(),provider,mode:'fixture',idempotency_key:idempotencyKey,reservation_micro_usd:1,payload:{scenario:'primary-development-fixture-v1'},fixture_output:{scenario:'primary-development-fixture-v1'}};
}
export async function submitDevelopmentFixture({request,post,caseId,provider,account,digestText}) {
 const key=await digestText(JSON.stringify(['primary-development-fixture-v1',account,caseId.toLowerCase(),provider]));
 const job=await post('provider/jobs',evaluationFixtureArgs({caseId,provider,account,idempotencyKey:key}));
 const history=await request('provider/jobs');
 return history.jobs?.find(item=>item.id===job.id)||job;
}
