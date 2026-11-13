// Recovery is inspection-first; UNKNOWN operations are never automatically redispatched.
export function receiptRequest(data) {return {tx_hash:data.get('tx_hash')};}
export function operationReadPath(operationId) {return 'operation?'+new URLSearchParams({id:operationId}).toString();}
export function reconciliationRequest(operationId) {return {operation_id:operationId};}
export function operationRecoveryState(data) {
 return {canReconcile:data?.status==='UNKNOWN'&&Boolean(data.tx_hash),locked:data?.status==='UNKNOWN'&&!data.tx_hash};
}

export async function inspectReceipt(post,data) {
 return post('receipt',receiptRequest(data));
}
export async function inspectOperation(request,operationId) {
 return request(operationReadPath(operationId));
}
export async function reconcileKnownOperation(post,operationId,operation) {
 if (!operationRecoveryState(operation).canReconcile) throw Error('Operation cannot be reconciled without a known transaction hash. UNKNOWN operations must remain locked.');
 return post('wallet/reconcile',reconciliationRequest(operationId));
}
