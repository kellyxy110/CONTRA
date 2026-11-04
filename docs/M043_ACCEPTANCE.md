# M04.3 desktop and radar correction acceptance record

Checkpoint: `CONTRA-2026-11-04-IMPL-M04.3-P1`

Owner visual acceptance: rejected for M04.2, pending for M04.3

## Phase 1 root cause

At 1536 x 676, the M04.2 implementation rendered an 842px shell and a 787px main workspace. The document height was 882px, 206px taller than the visible viewport. The direct causes were the desktop `min-height:810px` shell, `min-height:756px` main columns and cumulative fixed section minimums.

The initial correction also exposed 31px of concealed middle-column overflow at 1200 x 900. That overflow came from a 105px progress row, 410px radar row and 272px materials minimum inside a 756px column.

## Phase 1 implementation

- Short desktops use a shell height of `calc(100vh - 24px)` with no minimum-height dependency.
- The three columns use explicit flexible grid rows.
- The primary Overview keeps case summary, progress, complete radar, primary actions and navigation visible.
- Overview shows two reviewer summaries, a compact materials count and one recent activity.
- Full reviewer, evidence and activity records remain available through stable routed workspaces.
- Desktops at 850px or taller use a centered 810px shell without document-margin overflow.
- No desktop column uses an independent scrollbar.

## Phase 1 verification

Command: `npm run test:frontend:desktop:m043`

The final run passes horizontal-overflow and console checks at all eight viewports. All five desktop viewports additionally pass shell, navigation, case summary, progress, radar, canvas, primary-action, document-scroll, column-scroll, control-visibility and minimum-text checks.

| Viewport | Shell bottom | Radar bottom | Document height | Result |
| --- | ---: | ---: | ---: | --- |
| 1536 x 676 | 664 | 571 | 676 | PASS |
| 1366 x 768 | 756 | 663 | 768 | PASS |
| 1200 x 900 | 855 | 614 | 900 | PASS |
| 1440 x 900 | 855 | 614 | 900 | PASS |
| 1920 x 1080 | 945 | 704 | 1080 | PASS |

Tablet 768 x 1024, mobile 390 x 844 and effective-width 320 x 844 pass horizontal-overflow and console checks. Their single-document flow remains intentionally scrollable.

The mandatory corrected screenshot is `project/artifacts/m043/phase1/desktop-short-1536x676.png`. The before image, all target viewport captures and `desktop-fit-report.json` are in the same directory. Each is a visible-viewport screenshot, not a full-page capture.

## Phase 1 gate

PASS. The screenshots were inspected after the numerical checks. Phase 2 may proceed. Owner visual acceptance is not claimed.

## Phase 2 measurement definitions

| Sector | Numerator | Denominator | Source |
| --- | --- | --- | --- |
| Evidence | Frozen criteria with a selected manifest record whose linked sources are retrievable | Frozen criteria | Selected evidence manifest and source retrieval results |
| Provenance | Retrievable selected-manifest sources with origin, capture time and submitter | Selected-manifest sources | Selected evidence manifest provenance |
| Review | Completed reveals in the selected primary or fresh round | Appointed slots in the selected round | Contract round records |
| Finality | Completed disposition, payout intent, callback observation and settled state | Four lifecycle milestones | Contract case and payout records |
| Challenge | Completed counterexample, fresh commit, fresh reveal and fresh resolution | Four challenge milestones | Contract challenge and fresh-round records |
| Quorum | Largest matching disposition count capped at threshold | Two matching reveals | Contract round records and frozen policy |
| Keyboard | Verified FULFILLED keyboard evaluations | Keyboard criteria | Protected criterion evaluation records |
| Criteria | Valid linked evidence plus recorded evaluation entries | Two records per frozen criterion | Protected manifest and evaluation records |

Measured zero has a nonzero denominator and displays `0%`. N/A means the measurement does not apply. Locked means the user lacks access to protected records. Unavailable means retrieval failed. Missing means an expected record was not returned. These states never masquerade as measured zero.

## Phase 2 lens definitions

- Criteria: Evidence, Provenance, Keyboard and Criteria acceptance records.
- Evidence: Evidence, Provenance, Review and Quorum adjudication readiness.
- Overall: all eight lifecycle measurements. This is the default.

An excluded sector displays N/A for the selected lens while its underlying numerator, denominator, source and status remain in the metric record.

## Genuine Sandbox values

Observation records are preserved in `radar-qa-report.json`. The selected genuine challenged case is `e97ff99942388b0e490e057435228fa82709ec76f2849b5c8c1bec579eca6e9c`.

| Sector | Value | Numerator | Denominator | Status | Source |
| --- | ---: | ---: | ---: | --- | --- |
| Evidence | 100% | 1 | 1 | measured | Retrievable source-linked selected manifest criterion |
| Provenance | 100% | 1 | 1 | measured | Retrievable source with complete provenance |
| Review | 67% | 2 | 3 | measured | Fresh round reveals |
| Finality | 100% | 4 | 4 | measured | Disposition, intent, callback and settled state |
| Challenge | 100% | 4 | 4 | measured | Counterexample, fresh commit, fresh reveal and resolution |
| Quorum | 100% | 2 | 2 | measured | Largest matching fresh-round disposition count |
| Keyboard | Missing | 0 | 0 | missing | No independent criterion evaluation record returned |
| Criteria | Missing | 0 | 0 | missing | No independent criterion evaluation record returned |

The genuine unchallenged case differs at Challenge, which is N/A, and uses primary round review and quorum sources. Protected sectors display Locked when disconnected rather than false 0%.

## Phase 2 verification

- `npm test`: 35/35 pass.
- `npm run test:frontend:radar:m043`: 17/17 pass.
- `npm run test:frontend:desktop:m043`: complete responsive matrix passes.
- Browser console errors: zero.
- Label overlap: none in zero, partial and complete rendered states.
- Case switching: all eight genuine metrics refresh and the two profiles differ.

The required comparison is `project/artifacts/m043/phase2/radar-three-state-comparison.png`. It contains clearly labeled deterministic created/unfunded zero, incomplete fresh-review partial and settled challenged complete fixtures. Individual fixture screenshots, genuine case screenshots and the exact report are stored beside it. Deterministic fixtures are not transactions.

## Phase 2 gate

PASS. The actual screenshots were inspected after the calculations passed. Phase 3 may proceed. Owner visual acceptance is not claimed.

## Phase 3 browser verification

Windows Chrome, Playwright Chromium and Firefox each passed 93 viewport checks and 12 interaction checks. The resulting total is 315/315. The matrix uses actual visible browser viewports, not full-page screenshots, at 1536 x 676, 1366 x 768, 1200 x 900, 1440 x 900, 1920 x 1080, 768 x 1024, 390 x 844 and 320 x 844.

Verified behavior includes horizontal overflow, desktop document and column scroll ownership, primary-section boundaries, full radar placement, eight direct metric values, label overlap, readable text, console errors, keyboard navigation through all workspaces, browser Back, Escape, focus restoration and reduced motion. The report is `project/artifacts/m043/phase3/browser-matrix/browser-matrix-report.json`.

The existing complete end-to-end suite also passes 54/54 checks. Manual screen-reader testing was not run, is recorded as NOT RUN, and remains an open acceptance item.

## Phase 3 visual inspection

Fresh connected-case images are in `project/artifacts/m043/phase3/final/`. The mandatory corrected image is `desktop-short-1536x676.png`. The same directory contains 1366 x 768, 1200 x 900, 1440 x 900, 1920 x 1080, tablet, mobile and 320px visible-viewport images plus dedicated smaller-screen radar positions.

The 1536 x 676, 1200 x 900, tablet, mobile and mobile-radar screenshots were visually inspected after the automated checks. The desktop primary workspace is fully visible. The responsive layouts have no horizontal clipping, and the radar labels, values, rings, spokes and eight independent sectors remain readable. No remaining visual defect was identified in this local review. This is engineering verification only, not owner acceptance.

## Phase 3 Sandbox regression

The first rerun encountered `EADDRINUSE` because the retained review server owned port 4173. The unchanged workflow passed on isolated port 4273 with 44 confirmed operations, 44 receipts and two manifests. Artifacts are under `project/artifacts/m043/phase3/sandbox/`.

| Journey | Primary | Final | Basis | Receiver | Exact balance delta | Callback |
| --- | --- | --- | --- | --- | ---: | --- |
| Unchallenged | ACCEPT | ACCEPT | PRIMARY | beneficiary.test.near | 1000000000000000000000000 yoctoNEAR | SUCCESS |
| Challenged | ACCEPT | REJECT | FRESH | creator.test.near | 1000000000000000000000000 yoctoNEAR | SUCCESS |

All six local reviewer accounts were controlled by one process. This is functional committee evidence, not independent-operator evidence. No paid inference was used.

## Phase 3 regression results

- Browser matrix: 315/315 pass across three engines.
- Complete frontend end-to-end suite: 54/54 pass.
- Repository service and coverage tests: 35/35 pass.
- Rendered radar checks: 17/17 pass.
- Desktop responsive gate: pass at all eight target sizes.
- Wallet bundle: build passed.
- Browser console errors: zero.
- Manual screen reader: NOT RUN.

## Phase 3 gate

PASS at the authorized local engineering scope. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED. AC31 and AC32 remain blocked. Owner visual acceptance is pending and is not claimed.
