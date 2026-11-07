# CONTRA canonical state machine v1

Freeze: CONTRA-2026-10-28-UX3C. Authoritative G01/G03 decision. ABI types/methods are defined once in [CONTRACT_ABI_V1.md](CONTRACT_ABI_V1.md). This is an untested specification.

## Canonical state, phase and outcome

State enum: Draft, Cancelled, Funded, Submitted, ReviewCommit, ReviewReveal, Provisional, Challenged, ChallengeReview, Unresolved, Resolved, SettlementPending, TransferFailed, Settled. JSON state strings are the exact PascalCase spellings here; no second uppercase state enum exists. Resolved is introduced for a decisive fresh outcome awaiting payout. RefundPending is removed. Refund eligibility is a final disposition/recipient calculation, not a separate transfer pipeline. Paid and refunded are settlement directions under Settled, not separate canonical states.

Disposition is ACCEPT/REJECT/UNRESOLVED; settlement disposition is always ACCEPT or REJECT once finalizable. resolution_basis is PRIMARY/FRESH/BASE_REFUND/KEEP_PRIMARY. Reason enum: NONE, CREATOR_CANCELLED, DRAFT_EXPIRED, SUBMISSION_EXPIRED, PRIMARY_NO_QUORUM, PRIMARY_UNRESOLVED, PRIMARY_DECISIVE, CHALLENGE_PENDING, FRESH_DECISIVE, FRESH_NO_QUORUM_KEEP_PRIMARY, FRESH_UNRESOLVED_KEEP_PRIMARY, CALLBACK_SUCCESS, CALLBACK_FAILED. Preserve the decision reason separately in payout snapshot when the current case reason changes to callback success/failure.

Round 0 phase COMMIT/REVEAL/CLOSED corresponds to ReviewCommit/ReviewReveal. Round 1 phase COMMIT/REVEAL/CLOSED is nested under ChallengeReview. No early quorum closes a round: all appointed reviewers retain their original reveal deadline. State progression only uses block_timestamp, never browser or evaluator clock.

## Absolute time policy

At creation require now < fund_by < submit_by < primary_commit_end < primary_reveal_end < challenge_end < fresh_commit_end < fresh_reveal_end. Each adjacent gap is at least 600 seconds and at most 7 days; fresh_reveal_end - creation time is at most 30 days. Hard unresolved deadline is fresh_reveal_end; it cannot be extended. All are integer nanoseconds with checked u64 arithmetic. Deadlines are included in terms_digest and beneficiary consent before funding. No arbitrary admin deadline overrides.

Writes allowed strictly BEFORE their end timestamp. At equality, that phase is expired. Round 0 commits may start after Submitted is advanced; reveal starts at primary_commit_end. Round 1 commits start when Challenged is advanced, and reveal starts at fresh_commit_end. Primary result is available only at/after primary_reveal_end. Challenge must be confirmed before challenge_end. Unchallenged decisive result finalizes at/after challenge_end; a timely challenge blocks it until the fresh round closes at/after fresh_reveal_end. No transaction's broadcast time reserves a deadline slot; receipt execution time governs.

## Transition table

| Current state / guard | Authorized method | New state / deterministic effect |
| --- | --- | --- |
| No case, valid unique request | create_case | Draft with immutable terms/snapshots; beneficiary_accepted=false; no principal |
| Draft, beneficiary matches digest, now<fund_by | accept_terms | Draft, beneficiary_accepted=true; no principal |
| Draft, original creator | cancel_case | Cancelled/CREATOR_CANCELLED; no transfer. Strictly rejects funded/previously funded cases |
| Draft, now>=fund_by | advance_round | Cancelled/DRAFT_EXPIRED; no transfer |
| Draft, accepted, snapshot still eligible, now<fund_by | fund_case | Funded; exact deposit reserved to case |
| Funded, beneficiary, now<submit_by | submit_evidence | Submitted with immutable manifest digest and round-0 evidence digest |
| Funded, now>=submit_by | advance_round | Unresolved/SUBMISSION_EXPIRED; final_disposition=REJECT, basis=BASE_REFUND; eligible_at=fresh_reveal_end |
| Submitted, now<primary_commit_end | advance_round | ReviewCommit, open round 0; membership/threshold/deadlines unchanged |
| Submitted, primary_commit_end<=now<primary_reveal_end | advance_round | ReviewReveal with same preallocated round and any commitments (usually none); no retroactive commits |
| ReviewCommit, now<primary_commit_end | commit_vote | Same state, one immutable commitment slot per member |
| ReviewCommit, now>=primary_commit_end and now<primary_reveal_end | advance_round | ReviewReveal |
| ReviewReveal, primary_commit_end<=now<primary_reveal_end | reveal_vote | Same state, one validated reveal slot |
| Submitted/ReviewCommit/ReviewReveal, now>=primary_reveal_end | advance_round | Close round 0: >=2 ACCEPT or REJECT -> Provisional; >=2 UNRESOLVED -> Unresolved/PRIMARY_UNRESOLVED; else Unresolved/PRIMARY_NO_QUORUM |
| Provisional, now<challenge_end, losing eligible party, unused challenge | file_challenge | Challenged/CHALLENGE_PENDING; immutable counterexample/criterion; freeze original decisive disposition; block ordinary release |
| Challenged, now<fresh_commit_end | advance_round | ChallengeReview/COMMIT, frozen disjoint round 1 opened |
| Challenged or ChallengeReview/COMMIT, fresh_commit_end<=now<fresh_reveal_end | advance_round | ChallengeReview/REVEAL; no replacements or extended deadline |
| ChallengeReview/COMMIT, now<fresh_commit_end | commit_vote with round_id=1 | Same state, fresh committee commitment |
| ChallengeReview/REVEAL, fresh_commit_end<=now<fresh_reveal_end | reveal_vote with round_id=1 | Same state, fresh validated reveal |
| Challenged/ChallengeReview, now>=fresh_reveal_end | advance_round | Close round 1: >=2 ACCEPT/REJECT -> Resolved/FRESH_DECISIVE with that final disposition; >=2 UNRESOLVED -> Unresolved/FRESH_UNRESOLVED_KEEP_PRIMARY; otherwise Unresolved/FRESH_NO_QUORUM_KEEP_PRIMARY |
| Provisional, no challenge, now>=challenge_end | finalize_case | Final disposition=primary, basis=PRIMARY; create immutable intent -> SettlementPending then schedule one native transfer + callback |
| Unresolved base, now>=fresh_reveal_end | finalize_case | Final disposition=REJECT, basis=BASE_REFUND -> SettlementPending for creator refund |
| Unresolved fresh, now>=fresh_reveal_end | finalize_case | Final disposition=original decisive primary, basis=KEEP_PRIMARY -> SettlementPending for corresponding recipient |
| Resolved, now>=fresh_reveal_end | finalize_case | Fresh final disposition/basis=FRESH -> SettlementPending |
| SettlementPending, matching authorized callback, actual transfer successful | on_payout_complete | Settled; record successful intent/attempt, no further payment |
| SettlementPending, matching authorized callback, actual transfer Failed | on_payout_complete | TransferFailed; mark attempt FAILED; retain immutable claim for same recipient |
| SettlementPending, callback missing/failed/unexpected result | No safe outcome transition in MVP | Remain SettlementPending, last attempt UNKNOWN, no retry; receipt monitor may flag unknown without changing payout authority |
| TransferFailed, matching intent/attempt, liquidity/gas available | retry_payout | SettlementPending, increment attempt; schedule same amount/recipient only |

advance_round normalizes directly to the phase/result due NOW, with at most two rounds and bounded fixed-size checks. It never opens a fresh round without a recorded challenge. finalize_case runs the same bounded normalization first so a missing keeper cannot force stale-state denial; no native transfer until resulting state is eligible. file_challenge and vote methods do NOT pretend that an earlier client phase is valid: if phase needs advancing first, E_PHASE, refresh/advance and retry only if still before deadline. Failed normalization inside a rejected transaction cannot be treated as persisted state by UI.

Once primary decisive result is calculated, store primary_disposition permanently even when finalization is much later. Never discard its validity merely because the observer called advance_round after challenge_end. Once fresh resolution is calculated, store final outcome immutably; subsequent methods cannot choose new votes/policy. Terminal Cancelled and Settled are read-only except idempotent matching replays. No admin path changes funded terms, committee, recipient, final verdict or pending status.

## Challenge-abuse safeguard and fallback amendment

The old single creator-refund fallback is economically exploitable: a creator loses primary review (ACCEPT), challenges and induces fresh reviewers to withhold, then receives the principal on timeout. A fixed deadline or one-challenge cap alone limits delay but does not remove this financial incentive. Requiring a digest cannot prove a counterexample has merit.

UX3C therefore narrows the fallback. BASE_REFUND_V1 applies only when the original adjudication never produced a decisive quorum, including absent delivery. KEEP_PRIMARY_V1 applies when a valid decisive primary result is challenged but fresh review is inconclusive. An inconclusive challenge does not convert ACCEPT to a creator refund, or REJECT to a beneficiary payment. Only a decisive fresh quorum can change the recipient. This is a deliberate documented amendment to the old fresh-review unresolved refund interpretation, not a silent reuse of it. State Unresolved can coexist with a payout based on the preserved primary decision; UI must say `Fresh review inconclusive; prior verdict retained`, never `fresh reviewers accepted`.

Other safeguards: exactly one challenge per case; only the party disadvantaged by the primary result may file; specific existing criterion and distinct nonzero counterexample digest; six eligible distinct-operator reviewers selected/snapshotted before funding; no replacements or outcome-dependent appointment; immutable maximum deadline; both parties consent to the two fallback policies. No new token, challenge bond, slashable stake or automated merit filter in v1. Challenger pays only normal gas and one-yocto confirmation. Frivolous challenge can still delay payout until the fixed fresh deadline. Corrupt fresh reviewers can still reverse outcomes; the protocol cannot guarantee factual truth. See threat model for this residual risk.

## Invariant interpretation

I1-I6/I8-I9 retain their original meanings. I7's bounded liveness applies to adjudication, not unknowable asynchronous payment outcome: every review path has a bounded decision policy once someone calls a keeper method; it cannot promise payment finality under callback failure. I10 recovery guarantees apply to VERIFIED_FAILED transfer attempts only. Unknown transfer results deliberately sacrifice liveness to preserve I2 (no double payout). The owner explicitly permits documenting this MVP limitation; no timeout, admin assertion or RPC observation is a substitute for contract-authenticated outcome evidence.

## Required state tests (not executed)

ST01: Creator-only unfunded cancellation; outsider/beneficiary/funded cancellation reject; concurrent fund/cancel leaves one consistent result and at most one principal claim (AC07/23).
ST02: Boundary tests at each end-1ns/end/end+1ns, overflow, backward/unordered/too-short/too-long deadlines; local clock has no authority (AC05/13/15/18).
ST03: Permissionless late advance jumps safely to correct primary/fresh phase/result; no keeper creates another round, extends window or clears a challenge (AC13/17/18).
ST04: Quorum of 2 matching valid reveals including UNRESOLVED; all 27 disposition triples plus missing/invalid votes produce deterministic result; early quorum cannot finalize (AC13/17).
ST05: Creator challenges ACCEPT and fresh reviewers all withhold or vote UNRESOLVED: keep ACCEPT/pay beneficiary, not refund. Mirror REJECT/beneficiary challenge keeps creator refund (AC16-18/32).
ST06: Decisive fresh reversal changes recipient; original votes cannot enter fresh round; no second challenge; winner cannot challenge; nonmember criterion rejects (AC14-17).
ST07: No-delivery/original no-quorum -> base unresolved refund only at maximum deadline; callback unknown remains pending after every deadline (AC18/19/22).
ST08: All disallowed state/method pairs reject with no claim/event/transfer; already settled/cancelled remain terminal (AC19/21/23/24).
