# CONTRA settlement and recovery v1

Freeze: CONTRA-2026-10-28-UX3C. Definitive G07 decision. No onchain recovery oracle, proof verifier or administrative override in MVP. [CONTRACT_ABI_V1.md](CONTRACT_ABI_V1.md) owns methods/types; [STATE_MACHINE_V1.md](STATE_MACHINE_V1.md) owns adjudication eligibility. These are financial design requirements, not tested guarantees.

## Single immutable payout intent

Only finalize_case may create an intent, after bounded state normalization and all adjudication/deadline guards. Once created it is never replaced. Intent recipient is beneficiary on final ACCEPT and creator on REJECT, including base unresolved refund. Amount is full original funded principal. Challenge fresh-inconclusive payout uses the retained original decisive disposition, explicitly basis=KEEP_PRIMARY.

`payout_intent_id = SHA256(Borsh(IntentKeyV1))` with exact fields: domain:String CONTRA:PAYOUT:v1; chain_id:String testnet; contract_account:AccountId; case_id:Hash32; terms_digest:Hash32; recipient_id:AccountId; amount_yocto:u128; disposition:Disposition (ACCEPT/REJECT only); resolution_basis enum ordinal PRIMARY=0,FRESH=1,BASE_REFUND=2,KEEP_PRIMARY=3. No timestamp/random nonce in intent ID. Repeated finalization references this same ID and cannot choose another receiver/amount. Retry increments attempt:u32 from 1, never changes intent ID.

Before dispatch: validate state/intent, recipient!=contract, amount>0, counter headroom, liquidity, bounded storage and prepaid/remaining gas. Preallocate record space at creation. Atomically set state=SettlementPending, payout status=AWAITING_RESULT, attempt result=UNKNOWN, immutable recipient/amount/disposition/basis, dispatch timestamp; reclassify principal held -> in-flight/unknown. Then schedule EXACTLY one native NEAR Transfer action to recipient followed directly by on_payout_complete(case_id,intent_id,attempt) on current account with 30 Tgas static allocation. No token contract, arbitrary callee, function result chain, or second transfer in callback. Return the immediate FinalizeResult value; do not return the native promise as though its eventual result were a business receipt. Indexers track downstream receipts separately.

If the dispatch method panics or runs out of gas before committing, state and promises from that receipt roll back together; do not infer a broadcast transfer from a failed initiating receipt. If it commits, pending guard is already durable before other receipts execute. External calls cannot interleave inside one receipt, but may run between dispatch and callback.

## Callback authentication and outcome interpretation

1. ABI exposure is runtime-callable but marked private; assert immediate predecessor=current_account_id and attached deposit=0. Signer-only checks are insufficient.
2. Require exactly one runtime promise result. An ordinary self function call with zero results cannot claim payout success. No JSON argument describes success/failure/receiver/amount.
3. Look up exact case and stored intent; match ID, currently dispatched attempt, state=SettlementPending and last attempt UNKNOWN. Unknown case/mismatched/stale/already processed invocation has no monetary or state effect. Duplicate callbacks do not decrement/credit ledgers twice. Validated no-op callbacks may return applied=false; foreign predecessor is rejected.
4. Read env::promise_result_checked(0,0): Ok(empty) is success of the directly linked native transfer -> last attempt SUCCESS; state=Settled; payout status=SUCCESS_VERIFIED; release reservation to completed counter. Explicit PromiseError::Failed -> last attempt FAILED; state=TransferFailed; payout status=FAILED_VERIFIED; principal remains owed to the same recipient. Native Transfer returns no application bytes, so oversized/nonempty/unexpected result or wrong result count is UNKNOWN, NOT FAILED. Such observations preserve pending lock (or reject invocation) and emit at most one bounded observation record.
5. Fixed-size state writes/events only, no variable input loops, URI retrieval, result JSON parsing, admin writes or new transfer. Minimize panic paths, and reserve gas/storage headroom. Reject unauthorized entry, but legitimate failed transfer handling must not panic merely because the transfer failed.

Trust relies on runtime linkage, self-only callback and absence of other contract methods capable of scheduling fabricated results into this callback. A compromised deploy/full-access key could replace code or construct self calls and is outside this guarantee. See key-control threat and launch gate. No arbitrary-call/admin-proxy method exists.

## Verified failure retry

retry_payout is permissionless but requires case=TransferFailed AND stored attempt result=FAILED AND exact intent/expected_attempt. A transaction receipt or client claim of failure does not satisfy this check. Native asset return may not be immediately liquid when failure is observed; recheck available liquid coverage without consuming other case reservations or storage/operating funds. Lack of liquidity -> E_LIQUIDITY, retaining TransferFailed unchanged. Do not substitute sponsor balance observations for transfer outcome proof.

When eligible, increment attempt once (checked u32), reclassify owed amount to pending, set UNKNOWN, dispatch same single transfer/callback. A concurrent second retry sees pending or changed attempt and rejects. Stale old success/failure callback cannot apply to a later attempt. Max counter overflow rejects before dispatch; no rollover. A new attempt is allowed only when EVERY earlier attempt is recorded Failed by the directly linked authentic callback. Thus no successful or unknown prior transfer can be repeated. Creator, beneficiary and registry administrator have no override.

## Callback fails after transfer succeeds: explicit MVP limitation

NEAR executes transfer and callback as separate receipts. If native transfer succeeds but callback panics/out-of-gas or is incompatible after a redeploy, the recipient has the money while the contract still shows SettlementPending/UNKNOWN. The callback is not automatically retried, and failure of the callback does not reverse the transfer. Root transaction error or final aggregate receipt failure cannot be treated as transfer failure.

The MVP provides NO authenticated recovery capable of importing and verifying historical receipt proofs in contract. RPC/indexer/explorer results are useful incident evidence but cannot change this locked state. Neither a signed admin statement, elapsed deadline, current balance, screenshot, manual self callback nor second promise returning an old result is accepted. There is no recover_settlement method, force-mark-paid method or transfer retry from UNKNOWN. This intentional limitation is the definitive resolution of G07, not an unimplemented recovery claim.

Operational response: keep pending canonical state, surface `Payout result unconfirmed in contract; retry disabled`, retain transfer/callback receipt IDs and alert the operator. Offchain observation may say the transfer receipt succeeded but contract finality is unconfirmed; it must not label contract Settled. Record incident and stop acceptance/deployment expansion until reviewed. If transfer actually failed but its callback also failed, principal may be stranded even if account balance later contains returned funds. No MVP manual refund is safe. A future version may add a rigorously verified proof-based recovery design, but not by changing this case's receiver/amount or inventing a success event.

Consequently I2 takes precedence over unconditional payout liveness. I7 has bounded adjudication only, and I10 recovery is conditional on a successfully authenticated failure callback. Claims that ALL callback failures are recoverable are explicitly superseded. Sandbox must prove the safe lock behavior, not fabricate a successful recovery for the demo. Residual stranded-fund risk blocks any mainnet claim and must be prominent in a testnet pilot consent disclosure.

## Accounting invariant and solvency

Per-case principal is classified as held, in-flight/unknown, or completed exactly once. Never treat reserved principal as sponsor/storage/fees. Sum(funded principal) = held claims + in-flight/unknown claims + successfully acknowledged completed principal, with a verified-failed amount moved back to held claim. This is an accounting equation over acknowledged outcomes, not an assertion that in-flight principal remains physically in the contract account. If transfer succeeds but callback fails, it stays logically in-flight/unknown while physically at recipient; that uncertainty cannot create spendable credit.

Before a new dispatch verify liquid balance >= this transfer + other held claims + reserved storage coverage + operating floor, using conservative runtime account-balance/storage semantics tested in sandbox. Pending claims are locked and unavailable, not re-spent merely because current balance looks larger. Failed-return receipts may be asynchronous; a recorded held claim may await actual returned liquidity. Solvency tests must model that timing and ensure another case cannot consume anticipated refunds. Insufficient balance blocks new creation/funding or dispatch as appropriate, not unilateral haircut, recipient change or principal borrowing. Sponsorship is additional testnet operating capital, never fabricated escrow.

Callback records and attempts have fixed-size slots; old attempts are retained in successful-receipt event logs, last attempt in state. No unbounded attempt vector or storage allocation in callback. All public method withdrawals absent; no sponsor recovery competing with escrow. Actual maximum allocation and runtime storage costs remain mandatory sandbox measurements.

## Negative acceptance tests (not executed)

| Test | Fault / adversarial input | Required observation | Governing acceptance |
| --- | --- | --- | --- |
| SR01 | External user/contract calls callback with invented success; signer is contract but predecessor is foreign | Reject; no state/balance/result change | AC20/29, I2/I10 |
| SR02 | Self-call callback with zero/multiple promise results or wrong intent/attempt/case | Reject/no-op; NEVER successful/failed authority for active payout | AC20/22 |
| SR03 | Valid success callback delivered twice; repeat finalize and retry | One completed principal; retry disallowed; no duplicate event/ledger release | AC19-21, I2 |
| SR04 | Native transfer fails, valid callback executes, exact failed attempt retried twice concurrently | Exactly one new dispatch, same receiver/amount/intent; other attempt rejects | AC21, I1/I2/I10 |
| SR05 | Native transfer succeeds; deliberately starve callback gas or inject test-only callback panic | Recipient balance increases ONCE; canonical state stays pending/UNKNOWN; finalize/cancel/retry/admin attempt cannot schedule another transfer | AC22, I2 |
| SR06 | Transfer fails AND callback fails | State remains pending/UNKNOWN despite returned funds; retry unavailable; no manual refund or admin unlock | AC22, I2 |
| SR07 | Transfer succeeds but callback returns malformed/unexpected payload through test callee | UNKNOWN, not Failed; no retry. Production path is native Transfer only | AC20/22 |
| SR08 | Root transaction reports failure because callback failed after transfer success | UI distinguishes receipt lineage; no generic Failed/retry button for payout | AC22/24-26 |
| SR09 | RPC timeout/indexer lies about transfer, missing receipt, duplicated/out-of-order events | No onchain status change; stale/unknown source shown; only callback can settle/fail | AC20/22/25/29 |
| SR10 | Stale callback from previous failed attempt arrives during later pending attempt | No change to later attempt; receiver/amount immutable | AC20/21 |
| SR11 | Dispatch gas guard/storage/liquidity fails; max input/state; failed-return liquidity delayed | No transfer scheduled, no partial mutation; other case principal remains protected | AC07/19/21, I1 |
| SR12 | Redeploy/callback incompatibility in sandbox-only test harness | Pending unknown lock persists; no unsafe recovery claimed. No upgrade method in production ABI | AC22/33 |
| SR13 | Multi-case payouts, retry failures, unsolicited donations and sponsor top-ups interleaved | Accounting equation holds; no donation credited as escrow; no principal borrowed across cases | AC07/19-22, I1/I2 |

Fault injection belongs exclusively in eligible-window test harnesses; no production method exposes `simulate_success`, callback panic, artificial result or mock oracle. Documentation validation is not execution of SR01-SR13.

Technical basis reviewed 2026-10-28: [NEAR private callbacks](https://docs.near.org/smart-contracts/security/cross-contract-calls/callbacks), [NEAR callback failures](https://docs.near.org/smart-contracts/security/cross-contract-calls/callback-failures), [bounded promise results](https://docs.rs/near-sdk/latest/near_sdk/env/fn.promise_result_checked.html). The no-recovery/locked-unknown policy is CONTRA's conservative MVP engineering decision, not a claim that NEAR itself cannot support stronger future recovery protocols.
