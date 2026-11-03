# M04 integration and acceptance record

Checkpoint: CONTRA-2026-11-03-IMPL-M04-J01

This record evaluates AC01 through AC33 against actual repository and runtime evidence. `PASS` means the criterion is satisfied within its stated scope. `PARTIAL` means useful evidence exists but one or more required checks are missing. `BLOCKED` means the criterion requires separately unauthorized testnet, paid-provider or independently controlled operator activity. A passing local Sandbox journey does not convert a testnet requirement into a pass.

## Verified local journeys

The compatible Ubuntu x86_64 host used glibc 2.39, hard open-file limit 1,048,576 and the checksum-pinned NEAR Sandbox 2.13.4 binary. The initial attempt on Ubuntu 22.04 stopped before Sandbox startup because its glibc did not satisfy the binary. No transaction ran there. The successful run used the compatible `Ubuntu` WSL distribution.

The reproducible command is `npm run test:m04:journeys`. It executed 44 API-backed operations and recorded 44 unique confirmed transaction hashes and 44 successful Sandbox receipts. Every operation contains the exact lifecycle `PREPARING`, `AWAITING_SIGNATURE`, `BROADCAST`, `PENDING`, `CONFIRMED`. Maximum observed transaction gas in this run was 35,954,802,810,711. No paid inference was enabled.

| Journey | Case | Evidence linkage | Result | Exact receiver balance delta |
| --- | --- | --- | --- | --- |
| Unchallenged | `b1ed7f3fb15ac752e3836df5e37b73fff906ba6045b2d2cce32b95e6f8a0c830` | Manifest `af1746823aaafe9d35ae3ed8641c0227fcc5cb9bb46df1369a7b912ec00682ba` | ACCEPT, PRIMARY, callback SUCCESS to beneficiary | 1,000,000,000,000,000,000,000,000 yoctoNEAR |
| Challenged | `c077294c1d8b9d306707536dec6ce473fc69d5f21f79b8535b346a14903adb11` | Manifest `33754063362ef6ed8e6787f5f04a882f9ee4f9de6a57199ead531d26f92c5517`; counterexample `47b7d42ceacf3872c14434846176ec3456b28bf6917f2713797ff044079b73c1` | Primary ACCEPT, fresh REJECT, FRESH, callback SUCCESS to creator | 1,000,000,000,000,000,000,000,000 yoctoNEAR |

Raw evidence:

- `project/artifacts/m04/local-journeys/journey-report.json`
- `project/artifacts/m04/local-journeys/operations.json`
- `project/artifacts/m04/local-journeys/receipts.json`
- `project/artifacts/m04/local-journeys/visual-qa-report.json`
- `project/artifacts/m04/local-journeys/the-bench-populated-desktop-1200x900.png`
- `project/artifacts/m04/local-journeys/the-bench-populated-tablet-768x1024.png`
- `project/artifacts/m04/local-journeys/the-bench-populated-mobile-390x844.png`

All six Sandbox reviewer accounts were controlled by one local process. Their disclosures state this common control. This run proves registry, committee, commit/reveal and settlement operation, not independent reviewer control.

## AC01 through AC33

| AC | Status | Evidence and remaining requirement |
| --- | --- | --- |
| AC01 | PARTIAL | Immutable JPEG SHA-256 remains `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`; desktop populated screenshot preserves the approved coded UX3A composition and NEAR palette. Explicit owner visual acceptance is still pending. |
| AC02 | PARTIAL | All sidebar controls open their mapped view or modal without mutation and browser QA exercises case selection, tabs, search and keyboard focus. URL routing, browser Back restoration and explicit focus return are not fully implemented. |
| AC03 | PASS | Pre-event October 28 implementation and November 3 competition-window changes are separated in commits and logs. Reference assets remain outside production source. |
| AC04 | PASS | Chain reads are available without a signing session; mutations require authentication and role checks. External testnet wallet use remains gated and cannot sign. |
| AC05 | PASS | Frozen terms preview, canonical digest, consent and contract input bounds are covered by the Rust SDK and P0 Sandbox evidence. The Bench shows exact native amount, parties, deadlines, criteria and fallback terms before creation. |
| AC06 | PARTIAL | Local create confirmations, request idempotency, durable operation records and reload reconciliation pass. External wallet rejection and redirect recovery remain unverified because testnet authorization is absent. |
| AC07 | PASS | P0 proves exact funding, wrong deposit rejection, authorization, duplicate rejection, immutable funded terms and reserve conservation. The M04 journeys add two confirmed exact 1 NEAR deposits. |
| AC08 | PASS | `CONTRA_EVIDENCE_V1` canonical bytes bind every criterion to immutable source hashes, provenance and participant-only access. Hash, size, corruption, authorization and append-only correction tests pass. Only the manifest digest enters the contract. |
| AC09 | PASS | Beneficiary-only, deadline-bound and immutable evidence submission is covered by contract/P0 tests; both M04 cases link the exact stored manifest digest to the onchain record. |
| AC10 | PARTIAL | Meta primary/fresh, Baseten adversarial and Modal verifier fixtures validate case, round, role, model, citations, limitations, source provenance and injection resistance. Live provider interoperability and actual provider records remain unauthorized and unverified. |
| AC11 | PARTIAL | Atomic persistent reservation, idempotency, cap exhaustion, timeout retention and no-double-call tests pass for $3 Meta, $3 Baseten and $5 Modal caps. Actual billing reconciliation requires authorized live use. |
| AC12 | PASS | Shared canonical commitment vectors pass; commitments bind chain, contract, case, round, terms, evidence, finding, reviewer and nonce. M04 receipts show appointed commits before reveal. |
| AC13 | PASS | Rust and P0 tests cover wrong, late, duplicate and unauthorized reveals, threshold and unresolved behavior. M04 shows two matching valid reveals in both rounds. |
| AC14 | PARTIAL | Frozen disjoint 3+3 membership and disclosure digest joins pass. The UI and artifacts state that all local accounts share one process. Six independently controlled operators remain unavailable. |
| AC15 | PARTIAL | The challenged journey stores an immutable criterion-bound counterexample and confirms the signed challenge onchain. The browser entry is present, but the live challenge was driven through the authenticated API rather than a manual wallet browser journey. |
| AC16 | PASS | P0 proves confirmed challenge blocks ordinary settlement and tests concurrent/deadline ordering. M04 records the confirmed challenge before fresh review and settlement. |
| AC17 | PASS | The fresh committee is disjoint, its votes bind the deterministic challenge bundle, old votes do not count, and the live M04 case reverses ACCEPT to REJECT with FRESH basis. |
| AC18 | PASS | P0 covers before/at/after deadline boundaries, submission expiry, primary unresolved fallback and KEEP_PRIMARY fresh timeout. M04 advances only from observed chain time. |
| AC19 | PASS | Premature finalization rejection and intent-before-transfer ordering pass in P0. M04 receipts record `payout_dispatched` before callback-confirmed `payout_result`. |
| AC20 | PASS | P0 covers authenticated self-callback and wrong-intent rejection. Both M04 cases record the exact recipient, amount, intent and callback SUCCESS. |
| AC21 | PASS | P0 proves failed transfer states, exact-intent retry, duplicate/concurrent retry safety and balance conservation. |
| AC22 | PASS | P0 SR05 and UNKNOWN tests prove no blind retry after ambiguous callback or RPC state. The service keeps UNKNOWN operations locked and idempotent. |
| AC23 | PASS | Creator-only unfunded cancellation and post-funding prohibition pass contract and Sandbox tests. The UI does not describe cancellation as a refund. |
| AC24 | PARTIAL | Local lifecycle persistence, transaction hash linkage, UNKNOWN lock, reload recovery and reconciliation pass. External wallet rejection, redirect and signed testnet recovery remain gated. |
| AC25 | PARTIAL | Final reads carry network, finality, block height/hash/timestamp and observation time; stale state is visible and refresh generations prevent late overwrite. Injected index-lag and out-of-order adapter tests remain incomplete. |
| AC26 | PASS | Chain-unavailable mode blocks transactions and does not fabricate state. Paid providers remain unavailable without all authorization gates. No runtime fixture fallback exists. |
| AC27 | PASS | The eight-sector radar uses deterministic numerator/denominator sources, distinguishes N/A from zero, exposes accessible details and is verified in populated screenshots. It has no settlement authority. |
| AC28 | PARTIAL | Populated browser evidence shows materials, reviewers, tasks and activity from one selected canonical case, with UTC and event sequence labels. Duplicate event ID and full pagination/case-switch matrices remain incomplete. |
| AC29 | PASS | Text is escaped, structured citations are allowlisted, source content is explicitly untrusted, NEP-413 replay/expiry and cross-case access tests pass, and no secret is exposed in browser assets. |
| AC30 | PARTIAL | Chromium passes desktop, tablet and mobile overflow, named controls, keyboard focus, textual status, reduced motion and console checks. A 320px at 200 percent zoom screen-reader audit, Escape behavior and focus return remain incomplete. |
| AC31 | BLOCKED | The complete local unchallenged Sandbox journey passes with linked manifest, receipts, exact balance delta and callback. The frozen criterion requires an authorized testnet case and actual provider records, which remain unauthorized. |
| AC32 | BLOCKED | The complete local challenged Sandbox journey passes with a stored counterexample, fresh reversal, exact balance delta and callback. The frozen criterion requires authorized testnet and actual provider records, which remain unauthorized. |
| AC33 | PASS | `docs/UX3B_FUNCTIONAL_INTEGRATION_MAP.md`, contract ABI, API routes and The Bench entries provide A01-A23 role/state, mutation/no-op, receipt/job, error/retry and UI traceability. M04 raw operations link all exercised mutations to receipts. |

Summary: 20 PASS, 11 PARTIAL, 2 BLOCKED. No AC status relaxes the frozen protocol or authorizes testnet, paid inference, production secrets or mainnet.

## Browser verification

Chromium rendered the genuine retained Sandbox state. The final run passed 16 checks: populated selection, settled state, final-block display, accessible button names, structured criteria sources, radar details, search, keyboard focus, desktop/tablet/mobile overflow, tablet materials, mobile clipping/navigation, reduced motion and zero console errors. Visual inspection found and corrected a tablet radar-height defect before the passing recapture. The screenshots are evidence of the local Sandbox state, not owner visual acceptance.
