# AC01 to AC33 acceptance matrix

Release evidence notice: the integrated CONTRA interface, public Cloudflare runtime and NEAR Testnet contract are live. One funded Testnet case reached callback-authenticated settlement through the no-quorum `BASE_REFUND` policy. Meta and Modal produced non-binding retrospective artifacts for that closed case. Controlled fixtures and Sandbox evidence remain explicitly distinguished from live observations, and AC31 and AC32 remain DEFERRED because the intended committee-decided unchallenged journey and a complete challenged appeal journey have not both been demonstrated on Testnet.

Checkpoint: `CONTRA-2026-11-14-LIVE-SETTLEMENT-PROVIDER-VERIFIED`

Evidence cut-off: merged `main` commit `42f5b8370ba92c1633debe5aa4b54b400400e48a`. Criteria are upgraded only from evidence of the required class.

This is a criterion-by-criterion review of the implemented protocol and [current functional acceptance matrix](../testing/FUNCTIONAL_ACCEPTANCE_MATRIX.md). PASS means the criterion is supported by current retained evidence at the stated environment boundary. PARTIAL means a material part is proven but one or more required observations are absent. BLOCKED means the required live external evidence cannot exist without an externally controlled resource or signature.

The final comprehensive gate passed in [Integration run 43627351495](https://github.com/kellyxy110/CONTRA/actions/runs/43627351495). It includes the corrected nine-test Sandbox baseline, both complete controlled Contestation journeys and the credential-free judge quick-start. [Core 43627415879](https://github.com/kellyxy110/CONTRA/actions/runs/43627415879), [Security 43627181326](https://github.com/kellyxy110/CONTRA/actions/runs/43627181326) and [Contract 43627420080](https://github.com/kellyxy110/CONTRA/actions/runs/43627420080) also passed against final `main`.

## Evaluation

| AC | Status | Evidence class | Current evidence and remaining limitation |
| --- | --- | --- | --- |
| AC01 | PARTIAL | Historical browser and source | The immutable reference checksum and active asset boundary are enforced. Final visual acceptance is deferred to the owner-provided frontend, so no new screenshot acceptance is claimed. |
| AC02 | PASS | Operational client and browser tests | Hash routes cover all current workspaces, retain case selection, use browser history for dialogs and restore focus. Navigation itself does not request a signature or mutate contract state. |
| AC03 | PASS | Git history | Eligible implementation history and the actual 2026-10-28 start are preserved. Pre-event reference assets remain separate from production source. |
| AC04 | PASS | Service, wallet and contract tests | Unavailable and wrong-mode paths fail closed. Wallet handoff requires testnet, the expected contract, an authenticated signer and an explicit server authorisation gate. |
| AC05 | PASS | Rust, protocol vectors and Sandbox | Canonical terms, beneficiary consent, creator admission, exact integer amount, fixed committees and frozen digests are validated before funding. |
| AC06 | PASS | Sandbox plus genuine Testnet wallet execution | Sandbox creates a real Draft from a confirmed receipt. Testnet execution additionally proves wallet-approved case operations, stable request identity and final receipt reconciliation. Interrupted handoff, restart, duplicate preparation and recovered-hash paths remain covered by controlled fault tests. |
| AC07 | PASS | Sandbox, F01 to F18 and Testnet receipt | Exact native funding, wrong or duplicate deposits, authorisation and immutable funded terms are covered. The retained Testnet case was funded with 0.1 NEAR and later settled through the frozen fallback policy. |
| AC08 | PASS | Service and restart tests | Canonical manifests, source digests, provenance, case isolation, size limits, corruption detection, backup and restore all fail closed. Private source bytes remain offchain. |
| AC09 | PASS | Rust, Sandbox and Testnet receipt | Beneficiary, deadline, case, terms and manifest-digest guards prevent unauthorised, late, stale or duplicate evidence submission. A genuine Testnet case also reached onchain evidence submission. |
| AC10 | PARTIAL | Deterministic provider fixtures plus live retrospective execution | Meta produced proposal `f12b3961...3ff3d` and Modal produced verification `0e4981b4...a427` bound to that exact proposal for a genuine closed Testnet case. The artifacts were retrospective and non-binding, so execution during an active review round remains unproven. |
| AC11 | PARTIAL | Durable provider ledger and live Meta usage | Reservations are durable, atomic, idempotent, concurrency-limited and capped. Ambiguous case-bound calls lock their reservation and cannot be retried automatically. The live Meta smoke reconciled 49 tokens to 110 microUSD and Modal used zero model tokens, but case-bound live billing evidence remains absent. |
| AC12 | PASS | Rust and cross-language vectors | Exact domain separation, serialization, appointed reviewer checks and replay boundaries pass. Reveal nonces are excluded from general audit records. |
| AC13 | PASS | Rust and Sandbox | Wrong, late, duplicate and conflicting review actions fail. Two matching reveals decide; timeout and no-quorum paths follow frozen fallback rules. |
| AC14 | PARTIAL | Testnet registry, signed disclosures and controlled regressions | Six distinct Testnet reviewer accounts were registered and confirmed, with account, disclosure revision, operator identifiers and disjoint 3 plus 3 committees enforced. Operator independence relies on supplied signed control disclosures and has not been independently audited by the repository. |
| AC15 | PARTIAL | Sandbox, service and browser artifacts | Criterion-bound counterexample storage, filing eligibility, disabled-signing presentation and a confirmed challenged Sandbox journey pass. The complete external-wallet challenge has not been signed against Testnet. |
| AC16 | PASS | Sandbox concurrency and journeys | Confirmed challenge blocks ordinary finality, and ordering follows contract time and receipt order rather than the browser clock. |
| AC17 | PASS | Sandbox challenged journey | Fresh committee, fresh evidence bundle, old-round exclusion, reversal from ACCEPT to REJECT and KEEP_PRIMARY timeout behaviour are verified. |
| AC18 | PASS | Rust and Sandbox deadlines | Submission, commit, reveal, challenge and fresh-review timeouts use contract timestamps and the frozen base or challenge fallback. |
| AC19 | PASS | Rust, Sandbox and Testnet payout evidence | Finalisation guards, immutable intent-before-transfer ordering and SettlementPending semantics are covered. The retained Testnet case reached final settlement through one immutable payout attempt. Pending or ambiguous outcomes are never shown as paid. |
| AC20 | PASS | Rust, Sandbox and Testnet receipt | Only the private callback can settle the exact payout intent. The live receipt records `SUCCESS_VERIFIED` and an exact 0.1 NEAR refund to `contra-creator.testnet`; spoofed or mismatched callbacks fail in regression coverage. |
| AC21 | PASS | Fault contract and Sandbox | Verified failure alone enables retry of the same immutable intent. Duplicate and concurrent retries cannot create a second payout. |
| AC22 | PASS | Fault contract, wallet and controlled workflow | Callback or RPC uncertainty remains locked and never triggers blind retry or redispatch. Original transaction identities survive restart. |
| AC23 | PASS | Rust and Sandbox | Creator-only cancellation is limited to Draft and cannot imply or trigger a funded refund. |
| AC24 | PASS | Wallet service, browser tests and genuine Testnet signing | PREPARED, SIGNING, PENDING, CONFIRMED, FAILED and UNKNOWN remain distinct across rejection, redirect loss, callback failure, reload, account switch and restart. Live operations retained their exact identities and hashes; recovery uses the original operation with zero blind redispatch. |
| AC25 | PARTIAL | Live RPC, readiness and interface tests | Network, contract, finality, block identity, observation time, staleness and regression are explicit and fail closed. Public readiness now proves fresh finalised Testnet observations, while longer multi-RPC production history remains limited. |
| AC26 | PASS | Failure injection | RPC and provider failures remain unavailable or unresolved. The runtime does not fall back to fixture success or invent receipts, findings, identities or amounts. |
| AC27 | PASS | Coverage unit and browser evidence | Eight sectors, populated polygon geometry, exact numerator and denominator data, N/A versus zero, protected-data denial, lenses and non-authoritative semantics are verified in Chromium and Firefox. |
| AC28 | PARTIAL | Operational client and browser evidence | Search, state and account filters, linked case inspection, selected-case consistency, case-switch cancellation and basic pagination are implemented. Broader duplicate-event and multi-page live-index evidence remains incomplete. |
| AC29 | PASS | Security and service tests | Untrusted evidence is isolated from instructions, browser output is escaped, sessions reject replay and expiry, and cross-case protected data is denied. Current-tree secret and policy checks pass. |
| AC30 | PARTIAL | Browser accessibility evidence | Keyboard routes, dialog focus, Escape, return focus, text states and responsive evidence exist. A current manual screen-reader session against the final owner frontend is absent. |
| AC31 | DEFERRED | Requires the intended complete live committee journey | A genuine Testnet case was created, accepted, funded, supplied with evidence and settled. It ended through no-quorum `BASE_REFUND`, so it does not prove a committee-decided unchallenged result. |
| AC32 | DEFERRED | Requires a complete challenged Testnet case | The challenged Sandbox reversal and canonical challenged-packet validation pass. A genuine Testnet counterexample, fresh appeal decision and final challenged settlement remain post-hackathon work. |
| AC33 | PASS | ABI, API and interface traceability | A01 to A23 remain mapped to contract, service or no-op behaviour. `CONTRA_FRONTEND_INTERFACE_V1` now machine-checks every implemented API route and exact Rust case states. |

## Result

Current result: **23 PASS, 8 PARTIAL, 2 DEFERRED**.

The two upgrades from the M05 baseline are evidence-based:

- AC06 moves from PARTIAL to PASS because M06 added durable external-wallet intent, authoritative pre-handoff rejection, interrupted-handoff UNKNOWN locking, receipt-only hash recovery and duplicate-dispatch prevention, all connected to genuine local Sandbox case creation evidence.
- AC24 moves from PARTIAL to PASS because the complete simulated external-wallet lifecycle now covers browser reload, callback loss, restart, account switching, rejection, concurrent requests, receipt reconciliation and exact identity persistence.

No criterion is upgraded from fixture evidence where its text requires a live provider, independent operator, deployed testnet contract or manual assistive-technology observation. AC31 and AC32 remain DEFERRED.

## Environment boundary

- Contract-sensitive financial evidence uses real local NEAR Sandbox transactions and retained receipts.
- Genuine browser-wallet authentication and operation-specific Testnet transaction signing are verified. Private keys remain wallet-held, and the application cannot grant itself general signing authority.
- Meta and Modal produced retained retrospective artifacts for the genuine settled case. Baseten's historical probe remains audit evidence only and Baseten is not an active provider.
- Six Testnet reviewer accounts were registered and confirmed. The repository preserves signed control disclosures but cannot independently audit the real-world identity or custody of each operator.
- The Contestation contract and public operational API are live. One funded Testnet case settled through `BASE_REFUND`; the complete challenged Testnet journey remains outstanding.
