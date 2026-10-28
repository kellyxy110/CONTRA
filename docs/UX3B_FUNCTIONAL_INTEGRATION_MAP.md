# CONTRA UX3B functional integration map

Current ABI/policy authority: UX3C CONTRACT_ABI_V1.md and companion state/committee/recovery/vector/threat documents. UX3B routes and A01-A23 remain integration context; its conceptual signatures, G01-G07 alternatives and any conflicting fallback/recovery assumption are superseded. G01-G07 are RESOLVED AT SPECIFICATION LEVEL, with exact decisions and test mapping in THREAT_MODEL_V1.md. Add accept_terms before funding and restrict create_case to the immutable pilot creator allowlist. No visual code changes. Earlier proposal language below is historical, not an invitation to select another ABI.


Checkpoint: CONTRA-2026-10-28-UX3B
Date: 2026-10-28
Status: Engineering specification delivered; integrations not implemented.
Visual authority: owner-approved, frozen commit bee5a7481d56c86d4c9860280b8367f82af0cb5a.
Dependencies: docs/PROTOCOL.md, docs/PRD.md, docs/ARCHITECTURE.md and docs/UX3B_ENGINEERING_ACCEPTANCE.md.

## Scope and authority

The owner approved UX3A in the UX3B request. Earlier statements that UX3A approval was pending are historical and superseded. UX3B preserves the approved sidebar, three columns, panel bounds, sector radar, cards, fonts, spacing and six NEAR colors. This document maps behavior onto those surfaces; it does not change their code or introduce a new visual direction.

All contract method names below come from the existing conceptual protocol unless marked proposed. No deployed ABI, contract account, service endpoint, reviewer registry or live result has been verified. API paths, request schemas and route names below are proposed engineering interfaces, not claims of working services. Final signatures, gas/storage deposits and serialization must be pinned against the implemented ABI before wiring signing actions.

Existing escrow invariants I1-I10, unresolved refund policy, commit/reveal, native NEAR testnet scope, bounded challenge review and provider spending controls remain authoritative. Multiple reviewer accounts or different models do not establish independent operators.

## Frozen dashboard integration

| Approved component | Protocol content and source | Existing interaction becomes | Truth and empty behavior |
| --- | --- | --- | --- |
| Header title and search | Selected case title/ID; searchable authorized case records | Search accessible case/evidence records; selecting a result changes case route | No invented records; loading, unavailable and no results are distinct |
| Left profile/creator/criteria/network panel | get_case terms, creator, beneficiary, criteria digest, network and contract account | Agreement drawer with frozen terms, amount, recipients and provenance | No stock portrait represents a real reviewer or creator; absent identity is shown as unavailable |
| Left review-window panel and existing period selector | get_round/get_case absolute commit, reveal, challenge and maximum-review deadlines | Select actual current/all round records; open deadline detail | UTC with observed block time; local countdown is advisory; no fabricated dates |
| Left four reviewer-card slots | get_committee plus authenticated finding references | Reviewer detail drawer: account, operator provenance, model/version, round, commitment/reveal status | Real count may be below four; unused slots show empty state. Additional members accessible in drawer, without resizing panel |
| Center case-progress strip and Details | Canonical case state plus current round phase | Open timeline/settlement drawer | Eight display segments are milestones, not equal-duration or trust percentages. Current failure/challenge interrupts forward progress |
| Center radar, tabs and Details | Versioned, deterministic evidence-coverage projection below | Existing tabs select documented coverage datasets; Details opens values, denominators and sources | Coverage never means confidence, truth, quorum validity or payment authorization |
| Lower-center material tabs and three card slots | Evidence manifest, findings, frozen criteria, protocol/payout facts | Existing tabs filter records; cards open evidence, finding or criterion drawers; drawer provides submit action | Counts come from the same selected-case snapshot; empty slots never contain invented materials |
| Right Tasks/Goals and three card slots | Role/state/deadline-derived available actions and frozen acceptance criteria | Tasks route to current next action; Goals opens criterion inspection | Do not interpret a generic Done task as Settled. Every card carries its actual entity status |
| Right Latest activities and pagers | Contract events/receipts and separately tagged service events | Event detail and validated receipt link; cursor pagination | Uploaded, queued and AI proposed are service events, not chain confirmations; no fake unread count |
| Existing dialog/detail affordances | Selected entity plus provenance/freshness | Accessible detail drawer, then dedicated workflow screen for multi-step forms | Returning restores selected case, tab, pagination and focus |

At 1200 x 900, preserve the UX3A shell at x60/y45, 1080 x 810, sidebar 53, content columns 255/472/299. Extended screens use the same shell, typography, surfaces, border treatment and colors. Their forms occupy dedicated workflow content, not new permanent dashboard panels. No permanent toolbar, extra dashboard column, assistant or graph replaces the frozen composition.

## Navigation and workflow screens

Routes are proposed client routes. Navigating never calls a mutating contract method or requests a signature automatically. Case ID, network and contract account are part of route context; a case ID alone is not globally unique.

| Existing sidebar/control | Route or surface | Purpose and next step |
| --- | --- | --- |
| CONTRA mark / Overview | /overview | Read-only overview in approved system; choose an accessible case or go to Cases |
| Cases | /cases | Case list and Create agreement entry; select /cases/:id |
| Cases > Create agreement | /agreements/new | Define parties, criteria, amount, dates, committee policy and unresolved fallback; review then create draft |
| Case Tasks > Fund escrow | /cases/:id/fund | Review chain/contract/amount/recipient/terms digest and fees; sign fund_case |
| Evidence | /cases/:id/evidence | Upload/validate manifest, inspect content hashes and limitations, then submit_evidence |
| Reviewers | /cases/:id/reviews | See actual committee and independent-operation disclosures; request evaluation if authorized; appointed reviewer commit/reveal screens |
| Challenges | /cases/:id/challenges/new or /cases/:id/challenges/:challengeId | Select contested criterion/finding, attach counterexample, inspect deadline and sign challenge; follow fresh review |
| Protocol | /cases/:id/protocol | Frozen policy, phase deadlines, quorum and actual contract-read results; settlement detail and permitted next action |
| Protocol / Tasks > Finalize or retry | /cases/:id/settlement | Exact payout intent, beneficiary/refund recipient, amount, finality prerequisites, callbacks and recovery |
| Lab | /lab | Preserve navigation slot; show actual executed benchmark evidence or explicit not available, no invented scores; no new benchmarking work in UX3B |
| Notifications | Drawer | Authorized service/contract events and real read cursor; no blockchain mutation |
| Network | Wallet/network drawer | Connect/disconnect, inspect account and selected testnet contract; connection is not signing or funding |
| Settings | Settings drawer | Read preferences and integration availability; cannot change frozen terms, quorum or payout receiver |
| Profile | Account drawer | Current authenticated account/roles; no prototype identity presented as a live account |

Dedicated forms retain field validation and drafts when wallet signing is cancelled. Drawers support keyboard focus containment, Escape and focus restoration. At narrow widths or 200% zoom, workflow forms must stay operable without changing the approved 1200 x 900 dashboard baseline; adaptive presentation is tested separately, not assumed accepted.

## Action-to-operation matrix

All writes require authenticated, authorized actors and a fresh read of state/deadlines. The contract rechecks every guard regardless of UI state. Read-only observers never gain mutation privileges from opening a route. 'None' below explicitly means no corresponding chain or service mutation.

| ID / user action and actor | Contract operation | Proposed service operation | Transaction/state progression | Failure and recovery |
| --- | --- | --- | --- | --- |
| A01 Connect wallet; any user | None; read get_case/get_committee for roles | Wallet-signature session challenge/verification if private APIs needed | Disconnected -> connected; no case-state change | Reject/wrong network: remain disconnected or wrong-network, retain read-only view; never request transaction on connect |
| A02 Save/edit agreement draft; creator | None until A03 | Local draft save or authenticated draft store; no chain claim | Local draft only | Validate account IDs, integer yoctoNEAR, bounded dates, criteria and fallback; preserve inputs on failure |
| A03 Create agreement; creator | create_case(params) | Optional immutable terms-manifest storage before signing | Local draft -> signing -> pending -> confirmed Draft, using returned case ID | Rejection/failure preserves draft; unknown result: reconcile transaction and creator/request ID before resubmitting to avoid duplicate cases |
| A04 Fund and freeze; creator | fund_case(case_id), exact native NEAR deposit | Read immutable terms/evidence policy; no service can credit escrow | Draft -> funding pending -> contract-confirmed Funded | Insufficient balance, wrong deposit, stale terms, unauthorized or already funded: no optimistic lock amount; reconcile get_case before retry |
| A05 Upload evidence; beneficiary | None | POST /v1/cases/:id/evidence-uploads; upload bytes; POST /v1/uploads/:uploadId/complete | Uploading -> digest validated/stored; case still Funded | Size/type/auth/storage/hash failure: retain retryable upload draft; never show Submitted; exclude private bytes from chain/logs |
| A06 Seal and submit evidence; beneficiary | submit_evidence(case_id, manifest_digest) | GET immutable manifest by digest; verify canonical bytes and availability | Funded -> transaction pending -> Submitted; review opens via defined transition | Deadline expiry, digest mismatch, inaccessible artifact or unauthorized caller: reject, refresh state; never overwrite accepted manifest |
| A07 Open/advance timed phase; permissionless keeper or user | advance_round(case_id) | Read current round/policy; no arbitrary committee supplied by browser | Submitted -> ReviewCommit; ReviewCommit -> ReviewReveal; ReviewReveal -> Provisional/Unresolved; or permitted challenge phase transition | Too early/stale/duplicate call: safe rejection/no-op with latest state. Assignment rules require G02 below before implementation |
| A08 Request primary or adversarial AI evaluation; authorized role/service | None; AI output cannot mutate case state | POST /v1/cases/:id/evaluations with role, round_id, evidence_digest and policy_version | Reserved budget -> queued -> running -> proposed finding, or unavailable | Budget exhausted, provider offline/timeout, malformed output or missing citations: explicit failure/unavailable; no synthetic verdict; idempotent job lookup before retry |
| A09 Inspect finding/evidence; any authorized reader | get_case/get_round/get_committee reads only | GET /v1/findings/:id; GET /v1/manifests/:digest and artifact authorization | No mutation; show AI proposed and source quality separately | Digest/signature mismatch quarantines finding; unavailable source stays unavailable; model explanations rendered as untrusted text |
| A10 Commit vote; appointed reviewer | commit_vote(case_id, round_id, commitment) | GET evidence/finding; optional encrypted reviewer-secret recovery store under reviewer control | ReviewCommit -> commitment recorded; not a revealed vote | Wrong member/phase/replay/duplicate or signing failure: reject/retain secret; lost secret means cannot reveal, disclose consequence; never expose nonce in logs |
| A11 Reveal vote; same appointed reviewer | reveal_vote(case_id, round_id, disposition, evidence_digest, nonce) | None required; matching evidence/finding reads | ReviewReveal -> valid reveal recorded; derive matching disposition counts, advance per A07 | Wrong preimage/digest/nonce, expired phase, duplicate or cross-case replay: reject; failed reveal never counts toward quorum |
| A12 Inspect provisional outcome; any reader | get_case/get_round plus authenticated event receipts | Optional projection reads | Contract quorum -> Provisional; display reviewer outcome and open challenge window separately from AI proposed | Missing quorum/expired round -> Unresolved under policy, not acceptance; stale read cannot unlock payout |
| A13 Draft/upload counterexample; creator or beneficiary | None | Evidence upload lifecycle as A05, with contested criterion/finding reference | Local challenge draft/stored manifest; no settlement lock yet | Save local note is not file_challenge. Failed upload preserves draft and leaves canonical state unchanged |
| A14 Submit challenge; eligible party | file_challenge(case_id, counterexample_digest) | Immutable challenge-manifest lookup/validation | Provisional -> signing/pending -> confirmed Challenged; contract blocks ordinary finalization | Late, duplicate, unauthorized, wrong digest or ineligible state: reject; pending attempt alone is not confirmed challenge; reconcile race with finalization using contract state |
| A15 Start fresh review; keeper/contract policy | advance_round(case_id), assignment under G02 | Evaluation request A08 for fresh round only | Challenged -> ChallengeReview; round.phase=commit/reveal; never revert UI to ordinary unchallenged review | Missing disjoint committee: explicit unavailable/independence limitation; bounded timeout to frozen unresolved rule. Never silently recycle committee |
| A16 Commit/reveal fresh judgment; fresh appointed reviewers | commit_vote / reveal_vote with fresh round_id | Evidence/finding reads and independent evaluation A08 | Fresh valid reveals -> decisive accepted/rejected or Unresolved, according to contract | Same guards as A10/A11, plus fresh-committee validation; old-round votes cannot be counted |
| A17 Advance expired/no-quorum/no-evidence case; keeper | advance_round(case_id), then finalize_case only when eligible | None required | Frozen deadline -> Unresolved/refund eligibility; no immediate Settled | Client clock cannot expire case. If RPC unavailable, show stale/unavailable; no speculative resolution. G03 specifies refund-state ambiguity |
| A18 Finalize payout/refund; permissionless caller | finalize_case(case_id) | Read payout intent/receipts; no payment API | Eligible decision -> SettlementPending before transfer dispatch | Open challenge/deadline/quorum/auth policy or balance failure: reject; uncertain receipt remains reconciliation required. No repeated transfer while pending |
| A19 Observe payout; any reader, callback is contract-only | on_payout_complete(case_id, payout_intent_id), private callback; get_case/get_events | Receipt lookup/projection | Verified callback success -> Settled; verified transfer failure -> TransferFailed; delay -> SettlementPending | Client/service cannot invoke trusted callback or set Settled. If transfer succeeded but callback processing is unproven, require reconciliation; never auto-retry based on timeout |
| A20 Retry failed payout; permissionless keeper | retry_payout(case_id) | Existing payout intent read; no new receiver/amount | TransferFailed -> SettlementPending -> callback outcome | Same immutable intent/recipient/amount, attempt guard; pending/succeeded/unknown attempt cannot be retried; duplicate calls cannot pay twice |
| A21 Cancel unfunded draft; creator | Proposed cancel_case(case_id), absent from existing method list | Delete local draft only if no chain case exists | Draft -> Cancelled only after contract confirmation | Contract must reject after funding; no funded-case delete/refund shortcut. G01 blocks exposing chain cancel until ABI exists |
| A22 Navigate, search, select tabs/round/cards, paginate, open drawers, inspect receipt | Read get_case/get_round/get_events/get_committee as needed; no write | GET /v1/cases?cursor=...; GET case projection/events/manifests/findings | Local route/selection only; retain canonical case state | No results differs from unavailable; abort stale requests after case change; validate receipt network/contract/hash before link |
| A23 Disconnect, close workflow, change preferences, mark event read | None | Revoke session if used; optional event read cursor/preferences | Local/session state only; known submitted transaction stays tracked | Closing wallet/drawer cannot cancel an already broadcast transaction; reopen resumes reconciliation |

## API and integration contracts

These are proposed paths. Frontend availability flags remain unavailable until a deployed service and contract ABI are verified. API authentication uses short-lived sessions derived from a wallet signature over a server-issued nonce, intended domain, network and expiry; it must not request an asset transfer or unrestricted access key. Authorization checks case membership and role on the server, not a submitted role string.

| Operation | Required inputs / response | Safety and failure contract |
| --- | --- | --- |
| Session challenge/verify | Wallet account, network, nonce/domain/expiry; short-lived session | Nonce single use; replay rejected; disconnected/expired user may read public data only |
| POST evidence-uploads and complete | case_id, expected state revision, media type/size; upload_id; canonical manifest digest and artifact URIs after completion | Enforce authorized uploader, size/type limits and content hashing; immutable manifests; completion is idempotent; no secrets in signed URLs/logs |
| POST evaluations | case/round/evidence digest, evaluator role, policy version, idempotency key; job_id/status | Server chooses allowlisted provider/model, atomic budget reservation, bounded runtime/tokens/retry; role authorization; no arbitrary prompt-triggered contract call |
| GET evaluations/:jobId / findings/:id | Status or evidence-bound structured finding | Include provider/model/version, actor/operator provenance, criteria citations, digest, timestamps, limitations and signature where available; no invented scores |
| GET cases, case projection, events | Network/contract/case key, cursor/filter; snapshot and next cursor | Include observed block hash/height/time, indexed height, source and fetched_at; eventual index cannot override contract; stable event IDs deduplicate duplicates |
| GET manifests/:digest / artifacts | Digest-addressed object and authorized source links | Recompute digest; show retrieval/auth failure; never treat accessible URI alone as proof of integrity |
| Wallet transaction adapter | Pin network/contract/method/ABI version, args, integer deposit and reviewed gas/storage policy | User confirms exact intent; persist resulting transaction hash/account; query receipt and current state after reload; no success from wallet redirect alone |

Mutation requests use an idempotency key scoped to authenticated actor, network, contract, case, round, operation and payload digest. A reused key with different content is a conflict. An evaluation retry retrieves the existing job/reservation before authorizing another provider call. Exactly-once offchain requests are not assumed. Immutable case/round/vote/payout guards provide contract safety.

## Sources of truth and transaction presentation

Keep four separate fields: canonical case state, round phase, evaluation status and transaction attempt status. Do not collapse them into one Done label.

| Layer | Authoritative source | Display contract |
| --- | --- | --- |
| Local work | Form/session storage | Draft/local only; no onchain assertion |
| Service work | Authenticated service job/manifest record | Uploading, stored, queued, running, AI proposed, failed or unavailable |
| Reviewer protocol | Contract committee/commit/reveal/quorum at observed block | Reviewer accepted/rejected only from valid contract reveals; independence disclosure is separate |
| Case finality | Contract case, round deadlines, challenge status, payout intent and receipt chain | Provisional, Challenged, Unresolved, SettlementPending, TransferFailed or Settled, with actual disposition |
| Activity/index | Contract events plus tagged service events | Record origin and block/transaction or job ID; eventual projections cannot authorize writes |

Transaction attempt states: idle -> preparing -> awaiting signature -> broadcast/confirmation pending -> contract-confirmed or failed. Wallet rejection returns to editable intent. Unknown hash/outcome becomes reconciliation required, not failed and not confirmed. A contract-confirmed finalize call may still leave payout SettlementPending. Preserve separate original transaction and downstream transfer/callback receipt IDs. A successful transaction unrelated to the selected case is not confirmation.

Each read envelope includes network, contract_account, case_id, round_id where relevant, observed block hash/height/time, fetched_at, source, availability and schema version. Source can be fixture, contract, service or derived; derived data lists its dependencies and algorithm version. Confirmed write guards use current chain state. Stale cached reads remain visibly stale; service/index lag is shown independently. On reconnect refresh canonical state before enabling state-changing actions. Ignore late responses for a previously selected case/network/round. Unknown is never converted to zero, false, accepted or settled.

## State and financial truth

| Canonical condition | User-facing meaning / available action |
| --- | --- |
| Draft | Agreement created, no escrow funded; fund or cancel only if creator and allowed |
| Funded | Actual deposited native NEAR reserved for this case; beneficiary may submit evidence before deadline |
| Submitted / ReviewCommit / ReviewReveal | Evidence recorded; show exact phase and appointed reviewers; AI evaluation and reviewer actions are distinct |
| Provisional | Reviewer-derived provisional disposition; show challenge deadline; eligible parties may challenge |
| Challenged / ChallengeReview | Confirmed challenge blocks ordinary release; show fresh round and operator independence evidence |
| Unresolved | No valid decisive outcome; frozen fallback applies after permitted deadline; not a finding of wrongdoing |
| SettlementPending | Payout intent dispatched/awaiting verified result; funds not shown as paid; no second transfer |
| TransferFailed | Verified failed transfer remains recoverable; expose guarded retry of same intent |
| Settled | Successful payout callback verified for exact intent, amount and recipient; show paid beneficiary or refunded creator and receipt |
| Cancelled | Unfunded agreement cancelled by authorized method; no implied refund transaction |

UI action availability is derived from role + network + current state + phase + deadlines + committee + pending attempt + integration availability. A derived `can_finalize` flag is helpful UX but never authority for the contract. Amounts are stored/transmitted as integer yoctoNEAR strings; decimal formatting cannot change the value signed. Display amount, receiver, network, contract, digest and applicable costs in the confirmation screen. Never use an onchain success color for an unverified service claim; text labels carry status alongside the frozen mint/coral/amber palette.

## Radar: preserve appearance, replace invented numbers

Retain eight sectors, both series, dashed rings, layout and tab positions. Replace decorative ring labels with numeric coverage percentages in the same slots when production data is connected. No random/example values in live mode. A missing denominator displays N/A in chart Details and accessible data, with no filled sector; zero coverage is explicitly 0/n. Required series is 100% only where a nonzero frozen requirement denominator exists. No aggregate confidence score or inference from chart completion is permitted.

The existing sector positions retain Criteria, Evidence, Provenance, Review, Finality, Challenge, Quorum and Keyboard labels. Keyboard is a property of the approved accessibility case, not a fabricated requirement for unrelated agreements: show N/A for a case without keyboard criteria. For each tab, use numerator/denominator definitions below; Details exposes integer counts, selected case/round, timestamps, sources and missing data. No arithmetic mixes fixture and live provenance.

| Sector | Criteria tab | Evidence tab | Overall tab |
| --- | --- | --- | --- |
| Criteria | Defined/required binary criterion fields | Criteria with digest-valid evidence / frozen criteria | Frozen criteria with completed source-linked review / frozen criteria |
| Evidence | Defined/required evidence-type obligations | Valid available artifacts / required artifact slots | Accepted manifest obligations met / frozen evidence obligations |
| Provenance | Defined/required provenance fields | Digest-valid retrievable source records / required source records | Completed provenance checks / required provenance checks |
| Review | Defined/required reviewer policy fields | Source-linked findings / expected findings for selected round | Valid reveals / appointed reviewers for selected round; not a truth score |
| Finality | Defined/required settlement policy fields | Verifiable finality records / required records for current stage | Deterministic gates met / gates required for eligible settlement, using explicit gate IDs |
| Challenge | Defined/required challenge-policy fields | Counterexample artifacts available / required artifacts when challenged | Fresh-review steps complete / required steps when challenged; no challenge means N/A |
| Quorum | Defined/required committee/quorum fields | Authenticated review artifacts / expected review artifacts | Maximum matching valid reveals / threshold, capped at 100%; display disposition and timeout separately |
| Keyboard | Defined/required keyboard criterion fields | Keyboard criteria with test artifacts / frozen keyboard criteria | Keyboard criteria with completed evidence-bound review / frozen keyboard criteria |

Each denominator and gate set is frozen/versioned with policy rather than chosen by a UI designer at render time. A completed review can reject a criterion; coverage must never be labelled criterion passed. Clicking/keyboard-activating chart Details exposes this distinction and the same figures as text.

## Live integration rollout and eligibility boundary

| Phase | Work | Completion evidence |
| --- | --- | --- |
| UX3B now | Freeze acknowledgment, workflow/operation map, acceptance criteria and gap register only | Documentation commit; no changed UX3A assets or functional code |
| First eligible build | Fresh contracts/adjudication and apps/web implementation during eligible window, beginning November 1, 2026 UTC | Recorded new-source commits; independently implemented UI matched visually to frozen design; no pre-event app code imported as competition implementation |
| Contract vertical slice | Create/fund, guards and callback-safe payout/refund in sandbox, then authorized testnet | Sandbox invariant results and genuine testnet receipts after deployment authorization |
| Evidence/reviewer integration | Immutable manifest service, budget-controlled primary/adversarial evaluation, authenticated commit/reveal | Actual artifact hashes, evaluator provenance, valid reveals and negative tests |
| Challenge journey | Confirmed challenge, fresh review, challenged finalization rejection, resolution and callback settlement | One full replay with receipts, service records and financial reconciliation |
| Read model replacement | Replace each fixture adapter only after its source is verified | Integration availability ledger and source-labelled UI, no fallback from live failure into invented fixture values |

Keep design/ux3a and its screenshots as immutable approved reference. Keep UX3B as planning documents. New competition code belongs in separate directories and new eligible-window commits. Reuse specification and visual decisions as references; do not copy the pre-event runnable study into the eligible implementation. This separation records project policy; organizer eligibility itself is not independently adjudicated here.

Provider integration does not authorize spending. Meta primary, Baseten adversarial and Modal bounded verifier remain planned allocations subject to verified credits and owner-authorized usage. Actual operator independence must be established separately. No deployment/secrets/mainnet authorization is introduced by UX3B.

## Protocol gap register and implementation decisions

| Gap | Existing ambiguity | Proposed resolution for engineering review | Gate |
| --- | --- | --- | --- |
| G01 | Draft cancellation exists in state table but no cancel method | Add authenticated creator-only cancel_case before funding; local deletion only for uncreated local drafts | Pin ABI and unauthorized/funded cancellation tests before exposing action |
| G02 | Committee selection and round opening/fresh assignment not fully specified by existing ABI | Freeze round policy/eligible committee source at funding; advance_round performs deterministic assignment from that source; no browser-appointed quorum. If explicit registration/assignment methods are needed, specify authorization before coding | Pin membership, disjoint fresh-set enforcement and bounded no-committee fallback before enabling review writes |
| G03 | Funded expiry mentions RefundPending, while main lifecycle uses Unresolved -> SettlementPending | Proposed one payout pipeline: expiry -> Unresolved with reason submission_expired -> SettlementPending -> Settled/refunded or TransferFailed. RefundPending is not a client-created canonical state | Adopt explicit state schema/ABI and migration notes before financial implementation |
| G04 | Create retry uniqueness and offchain event projection not specified | Bind creator request ID/terms digest or verify matching creation receipt before another create; define event IDs and paginated reads/index contract | No blind create retry or fabricated activity history |
| G05 | Deposit/storage/gas details and canonical commitment serialization unresolved | Pin schema/version, integer deposits, storage policy, domain separation and shared test vectors against implemented ABI | Block signing adapter until ABI/vector tests pass |
| G06 | Independent operators and fresh committee availability unverified | Record operator identities/control disclosures; different keys/models alone are insufficient; enforce fresh disjointness and honest unavailable/timeout path | No independent/decentralized claims without evidence |
| G07 | Recipient transfer succeeds but callback processing is missing/failed | Persist intent/attempts and receipt lineage; pending/unknown cannot auto-retry; define authenticated contract recovery that proves outcome before retry/settled | Specify and test reconciliation procedure before live funds |

These are proposed resolutions, not silent edits to accepted protocol decisions. They do not block delivering UX3B planning. Resolve and pin them as engineering decisions before the dependent implementation work. The next work is ABI/state-policy definition and sandbox acceptance tests in the eligible window, not another visual redesign.
