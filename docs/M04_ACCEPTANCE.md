# M04 integration and acceptance record

Checkpoint: CONTRA-2026-11-03-IMPL-M04-J01

This record evaluates AC01 through AC33 against actual repository and runtime evidence. `PASS` means the criterion is satisfied within its stated scope. `PARTIAL` means useful evidence exists but one or more required checks are missing. `BLOCKED` means the criterion requires separately unauthorised testnet, paid-provider or independently controlled operator activity. A passing local Sandbox journey does not convert a testnet requirement into a pass.

## Verified local journeys

The compatible Ubuntu x86_64 host used glibc 2.39, hard open-file limit 1,048,576 and the checksum-pinned NEAR Sandbox 2.13.4 binary. The initial attempt on Ubuntu 22.04 stopped before Sandbox startup because its glibc did not satisfy the binary. No transaction ran there. The successful run used the compatible `Ubuntu` WSL distribution.

The reproducible command is `npm run test:m04:journeys`. It executed 44 API-backed operations and recorded 44 unique confirmed transaction hashes and 44 successful Sandbox receipts. Every operation contains the exact lifecycle `PREPARING`, `AWAITING_SIGNATURE`, `BROADCAST`, `PENDING`, `CONFIRMED`. Maximum observed transaction gas in this run was 35,954,802,810,711. No paid inference was enabled.

| Journey | Case | Evidence linkage | Result | Exact receiver balance delta |
| --- | --- | --- | --- | --- |
| Unchallenged | `09006893b15ef0827d69fa080166091ffef49bd1f2a695bcbcb729a7a133f3c9` | Manifest `2895d6c8c2bae4408553d319de9f39b56ffa405447d21ba7786e5777581df41a` | ACCEPT, PRIMARY, callback SUCCESS to beneficiary | 1,000,000,000,000,000,000,000 yoctoNEAR |
| Challenged | `d3b67258309c992880dfa38dceae0163551ce1ebc350d981e7667e0514440ef3` | Manifest `d1771d2172f3253e06e147b02c5675a2f664ac54f977caacf8f361a5dc7e244d`; counterexample `bac6fa9df83814a32c5d2486df2c99c62f64c6cce403fb0cf98a83a90a3f0bfd` | Primary ACCEPT, fresh REJECT, FRESH, callback SUCCESS to creator | 1,000,000,000,000,000,000,000,000 yoctoNEAR |

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
| AC02 | PASS | Every sidebar control opens its mapped view without mutation. M04.1 verifies genuine case switching, tabs, search, browser Back closing the active dialog without leaving the case, Escape and explicit focus return. |
| AC03 | PASS | Pre-event October 28 implementation and November 3 competition-window changes are separated in commits and logs. Reference assets remain outside production source. |
| AC04 | PASS | Chain reads are available without a signing session; mutations require authentication and role checks. External testnet wallet use remains gated and cannot sign. |
| AC05 | PASS | Frozen terms preview, canonical digest, consent and contract input bounds are covered by the Rust SDK and P0 Sandbox evidence. The Bench shows exact native amount, parties, deadlines, criteria and fallback terms before creation. |
| AC06 | PARTIAL | Local create confirmations, request idempotency, durable operation records and reload reconciliation pass. External wallet rejection and redirect recovery remain unverified because testnet authorisation is absent. |
| AC07 | PASS | P0 proves exact funding, wrong deposit rejection, authorisation, duplicate rejection, immutable funded terms and reserve conservation. The M04 journeys add two confirmed exact 1 NEAR deposits. |
| AC08 | PASS | `CONTRA_EVIDENCE_V1` canonical bytes bind every criterion to immutable source hashes, provenance and participant-only access. Hash, size, corruption, authorisation and append-only correction tests pass. Only the manifest digest enters the contract. |
| AC09 | PASS | Beneficiary-only, deadline-bound and immutable evidence submission is covered by contract/P0 tests; both M04 cases link the exact stored manifest digest to the onchain record. |
| AC10 | PARTIAL | Meta primary/fresh, Baseten adversarial and Modal verifier fixtures validate case, round, role, model, citations, limitations, source provenance and injection resistance. Live provider interoperability and actual provider records remain unauthorised and unverified. |
| AC11 | PARTIAL | Atomic persistent reservation, idempotency, cap exhaustion, timeout retention and no-double-call tests pass for $3 Meta, $3 Baseten and $5 Modal caps. Actual billing reconciliation requires authorised live use. |
| AC12 | PASS | Shared canonical commitment vectors pass; commitments bind chain, contract, case, round, terms, evidence, finding, reviewer and nonce. M04 receipts show appointed commits before reveal. |
| AC13 | PASS | Rust and P0 tests cover wrong, late, duplicate and unauthorised reveals, threshold and unresolved behaviour. M04 shows two matching valid reveals in both rounds. |
| AC14 | PARTIAL | Frozen disjoint 3+3 membership and disclosure digest joins pass. The UI and artifacts state that all local accounts share one process. Six independently controlled operators remain unavailable. |
| AC15 | PARTIAL | The challenged journey stores an immutable criterion-bound counterexample and confirms the signed challenge onchain. The browser entry is present, but the live challenge was driven through the authenticated API rather than a manual wallet browser journey. |
| AC16 | PASS | P0 proves confirmed challenge blocks ordinary settlement and tests concurrent/deadline ordering. M04 records the confirmed challenge before fresh review and settlement. |
| AC17 | PASS | The fresh committee is disjoint, its votes bind the deterministic challenge bundle, old votes do not count, and the live M04 case reverses ACCEPT to REJECT with FRESH basis. |
| AC18 | PASS | P0 covers before/at/after deadline boundaries, submission expiry, primary unresolved fallback and KEEP_PRIMARY fresh timeout. M04 advances only from observed chain time. |
| AC19 | PASS | Premature finalisation rejection and intent-before-transfer ordering pass in P0. M04 receipts record `payout_dispatched` before callback-confirmed `payout_result`. |
| AC20 | PASS | P0 covers authenticated self-callback and wrong-intent rejection. Both M04 cases record the exact recipient, amount, intent and callback SUCCESS. |
| AC21 | PASS | P0 proves failed transfer states, exact-intent retry, duplicate/concurrent retry safety and balance conservation. |
| AC22 | PASS | P0 SR05 and UNKNOWN tests prove no blind retry after ambiguous callback or RPC state. The service keeps UNKNOWN operations locked and idempotent. |
| AC23 | PASS | Creator-only unfunded cancellation and post-funding prohibition pass contract and Sandbox tests. The UI does not describe cancellation as a refund. |
| AC24 | PARTIAL | Local lifecycle persistence, transaction hash linkage, UNKNOWN lock, reload recovery and reconciliation pass. External wallet rejection, redirect and signed testnet recovery remain gated. |
| AC25 | PARTIAL | Final reads carry network, finality, block height/hash/timestamp and observation time. M04.1 injects an old observation time and verifies visible stale state; refresh generations prevent late overwrite. Injected index-lag and a dedicated out-of-order adapter test remain incomplete. |
| AC26 | PASS | Chain-unavailable mode blocks transactions and does not fabricate state. Paid providers remain unavailable without all authorisation gates. No runtime fixture fallback exists. |
| AC27 | PASS | The eight-sector radar uses deterministic numerator/denominator sources, distinguishes N/A from zero, exposes accessible details and is verified in populated screenshots. It has no settlement authority. |
| AC28 | PARTIAL | Populated browser evidence shows materials, reviewers, tasks and activity from one selected canonical case, with readable UTC labels. M04.1 verifies two-case switching, all material tabs and activity pagination in both directions. Duplicate event ID handling and broader multi-page datasets remain incomplete. |
| AC29 | PASS | Text is escaped, structured citations are allowlisted, source content is explicitly untrusted, NEP-413 replay/expiry and cross-case access tests pass, and no secret is exposed in browser assets. |
| AC30 | PARTIAL | Chromium passes desktop, tablet, mobile, 125 percent and 200 percent effective zoom, including 320px width. Keyboard dialog entry, Escape, Back, focus return, landmarks, chart semantics, visible textual state, contrast and reduced motion pass. A manual assistive-technology screen-reader audit remains incomplete. |
| AC31 | BLOCKED | The complete local unchallenged Sandbox journey passes with linked manifest, receipts, exact balance delta and callback. The frozen criterion requires an authorised testnet case and actual provider records, which remain unauthorised. |
| AC32 | BLOCKED | The complete local challenged Sandbox journey passes with a stored counterexample, fresh reversal, exact balance delta and callback. The frozen criterion requires authorised testnet and actual provider records, which remain unauthorised. |
| AC33 | PASS | `docs/UX3B_FUNCTIONAL_INTEGRATION_MAP.md`, contract ABI, API routes and The Bench entries provide A01-A23 role/state, mutation/no-op, receipt/job, error/retry and UI traceability. M04 raw operations link all exercised mutations to receipts. |

Summary after M04.1: 21 PASS, 10 PARTIAL, 2 BLOCKED. No AC status relaxes the frozen protocol or authorizes testnet, paid inference, production secrets or mainnet.

## Browser verification

Chromium rendered the genuine retained Sandbox state. The final run passed 16 checks: populated selection, settled state, final-block display, accessible button names, structured criteria sources, radar details, search, keyboard focus, desktop/tablet/mobile overflow, tablet materials, mobile clipping/navigation, reduced motion and zero console errors. Visual inspection found and corrected a tablet radar-height defect before the passing recapture. The screenshots are evidence of the local Sandbox state, not owner visual acceptance.

M04.1 adds 58 passing end-to-end browser assertions, 55 responsive assertions across empty and populated states, and 15 radar and information-accuracy assertions. It verifies portable Playwright imports, account connect/disconnect, persisted-operation reconciliation after reload, all navigation entries, genuine case switching, Back, Escape, focus restoration, search, tabs, activity pagination, stale and unavailable states, permission denial, 125 and 200 percent effective zoom, 320px layout, touch targets, reduced motion, chart semantics and contrast. Owner visual acceptance remains separate.

M04.2 replaces configuration-derived radar completion with operational source rules and replaces major workflow dialogs with stable navigable views. Its final evidence adds 54/54 end-to-end checks, 46/46 empty and 46/46 populated responsive checks, 13/13 radar browser checks, 3/3 deterministic measurement subtests and 12/12 browser-matrix checks across Windows Chrome, Chromium and Firefox. Linux Chromium and manual screen-reader verification remain incomplete. The local journeys were reexecuted with 44 persisted operations and receipts. These additions strengthen AC02, AC27 and AC30 evidence but do not change the 21 PASS, 10 PARTIAL and 2 BLOCKED totals.

M04.3 Phase 1 corrects the rejected short-desktop composition. The actual 1536 x 676 viewport now contains the complete primary workspace without document or column scrolling, and seven additional responsive sizes pass the new visible-boundary regression. Extended records remain accessible in stable workspaces. This strengthens AC02 and AC30 presentation evidence but does not change the 21 PASS, 10 PARTIAL and 2 BLOCKED totals. Radar semantics remain subject to the M04.3 Phase 2 gate.

M04.3 Phase 2 strengthens AC27 with direct chart values, explicit measured, N/A, locked, unavailable and missing states, three meaningful lens scopes, exact observation metadata and 17/17 rendered checks. The deterministic lifecycle matrix covers every owner-required case state and the two genuine cases refresh all eight metrics when switched. AC27 remains PASS. The overall totals remain 21 PASS, 10 PARTIAL and 2 BLOCKED.

M04.3 Phase 3 adds 315/315 checks across Windows Chrome, Playwright Chromium and Firefox at eight exact viewport sizes, 54/54 complete end-to-end checks, inspected connected-case screenshots and a fresh 44-operation, 44-receipt Sandbox rerun of both settlement journeys. This strengthens AC01, AC02, AC27 and AC30 evidence. Manual screen-reader verification remains incomplete, owner visual acceptance remains pending, and AC31 plus AC32 retain their separately authorised external requirements. Totals remain 21 PASS, 10 PARTIAL and 2 BLOCKED.
