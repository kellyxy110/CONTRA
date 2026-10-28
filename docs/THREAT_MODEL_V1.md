# CONTRA threat model, freeze decisions and verification v1

Checkpoint: CONTRA-2026-10-28-UX3C. Documentation freeze, not a smart contract audit or executed contract test report. Baseline plan/ux3b at af0dd97558f134ac9269c7fb58cc7613df6b8202; UX3A frozen at bee5a7481d56c86d4c9860280b8367f82af0cb5a.

Read [CONTRACT_ABI_V1.md](CONTRACT_ABI_V1.md) first; the six UX3C documents jointly define one v1 specification with field-level ownership, not six independent alternatives. Earlier PROTOCOL.md and UX3B concepts remain history/integration context where explicitly superseded. No paid models, deployment, secrets or mainnet actions were used. Credit authorization remains Meta $3, Baseten $3, Modal $5, subject to verified credits, no unauthorized cash spending.

## Assets, boundaries and adversaries

Protect native escrow principal, immutable party consent/terms/evidence, appointed vote slots, payout intent/attempt authority and truthful UI state. Treat parties, malformed submissions, providers, reviewer operators, relayers, indexers/RPC, admin registry and deploy keys as separate trust boundaries. NEAR consensus authenticates account calls and receipt execution, not evidence truth, operator independence, AI reliability or the fairness of a buyer-favored fallback.

| Threat | Attack / consequence | Frozen control | Residual risk |
| --- | --- | --- | --- |
| T01 Unauthorized cancellation/terms change | Creator or outsider withdraws/changes bargain after funding | Creator-only Draft cancel; beneficiary accepts immutable digest; no edit/withdraw method | Parties may misunderstand terms; consent screen must state fallback and callback lock risk |
| T02 Duplicate creation/funding | Unknown transaction retried as new case or deposit | Persistent creator/request identity, immutable digest, get_creation; duplicate fund rejects attached principal atomically | Wallet may pay gas for rejected retries; client must reconcile |
| T03 Mutable committee/Sybil control | Registry owner replaces losing reviewer, multiple keys pretend independence | Six distinct declared operators, 3+3 frozen snapshots, 2-of-3; no funded replacement; admin + reviewer confirmation | Registry attestations can lie; predictable selection; majority collusion; no permissionless decentralization |
| T04 Provider/model correlation | Shared model/operator repeats same wrong finding | Operator disclosures, source-linked findings, independent fresh set; AI proposals never finalize | Different operators/providers can still share biases or collude; model diversity does not prove truth |
| T05 Vote replay/front-running | Reuse reveal in other round/case/network or change nonce/digest | Exact domain-separated Borsh commitment and authenticated predecessor, one immutable slot | Reviewer may voluntarily leak secret or sell vote; no economic slashing |
| T06 Evidence forgery/injection/unavailable URI | Fabricated hash or source commands signing service | Immutable digest and service retrieval checks, typed outputs, server secrets/allowlists | Hash authenticates bytes, not factual truth; contract cannot enforce external artifact availability |
| T07 Creator challenge abuse | Creator challenges primary ACCEPT, causes fresh timeout and receives refund | KEEP_PRIMARY_V1 on inconclusive fresh review, only losing party, one criterion-bound challenge, fixed fresh deadline, preconsented policy | Deliberate delay remains free apart from gas/1yocto; corrupt fresh majority may still reverse. No bond/token introduced |
| T08 Original quorum withholding | Corrupt primary reviewers withhold to force buyer-favored base refund | Six preconsented operators, disclosures, fixed deadlines and public missing-vote record | BASE_REFUND_V1 remains creator-favored; committee honesty/availability required. No claim of fairness or eliminated abuse |
| T09 Wrong primary decision retained | Fresh outage/inconclusive vote fails to correct original error | Publish fallback explicitly; require decisive fresh quorum for reversal | Retained wrong verdict may pay wrong party. Changing this trade-off needs a new policy/version, not admin exception |
| T10 Reentrancy/double payout | Interleaved finalize/retry before callback spends twice | Durable pending before dispatch, unique intent, exact attempt guard, retry only verified Failed | Deployed-code/runtime bug still possible; sandbox race and invariant proof required |
| T11 Forged/oversized callback | Malicious caller supplies positive result or conflates callback failure with transfer failure | Private predecessor, exactly one linked native result, bounded empty return; unexpected stays unknown | Contract/deploy key compromise can defeat self-only assumption |
| T12 Successful transfer, failed callback | Root error leads operator to retry payment | UNKNOWN stays pending forever in MVP; no recovery/override API | Recipient may be paid while contract never reaches Settled; failed transfer plus failed callback may strand funds |
| T13 Balance spoofing / asynchronous refunds | Donation or delayed refund mistaken for proof or spendable principal | Separate ledgers and guarded liquid reserves; balance never proves result | Temporary liquidity shortage can delay legitimate verified-failure retry |
| T14 Storage/gas exhaustion | Public spam grows state or callback cannot complete | Immutable creator allowlist (1..8), bounded cases/registry/criteria/rings; sponsor reserves; callback preallocation and gas guards | Admitted creators/admin can still exhaust finite capacity; actual gas/storage unmeasured; launch blocked until worst-case sandbox passes |
| T15 Time/index/RPC deception | Client clock, stale vote count or fabricated receipt authorizes payout | Contract deadlines, onchain method guards, finalized receipt lineage; source/freshness labels | RPC may hide/lie about data; client cannot promise availability |
| T16 Full-access/deploy governance | Owner replaces code to bypass locks or forges own callback | No upgrade/admin payout ABI; isolated deployment account and documented key control | Merely removing upgrade ABI does not remove full-access-key power. Before any authorized pilot funding, document key holders and restrict/remove deploy authority or disclose custody risk; no key changes are performed by UX3C |

## Challenge economics decision

No-challenge original no-quorum fallback refunds creator only after the fixed maximum review deadline. Both parties acknowledge BASE_REFUND_V1 AND KEEP_PRIMARY_V1 before any funding. This reduces the specific benefit of forcing a fresh-review timeout after an ACCEPT verdict while retaining bounded appeal duration and simple native-NEAR-only economics.

No algorithm can infer whether a counterexample is genuine from a digest alone. This freeze deliberately chooses no new token/bond/slashing. It does NOT solve collusion, primary withholding, frivolous delay, censoring a challenge before its deadline, or retaining a wrong initial verdict under a fresh outage. Public missing-vote/operator disclosure, preselected fresh jury, one losing-party challenge and no deadline extension are safeguards, not guarantees of fair adjudication. A claim of eliminated challenge abuse is prohibited.

## G01-G07 closure register

Resolved means a definitive engineering decision, coherent ABI/state rule and written acceptance tests exist. It never means implemented or proven in sandbox.

| Gap | Freeze decision and authoritative location | Consistent interface | Acceptance obligations | Status |
| --- | --- | --- | --- | --- |
| G01 | Creator-only cancellation before any funding; state table ST01/ST08 | cancel_case(case_id); accept_terms precedes fund | AC07/23; ST01/ST08 | RESOLVED (specification) |
| G02 | Owner registry + reviewer confirmation, six distinct operators, deterministic 3+3 snapshot, 2-of-3, no replacements; committee policy | set_reviewer,confirm_reviewer,preview_case,create_case,fund_case,advance_round; get_committee | AC12-14/17/18; CM01-CM07 | RESOLVED (specification) |
| G03 | One payout pipeline; no RefundPending; base unresolved refund vs fresh inconclusive retain-primary, one terminal Settled; state machine | State/Disposition/Reason types; advance_round,finalize_case | AC13/16-19; ST02-ST08 | RESOLVED (specification) |
| G04 | Creation identity and immutable canonical digest, payload-idempotency, finalized successful-receipt event rings/logs; ABI | create_case/get_creation/get_events; request/sequence schemas | AC06/07/24/25/28; ID01-ID05 below | RESOLVED (specification) |
| G05 | JSON DTOs, Borsh byte order, exact fields/deposits/minimum gas assumptions, domain-separated SHA-256, V01-V12; ABI/vector document | Complete public/private method tables and wire schemas | AC05/12/13/33; CV01-CV07; ABI01-ABI04 | RESOLVED (specification) |
| G06 | Admin-attested operator and key disclosures, account acknowledgement, no independent-operator claim without evidence; committee policy | operator_id/disclosure_digest/revision in registry/frozen snapshots | AC10/14/26/29; CM01-CM08 | RESOLVED (specification) |
| G07 | Immutable intent/recipient/amount; linked private result; retry only explicit authentic Failed; no MVP unknown-outcome recovery | finalize_case/retry_payout/on_payout_complete/get_payout; no recover method | AC19-22/24; SR01-SR13 | RESOLVED (specification with explicit liveness limitation) |

## Acceptance-test specification additions (all NOT RUN)

ID01: Same creator/request/terms replays to identical case ID with no event/counter/capacity charge; changed input or expected digest -> E_REQUEST_CONFLICT; new creator/request -> new identity. Replay must use stored snapshot even if registry changed (AC06/24).
ID02: Lost create receipt, wallet redirect, repeated signed fund/submit/challenge and process restart reconcile from get_creation/get_case/get_payout; no duplicate principal, conflicting overwrite or fake confirmation (AC06/07/15/24).
ID03: Only successful finalized executor receipts produce indexed contract events; ignore reverted logs; deduplicate by network/contract/stream/seq; service events cannot forge contra standard provenance (AC25/28/29).
ID04: Ring overflow and old cursor report explicit gap; pagination bounded to 50; sequence monotonic through retries; no duplicate events on idempotent replay; conflicting callback cannot finalize another attempt (AC21/25/28).
ID05: Terms digest recomputes exact schema and includes all consent, committee and timing fields; preview/create race rejects changed snapshot; no post-fund mutation (AC05/07).
ABI01: Every public/private signature and DTO matches ABI JSON/return schema, unknown/duplicate fields fail, integer/hash/account limits enforce, non-allowlisted creators reject without sponsor growth, no undeclared recovery/admin-transfer/admission-mutation method is exported (AC04/05/33).
ABI02: Every method's deposit rule tested at zero/exact/too-low/too-high; one-yocto confirmation never credits escrow; duplicate funding returns attached amount through failed receipt semantics (AC07/23/29).
ABI03: Measure gas and state at maximum 128 cases, 32 registry members, 16 criteria, 64 event slots, both rounds and repeated attempts; guards cover worst case + margin, callback allocations bounded (AC19-22/33).
ABI04: Sponsor/storage/principal accounting and ability to settle at case capacity, exhausted sponsor, delayed failed-return liquidity and unsolicited funds; no cross-case subsidy from principal (AC07/19/21).

## AC01-AC33 cross-check

All runtime/browser/contract/service acceptance remains NOT RUN. The column below states how the frozen specification supports the criterion or explicitly amends its earlier assumption.

| Criterion | Specification coverage / required future result |
| --- | --- |
| AC01 | UX3A tree unchanged; no visual methods/assets edited. Future production UI compares to bee5a74 |
| AC02 | UX3B routes/drawers preserved; API/type bindings frozen here, no auto-sign on navigation |
| AC03 | Only specifications/preparation before November 1 UTC; new eligible code in separate contract/app/service paths |
| AC04 | Predecessor roles, testnet configuration, fixed deposit and registry guards; CM01/CM06 |
| AC05 | Bounded TermsInput, canonical digest, dual-party consent/deadlines; ABI01/CV03/ST02 |
| AC06 | Creator/request tombstones and immutable digest; ID01/ID02 |
| AC07 | Exact funding, accepted terms and funded snapshot; sponsor/escrow separation; ID05/ABI02/ABI04 |
| AC08 | Manifest hashes and service validation from UX3B; contract stores digest only, not availability proof |
| AC09 | Beneficiary-only deadline/digest-locked submission; idempotent identical replay, conflicting overwrite rejects |
| AC10 | Evidence-bound findings include model/operator disclosure; no finding method finalizes money |
| AC11 | UX3B server atomic budget/idempotency policy unchanged; initial $3/$3/$5 envelopes, no calls in UX3C |
| AC12 | Exact vote preimage V01-V12, predecessor/snapshot binding and nonce handling; CV01-CV07 |
| AC13 | Fixed phases, 2-of-3 matching valid reveals, original unresolved fallback; ST02/ST04 |
| AC14 | Six distinct disclosed operators, active-confirmed at funding, frozen after funding; CM01-CM08 |
| AC15 | Losing-party-only one criterion-bound challenge confirmed strictly before deadline; ST02/ST06 |
| AC16 | Pending broadcast is not challenge; receipt-time order and guards block post-challenge finalization; ST05/ST06 |
| AC17 | Fresh committee/round/digest, decisive reversal; AMENDED inconclusive fresh result retains prior decisive outcome instead of automatic creator refund; ST04-ST06 |
| AC18 | Absolute bounded deadlines and no keeper-dependent resets; AMENDED base unresolved refund vs fresh inconclusive keep-primary; ST02/ST03/ST07 |
| AC19 | Decision guards, immutable intent and durable pending before dispatch; SR03/SR11 |
| AC20 | Private predecessor + single linked native result and exact attempt; SR01-SR03 |
| AC21 | Retry only verified Failed, same intent, recipient/amount, no overlapping attempt; SR04/SR10/SR13 |
| AC22 | AMENDED success-transfer/failed-callback remains locked UNKNOWN; no authenticated MVP recovery is claimed. SR05/SR06/SR08 prove unsafe retries absent |
| AC23 | Creator-only Draft cancel, funded cancellation impossible; ST01/ST08 |
| AC24 | Client unknown/rejected/pending/confirmed states and receipt lineage remain UX3B obligations; ID02/SR08 |
| AC25 | Finalized indexed events vs canonical contract state; stale block/freshness envelope; ID03/ID04/SR09 |
| AC26 | No fake identities/results/receipts or fixture fallback in live mode; CM08/SR09 |
| AC27 | Frozen eight-sector radar uses UX3B deterministic coverage; source/final disposition semantics updated, no trust/settlement inference |
| AC28 | Stable case/round/events/DTOs and bounded cursors with gap reporting; ID03/ID04 |
| AC29 | Server authorization/input quarantine unchanged; callback/predecessor/deposit/domain guards; CM01/CM06/CV03/SR01 |
| AC30 | Existing keyboard/drawer/mobile-forms obligations remain; no design changes or accessibility pass claimed by UX3C |
| AC31 | Full unchallenged testnet receipt/evidence/provider proof remains required after sandbox and separate deployment/spend authorization |
| AC32 | Full challenged decisive reversal proof plus fresh-timeout abuse regression and callback-failure safety evidence required; not just a happy-path demo |
| AC33 | ABI binds UX3B A01-A23; accept_terms and sponsor/registry setup are explicit added preparation/consent steps; ABI01 checks all exported methods |

## Invariants I1-I10 cross-check

| Invariant | Frozen design obligation | Future proof / limitation |
| --- | --- | --- |
| I1 Principal conservation | Exact deposit per case, sponsor/storage separate, guarded liquidity, complete intent amount | ABI04/SR11/SR13; acknowledged ledger plus in-flight/unknown accounting, not naive account-balance equality |
| I2 At most one successful payout | Single intent; pending guard; only authentic verified-failure retry | SR03-SR06/SR10; unknown outcome permanently blocks another transfer in MVP |
| I3 Terms immutability | Immutable draft terms + beneficiary consent; snapshot/digests frozen before funding | ID05/CV06/CM05/ST01 |
| I4 No AI shortcut to settlement | Contract quorum/deadlines/challenge checks + successful callback only | ST04/ST06/SR01/SR03 |
| I5 Round-bound authenticated votes | Frozen predecessor identity, full domain/case/terms/round/evidence preimage | CM06/CV01-CV07/ST04 |
| I6 Challenge lockout | Timely challenge prevents original finalization until fresh deadline/result | ST05/ST06; receipt time controls race |
| I7 Bounded unresolved policy | Base/fresh review decisions bounded by fixed maximum, subject to permissionless call execution | ST02/ST03/ST07; explicitly NOT unconditional payment liveness when callbacks fail or nobody submits keeper calls |
| I8 No model confidence as truth | Findings advisory; coverage chart has no payout authority; votes not proof of correctness | AC10/26/27; wrong/colluding judgments remain possible |
| I9 Untrusted evidence separation | Digests and typed arguments onchain, provider/secret access isolated offchain | AC08/29; no secret/onchain personal evidence |
| I10 Authenticated callback and recovery | Exact self/result/intent/attempt; verified failure retry only | SR01-SR13; explicit exception: failed/missing callback cannot be safely recovered in MVP; no false recovery guarantee |

The I7/I10 liveness qualifications and fresh-inconclusive fallback amendment are substantive, recorded freeze decisions under the owner's UX3C instruction. They must be reflected in consent copy and future integration tests. They do not weaken I2 with a convenient manual payout exception.

## Residual risks and launch blockers

G01-G07 have no remaining specification alternatives/TODOs. Implementation and safety gates remain OPEN: actual Rust/browser serialization parity; exact SDK compilation/ABI export; worst-case storage and gas measurement; sandbox financial/race/callback-fault tests; real separately controlled reviewer availability; verified provider credits/budget controls; deployed account/key-control disclosure; actual authorized testnet receipts. These are execution prerequisites, not grounds to call a documentation check a contract test.

Known accepted MVP limitations: trusted permissioned registry and potentially correlated judgments; declared rather than Sybil-proof operator identity; biased base unresolved refund and wrong-primary retention; one free-to-delay challenge; possible indefinite locked pending payout after callback failure; no mainnet readiness or GenLayer security-equivalence claim. Testnet principal only, with explicit party consent. Any claim that all cases always become paid/refunded despite callback failure is prohibited.

First November 1 task: initialize fresh Rust contract source and test harness, pin toolchain/dependencies, implement storage/accounting plus create/accept/cancel/fund and payout intent/private callback/retry; prove I1/I2/I3/I10 in sandbox including SR05 (successful transfer plus failed callback) before integrating real adjudication/services/frontend. A harness-only deterministic decision path may test payout in sandbox, but must never be exported as a production verdict bypass. No deployment is authorized by this planning handoff.
