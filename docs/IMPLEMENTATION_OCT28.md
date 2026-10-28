# Implementation record - October 28, 2026

Owner authorization supersedes the internal November 1 implementation gate. Actual implementation starts **2026-10-28 UTC**, before the official competition. All code in this checkpoint is pre-event work. Do not represent it as code developed during the competition. Preserve the approved UX3A reference and historical logs.

Authority: UX3C e57cc94, naming continuation e875a58, approved visual baseline bee5a74. Work branch: implementation/oct28. Frozen v1 ABI and five companion specifications remain governing; implementation is not evidence that all acceptance criteria are proven.

## Escrow milestone M01

Rust source implements consent, creator-only unfunded cancellation, exact funding, frozen reviewer selection, evidence commitments, two rounds, challenge fallback, immutable payout intents and private promise-result callbacks. The default Wasm excludes callback fault injection; sandbox-faults is solely a separately built negative-test artifact.

Fourteen **Rust SDK mocked-environment tests** pass. These test contract logic and generated mock receipts; they do not prove real transfers, Wasm execution, receipt timing or callback gas sufficiency. Production Wasm compiles. Sandbox scenarios are authored but **not executed**: stock NEAR Sandbox requires 65,535 open files, while this host's hard limit is 16,384. No onchain balances, transaction hashes or successful settlement are claimed.

Unknown transfer outcomes remain permanently pending in the MVP. A successful native transfer followed by a failed callback cannot be retried. SDK coverage is not a substitute for the authored Sandbox balance-delta negative test. Financial approval remains blocked on real Sandbox execution, gas/storage bounds, concurrent-case accounting and receipt-race checks.

No deployment, paid provider call, production secret or mainnet operation is authorized or performed. Meta $3, Baseten $3, Modal $5 remain hard reservation ceilings, not verified available credit balances. Actual billing remains unknown until reconciled.

## Integration milestone M02

The implementation branch now includes 20 passing Rust SDK tests and 16 passing service/encoding tests. Rust and Node both match shared creation, terms and payout golden vectors. The production/fault Wasm artifacts both compile and have separate export surfaces. Case records occupy a fixed 131072-byte reserved Borsh allocation from creation; SDK tests assert callback writes do not grow it. Runtime storage/gas cost still requires Sandbox measurement.

`apps/web` reuses the frozen pre-event UX3A geometry, CSS and visual assets as authorized, with separate functional source. It is also October 28 pre-event code. No claim of independently authored competition-window frontend is made. All 15 measured desktop rectangles match the approved reference at 1200x900. The screenshot comparison intentionally contrasts the reference's labelled illustrative content with the implementation's truthful unavailable-chain state. It is not a screenshot of a successful escrow journey and not owner acceptance.

API source covers authenticated participant access, immutable content-addressed evidence, criteria source retrieval, admission-gated terms upload, real contract views, local Sandbox signing, persisted unknown transaction operations, real receipt records and bounded AI proposals. Duplicate unknown operations are never dispatched again automatically. Tests use explicit fixtures only inside tests; the runtime has no fixture fallback. NEP-413 signature verification checks an actual account access key when an external adapter is enabled. The external Testnet wallet adapter compiles but is not enabled or verified end to end. The Sandbox signer is controlled by the local server and is not a production wallet.

Provider adapters are configuration-gated OpenAI-compatible calls for Meta primary/fresh, Baseten adversarial and Modal verifier roles. No live provider interoperability, operator independence, credit balance, pricing bound or actual billing is verified. A reserved worst-case cost is operator configuration, not a verified invoice: never enable paid usage until authorization, credits and worst-case pricing are reviewed. A timeout or invalid response retains its full reservation and the same key cannot initiate another call. This single-host SQLite ledger must not be copied into independent replicas or reset to obtain more credits. Model outputs cannot overwrite trusted case/round/provenance fields and never set contract state or sign votes.

The eight-sector radar retains its visual anatomy. Fixed coverage counters live in packages/protocol/coverage.mjs; Details shows counts, source descriptions and N/A separately from zero. Per-criterion completed evidence review is N/A until structured source-linked manifests exist; it is not inferred from a case-level verdict. Every sector is N/A without a contract snapshot. Counts are coverage, never truth or settlement authority.

## Acceptance and remaining work

No AC01-AC33 criterion is declared fully accepted at this checkpoint. The following is a conservative evidence cross-check against the frozen criteria, not a substitute for their exact required tests.

| Criteria | Evidence now | Required remaining proof |
| --- | --- | --- |
| AC01-AC04 | Frozen reference unchanged by this branch; 15 desktop rectangles equal; navigation/forms and controlled signer source | Owner visual review, full routing/persistence/focus and external wallet tests |
| AC05-AC09 | Consent, exact funding/cancel guards in SDK; immutable storage/integrity/auth service tests | Actual Sandbox deposits, immutable terms, upload/submission and deadline boundary balances |
| AC10-AC11 | Strict proposed-finding parser, hostile binding test, atomic caps, timeout/idempotency tests | Authorized real providers, independently controlled operators, measured worst-case pricing and billing reconciliation |
| AC12-AC14 | Shared vectors, frozen committees, nonmember and stale-snapshot guards in SDK | Full replay/equivocation/insufficient-operator matrix in Wasm and independently verified disclosures |
| AC15-AC18 | Challenge reversal and KEEP_PRIMARY timeout regression in SDK; workflow source | Concurrent Sandbox challenge/finalize receipts, all timeout boundaries and source-linked fresh review |
| AC19-AC23 | Pending before dispatch, authentic result handling, duplicate/forged/wrong-intent guards and same-intent failure retry in SDK | Real native balance deltas, failed receiver, concurrency, callback-fault SR05/SR06, worst-case gas/storage |
| AC24-AC26 | Persisted unknown operation, duplicate-unknown dispatch test; real unavailable-state browser evidence | Wallet rejection/redirect/reload, RPC lag and block-tagged read envelopes, indexed receipt reconciliation |
| AC27-AC30 | Counter/N/A tests, escaping, session replay/expiry tests, desktop geometry and mobile form inspection | Complete structured manifests, source timestamps, cross-case/injection matrix, 320px/200% screen-reader and focus audit |
| AC31-AC32 | Authored Sandbox unchallenged/challenged/fault scenarios only | Real Sandbox execution first; separately authorized testnet deployment and real providers later |
| AC33 | API/ABI workflow source and freeze documents | Complete reviewer/finding/transaction linkage audit against executed release |

| Invariants | Current evidence and limit |
| --- | --- |
| I1-I3 | Aggregate ledgers, unique intent, pending guards, immutable terms/consent implemented; mocked conservation and retry checks only. Multi-case real solvency remains unproven. |
| I4-I6 | No model-to-settlement shortcut; domain-bound voting and challenge lock implemented. Wasm adversarial/race proof remains blocked. |
| I7 | Contract deadlines/fallback implemented; keeper-dependent bounded adjudication, not unconditional payment liveness. |
| I8-I9 | Advisory findings, N/A coverage, byte digests and authenticated artifacts tested in part; live provenance and independence remain unverified. |
| I10 | Verified failure alone permits same-intent retry. UNKNOWN stays locked, including successful transfer plus failed callback. Real SR05 fault proof remains blocked. |

Residual implementation risks: unmeasured callback gas and worst-case view cost; no real failed-transfer liquidity timing proof; no financial audit; single-process controlled Sandbox reviewers; no structured per-criterion manifest validation yet; external wallet/redirect and provider flows unverified; no production key-control/deployment review. Operator/full-access-key compromise and the creator-favored base unresolved fallback remain the UX3C threat-model limitations. KEEP_PRIMARY and one bounded challenge prevent a challenger profiting simply by forcing fresh timeout, while also retaining the risk of a wrong primary judgment.

Next exact engineering action: run `node scripts/build-contracts.mjs` and `npm run test:sandbox` on a Linux x86_64 host permitting at least 65535 file descriptors, fix any real Wasm failures, and prove SR05 with balance deltas before enabling funds or live adjudication. The first November 1 task remains financial invariant proof if still outstanding; log any event-window changes separately from this October 28 source.
