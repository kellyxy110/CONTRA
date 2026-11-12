export const deadlineFields = ['fund_by_ns','submit_by_ns','primary_commit_end_ns','primary_reveal_end_ns','challenge_end_ns','fresh_commit_end_ns','fresh_reveal_end_ns'];

export function yocto(value) {
 if (!/^(?:0|[1-9]\d*)(?:\.\d{1,24})?$/.test(value)) throw Error('Enter a positive NEAR amount with at most 24 decimal places.');
 const [whole, fraction = ''] = value.split('.');
 const amount = BigInt(whole) * 10n ** 24n + BigInt(fraction.padEnd(24, '0'));
 if (amount <= 0n || amount > 10n ** 24n) throw Error('This authorised Testnet journey is limited to 1 NEAR per funding transaction.');
 return amount.toString();
}

export async function previewCase({data, account, post, view, requestId, now = Date.now()}) {
 const times = deadlineFields.map(field => Date.parse(data.get(field)));
 if (times.some(value => !Number.isFinite(value)) || times[0] <= now || times.some((value, i) => i > 0 && (value - times[i - 1] < 600000 || value - times[i - 1] > 7 * 86400000)) || times.at(-1) - now > 30 * 86400000) {
  throw Error('Deadlines must advance by 10 minutes to 7 days each and end within 30 days.');
 }
 const requirement = await post('terms', {text:data.get('requirement')});
 const policy = await post('terms', {text:data.get('policy')});
 const terms = {
  beneficiary_id:data.get('beneficiary_id'), creator_operator_id:data.get('creator_operator_id'),
  beneficiary_operator_id:data.get('beneficiary_operator_id'), amount_yocto:yocto(data.get('amount')),
  criteria:[{criterion_id:1,kind:data.get('kind'),requirement_digest:requirement.digest}],
  evidence_policy_digest:policy.digest, policy_version:1,
  base_fallback:'BASE_REFUND_V1', challenge_fallback:'KEEP_PRIMARY_V1',
 };
 deadlineFields.forEach((field, i) => {terms[field] = (BigInt(times[i]) * 1000000n).toString();});
 const preview = await view('preview_case', {creator_id:account, request_id:requestId, terms});
 return {terms, preview};
}
