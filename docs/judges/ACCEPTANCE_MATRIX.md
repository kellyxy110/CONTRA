# AC01 to AC33 acceptance matrix

Checkpoint: `CONTRA-2026-11-09-M11-ACCEPTANCE-REVIEW`

Evidence cut-off: implementation merge `59de0f9b57b5245aaae1bb6d90d0df7c7f17b5bd`, promoted to `main` as `a74445527dd66f2ff0c684887849346f7951416e`.

This is a fresh criterion-by-criterion review of [the frozen acceptance specification](../UX3B_ENGINEERING_ACCEPTANCE.md). PASS means the criterion is supported by current retained evidence at the stated environment boundary. PARTIAL means a material part is proven but one or more required observations are absent. BLOCKED means the required live external evidence cannot exist without an owner-controlled resource or authorisation.

The complete protected-main gate passed in [GitHub Actions run 42624205937](https://github.com/kellyxy110/CONTRA/actions/runs/42624205937). It includes the corrected nine-test Sandbox baseline, both complete Contestation journeys and the controlled M06 workflow. Core passed in [42624205902](https://github.com/kellyxy110/CONTRA/actions/runs/42624205902) and Security passed in [42624205805](https://github.com/kellyxy110/CONTRA/actions/runs/42624205805).

## Evaluation

| AC | Status | Evidence class | Current evidence and remaining limitation |
| --- | --- | --- | --- |
| AC01 | PARTIAL | Historical browser and source | The immutable reference checksum and active asset boundary are enforced. Final visual acceptance is deferred to the owner-provided frontend, so no new screenshot acceptance is claimed. |
| AC02 | PASS | Operational client and browser tests | Hash routes cover all current workspaces, retain case selection, use browser history for dialogs and restore focus. Navigation itself does not request a signature or mutate contract state. |
| AC03 | PASS | Git history | Eligible implementation history and the actual 2026-10-28 start are preserved. Pre-event reference assets remain separate from production source. |
| AC04 | PASS | Service, wallet and contract tests | Unavailable and wrong-mode paths fail closed. Wallet handoff requires testnet, the expected contract, an authenticated signer and an explicit server authorisation gate. |
| AC05 | PASS | Rust, protocol vectors and Sandbox | Canonical terms, beneficiary consent, creator admission, exact integer amount, fixed committees and frozen digests are validated before funding. |
| AC06 | PASS | Sandbox plus controlled wallet simulation | Sandbox creates a real Draft from a confirmed receipt. Stable request identity, pre-handoff rejection, interrupted handoff, restart, duplicate preparation and recovered hash paths are tested without duplicate dispatch. External signing remains simulated but is not required to establish this Sandbox criterion. |
| AC07 | PASS | Sandbox and F01 to F18 | Exact native funding, wrong or duplicate deposits, authorisation and immutable funded terms are covered. No testnet deposit is claimed. |
| AC08 | PASS | Service and restart tests | Canonical manifests, source digests, provenance, case isolation, size limits, corruption detection, backup and restore all fail closed. Private source bytes remain offchain. |
| AC09 | PASS | Rust and Sandbox | Beneficiary, deadline, case, terms and manifest-digest guards prevent unauthorised, late, stale or duplicate evidence submission. |
| AC10 | PARTIAL | Deterministic provider fixtures | Meta and Baseten request shapes, citations, provenance, prompt-injection resistance and invalid responses are tested. No authorised real provider response exists. |
| AC11 | PARTIAL | SQLite concurrency and provider fixtures | Reservations are durable, atomic, idempotent and capped. Ambiguous started calls retain their reservation. Actual provider billing reconciliation remains unavailable. |
| AC12 | PASS | Rust and cross-language vectors | Exact domain separation, serialization, appointed reviewer checks and replay boundaries pass. Reveal nonces are excluded from general audit records. |
| AC13 | PASS | Rust and Sandbox | Wrong, late, duplicate and conflicting review actions fail. Two matching reveals decide; timeout and no-quorum paths follow frozen fallback rules. |
| AC14 | PARTIAL | Registry and controlled reviewer fixtures | Account, disclosure, revision, operator identifiers and disjoint 3 plus 3 committees are enforced. Six separately controlled real-world operators are unavailable. |
| AC15 | PARTIAL | Sandbox and service artifacts | Criterion-bound counterexamples and a confirmed challenged Sandbox journey pass. The complete external-wallet browser challenge flow has not been exercised with a live wallet. |
| AC16 | PASS | Sandbox concurrency and journeys | Confirmed challenge blocks ordinary finality, and ordering follows contract time and receipt order rather than the browser clock. |
| AC17 | PASS | Sandbox challenged journey | Fresh committee, fresh evidence bundle, old-round exclusion, reversal from ACCEPT to REJECT and KEEP_PRIMARY timeout behaviour are verified. |
| AC18 | PASS | Rust and Sandbox deadlines | Submission, commit, reveal, challenge and fresh-review timeouts use contract timestamps and the frozen base or challenge fallback. |
| AC19 | PASS | Rust, Sandbox and payout evidence | Finalisation guards, immutable intent-before-transfer ordering and SettlementPending semantics are covered. Pending or ambiguous outcomes are never shown as paid. |
| AC20 | PASS | Rust and Sandbox receipts | Only the private callback can settle the exact payout intent. Spoofed or mismatched callbacks fail, and exact recipient and amount are reconciled. |
| AC21 | PASS | Fault contract and Sandbox | Verified failure alone enables retry of the same immutable intent. Duplicate and concurrent retries cannot create a second payout. |
| AC22 | PASS | Fault contract, wallet and controlled workflow | Callback or RPC uncertainty remains locked and never triggers blind retry or redispatch. Original transaction identities survive restart. |
| AC23 | PASS | Rust and Sandbox | Creator-only cancellation is limited to Draft and cannot imply or trigger a funded refund. |
| AC24 | PASS | Wallet service and browser simulation | PREPARED, SIGNING, PENDING, CONFIRMED, FAILED and UNKNOWN remain distinct across rejection, redirect loss, callback failure, reload, account switch and restart. Recovery uses the original operation and hash with zero redispatch. |
| AC25 | PARTIAL | RPC and interface tests | Network, contract, finality, block identity, observation time, staleness and regression are explicit and fail closed. A complete deployed-contract field review remains unavailable. |
| AC26 | PASS | Failure injection | RPC and provider failures remain unavailable or unresolved. The runtime does not fall back to fixture success or invent receipts, findings, identities or amounts. |
| AC27 | PASS | Coverage unit and browser evidence | Eight sectors, exact numerator and denominator data, N/A versus zero, lenses and non-authoritative semantics are verified. |
| AC28 | PARTIAL | Operational client and browser evidence | Selected-case consistency, case-switch cancellation and basic pagination are implemented. Broader duplicate-event and multi-page live-index evidence remains incomplete. |
| AC29 | PASS | Security and service tests | Untrusted evidence is isolated from instructions, browser output is escaped, sessions reject replay and expiry, and cross-case protected data is denied. Current-tree secret and policy checks pass. |
| AC30 | PARTIAL | Browser accessibility evidence | Keyboard routes, dialog focus, Escape, return focus, text states and responsive evidence exist. A current manual screen-reader session against the final owner frontend is absent. |
| AC31 | BLOCKED | Requires a complete live testnet case and providers | The contract is genuinely deployed and initialised on testnet, and the unchallenged local Sandbox journey passes. The deployed allowlist has no eligible creator, so a live case cannot begin. A complete authorised testnet case, live wallet actors and actual provider records also remain absent. B-M09-02, B-M09-03 and B-M10-02 apply. |
| AC32 | BLOCKED | Requires a complete challenged testnet case and providers | The contract is genuinely deployed and initialised on testnet, and the challenged local Sandbox reversal passes. The deployed allowlist has no eligible creator, so a challenged live case cannot begin. Real wallet interaction, independent reviewers and actual provider records also remain absent. B-M09-02, B-M09-03, B-M10-01 and B-M10-02 apply. |
| AC33 | PASS | ABI, API and interface traceability | A01 to A23 remain mapped to contract, service or no-op behaviour. `CONTRA_FRONTEND_INTERFACE_V1` now machine-checks every implemented API route and exact Rust case states. |

## Result

Current result: **23 PASS, 8 PARTIAL, 2 BLOCKED**.

The two upgrades from the M05 baseline are evidence-based:

- AC06 moves from PARTIAL to PASS because M06 added durable external-wallet intent, authoritative pre-handoff rejection, interrupted-handoff UNKNOWN locking, receipt-only hash recovery and duplicate-dispatch prevention, all connected to genuine local Sandbox case creation evidence.
- AC24 moves from PARTIAL to PASS because the complete simulated external-wallet lifecycle now covers browser reload, callback loss, restart, account switching, rejection, concurrent requests, receipt reconciliation and exact identity persistence.

No criterion is upgraded from fixture evidence where its text requires a live provider, independent operator, deployed testnet contract or manual assistive-technology observation. AC31 and AC32 remain BLOCKED.

## Environment boundary

- Contract-sensitive financial evidence uses real local NEAR Sandbox transactions and retained receipts.
- External-wallet interaction is controlled simulation only. No signature or transaction was broadcast by a browser wallet.
- Meta, Baseten and Modal use deterministic mocked transports only. No provider endpoint or paid inference was used.
- Six Sandbox reviewer accounts share one process and do not establish independent operator control.
- There is no testnet deployment, live funded testnet journey or public operational API.
