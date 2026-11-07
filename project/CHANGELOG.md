# Change log

## 2026-11-07 | IMPL-M06-P1 external wallet lifecycle local gate

Recovered the wallet portion of the preserved M06 stash onto `feat/m06-wallet-lifecycle` without applying its reviewer or provider work. Added strict external-call policy, durable pre-signing intents, session inspection, renewal and revocation, transaction-hash callbacks, finalized receipt reconciliation, network and payload matching, block-regression rejection and restart recovery. Added browser adapter helpers for stable operation identifiers, reload-visible pending operations, explicit rejection, interruption locking and delayed callback recovery.

Added eight controlled wallet lifecycle tests covering policy, receipt integrity, restart, concurrent prepare, conflicting reuse, repeated callbacks, rejection, missing redirect, delayed receipts, RPC failure, stale observations, UNKNOWN safety and session/account isolation. Updated M05 recovery expectations for schema version 3 and added finalized receipt block metadata. `npm test` passes 60/60, the focused M05/service/wallet run passes 51/51 and `npm run build:wallet` passes. Published code commit `379ff4e0111336da33579357a08c341ce6273dcb` in PR 4. Genuine Core `42373449517`, Security `42373449483` and Integration `42373449454` passed. Integration reran the nine-test baseline and both full journeys, then validated receipts and balances. No contract source, financial assertion, live transaction, signing, deployment, paid inference, secret or spend changed.

## 2026-11-07 | IMPL-M05.1 CI recovery local gate

Added Core, Contract, Security, Integration and Full Financial P0 GitHub Actions workflows with pinned actions, Node 26.13.0, clean Linux dependency installs, package-download caching and retained CI evidence. Added source, secret, dependency-delta, contract ABI, production/fault export, commitment-vector and historical-evidence checks plus a pull request template and retrospective verification matrix.

Pinned Playwright 1.65.0 and removed its direct advisory. Retained and disclosed 17 inherited NEAR development and Sandbox dependency findings. Rustfmt-normalized the contract and applied two strict-Clippy-equivalent rewrites. Local checks pass 52 repository tests, 28 Rust tests, rustfmt, Clippy with warnings denied, wallet build, exact vectors, 29 production exports, four fault-only exports and historical evidence integrity. The original and rebuilt Wasm hashes remain distinct and documented. No financial assertion, contract interface or settlement safeguard was weakened. Genuine Actions and PR evidence remain pending. No external transaction, deployment, signing, paid provider, production secret, mainnet action or spend occurred.

The first genuine Integration run failed before Sandbox launch because it attempted to raise the hosted runner's already sufficient open-file limit to 1,048,576. Replaced that fixed mutation with a conditional minimum of 65,535 and retained the observed soft and hard values. The first Contract run passed formatting, Clippy, tests and export separation, then identified path-dependent Wasm byte hashes between WSL and GitHub. The ABI gate now retains actual hashes as artifacts while hard-failing interface or production/fault export changes.

Genuine Core, Security and Contract jobs passed on the final CI head. A genuine hosted Integration run passed the corrected nine-test Sandbox baseline, both complete M04 journeys, fresh receipt and balance validation and artifact upload in 70m52s. Cancelled a later redundant Integration run after documenting that its only intervening changes were Contract ABI evidence reporting and documentation; it is not counted as a pass. Merged PR 1 into `implementation/oct28` as `a1eedc929758d3e9f16dffb78fee64da5820817e`. Protected `main` and `implementation/oct28` with PR-only updates, required Core and Security checks, conversation resolution, stale-review dismissal, administrator enforcement and force-push/deletion prohibition. Automatic merge remains disabled and `main` remains unchanged.

## 2026-11-07 | IMPL-M05-R03 compatible-host Sandbox regression

Ran both API-backed local Sandbox journeys on the compatible `Ubuntu` WSL distribution after the strengthened preflight passed. Refreshed the three structured M04 journey evidence files. Verified 44 CONFIRMED operations, 44 unique transaction hashes, 44 matching successful receipts and two callback-confirmed exact 1 NEAR settlements. The unchallenged path ended PRIMARY ACCEPT to the beneficiary. The challenged path reversed PRIMARY ACCEPT to FRESH REJECT and refunded the creator. Preserved the explicit one-process reviewer-control disclosure. No testnet transaction, deployment, external signing, live provider, production secret, mainnet action or spending occurred. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED.

Reran the complete P0 gate on the compatible host. All 18 financial categories, nine corrected baseline Sandbox tests, 28 Rust tests and 19 service/report tests passed. Captured 454 transactions, 753 receipt outcomes, 46 balance/storage snapshots, maximum transaction gas `35926618795729`, maximum callback gas `17002377317045`, maximum storage 17,470,225 bytes and zero gas-budget violations. The initial parent exited 2 only because Windows esbuild dependencies were shared with WSL. Added an isolated Linux-native wallet build helper, preserved the failure transcript, reproduced the bundle twice from clean installs, and recomputed the unchanged strict gate to exit 0. Added auditable reconciliation metadata and preserved the previous matrix evidence files.

## 2026-11-07 | IMPL-M05-R02 rate limits, isolation and durable restore

Added bounded rate controls for NEP-413 challenge and verification, artifact writes, provider evaluation and transaction dispatch, including `Retry-After`. Made configured public origin authoritative against forged Host matching. Added cross-case artifact isolation verification. Added offline SQLite WAL checkpoint and full storage audit preparation, a storage-check command, single-volume backup and restore instructions, successful copied-volume restore verification and missing-object fail-closed coverage. Added session and challenge expiry pruning. Added an abrupt child-process crash test proving object and reservation durability plus UNKNOWN recovery of a broadcast operation. Added concurrent limiter and aborted partial-body coverage. Verified all retained operational frontend assets remain served after visual cleanup. Full service and coverage suite passes 52/52. No Sandbox, testnet contract, transaction, signing, deployment, provider, secret or spending operation occurred.

Attempted the M04 journey regression on Windows and WSL. Windows lacked Unix `ps`; WSL lacked the GLIBC 2.38 and 2.39 versions required by the pinned Sandbox binary. Both failed before Sandbox launch and executed no transaction. Expanded preflight to validate native Linux, `ps`, binary presence and binary execution in addition to the file limit.

Reviewed AC01 through AC33 individually against M05 evidence. Preserved 21 PASS, 10 PARTIAL and 2 BLOCKED with no weakened requirement or unsupported upgrade.

## 2026-11-07 | IMPL-M05-R01 runtime, finalized reads and durable recovery

Added explicit unavailable, Sandbox and testnet startup configuration. Wired testnet RPC into startup with endpoint, chain identity, sync, account, deployed-code and finalized-block validation. Added finalized read provenance, stale and regressed block detection, authenticated finalized receipt inspection and genuine health metadata. Replaced implicit SQLite setup with two recorded migrations, FULL synchronous mode, integrity and content-object audits, conservative restart recovery to UNKNOWN and two-connection reservation verification. Tightened origin, JSON and browser security headers. Added 9 M05 runtime tests; the complete service and coverage suite passes 44/44. Verified live public testnet RPC status read-only, without a configured CONTRA contract, transaction or deployment.

Recorded the product-first M05 through M07 directive, live hackathon Q-001 eligibility, `security` plus `open` tracks and one-time submission safeguards. Added MIT license, safe environment example, hackathon checklist and M05 checkpoint report. Removed superseded standalone visual studies, capture wrappers and visual-only matrix tools after confirming the operational client still depends on selected UX3A assets. Preserved immutable references, functional browser coverage, protocol source and financial evidence. No Sandbox rerun, testnet transaction, signing, provider request, production secret, deployment or spending occurred.

## 2026-11-07 | DOC-HACKATHON-01 live hackathon instructions

Fetched the live `https://nearhackathon.com/HACKATHON.md` response and added it at repository root as `HACKATHON.md`. Recorded upstream SHA-256 `903794f4b656b456eaee087941517d024a33633641d167b90c3f060d381d9aed`. Normalized seven upstream em dash characters to ASCII punctuation to comply with repository policy without removing rule content; local SHA-256 is `81022d6f7c4d3033d581a1cdd90d50f60d5eb382722cd9034b2aa404cd64a8af`. No implementation, contract, test, transaction, deployment, paid provider, secret or repository setting changed. The live source says to read it again before submission because dates and rules may change.

## 2026-11-04 | IMPL-M04.3-P3 browser verification and visual evidence

Added a portable Windows Chrome, Playwright Chromium and Firefox matrix across eight required viewports, with 315 passing visible-viewport, overflow, radar, typography, console, keyboard, Back, Escape, focus and reduced-motion checks. Added reproducible genuine-case captures at every supported size and inspected the actual 1536 x 676, 1200 x 900, tablet, mobile and mobile-radar images. Corrected an ambiguous navigation selector in the existing end-to-end suite. Reexecuted both local Sandbox journeys on an isolated port after the first attempt encountered the existing server on port 4173. The successful rerun recorded 44 confirmed operations and receipts, two exact 1 NEAR receiver balance deltas, PRIMARY ACCEPT settlement and a FRESH REJECT reversal, both with callback SUCCESS. Repository tests pass 35/35, radar checks pass 17/17, desktop checks pass, and the wallet bundle builds. No contract, protocol, payout invariant, paid provider, deployment, secret, testnet or mainnet change occurred. Manual screen-reader testing and owner visual acceptance remain open.

## 2026-11-04 | IMPL-M04.3-P2 accurate radar values and retrieval states

Rebuilt coverage metrics around explicit measured, not-applicable, inaccessible, unavailable and missing states. Corrected the frontend retrieval path so HTTP authorization and network failures remain explicit instead of becoming false source absence. Added read-only disconnected case coverage with protected sectors marked Locked. Added direct percentage or status text at every sector label, persistent 25/50/75/100 rings, status markers, complete accessible chart text and exact metric metadata. Defined distinct Criteria, Evidence and Overall lens scopes and made Overall the default. Added exhaustive lifecycle unit tests and 17 rendered-browser checks for exact values, label boundaries and overlap, tab profiles, protected data, genuine case switching and console output. Generated three-state side-by-side and genuine Sandbox radar captures. Repository tests pass 35/35 and the Phase 1 viewport matrix remains clean. No contract, protocol, payout, transaction, provider, deployment, secret, testnet or mainnet change occurred.

## 2026-11-04 | IMPL-M04.3-P1 visible desktop workspace

Removed the fixed 810px and 756px desktop minimum-height dependencies and replaced cumulative section minimums with flexible three-column grid rows. Added a short-desktop layout that fits a 652px shell and 597px primary workspace inside the 1536 x 676 viewport. Reduced Overview reviewer cards to two summaries, made materials a compact count on short desktops and limited Overview activity to the newest event, with direct links to the existing Reviewers, Evidence and Activity workspaces. Corrected a separately detected 31px concealed middle-column overflow at 1200 x 900 and centered the desktop shell without document-margin overflow. Added `tests/m043-desktop-fit.mjs` with visible-viewport, scrollbar, section-boundary, control visibility, typography, horizontal-overflow and console assertions across eight viewports. The final matrix passes and actual screenshots were inspected. No protocol, contract, financial safeguard, provider, deployment, secret, testnet or mainnet state changed.

## 2026-11-03 | IMPL-M04.2-P3 stable navigation and complete UX verification

Replaced major workflow dialogs with stable hash-routed views for Overview, Cases, Evidence, Challenges, Reviewers, Settlement, Lab, Settings and Activity while retaining dialogs for focused actions. Preserved selected-case context, direct routes and browser Back behavior. Added complete state, keyboard, focus, responsive, zoom, reduced-motion, contrast and console verification. Results: 54/54 end-to-end checks, 46/46 empty and 46/46 genuine populated responsive checks, 13/13 radar checks, 3/3 deterministic coverage subtests and 12/12 browser-matrix checks across Windows Chrome, Chromium and Firefox. Linux Chromium remains blocked by WSL browser-download network failure. Reexecuted both local Sandbox journeys with 44 persisted operations and receipts, exact 1 NEAR callback-confirmed settlements and challenged ACCEPT to REJECT reversal. Added the component audit, final screenshots and acceptance evidence. No protocol, Rust contract, deployment, paid call, production secret, testnet or mainnet action occurred. Owner visual acceptance remains pending.

## 2026-11-03 | IMPL-M04.2-P2 operational radar measurements

Replaced configuration-derived radar completion with eight operational numerator and denominator rules. Added source retrieval checks for manifest sources, explicit criterion evaluation metadata, selected-round review and quorum calculations, actual settlement and challenge milestones, and an exported render-depth function shared by browser rendering and tests. Replaced eleven-percent rings with 25, 50, 75 and 100 percent markers. Added deterministic eight-state coverage tests and browser checks for zero, genuine partial, case switching, tabs and deterministic full coverage. Results: 3/3 coverage subtests, 13/13 interface checks and 92/92 responsive checks across empty and genuine populated states. Saved close-ups and reports under `project/artifacts/m042/phase2/`. No contract, protocol, deployment, paid call, production secret, testnet or mainnet operation occurred. Phase 3 navigation and complete UX verification is next.

## 2026-11-03 | IMPL-M04.2-P1 coherent responsive shell

Removed independent desktop overflow and stable scrollbar gutters from the three content columns. Made the shell grow with content so 1536 x 676 and 1366 x 768 use one document scrollbar. Raised the reading scale, restored the complete empty heading, separated lower radar labels from its legend, and retained the existing tablet and phone flows. Added a portable M04.2 responsive test and package command covering eight viewports, exact scroll ownership, clipping, page overflow, minimum text size, heading visibility and console errors. Empty and genuine populated states each pass 46/46 checks. Saved before and after screenshots and measurements under `project/artifacts/m042/phase1/`. Reference checksum and em dash scans pass. No protocol, contract, deployment, paid inference, production secret, testnet or mainnet action occurred. Phase 2 radar semantics is next.

## 2026-11-03 | IMPL-M04.1-P3 complete frontend UX gate

Pinned Playwright, added portable browser setup and test commands, and removed all user-specific module and Chromium paths. Added account disconnect, persistent-operation reconciliation availability, serialized async navigation, dialog history state, browser Back behavior, Escape close and reliable focus restoration. Added 58 end-to-end checks for genuine case switching, all navigation and tabs, search, pagination, settlement retry lock, reload recovery, stale and failed reads, permission denial, reduced motion, semantics, contrast, 125 and 200 percent effective zoom and final screenshots. Legacy browser checks pass 16/16, service tests 29/29 and wallet build passes. Updated README badges, environment commands, M04 acceptance and new M04.1 acceptance report. Fresh Rust execution was blocked before tests by crates.io DNS and missing offline cache; no contract change or pass is claimed. Windows frontend-only clean install passes with `npm ci --ignore-scripts`; dependency audit limitations are recorded. No deployment, testnet, mainnet, paid inference or production secret occurred.

## 2026-11-03 | IMPL-M04.1-P2 radar and interface gate

Rebuilt the radar renderer around responsive canvas dimensions and device pixel ratio, separate eight-sector fills, visible ring and spoke layers, dynamic labels and genuine metric metadata. Added automated zero, partial, full and mobile radar checks plus close-up captures. Refined financial display to readable NEAR with exact yoctoNEAR details, shortened case headings with full digest access, translated contract codes, corrected completed review windows, and clarified material, reviewer and event history text. Added a side-by-side comparison with the approved UX3A desktop. Gate results: 15/15 interface checks, 26/26 empty responsive checks, 29/29 populated responsive checks and 29/29 service tests. Reference checksum and em dash scan pass. No contract, protocol, external transaction, deployment, paid inference, secret, testnet or mainnet action occurred. Next: Phase 3 complete UX, accessibility and portable-browser verification.

## 2026-11-03 | IMPL-M04.1-P1 responsive layout gate

Replaced the fixed-size-only behavior outside the approved viewport with proportional wide-desktop columns, intentional short-desktop panel scrolling, an ordered tablet flow and a full-width phone layout with scrollable navigation. Removed fixed content heights that clipped populated records and added coarse-pointer target sizing. Added a portable environment-configured responsive Chromium test covering seven target viewports, exact 1200 shell geometry, overflow, clipping, accessible names, touch targets and console errors. Empty state passed 26/26 checks. The initial genuine populated run correctly failed on undersized targets; those controls were fixed and the complete populated run passed 29/29. Saved fourteen screenshots and two measurement reports under `project/artifacts/m041/phase1/`. Reexecuted both authorized local Sandbox journeys to provide genuine populated state; 44 operations and receipts passed with the prior exact settlement results. No protocol, contract, deployment, paid inference, secret, testnet or mainnet change occurred. Next: Phase 2 radar and information refinement.

## 2026-11-03 | IMPL-M04 full local product integration

Completed structured evidence manifests, source provenance, corrections, participant access, transaction lifecycle and final-read metadata, reviewer control disclosures, human finding/counterexample artifacts, and Meta/Baseten/Modal non-billable adapter validation. Added a reproducible API-backed Sandbox journey runner. Two journeys passed with 44 confirmed operations and receipts: unchallenged ACCEPT to beneficiary and challenged primary ACCEPT to fresh REJECT to creator. Each receiver gained exactly 1 NEAR and each payout callback recorded SUCCESS. Added genuine populated-case desktop, tablet and mobile captures plus 16 passing Chromium checks. Corrected the verified tablet overflow/radar clipping defect without changing desktop geometry. Added the individual AC01-AC33 matrix at 20 PASS, 11 PARTIAL and 2 BLOCKED. Corrected README Rust and repository visibility facts and added truthful M04 badges. Final gates: 29 service tests, 28 Rust tests, wallet build, checksum and em dash scan pass. No testnet, paid call, production secret, deployment or mainnet action occurred.

## 2026-11-03 | IMPL-M04-R01 reviewer disclosures and provider fixtures

Added canonical reviewer control disclosures with stable operator identifiers and exact registry digest joins. Connected The Bench registry operations to disclosure creation and added explicit one-process Sandbox control warnings. Split Meta, Baseten and Modal request/response normalization, added structured source citations and prompt-injection boundaries, and retained response, idempotency and budget enforcement. Added Meta primary/fresh, Baseten adversarial and Modal verifier fixture tests. `npm test` passes 28/28. No live provider call, paid usage, transaction, deployment or secret occurred. Next: integrated Sandbox journeys, populated screenshots, accessibility and AC matrix.

## 2026-11-03 | IMPL-M04-W01 wallet lifecycle and read freshness

Replaced the single initial UNKNOWN operation state with persisted PREPARING, AWAITING_SIGNATURE, BROADCAST, PENDING and terminal state transitions. Added ordered transition history, transaction hashes, receipt/error timestamps, duplicate dispatch protection and automatic reload reconciliation. Added final-block metadata envelopes for Sandbox and testnet RPC reads and visible stale-read state in The Bench. `npm test` passes 24/24; syntax, whitespace and em dash checks pass. No new Sandbox transaction was executed in this milestone, so the two M04 journeys remain open. External testnet use remains gated.

## 2026-11-03 | IMPL-M04-E01 structured evidence integration

Added canonical per-criterion evidence manifests, exact source hashes, bounded provenance, participant-only access and append-only same-case corrections. Added manifest persistence and listing without altering immutable blobs. Connected The Bench evidence records, criteria cards and Evidence/Provenance radar values to the exact onchain-selected manifest. Added validation and HTTP tests for complete criterion coverage, hash mismatch, immutable corrections, cross-case rejection, participant authorization and onchain linkage. `npm test` passes 22/22; syntax and em dash checks pass. No contract change, transaction, deployment, paid call, secret or spending occurred. Next: wallet transaction lifecycle and stale-read reconciliation.

## 2026-11-03 | IMPL-M03 P0 financial verification complete

Corrected Sandbox worker lifecycle and finality synchronization, made release-mode failure assertions evidence-based, raised only F17's harness timeout to 40 minutes, and preserved all financial assertions. A clean `npm run test:p0` run passed 28 Rust SDK tests, 19 service/report tests, nine baseline Sandbox tests and all eighteen financial categories. Captured 454 transactions, 753 receipt outcomes, 46 balance/storage snapshots, maximum transaction gas 35,923,793,821,747, maximum callback gas 17,000,817,633,275 and maximum storage 17,470,225 bytes, with zero gas-budget or reserve-coverage violations. Production Wasm excludes all four fault-only exports. Shortened the UX3A empty-state copy to `No records` without geometry changes. Refreshed machine evidence and the M03 handoff. No deployment, paid call, production secret or mainnet operation occurred. October 28 source remains pre-event; the F17 timeout correction and final verification are November 3 competition-window work. AC01-AC33 remain unaccepted. Next: Priority 2 evidence, wallet, independent reviewer, provider and two-journey integration.

## 2026-10-29 | IMPL-M03 financial matrix and neutral avatars

Resumed c0800c8. Preserved its successful WSL evidence and explicitly superseded M02's global blocker. Authored eighteen isolated financial categories, SDK exact-deadline/overflow/unexpected-result tests, fault-only counter/callback probes, root/callback gas and account/storage capture, complete helper receipt journaling and a nonzero incomplete P0 gate. Twenty-eight SDK tests pass in each build; nineteen service/report tests and both Wasm/wallet builds pass. This host's rerun stopped at descriptor preflight: eighteen categories remain BLOCKED, P0 incomplete, no new financial measurements claimed. Replaced all active human photographs with neutral SVG; reference assets unchanged and fifteen desktop rectangles preserved. Refreshed verification and handoff. No deployment, paid call or production secret configuration.

## 2026-10-29 | IMPL-M03 in progress - Real Sandbox financial execution

Moved execution to compatible Ubuntu x86_64 with glibc 2.39 and hard open-file limit 1048576. Pinned Rust 1.98.0, passed all 20 Rust tests, rebuilt production and fault Wasm, installed checksum-pinned NEAR Sandbox 2.13.4 and executed real transactions. Verified exact 1 NEAR balance transfer and callback-confirmed settlement, plus a challenged case whose fresh committee reversed the original verdict. Corrected the Sandbox clock helper after real receipts proved deadline overshoot and expired block-hash behavior. Targeted `KEEP_PRIMARY` timeout now passes. Saved raw failure and passing evidence. P0 remains incomplete pending the rest of the 18-category matrix, gas/storage measurement and full rerun.

## 2026-10-28 | IMPL-M02 - Functional integration source and verification evidence

Extended M01 with preallocated case storage, strict ABI argument handling, complete RoundView slots, callback mismatch/duplicate handling, shared Rust creation/terms/payout vectors and 20 SDK tests. Added participant-authenticated immutable evidence and criteria retrieval, durable UNKNOWN transaction operations, NEP-413 verification, capped idempotent provider proposals and 16 service/encoding tests. Added The Bench functional workflows in separate apps/web source, gated external wallet adapter, coverage/N/A counters, responsive forms, pinned Sandbox setup and reproducible verification scripts. Production/fault Wasm and wallet bundles build. Saved source-resolution side-by-side, mobile form, geometry and test evidence. Financial execution remains BLOCKED by host file limit; no deployment/live providers/real paid settlement claimed. UX3A reference and historical logs preserved.

## 2026-10-28 | IMPL-M01 - Actual implementation begins before event

Owner removed November 1 implementation gate (D-042). Added Rust escrow/adjudication contract, canonical commitment encoding, Sandbox scenarios, immutable evidence/cost-ledger services and API foundation. Production Wasm builds; 14 Rust SDK tests pass. Sandbox execution blocked by host open-file hard limit. No deployment or paid calls. The Bench naming and frozen UX3A preserved. No claim of competition-window authorship or proven real settlement.


- UX3C verification record: project/artifacts/ux3c/spec-validation.json, including six specification SHA-256 values, 33 acceptance/10 invariant/7 gap coverage checks and 16 independent byte/hash fixture results. Contract/sandbox acceptance remains NOT RUN.

UX3A final correction: replaced sidebar library approximations with source-derived glyph assets and preserved the full spatial margin texture in a recolored derivative. Recaptured and reviewed the final combined comparison. Internal visual QA passed after corrections; font rasterization remains an explicit P3 limitation. Owner acceptance remains pending.
## v1.0 | 2026-10-27 | Preparation baseline

- Authored initial product, protocol, UX, security and benchmark specifications.
- Wrote NEAR-aligned visual tokens and a responsive, clickable, simulated Judgment Room screen.
- Established decisions, status, next task and agent resume protocol.
- Established 30-case test plan as a planned dataset. No measured results are claimed.
- Added accurate planning-stage README badges.
- Static HTML and JavaScript syntax check passed. Automated browser navigation was blocked by the environment; rendering and interactions remain unverified.
- Clarified that pre-event design HTML is reference-only and cannot be claimed as hackathon implementation.

Future entries must include date, changes, files touched, acceptance status, unresolved blockers, and next owner action.

## v1.1 | 2026-10-27 | Owner-selected design reference

- Added source screenshot at `design/reference/control-ai-policy-dashboard.jpeg` for project art direction.
- Accepted D-015: graph-first cinematic UI is now the exact desktop visual reference; NEAR mint, coral and amber remain the color vocabulary.
- Added detailed source-to-CONTRA component mapping and non-color graph semantics in `docs/VISUAL_DIRECTION.md`.
- Marked original v1.0 Judgment Room wireframe as superseded for layout only; it remains a design study, not an implemented product.
- No production implementation or onchain contracts created; budget spend unchanged.
- Next: interactive high-fidelity graph-first UI visual acceptance.

## v1.2 | 2026-10-27 | Complete blueprint and immutable-image agent handoff

- Produced `HANDOFF_TO_CODING_AGENT.md` with scope, phases, acceptance and reporting rules.
- Added `docs/DESIGN_REFERENCE_INTEGRITY.md` with the user-uploaded JPEG's SHA-256 and zero-modification policy.
- Added `docs/VISUAL_INTEGRATION_SPEC.md` mapping the exact reference to actual graph controls, NEAR palette and evidence semantics.
- Recorded accepted image-integrity decisions D-017 and D-018.
- Preserved all earlier blueprint materials and design reference. No contract, production UI, provider call or deployment was created by this package.
- Next: agent creates high-fidelity interactive graph-first design for owner's visual acceptance, then implements competition code during the eligible period.

- 2026-10-27: Repository-neutral handoff revision. Removed explicit mentions of unrelated GitHub accounts and added mandatory owner selection before any remote push or deployment. Original design reference files unchanged.

## v1.2.1 | 2026-10-27 | Graph-first design study implementation

- Rebuilt `design/judgment-room.html` as a fixture-backed provenance graph with dynamic selection and inspector updates.
- Added graph and list views, search, evidence filtering, zoom, fit, keyboard list navigation, challenge-path selection and a bounded local case question tool.
- Reworked `design/tokens.css` for the approved NEAR palette, 66/34 desktop composition, mobile inspector flow, visible focus and reduced motion.
- Added verified-state GitHub badges and recorded `kellyxy110` as the assigned GitHub identity. No remote repository exists.
- Verified JavaScript syntax and the immutable reference SHA-256. Repository em dash scan returned zero matches.
- Browser rendering was blocked because no browser surface was available. Owner acceptance remains pending.
- Files touched: `README.md`, `design/judgment-room.html`, `design/tokens.css`, `project/DECISIONS.md`, `project/STATUS.md`, `project/CHANGELOG.md`, `project/NEXT.md`, `project/SESSION_LOG.md`.
- Spending: $0. Transactions and deployments: none.
- Next owner action: review rendered desktop and mobile previews once browser QA is available.

## v1.2.2 | 2026-10-28 | UX2B Chromium visual verification

- Added `tests/visual-qa.mjs` and ran it with local Chromium through Playwright.
- Captured desktop, tablet and mobile viewport screenshots plus a side-by-side desktop reference comparison in `project/artifacts/ux2b/`.
- Verified graph selection, inspector updates, search, evidence filtering, graph/list switching, zoom, fit, keyboard navigation, challenge selection, reduced motion, responsive overflow and console output.
- Fixed a verified desktop overlap where the assistant dock intercepted the inspector challenge action by reserving bottom clearance for the dock.
- Added an inline favicon to remove the only browser console 404.
- Final run: 22 checks passed and zero browser console or page errors were recorded.
- Reference image remained unchanged at SHA-256 `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`.
- Owner visual acceptance remains pending. No repository initialization, remote, push, deployment, paid API, contract work or blockchain transaction occurred.

## v1.2.3 | 2026-10-28 | UX2C visual fidelity recovery

- Recorded the owner's rejection of UX2B visual fidelity while retaining its functional test evidence.
- Refactored the desktop shell and graph geometry against the original 1200 x 900 JPEG.
- Replaced the sparse card grid with a radiant root orb, four compact semantic groups and a dense leaf column connected by fine cubic SVG branches.
- Added truthful fixture-derived leaf points for frozen criteria, evidence digests, validation limits, viewport scope, review basis and settlement guards.
- Reduced toolbar and page metadata scale, constrained the inspector to the reference footprint and added a compact review-signal visual.
- Kept the assistant dock separate from the inspector and preserved search, filters, graph/list modes, zoom, fit, keyboard navigation, reduced motion and fixture questions.
- Fixed the SVG edge layer so it cannot intercept toolbar input and guarded edge drawing while graph view is hidden.
- Captured fresh desktop, tablet, mobile and direct-comparison images in `project/artifacts/ux2c/`.
- Final Playwright regression: 22 checks passed, zero browser console or page errors.
- No repository initialization, remote operation, deployment, paid API use, contract work or blockchain transaction occurred.

## v1.2.4 | 2026-10-28 | Repository baseline authorization

- Owner authorized creation of private repository `kellyxy110/CONTRA`.
- Current blueprint, logs, immutable reference and visual QA artifacts form the redesign baseline.
- Added repository ignore rules for local tooling, secrets and generated output.
- Product redesign is the next design milestone. No deployment, paid API use or smart contract work was authorized by this decision.
- Created private GitHub repository `kellyxy110/CONTRA`, set `main` as the default branch and pushed baseline commit `351e90d73c93577f8798e45c2e8bb45bff3e082a`.


## v1.3 | 2026-10-28 | UX3A dashboard reference implementation

- Added separate source-faithful dashboard study, immutable new reference, local server and screenshot comparison page.
- Preserved graph study, older source, all protocol requirements and historical logs.
- New study uses approved colors and CONTRA fixture records within the source panel geometry, plus original sector radar and avatar images.
- Inter font and Lucide icon assets are local; no runtime external font or API requests.
- Browser verification and screenshot comparisons completed. Owner acceptance pending; exact pixel identity is not claimed.
- Source files: package.json, server.mjs, design/ux3a/*, design/reference/IMG_7409.jpeg, project/artifacts/ux3a/*, design-qa.md, project logs.
- Spending $0; transactions and deployments none. Next: visual corrections from owner review.

## v1.4 | 2026-10-28 | UX3B functional integration specification

- Recorded owner's explicit approval/freeze of UX3A at bee5a7481d56c86d4c9860280b8367f82af0cb5a. Historical pending statements are superseded, preserved for audit.
- Added docs/UX3B_FUNCTIONAL_INTEGRATION_MAP.md with frozen-component/navigation mapping, A01-A23 contract/API/transaction/failure traceability, truthful data sources, radar coverage, integration rollout and G01-G07 gap register.
- Added docs/UX3B_ENGINEERING_ACCEPTANCE.md with AC01-AC33 and reproducible unchallenged/challenged vertical-slice evidence requirements. These future engineering tests are NOT RUN.
- Updated project STATUS, DECISIONS, NEXT and SESSION_LOG and added a current-scope notice to HANDOFF_TO_CODING_AGENT.md.
- Preserved all approved visual code/assets and protocol safety requirements. No implementation expansion, service integration, contract code, transaction, deployment or provider use.
- Validation: documentation coverage/invariant scans and changed-path inspection, not runtime protocol tests.
- Next: pin G01-G07 before fresh eligible-window contract and UI engineering. UX3B document delivery is not a workflow implementation or independent security audit.

## v1.5 | 2026-10-28 | UX3C protocol freeze

- Added docs/CONTRACT_ABI_V1.md, STATE_MACHINE_V1.md, COMMITTEE_POLICY_V1.md, SETTLEMENT_RECOVERY_V1.md, COMMITMENT_TEST_VECTORS.md and THREAT_MODEL_V1.md.
- Closed G01-G07 at specification level with definitive ABI/state/policy decisions and mapped future negative tests.
- Defined creator-only unfunded cancellation, beneficiary digest consent, immutable admission/committee snapshots, 3+3 distinct operators/2-of-3, exact JSON/Borsh/deposits/gas policy, request idempotency and typed events.
- Amended challenged fresh-inconclusive fallback to retain original decisive verdict; original undecided review still follows creator refund policy. Explicitly documented remaining delay/collusion/bias risks.
- Froze safe financial limitation: successful transfer plus failed callback remains pending/UNKNOWN; no authenticated recovery implementation in MVP, no unsafe retry. Verified transfer failure may retry only the same intent/receiver/amount. I7/I10 liveness qualification recorded without weakening I2.
- Added authoritative notices to old protocol/UX3B/handoff documents; updated project STATUS/DECISIONS/NEXT/SESSION_LOG. UX3A assets unchanged.
- Validation: documentation traceability, link/consistency checks, independently reconstructed 16 serialization/hash fixtures. No smart contract testing, Rust implementation, sandbox, live provider use, transaction, deployment, secrets or spending.
- Next: November 1 fresh Rust escrow implementation and sandbox financial proof, before reviewer/service/frontend integration.

## 2026-10-28 | UX3C naming update | The Bench

- Renamed the active dashboard header/browser title and current product documentation from Judgment Room to The Bench; clarified the current frontend entry in README and the case-dashboard navigation name in the UX3B map.
- Recorded D-041. Preserved historical log text and archived prototype paths. No contract methods, ABI, state machine, committee/recovery rules, commitment vectors, CSS, JavaScript behavior, reference images or other visual assets changed.
- UX3A remains approved with this owner-authorized naming-only exception. UX3C protocol work and first November 1 fresh Rust escrow/sandbox milestone continue unchanged.
- Validation: exact frontend text-substitution comparison and scoped diff inspection; no protocol/sandbox testing claimed. No deployment, provider use, secrets, mainnet action or spending.

