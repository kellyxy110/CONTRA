# CONTRA contract ABI v1.0.0

Freeze: CONTRA-2026-10-28-UX3C. Starting commit af0dd97558f134ac9269c7fb58cc7613df6b8202. Specification, not deployed code or a security audit.

## Authority and scope

This is the authoritative method/type/event/serialization definition. [STATE_MACHINE_V1.md](STATE_MACHINE_V1.md) owns transitions and deadlines; [COMMITTEE_POLICY_V1.md](COMMITTEE_POLICY_V1.md) owns selection; [SETTLEMENT_RECOVERY_V1.md](SETTLEMENT_RECOVERY_V1.md) owns money movement; [COMMITMENT_TEST_VECTORS.md](COMMITMENT_TEST_VECTORS.md) owns vote bytes; [THREAT_MODEL_V1.md](THREAT_MODEL_V1.md) owns risks and acceptance traceability. These six documents replace conceptual ABI/state ambiguities in PROTOCOL.md and UX3B, not the frozen UX3A visual baseline bee5a74. UX3B A01-A23 and AC01-AC33 remain integration/verification obligations with the explicit amendments in the threat model.

Single Rust adjudication contract, native NEAR testnet only. No model calls, arbitrary cross-contract execution, fungible token, slashing, upgrade, admin payout, forced recovery, arbitrary recipient or terms-edit method. The target SDK API reference reviewed is near-sdk 5.29.1; pin exact dependencies/toolchain in the first eligible implementation commit. No source implementation is created by this specification.

## Wire types and limits

| Type | JSON wire representation | Internal / validation |
| --- | --- | --- |
| Hash32 | Exactly 64 lowercase hexadecimal characters, no 0x | [u8;32]; reject malformed/uppercase/wrong-length inputs; all-zero disallowed for IDs/digests except test vectors explicitly marked synthetic |
| AccountId | Valid NEAR account string, at most 64 ASCII bytes | SDK AccountId; no normalization or case folding by contract |
| U64 / U128 | Canonical decimal string, no leading zeros except 0 | u64/u128; reject floats, signs, exponent notation and overflow |
| u8/u16/u32 | JSON integer in range | Bounded integer, no floats |
| Disposition | ACCEPT, REJECT, UNRESOLVED | Borsh ordinal 0/1/2 respectively |
| CriterionKind | GENERAL, KEYBOARD | Borsh ordinal 0/1 |
| State / Phase / Reason | Exact enum strings listed in state specification | Versioned typed enums, never user-controlled free text |
| Result<T> | Success is T; invalid calls panic with fixed E_* code and revert receipt | No business error returned after scheduling a transfer |

JSON inputs and outputs; Borsh state and hash preimages. Explicit struct field order below, not JSON key order, determines hashes. Unknown/duplicate fields and noncanonical scalar encodings reject. Do not hash JSON.stringify output. Strings are UTF-8 with u32 little-endian byte length; integer and enum encoding follows Borsh. No maps or floating point in hash schemas. Manifest digests hash exact uploaded bytes; their canonicalization scheme is declared inside the evidence policy, and byte mismatch always rejects source validation.

Pilot caps: 128 cases for contract lifetime, 32 reviewer records, 16 criteria per case, exactly 2 rounds x 3 reviewers, 1 challenge. No case deletion or reusable creation request IDs. Registry/case history stored as bounded last-64-event rings with monotonic u64 sequence; complete event logs are indexed offchain. Overflow of any counter rejects before mutation/dispatch. Reaching capacity rejects new cases, never settlement. Case storage budget is 131,072 bytes of worst-case additional storage, reserved at creation; registry writes reserve 4,096 bytes per new reviewer. An additional 131,072-byte global budget covers the registry event ring and global metadata, separately from code/existing account storage. Event payload is at most 1,024 UTF-8 bytes; persistent ring slots are fixed-capacity. Exact byte usage must be measured below these caps in sandbox before any live fund is accepted.

## Terms and canonical digests

`TermsInput` JSON fields: beneficiary_id:AccountId; creator_operator_id:Hash32; beneficiary_operator_id:Hash32; amount_yocto:U128; fund_by_ns:U64; submit_by_ns:U64; primary_commit_end_ns:U64; primary_reveal_end_ns:U64; challenge_end_ns:U64; fresh_commit_end_ns:U64; fresh_reveal_end_ns:U64; criteria:Vec<Criterion>; evidence_policy_digest:Hash32; policy_version:u16=1; base_fallback:BASE_REFUND_V1; challenge_fallback:KEEP_PRIMARY_V1.

`Criterion` fields in order: criterion_id:u16 (1..16, strictly ascending, unique); kind:CriterionKind; requirement_digest:Hash32. There must be 1..16 criteria. Text/title/source URIs are retrieved through the digest-bound offchain terms manifest, not arbitrary onchain text. Creator and beneficiary must differ from each other and current contract account. Their operator IDs must differ and are acknowledged by beneficiary acceptance; administrative attestations and their limitations are in committee policy. amount_yocto is in [1, 10^26] (at most 100 testnet NEAR); all deadline arithmetic is checked.

`ReviewerSnapshot` fields in order: reviewer_id:AccountId; operator_id:Hash32; revision:u64; disclosure_digest:Hash32. Registry confirmation and eligibility are checked at preview/create and rechecked against identical revisions at funding. Each committee is an ordered fixed array of 3 snapshots.

`FrozenTermsV1` Borsh fields, in exact order:

1. domain:String = CONTRA:TERMS:v1; chain_id:String = testnet; contract_account:AccountId; request_id:Hash32; creator_id:AccountId.
2. All TermsInput fields in the order listed above, using u128/u64 internally, criteria as Borsh Vec, fallback enums as u8 ordinal 0 for their sole allowed v1 variant.
3. primary_committee:[ReviewerSnapshot;3]; fresh_committee:[ReviewerSnapshot;3].

`terms_digest = SHA256(Borsh(FrozenTermsV1))`. Creation identity is independent of terms: `case_id = SHA256(Borsh(CreationKeyV1))`, whose fields are domain:String CONTRA:CASE:v1, chain_id:String testnet, contract_account:AccountId, creator_id:AccountId, request_id:Hash32. Reusing request_id with changed terms is an error, never a new case or mutable agreement. A draft's terms are immutable from creation; funding freezes their financial effect. To change a draft, cancel it and create with a fresh request ID. Beneficiary must call accept_terms over exact terms_digest before creator can fund. Recipient is beneficiary_id on acceptance, creator_id on rejection/base unresolved; no separate mutable payout address.

## Public change methods

All role checks use env::predecessor_account_id(), not an account argument or signer alone. Calls through multisig contracts are allowed when that predecessor is the authorized account. One yocto is an intentional confirmation deposit and belongs to nonwithdrawable operating funds, never escrow. Owner is a registry administrator, not a settlement authority.

| Method | Exact JSON arguments | Authorization / attached deposit | Success return / gas requirement |
| --- | --- | --- | --- |
| new | owner_id:AccountId, chain_id:String, creator_allowlist:Vec<AccountId> | Initialization once by predecessor=current account; chain_id=testnet; 1..8 sorted unique allowed creators; deposit 0; existing deployment account balance covers global budget, current code/storage and operating floor | Initializes Self; external successful result is empty (void); 50 Tgas |
| sponsor_storage | none | Owner only; positive attached deposit, retained as nonwithdrawable sponsor reserve | ReserveView; 30 Tgas |
| set_reviewer | reviewer_id:AccountId, operator_id:Hash32, disclosure_digest:Hash32, active:bool | Owner only; exactly 1 yocto; new record or changed record increments revision, confirmation resets | ReviewerView; 30 Tgas |
| confirm_reviewer | revision:U64, disclosure_digest:Hash32 | Predecessor's own registry record; current matching revision/digest; active; exactly 1 yocto | ReviewerView; 30 Tgas |
| create_case | request_id:Hash32, terms:TermsInput, expected_terms_digest:Hash32 | Creator=predecessor in immutable creator_allowlist; exactly 1 yocto; sufficient sponsor capacity; deterministic six-member selection | CreationResult; 50 Tgas |
| accept_terms | case_id:Hash32, terms_digest:Hash32 | Beneficiary only, Draft, now<fund_by; exactly 1 yocto | CaseView; 30 Tgas |
| cancel_case | case_id:Hash32 | Creator only, Draft, no successful fund; exactly 1 yocto | CaseView (Cancelled); 30 Tgas |
| fund_case | case_id:Hash32, terms_digest:Hash32 | Creator only, accepted Draft, now<fund_by, snapshot still eligible; deposit EXACTLY amount_yocto, not amount+1 | CaseView (Funded); 50 Tgas |
| submit_evidence | case_id:Hash32, terms_digest:Hash32, manifest_digest:Hash32 | Beneficiary only, Funded, now<submit_by; exactly 1 yocto | CaseView (Submitted); 30 Tgas |
| advance_round | case_id:Hash32 | Any predecessor; deposit 0; bounded transition specified in state machine | CaseView; 50 Tgas |
| commit_vote | case_id:Hash32, round_id:u8, commitment:Hash32 | Frozen reviewer of round 0 or 1; correct live phase/deadline; deposit 0 | RoundView; 30 Tgas |
| reveal_vote | case_id:Hash32, round_id:u8, disposition:Disposition, evidence_digest:Hash32, finding_digest:Hash32, nonce:Hash32 | Same frozen reviewer, correct reveal window; hash must match; deposit 0 | RoundView; 30 Tgas |
| file_challenge | case_id:Hash32, criterion_id:u16, counterexample_digest:Hash32 | Creator against ACCEPT or beneficiary against REJECT; Provisional, now<challenge_end, one challenge; exactly 1 yocto | CaseView (Challenged); 30 Tgas |
| finalize_case | case_id:Hash32 | Any predecessor; deposit 0; deterministic settlement eligible | FinalizeResult, immediate value, NOT promise-derived success; prepaid >=100 Tgas and remaining >=70 Tgas before dispatch |
| retry_payout | case_id:Hash32, payout_intent_id:Hash32, expected_attempt:u32 | Any predecessor; deposit 0; only matching TransferFailed from authentic Failed result | DispatchView; same gas guards as finalize_case |

No public recover_settlement, admin_mark_paid, force_refund, set_verdict, replace_committee, reopen_round, update_terms or change_recipient method exists. A missing/unavailable integration cannot call one by convention.

Native transfer is the only external action: one transfer receipt, then private on_payout_complete with 30 Tgas static callback allocation. No gas is passed as a user argument; native Transfer has runtime action cost rather than an attached function-call gas field. Other table values are minimum prepaid gas guards and wallet defaults for this v1 specification. Runtime costs/limits must be confirmed against the sandbox configuration; these are unmeasured engineering budgets, not demonstrated sufficient gas. If measured worst-case cost plus margin exceeds a guard, revise ABI specification before enabling funds. Contract scheduling panic rolls back dispatch atomically. No transfer may be scheduled if the remaining-gas guard fails.

## Private callback

`on_payout_complete(case_id:Hash32, payout_intent_id:Hash32, attempt:u32) -> CallbackView`, attached deposit 0. Require predecessor=current account and exactly one promise result; see recovery specification for mismatched/stale/invalid invocation semantics. No result, amount, receiver or claimed success is accepted from JSON. Read the actual native transfer result using bounded env::promise_result_checked(0,0). Ok(empty) is native success; explicit PromiseError::Failed is transfer failure; other errors/data are unknown, not permission to retry. Do not deserialize a user-controlled generic Result into a trusted payout result.

## Public view methods

Views attach 0 and mutate nothing. Return JSON with large integers as strings. Missing single objects return null; invalid pagination/enum arguments reject. All per-case lists use stable IDs/cursors and a maximum limit of 50.

| Method | Exact arguments | Return |
| --- | --- | --- |
| get_config | none | ConfigView {abi_version,policy_version,chain_id,contract_account,owner_id,creator_allowlist,limits,gas_policy,reserve_summary} |
| get_reviewer | reviewer_id:AccountId | ReviewerView or null |
| list_reviewers | from_index:U64, limit:u32 | {items:Vec<ReviewerView>,next_index:U64 or null}; account-lexicographic current record order |
| preview_case | creator_id:AccountId, request_id:Hash32, terms:TermsInput | {case_id,terms_digest,primary_committee,fresh_committee,policy_version}; runs same selection/validation as create without reserving state or signifying acceptance |
| get_creation | creator_id:AccountId, request_id:Hash32 | {case_id,terms_digest} or null |
| get_case | case_id:Hash32 | CaseView or null |
| list_cases | from_index:U64, limit:u32 | {items:Vec<CaseView>,next_index:U64 or null}; insertion order, no private actor filter implied |
| get_round | case_id:Hash32, round_id:u8 | RoundView or null |
| get_committee | case_id:Hash32, round_id:u8 | {members:[ReviewerSnapshot;3],threshold:2,policy_version:1} or null |
| get_payout | case_id:Hash32 | PayoutView or null |
| get_events | case_id:Hash32 or null, after_seq:U64, limit:u32 | EventPage; null selects registry/global ring, case ID selects case ring |

`CreationResult={case_id,terms_digest,replayed:bool}`. Replayed true is an identical existing request, with no new case/event. `DispatchView={case_id,payout_intent_id,attempt,state:State=SettlementPending,replayed:bool=false}`. `FinalizeResult = {kind:DISPATCHED,dispatch:DispatchView} or {kind:EXISTING,payout:PayoutView}`; repeated finalize after an intent exists returns EXISTING, including pending, failed and settled cases, never schedules a retry. retry_payout returns DispatchView only; stale attempt is E_ATTEMPT, not a new dispatch. `CallbackView={applied:bool,state:State,payout_intent_id,attempt,reason:APPLIED|DUPLICATE|STALE|MISMATCH|UNEXPECTED_RESULT}`.

`CaseView={case_id,creator_id,request_id,terms:FrozenTermsV1,terms_digest,beneficiary_accepted:bool,funded_principal_yocto:U128,principal_bucket:UNFUNDED|HELD|INFLIGHT_UNKNOWN|COMPLETED,state,reason,round_id:u8 or null,phase:COMMIT|REVEAL|CLOSED or null,evidence_digest:Hash32 or null,challenge:ChallengeView or null,primary_disposition:Disposition or null,final_disposition:Disposition or null,resolution_basis:PRIMARY|FRESH|BASE_REFUND|KEEP_PRIMARY or null,decision_at_ns:U64 or null,payout:PayoutView or null,created_at_ns:U64,funded_at_ns:U64 or null,revision:U64,last_event_seq:U64}`. funded_principal_yocto is 0 before funding, exact terms amount after successful fund and remains that lifetime amount after settlement; principal_bucket determines its current accounting class.

`ChallengeView={challenger_id,criterion_id,counterexample_digest,round_evidence_digest,submitted_at_ns}`. `RoundView={case_id,round_id,committee:[ReviewerSnapshot;3],threshold:2,phase,commit_end_ns,reveal_end_ns,evidence_digest,slots:[VoteSlot;3],counts:{accept:u8,reject:u8,unresolved:u8},closed_disposition:Disposition or null}`. `VoteSlot={reviewer_id,commitment:Hash32 or null,revealed:bool,disposition:Disposition or null,finding_digest:Hash32 or null}`; nonce is not stored after validating a reveal and is never logged. Its reveal argument is public at reveal time, so it cannot be promised confidential thereafter.

`ReviewerView={reviewer_id,operator_id,disclosure_digest,revision:U64,active:bool,confirmed:bool}`. `PayoutView={payout_intent_id,recipient_id,amount_yocto,disposition,resolution_basis,decision_reason:Reason,status:AWAITING_RESULT|FAILED_VERIFIED|SUCCESS_VERIFIED,attempt:u32,last_attempt:{attempt:u32,dispatched_at_ns:U64,result:UNKNOWN|FAILED|SUCCESS,completed_at_ns:U64 or null}}`. `ReserveView={sponsor_total_yocto,storage_reserved_yocto,held_escrow_yocto,inflight_or_unknown_yocto,paid_yocto}`; no reserve withdrawal ABI. Nullable JSON fields are explicit null, not omitted. Counts/phase/status come from stored state, not AI text; views never perform implicit persisted transitions. The client may indicate that advancement is due from the returned deadlines, but cannot label that as an executed change. decision_at_ns is the logical decision boundary: submit_by for missing submission, primary_reveal_end for primary closure, fresh_reveal_end for fresh closure. Event at_ns is the actual executing block timestamp; a late keeper does not shift any frozen decision/challenge deadline. Payout decision_reason preserves the pre-dispatch case reason even when callback changes current case reason.

## Storage and deposits

Sponsor reserve covers worst-case bounded state growth using env::storage_byte_cost(), with allocated budget per case/registry record. Existing deployment-account funds initialize sponsor accounting; initialization rejects if they cannot cover code/existing storage, global budget and a 0.1 testnet NEAR operating floor. At creation preallocate fixed vote slots, challenge/intent/attempt storage and bounded event capacity; callback cannot allocate unbounded or user-length state. Nullable JSON DTOs do NOT require variable-size Option fields in persistent storage: fixed internal slots use presence flags and fixed-width empty values so valid callback writes fit existing records. Before any capacity-growing operation, available non-escrow sponsor reserve must cover its worst-case additional budget and operating floor. At creation reserve max case bytes * current byte cost; the excess over actual use remains earmarked, never spendable escrow. Registry updates must fit their reserved maximum. Sponsor top-ups are retained and not refundable in MVP; disclose this on the admin tooling, not as a creator escrow fee.

For release/retry verify current liquid balance can cover the new transfer, all other physically held case claims, remaining storage reservation and operating floor. Use checked aggregate ledgers, not a callback-time scan over all cases. Dispatch moves amount from held to in-flight/unknown ledger before scheduling. Actual native transfer failures may return funds asynchronously; callback evidence of failure is necessary but not sufficient liquidity for retry. Unexplained account balance changes never prove a payout result. No storage/sponsor/gas cost is deducted from promised principal. One-yocto confirmations do not become case deposits. Direct unsolicited transfers do not create cases or credit escrow. See recovery document for solvency accounting and unknown-outcome limitations.

Because creation storage is sponsor-funded, immutable 1..8-account creator_allowlist admission prevents arbitrary outsiders cheaply consuming the finite case/storage capacity. There is no public admission/mutation method in v1. Non-admitted users can inspect public cases but cannot create; admitted creators and registry administrator remain trusted against capacity exhaustion. A new pilot deployment/policy is required to change admission, with existing funded cases left on their original contract. This permissioned limitation is exposed in the UI and is not presented as public permissionless escrow.

## Idempotency and errors

Creation request tombstone persists for contract lifetime. Same creator/request + identical canonical digest returns existing ID before capacity/new-case deadline checks; it cannot alter cancelled/funded cases. Different digest rejects E_REQUEST_CONFLICT. A stale registry preview must not be reinterpreted as a changed replay: consult stored key first; reconstruct terms with stored snapshot for an existing key, and compare the original TermsInput and expected digest. New requests run current selection. A transaction nonce/hash is transport identity, not business idempotency.

Identical accept_terms, submit_evidence, commit_vote or reveal_vote can return current matching record with no event/mutation, even after phase end; perform role and payload-identity checks first. Conflicting repeated payload rejects. cancel_case may return already Cancelled only to original creator. fund_case has no replay success because another attached principal would be real money: already funded rejects atomically so the duplicate attached amount is not retained by contract business logic. file_challenge can return its identical existing record to the same challenger only; a different payload/second party rejects. advance_round when nothing is due returns unchanged CaseView; it never creates a second round. finalize never creates another intent. retry requires exact expected_attempt and verified failure. Callback duplicates are no-ops when outcome already recorded; see recovery rules. No success event is re-emitted for a no-op.

Fixed error vocabulary: E_INIT, E_AUTH, E_DEPOSIT, E_NETWORK, E_INPUT, E_CAPACITY, E_STORAGE_RESERVE, E_DIGEST, E_REQUEST_CONFLICT, E_NOT_FOUND, E_TERMS, E_NOT_ACCEPTED, E_COMMITTEE, E_PHASE, E_DEADLINE, E_DUPLICATE_CONFLICT, E_COMMITMENT, E_CHALLENGE_USED, E_NOT_ELIGIBLE, E_ATTEMPT, E_OUTCOME_UNKNOWN, E_LIQUIDITY, E_GAS, E_OVERFLOW. Receipt panic code is the contract failure; RPC timeout or missing receipt is unknown, never mapped to E_* without a confirmed receipt. No mutation/events/transfer on rejected input. Logs from failed receipts are ignored by indexers.

## Events v1.0.0

Use NEP-297 `EVENT_JSON:` with {standard:"contra",version:"1.0.0",event:<name>,data:[<typed payload>]}. Emit through JSON serialization, not interpolated evidence text. Common fields: seq:U64 (per-case or global stream), case_id:Hash32 or null, actor_id:AccountId, at_ns:U64, block_height:U64, case_revision:U64 or null. Indexers add network, executor contract, block/receipt/transaction hashes from execution metadata, never from a fabricated contract field. Stable event identity=(network,contract,case_id-or-global,seq); accept logs only from successful receipts on finalized chain. Global registry events and per-case events use separate sequence spaces. Ring EventPage includes items, oldest_seq, next_after_seq, gap:bool; old cursors return gap=true, allowing index backfill from logs. Never claim full history from an evicted ring.

| Event name | Extra payload fields |
| --- | --- |
| reviewer_updated / reviewer_confirmed | reviewer_id,operator_id,revision,disclosure_digest,active,confirmed |
| reserve_sponsored | amount_yocto,sponsor_total_yocto |
| case_created | creator_id,beneficiary_id,request_id,terms_digest |
| terms_accepted / case_cancelled | terms_digest; cancellation also reason |
| case_funded | terms_digest,amount_yocto |
| evidence_submitted | manifest_digest |
| round_opened / phase_advanced | round_id,phase,commit_end_ns,reveal_end_ns,evidence_digest |
| vote_committed | round_id,reviewer_id,commitment |
| vote_revealed | round_id,reviewer_id,disposition,evidence_digest,finding_digest; never nonce |
| case_resolved | state,reason,primary_disposition,final_disposition,resolution_basis,decision_at_ns |
| challenge_filed | challenger_id,criterion_id,counterexample_digest,round_evidence_digest |
| payout_dispatched | payout_intent_id,attempt,recipient_id,amount_yocto,disposition,resolution_basis |
| payout_result | payout_intent_id,attempt,result:SUCCESS|FAILED,state |
| payout_observation_rejected | payout_intent_id,attempt,reason:STALE|MISMATCH|UNEXPECTED_RESULT; no outcome claim |

Case/registry mutations increment their revision once per business change, and emit bounded events with distinct seq. Fresh round transitions and resolution events may share the single post-call case revision but have different seq. Callback event work remains fixed-size. Service queued/running/AI-proposed events use a separate offchain envelope with job IDs, never standard contra contract events.

## Reviewed technical sources (2026-10-28)

- [NEAR private callbacks](https://docs.near.org/smart-contracts/security/cross-contract-calls/callbacks): predecessor checks are necessary; result typing alone is insufficient authentication.
- [NEAR callback failures](https://docs.near.org/smart-contracts/security/cross-contract-calls/callback-failures): callback failure does not undo earlier committed receipts; keep cleanup bounded.
- [near-sdk bounded promise result](https://docs.rs/near-sdk/latest/near_sdk/env/fn.promise_result_checked.html): distinguish explicit failed result from unexpected/oversized result.
- [NEAR serialization](https://docs.near.org/smart-contracts/anatomy/serialization), [Borsh specification](https://borsh.io/): JSON boundary and deterministic binary field encoding.
- [NEP-297](https://github.com/near/NEPs/blob/master/neps/nep-0297.md): event envelope, not an authority to accept unfinalized logs.
- [Storage staking](https://docs.near.org/protocol/storage/storage-staking), [gas](https://docs.near.org/protocol/transactions/gas), [one yocto](https://docs.near.org/smart-contracts/security/one_yocto): storage/gas/deposit assumptions must be measured against the implementation runtime.
