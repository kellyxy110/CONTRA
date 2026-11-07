# CONTRA status checkpoint

## Current checkpoint | CONTRA-2026-11-07-IMPL-M06-P1-WALLET-FINAL

M06 Phase 1 final wallet hardening is complete locally on `feat/m06-wallet-lifecycle` and remains within PR 4. Finalized RPC proof now requires an independently supplied, valid NEAR transaction hash that exactly matches the persisted hash. The adapter also verifies signer, configured contract, explicit final execution status and final block identity. The lifecycle layer independently rechecks the inner transaction hash, signer, receiver, single FunctionCall action, method, canonical arguments, gas and deposit. Missing, malformed, contradictory, stale or regressed proof cannot become CONFIRMED. Integrity failures lock the durable operation as UNKNOWN instead of leaving a potentially broadcast operation reusable.

The complete cross-layer audit preserved PREPARED, SIGNING, PENDING, CONFIRMED, FAILED and UNKNOWN safety. It additionally found and corrected browser loss of a wallet-returned hash when the server callback was unavailable. The hash is now retained in account-scoped local recovery state and attached through the existing idempotent callback after reload for receipt-only reconciliation. No transaction is redispatched. Existing restart, handoff, rejection, concurrency, unique-hash, terminal-state, session, account-isolation and migration safeguards remain intact.

Pre-fix regression evidence reproduced the missing-hash acceptance and the two audit findings for stale RPC confirmation and lost browser hash recovery. Final focused wallet, RPC and browser tests pass 34/34. The complete repository suite passes 69/69, the wallet production bundle passes, JavaScript syntax and diff checks pass, Core and Security policy checks pass, and the dependency audit retains the accepted 17 inherited findings with zero new baseline failures. Fresh GitHub Core, Security and Integration evidence is required on the final PR head before owner merge approval. Contract CI and full financial P0 are not required because contract, escrow, payout, settlement and financial invariants did not change. Acceptance remains 21 PASS, 10 PARTIAL and 2 BLOCKED. No signing, transaction, deployment, provider call, secret change or spending occurred.

## Current checkpoint | CONTRA-2026-11-07-IMPL-M06-P1-WALLET-SAFETY

PR 4 wallet safety corrections are implemented locally on `feat/m06-wallet-lifecycle`. External operations now separate durable `PREPARED` intent from persisted `SIGNING` handoff. Restart preserves pre-handoff preparation but locks a handed-off request without a hash as `UNKNOWN`; that operation cannot expose another signing request. A delayed callback can attach only the original recovered hash and resume receipt-only reconciliation. Transaction hashes are unique across operations and conflicting callbacks, payloads and terminal-state changes fail closed.

The RPC path confirms only finalized responses with a recognized NEAR `SuccessValue` or `SuccessReceiptId` result. Explicit `Failure` remains failed, while missing, malformed or unrecognized execution status remains unconfirmed. Receipt reconciliation verifies hash, network, signer, contract, method, arguments, deposit, final block identity and non-stale observation before completion. Post-handoff browser cancellation is never authoritative: it becomes `UNKNOWN`; only a rejection recorded before server handoff becomes `FAILED`. Browser recovery retains unresolved account-scoped operation IDs and known hashes across reloads. Live handoff remains disabled by default and requires a server-only authorization gate used solely by controlled tests.

The focused M05, wallet and browser run passes 31/31. The repository suite passes 66/66, M05 runtime passes 18/18, wallet bundling passes, Core and Security policy checks pass, and the dependency audit reports the unchanged accepted baseline of 17 inherited findings with no new failures. Local Sandbox integration was attempted but blocked before launch because this process is Windows; fresh GitHub Linux Integration evidence remains required on the corrective head. No contract or frozen financial protocol code changed, so Contract CI and full P0 are not required. Acceptance remains 21 PASS, 10 PARTIAL and 2 BLOCKED. No signing, transaction, deployment, provider call, secret change or spending occurred. PR 4 and PR 3 remain unmerged.

## Current checkpoint | CONTRA-2026-11-07-IMPL-M06-P1-WALLET

M06 Phase 1 wallet lifecycle has reached its local engineering gate on `feat/m06-wallet-lifecycle`. The backend now persists a server-validated external-wallet intent before signing, enforces exact testnet contract, signer, method, argument and deposit policy, retains one stable operation identity, and reconciles only a matching finalized receipt. Sessions support reload inspection, renewal and revocation. Wallet rejection is final before broadcast; an interrupted or missing redirect becomes UNKNOWN and cannot be blindly redispatched. A delayed callback may attach the original transaction hash and resume receipt-only reconciliation.

SQLite schema version 3 stores external-wallet payloads, operation kind and highest observed block height. Restart recovery preserves unsigned requests and returns known hashes to PENDING reconciliation while retaining conservative UNKNOWN locking for existing Sandbox operations. Duplicate prepare, conflicting payload reuse, repeated callbacks, delayed receipts, RPC failure, regressed observations, mismatched receipts, reload, restart, session expiry and account isolation are covered by controlled simulations. `npm test` passes 60/60, the wallet-focused M05/service subset passes 51/51 and the wallet bundle builds. No contract or financial protocol source changed, so full P0 was not rerun. The acceptance baseline remains 21 PASS, 10 PARTIAL and 2 BLOCKED until external authorized signing evidence exists.

Wallet code commit `379ff4e0111336da33579357a08c341ce6273dcb` is published in PR 4 against `implementation/oct28`. Genuine Core run `42373449517`, Security run `42373449483` and Integration run `42373449454` passed on that exact code commit. Integration completed the corrected nine-test Sandbox baseline, both full journeys, fresh receipt and balance validation and artifact upload. PR 3's previously pending Integration run `42370843796` also passed; PR 3 remains open and unmerged under the owner-controlled boundary. No live signing, testnet transaction, deployment, provider request, production-secret change, mainnet action or spending occurred.

## Current checkpoint | CONTRA-2026-11-07-IMPL-M05.1-CI

M05.1 CI recovery is COMPLETE. Five GitHub Actions workflows now cover core, contract, security, Sandbox integration and risk-based full financial P0 verification. Supporting checks enforce clean dependency installation, JavaScript syntax, the no-em-dash policy, immutable reference integrity, restricted credentials, dependency-audit deltas, exact contract exports, production/fault separation, frozen commitment vectors and truthful historical evidence boundaries.

Local verification passes 52/52 repository tests, 28/28 Rust contract tests, rustfmt, strict Clippy, the wallet build with pinned Playwright 1.65.0, 29 production plus four fault-only ABI exports, exact commitment vectors and the retrospective M03 through M05 evidence review. The contract was rustfmt-normalized and received two semantics-preserving Clippy rewrites. The historical M05 Wasm hash and rebuilt CI-formatted Wasm hash are both recorded without representing the latter as the original artifact.

The dependency baseline openly reports 17 inherited findings: 14 low, two high and one critical. The direct Playwright advisory was removed by the pinned 1.65.0 update. No vulnerability is hidden or treated as fixed without evidence. PR 1 merged the verified CI setup into `implementation/oct28` as `a1eedc929758d3e9f16dffb78fee64da5820817e`. Genuine Core, Security, Contract and Integration jobs passed. Integration completed the nine-test baseline and both journeys in 70m52s. Branch protection now requires pull requests plus fresh Core and Security checks on `main` and `implementation/oct28`, includes administrators and blocks force pushes and deletion. `main` remains unchanged. AC01 through AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED. No deployment, signing, external transaction, provider call, production secret, mainnet action or spending occurred.

## Current checkpoint | CONTRA-2026-11-07-IMPL-M05-R03

M05 R03 is COMPLETE. The compatible `Ubuntu` WSL distribution passed the strengthened native-Linux, `ps`, executable and file-limit preflight, then completed the full P0 financial regression and both API-backed local Sandbox journeys. P0 passed all 28 Rust tests, 19 service/report tests, nine corrected baseline Sandbox tests and all 18 financial categories. It preserved 454 transactions, 753 receipt outcomes, 46 balance and storage snapshots, maximum transaction gas `35926618795729`, maximum callback gas `17002377317045`, maximum storage 17,470,225 bytes and zero gas-budget violations.

The original P0 parent exited 2 because the repository's Windows-installed esbuild dependency was not executable in WSL. Financial execution itself passed. A clean Linux-native `npm ci` under `/tmp`, without shared Windows `node_modules`, rebuilt esbuild 0.28.2 and reproduced the wallet bundle twice at SHA-256 `b2dae16e02c234a8ac162ae25e923831ffc9095cc98f9fe4a3a629d414d61143`. The unchanged strict `p0Complete` predicate then reconciled to exit 0. The runner now uses this isolated Linux build helper on future Linux executions and retains the original failure transcript.

The journey run recorded 44 CONFIRMED operations, 44 unique operation transaction hashes and 44 matching successful receipts. The unchallenged case reached PRIMARY ACCEPT and paid the beneficiary exactly `1000000000000000000000000` yoctoNEAR. The challenged case reversed PRIMARY ACCEPT to FRESH REJECT and refunded the creator exactly `1000000000000000000000000` yoctoNEAR. Both payout intents finished `SUCCESS_VERIFIED` after authenticated callbacks.

The generated journey report is timestamped `2026-11-07T03:48:16.497Z`. All six Sandbox reviewer accounts remain controlled by one local process, so this run does not establish independent adjudication. No paid provider, external wallet, testnet transaction, deployment, production secret or mainnet action occurred. The earlier Windows `ps` and Ubuntu-22.04 GLIBC failures remain recorded as pre-launch diagnostics; neither executed a transaction.

`npm test` passes 52/52, both native and isolated Linux wallet builds pass, and the M05 runtime/backend changes have no observed P0 or two-journey Sandbox regression. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED because external wallet signing, independently controlled reviewers, live authorized providers, a configured testnet contract and manual screen-reader evidence remain incomplete. Spending remains $0.

## Current checkpoint | CONTRA-2026-11-07-IMPL-M05-R02

M05 R02 is COMPLETE. Backend authentication challenges, signature verification, artifact writes, evaluation requests and transaction dispatch now have bounded per-address or per-account limits with `Retry-After` responses. When a public origin is configured, it is authoritative and a forged Host header cannot make an attacker origin appear same-origin. A new case-isolation test proves that a participant in two cases cannot retrieve case A evidence through case B.

Durable storage is now documented and tested as one volume containing SQLite and content-addressed objects. Offline backup preparation performs object and database integrity checks plus a WAL truncate checkpoint. A copied volume was reopened successfully with its blob and case link intact. Missing object bytes fail the audit closed. Session and challenge expiry pruning is available. Every style, icon, font, texture, script and image retained for the minimal operational frontend was fetched successfully through the application after visual cleanup.

Abrupt child-process exit after an immutable object write, provider reservation and BROADCAST transaction state preserves the object and reservation, then recovers the interrupted operation only as UNKNOWN with its hash intact. Expired challenge and session pruning preserves active records. Concurrent limiter calls admit only the configured bound. An aborted partial JSON request writes no challenge and leaves the service healthy. `npm test` passes 52/52. R01 live public testnet RPC connectivity remains the only external chain observation in M05. No Sandbox journey, testnet contract read, transaction, signing, deployment, provider request or production secret occurred. Spending remains $0. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED pending fresh individual evaluation. The immutable screenshot checksum remains `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`.

The R03 journey regression was attempted but did not execute. Windows failed before Sandbox launch because Unix `ps` was absent. WSL then failed before launch because the pinned binary requires GLIBC 2.38 and 2.39, which that distribution lacks. The preflight now detects native Linux, `ps`, binary presence and binary executability, preventing another false readiness result. Accepted M03 and M04 Sandbox evidence remains unchanged.

AC01 through AC33 were reviewed individually in `docs/M05_AC_REVIEW.md`. No requirement was weakened and no incomplete criterion was upgraded. Totals remain 21 PASS, 10 PARTIAL and 2 BLOCKED.

## Current checkpoint | CONTRA-2026-11-07-IMPL-M05-R01

M05 runtime and backend checkpoint R01 is COMPLETE. Application startup now has explicit unavailable, Sandbox and testnet modes. Testnet mode wires the existing RPC adapter into startup and fails closed unless the endpoint identifies as testnet, is synchronized, the configured account is valid and contains contract code, and finalized blocks are available. Contract reads carry finalized block height, hash, timestamp, age, stale state and block-regression detection. Authenticated receipt inspection distinguishes pending, failed and confirmed outcomes without promoting unknown results.

Persistence now uses two explicit SQLite schema migrations with WAL, FULL synchronous mode, startup integrity checks and content-addressed file audits. Restart recovery converts interrupted PREPARING, AWAITING_SIGNATURE, BROADCAST and PENDING operations to UNKNOWN, preserving any transaction hash and prohibiting duplicate dispatch. Atomic provider reservations remain idempotent across two database connections. API responses expose genuine chain identity and persistence health; writes require JSON and same-origin or configured-origin validation.

`npm test` passes 44/44. A live read-only request to `https://rpc.testnet.near.org` returned `chain_id=testnet` with `syncing=false`; this proves public RPC connectivity only. No CONTRA testnet contract exists or was configured, so configured-contract reads remain BLOCKED and no testnet transaction or deployment is claimed. A local unavailable-mode process returned explicit unavailable chain health plus SQLite schema version 2 and integrity `ok`. No Sandbox journey was rerun, no provider was called and spending remains $0. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED pending a fresh individual evaluation after further M05 evidence. M03 and M04 financial evidence is unchanged.

The product-first directive supersedes active visual-review tasks. Live hackathon instructions were fetched again on 2026-11-07. Current Q-001 accepts code since the October 19 announcement; CONTRA's actual implementation start remains recorded as October 28. Primary track is `security`, with `open` additionally applicable. Obsolete visual-only tooling was removed after active dependency mapping; imported UX3A assets, immutable references and historical Git evidence remain.

## Current checkpoint | CONTRA-2026-11-07-DOC-HACKATHON-01

The live NEAR HACKATHON agent instructions were fetched from `https://nearhackathon.com/HACKATHON.md` and stored at repository root as `HACKATHON.md`. The fetched response SHA-256 was `903794f4b656b456eaee087941517d024a33633641d167b90c3f060d381d9aed`. Seven upstream em dash characters were normalized to ASCII punctuation to satisfy the repository rule, with no rule content removed; the local SHA-256 is `81022d6f7c4d3033d581a1cdd90d50f60d5eb382722cd9034b2aa404cd64a8af`. No source code, contract, test, transaction, deployment, provider usage, secret or repository setting changed. The current implementation checkpoint remains M04.3 Phase 3. The live rules must be read again before submission because the source states that dates and rules may change.

## Current checkpoint | CONTRA-2026-11-04-IMPL-M04.3-P3

M04.3 Phase 3 browser verification is COMPLETE at the authorized local scope. Windows Chrome, Playwright Chromium and Firefox each pass 105 checks across 1536 x 676, 1366 x 768, 1200 x 900, 1440 x 900, 1920 x 1080, 768 x 1024, 390 x 844 and 320 x 844, for 315/315 total checks. The matrix verifies visible viewport boundaries, complete radar placement, direct values, label overlap, console output, keyboard workspace navigation, browser Back, Escape focus restoration and reduced motion. Actual screenshots were inspected after the numerical gate.

Fresh connected Sandbox captures cover all target sizes. Both local settlement journeys were reexecuted with 44 confirmed operations and 44 receipts. The unchallenged PRIMARY ACCEPT paid exactly 1 NEAR to the beneficiary, and the challenged case reversed PRIMARY ACCEPT to FRESH REJECT and paid exactly 1 NEAR to the creator. Both callbacks recorded SUCCESS. Repository tests pass 35/35, the radar gate passes 17/17, the desktop viewport gate passes, the wallet bundle builds and the reference hash remains exact. Manual screen-reader testing was not run and is not claimed. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-04-IMPL-M04.3-P2

M04.3 Phase 2 radar correction is COMPLETE. The chart displays a direct value beside every sector label and distinguishes measured 0%, partial progress, full progress, N/A, protected evidence marked Locked, unavailable retrieval and missing records. Every metric preserves numerator, denominator, source, status and observation time. Retrieval and authorization errors no longer become false zero coverage.

The three tabs now have documented scopes. Criteria includes Evidence, Provenance, Keyboard and Criteria. Evidence includes Evidence, Provenance, Review and Quorum. Overall includes all eight lifecycle measurements and is the default. Excluded sectors are visibly N/A for that lens while retaining their underlying records in the metric data.

Deterministic tests cover no case, created/unfunded, funded/no evidence, evidence/incomplete review, provisional, active challenge, incomplete fresh review, settled unchallenged, settled challenged, inaccessible, unavailable, missing and not-applicable states. Results: 35/35 repository tests and 17/17 rendered radar checks pass. Genuine case switching refreshes all eight measurements. Side-by-side zero, partial and complete fixture screenshots plus genuine Sandbox screenshots are under `project/artifacts/m043/phase2/`. Phase 3 browser verification is next. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-04-IMPL-M04.3-P1

M04.3 Phase 1 desktop workspace correction is COMPLETE. Owner visual acceptance of M04.2 was rejected. The root cause was the combined desktop `min-height:810px`, `min-height:756px` and cumulative fixed section minimums, which produced an 842px shell and 206px of document overflow at 1536 x 676. The corrected short-desktop shell is 652px tall at y=12, with a 597px main workspace and no document or column scrollbar.

The Overview now reserves visible space for case summary, progress, the complete radar and all three primary action cards. It shows two reviewer summaries, one recent activity and a compact materials count, with full reviewer, evidence and activity records available through their stable workspaces. The three-column identity remains intact. A second defect found by the new test, 31px of concealed middle-column overflow at 1200 x 900, was corrected with explicit flexible desktop grid rows and true viewport centering.

The Phase 1 browser gate passes across 1536 x 676, 1366 x 768, 1200 x 900, 1440 x 900, 1920 x 1080, 768 x 1024, 390 x 844 and 320 x 844. Screenshots and measurements are under `project/artifacts/m043/phase1/`. Phase 2 radar data and presentation correction is next. Owner visual acceptance remains rejected and pending a new review.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04.2-P3

M04.2 Phase 3 and the three-phase correction are COMPLETE at the authorized local scope. Major workflows now use stable hash-routed views for Overview, Cases, Evidence, Challenges, Reviewers, Settlement, Lab, Settings and Activity. Browser Back, direct routes and selected-case context are preserved. Focused dialogs remain only for focused actions.

The final end-to-end suite passes 54/54 checks. Empty and genuine populated responsive matrices each pass 46/46 checks across eight viewports. The operational radar suite passes 13/13 browser checks and 3/3 deterministic coverage subtests. Windows Google Chrome, Playwright Chromium and Firefox each pass 4/4 browser-matrix checks. Linux Chromium is BLOCKED because the WSL browser download could not resolve its alternate host after the primary host timed out. Manual screen-reader verification remains PARTIAL.

Both local Sandbox journeys were executed again with 44 persisted operations and receipts. The unchallenged case and challenged fresh-review reversal each settled exactly 1 NEAR through callback-confirmed payout. No contract source or P0 safeguard changed. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04.2-P2

M04.2 Phase 2 operational radar correction is COMPLETE. All eight sectors now derive from actual evidence retrieval, provenance, selected-round reveals, settlement milestones, confirmed challenge lifecycle, matching quorum, verified keyboard evaluation records and independent criterion evidence/evaluation records. Configuration fields no longer count as completion. Denominator zero remains N/A. The canvas uses 25, 50, 75 and 100 percent rings and independent radial sector depths.

Deterministic tests cover eight progressive states and exact numerator, denominator, source and render depth behavior. Results: 3/3 coverage subtests, 13/13 browser information checks, 46/46 empty responsive checks and 46/46 genuine populated responsive checks. The challenged genuine case is visibly partial at Review 2/3, Keyboard 0/1 and Criteria 1/2 while preserving its actual completed challenge, finality and quorum records. Zero, genuine partial and deterministic full screenshots are under `project/artifacts/m042/phase2/`. Phase 3 navigation and full UX verification is active. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04.2-P1

M04.2 Phase 1 responsive shell correction is COMPLETE. Desktop columns no longer own independent scroll regions or reserve scrollbar gutters. Short screens at 1536 x 676 and 1366 x 768 now use one coherent document scrollbar, while 1200 x 900 retains the approved shell origin, width, column hierarchy and visual system. The minimum reading scale is raised, the empty heading no longer truncates, and the radar label and legend spacing is corrected.

Empty and genuine populated states each pass 46/46 Chromium checks across eight viewports: 1200 x 900, 1366 x 768, 1536 x 676, 1440 x 900, 1920 x 1080, 768 x 1024, 390 x 844 and 320 x 844. The checks cover page overflow, clipped sections, independent column scrolling, text below 10px, heading truncation, short-screen document ownership and console errors. Before and after screenshots and measurement reports are under `project/artifacts/m042/phase1/`. The reference SHA-256 remains exact. Phase 2 radar measurement semantics is now active. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04.1-P3

M04.1 Phase 3 and the three-phase frontend implementation are COMPLETE at the authorized local scope. Playwright is a pinned repository dependency, browser installation and test commands are portable, and no test contains a user-specific module or Chromium path. The final browser run passes 58/58 assertions covering connect/disconnect, two genuine case records, all navigation entries and tabs, search, activity pagination, Back, Escape, focus restoration, reload reconciliation, stale data, service failure, permission denial, reduced motion, semantics, contrast, 125 percent and 200 percent effective zoom, 320px width and final screenshots. The legacy populated browser regression passes 16/16.

Final regression also passes 29/29 service tests and the wallet bundle build. Phase 1 and Phase 2 results remain 26/26 empty responsive, 29/29 populated responsive and 15/15 interface checks. The current task executed both local Sandbox journeys again with 44 confirmed operations and receipts, retaining exact 1 NEAR callback-confirmed settlements and the challenged ACCEPT to REJECT reversal. AC01-AC33 now stand at 21 PASS, 10 PARTIAL and 2 BLOCKED. Owner visual acceptance remains pending.

A fresh Rust rerun did not execute: Windows DNS failed for `index.crates.io`, offline cache lacked `near-primitives`, and the WSL runtime has no Cargo installation. No Rust source changed, and accepted M03 evidence remains 28/28 Rust tests with complete P0 proof. Windows frontend-only `npm ci --ignore-scripts` passes; plain Windows `npm ci` is not supported by the pinned `near-sandbox` installer. The dependency audit findings and exact remaining gates are recorded in `docs/M041_ACCEPTANCE.md`. No deployment, paid inference, production secret, testnet or mainnet operation occurred.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04.1-P2

M04.1 Phase 2 radar and interface refinement is COMPLETE. The radar now renders eight separately bounded sectors with low-opacity genuine-data fills, high-contrast concentric rings and spokes, responsive geometry and a device-pixel-ratio-aware canvas buffer. Zero coverage remains N/A with denominator zero. The retained challenged case proves partial Overall coverage at Review 2/3 and Challenge 6/8, while the Criteria view proves full coverage without hiding the grid. Zero, partial, full and 320px close-ups are in `project/artifacts/m041/phase2/`.

The Bench now displays 1 NEAR while retaining the exact `1000000000000000000000000 yoctoNEAR` in element details, uses a meaningful short case identifier with the full digest available, translates technical state and payout codes, closes completed review windows using the callback completion time, and improves materials, reviewer-control and event-history labels. The approved 1200 shell and hierarchy remain unchanged. A direct UX3A comparison is saved as `ux3a-refined-comparison.png`.

Verification passes 15/15 interface checks, 26/26 empty responsive checks, 29/29 populated responsive checks and 29/29 service tests, with zero console error. The reference hash remains exact. No protocol, contract, Sandbox invariant, deployment, paid provider, secret, testnet or mainnet change occurred. Phase 3 end-to-end UX and accessibility testing is next. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04.1-P1

M04.1 Phase 1 responsive layout engineering is COMPLETE. The approved 1200 x 900 shell remains exactly 1080 x 810 at x 60, y 45. Wider desktops use proportional three-column growth, short desktop screens use intentional per-column scrolling, tablets use an ordered full-width content flow with the sidebar preserved, and 390px plus 320px phones use a full-width flow with a horizontally scrollable navigation strip. Fixed content heights no longer clip populated reviewers, materials, tasks or activity cards. Coarse-pointer navigation, tabs, disclosure links and pagers meet a measured 44px minimum target.

Empty and genuine populated states passed the seven-viewport Chromium matrix at 1200 x 900, 1366 x 768, 1440 x 900, 1920 x 1080, 768 x 1024, 390 x 844 and 320 x 844. Final results: 26/26 empty-state checks and 29/29 populated-state checks, with no page horizontal overflow, viewport-clipped section or browser console error. A real accessibility failure in the first populated run exposed undersized disclosure, radar-tab, pager and brand targets; the controls were corrected and the full matrix reran cleanly. Screenshots and measurements are in `project/artifacts/m041/phase1/`.

The retained local Sandbox run also reconfirmed both M04 journeys with 44 confirmed operations and receipts. No protocol, Rust contract, financial safeguard, testnet state, paid provider, production secret or mainnet operation changed. The immutable reference SHA-256 remains `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`. Phase 2 radar and information refinement is next. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04

M04 Priority 2 local product integration is COMPLETE. Structured per-criterion evidence, append-only corrections, provenance and participant access controls are connected to The Bench. Local transaction lifecycle, receipt linkage, reload recovery and final-block freshness are durable. Reviewer control disclosures join exact onchain registry digests and explicitly state that all local signers share one process. Meta primary/fresh, Baseten adversarial and Modal verifier adapters pass non-billable schema, citation, injection, idempotency and budget tests. Human finding and counterexample artifacts are immutable and case-bound.

`npm run test:m04:journeys` passed two real API-backed local Sandbox workflows. The unchallenged case settled ACCEPT to the beneficiary. The challenged case recorded a criterion-bound counterexample, changed primary ACCEPT to fresh REJECT and settled to the creator. Both callback-confirmed payouts changed the intended receiver balance by exactly 1 NEAR. The successful retained run recorded 44 confirmed operations, 44 unique transaction hashes, 44 successful receipts, two onchain-linked manifests and maximum observed transaction gas 35,954,802,810,711. Every persisted lifecycle was PREPARING, AWAITING_SIGNATURE, BROADCAST, PENDING, CONFIRMED.

Populated Chromium captures at 1200 x 900, 768 x 1024 and 390 x 844 pass 16 browser checks with no console error, horizontal overflow or clipped tablet radar. Final verification passes 29/29 service tests, 28/28 Rust tests and the wallet bundle build. The immutable JPEG SHA-256 remains `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`. AC01-AC33 evaluation is 20 PASS, 11 PARTIAL and 2 BLOCKED in `docs/M04_ACCEPTANCE.md`. AC31 and AC32 remain blocked at their exact frozen scope because authorized testnet and actual provider records do not exist. No testnet deployment, paid call, production secret or mainnet action occurred. GitHub visibility was verified as PUBLIC and README now says so. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04-R01

Priority 2 reviewer disclosure and evaluator fixture integration is complete. Reviewer operators can store canonical control disclosures covering common control, key custody, signer control, provider/model or human procedure, conflicts, limitations, verification sources and attestation time. The disclosure digest and stable operator identifier are ready for the existing owner registration and reviewer confirmation transactions. Registry inspection joins only exact onchain disclosure digests. Local Sandbox screens explicitly state that all fixture signers are controlled by one process and are not proof of independent operators.

Meta primary/fresh, Baseten adversarial and Modal verifier request and response adapters now have distinct normalized fixture paths. Evaluations bind trusted case, round, terms, role and prompt version; accept only allowed requirement, manifest, source and counterexample citations; quote source content as untrusted data; reject invalid responses; preserve idempotency; retain ambiguous cost reservations and enforce the existing $3/$3/$5 caps. `npm test` passes 28/28 with no live or paid provider call. Syntax, whitespace and em dash checks pass. No transaction or deployment occurred. Next: execute both populated local Sandbox journeys through the integrated API, capture screenshots, and finish UI accessibility plus AC01-AC33 evidence.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04-W01

Priority 2 wallet persistence and freshness integration is complete at service level. Local Sandbox operations now persist PREPARING, AWAITING_SIGNATURE, BROADCAST, PENDING and terminal CONFIRMED, FAILED or UNKNOWN transitions with an ordered audit history, transaction hash, receipt, observation error and timestamps. Duplicate operation IDs cannot dispatch twice. Reload recovery reconciles the saved operation from the server ledger. Final chain reads include network, finality, block height, block hash, block timestamp where available and fetch time; The Bench exposes the final block and stale state. External testnet signing remains gated.

`npm test` passes 24/24. Tests verify lifecycle history, hash persistence, duplicate blocking, UNKNOWN locking and final-block read envelopes. Syntax, whitespace and repository-wide em dash checks pass. This milestone did not execute a new Sandbox transaction; the complete M04 local journeys remain pending and must exercise this path before M04 acceptance. No deployment, paid call, production secret, testnet or mainnet action occurred. Next: reviewer disclosures and non-billable evaluator fixtures.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04-E01

Priority 2 evidence integration is complete and verified. The API now accepts canonical `CONTRA_EVIDENCE_V1` manifests that cover every frozen criterion exactly once, bind uploaded source bytes to SHA-256 digests, record bounded provenance and enforce participant-only retrieval. Corrections are append-only records that reference an earlier same-case manifest and preserve the original bytes. The Bench lists stored manifests, distinguishes the exact onchain-selected digest from offchain records, displays per-criterion source coverage, and derives the Evidence and Provenance radar sectors from the selected manifest rather than inferred verdict state.

`npm test` passes 22/22 tests, including structured validation, forged digest rejection, cross-case correction rejection, immutable history, access control and exact onchain linkage. Syntax checks and the repository-wide em dash scan pass. No Sandbox transaction, deployment, paid provider call, production secret or mainnet operation occurred in this milestone. P0 evidence and the Rust contract are unchanged. AC01-AC33 remain individually unaccepted pending the full M04 matrix and both local journeys. Next: durable wallet transaction states, receipt reconciliation, reload recovery and stale-read envelopes.

## Current checkpoint | CONTRA-2026-10-29-IMPL-M03

P0 financial verification is COMPLETE on the compatible WSL Ubuntu x86_64 host. The clean `npm run test:p0` gate exited 0 after the nine-test baseline passed 9/9 and financial categories F01-F18 passed 18/18. The run recorded 454 transactions, 753 receipt outcomes and 46 balance/storage snapshots. Maximum observed transaction gas was 35,923,793,821,747; maximum callback gas was 17,000,817,633,275; no configured gas-budget violation occurred. Maximum observed contract storage was 17,470,225 bytes. Independent snapshot review found no reserve-coverage violation.

Production Wasm SHA-256 is `c607adf597dfbf898d8e442fd71b3b75e7032ad47fd808fb50e89e0573fd3ef8`, size 631,042 bytes, with no fault-only export. Exact native receiver balance changes, callback outcomes, UNKNOWN locks, failure/retry behavior, concurrent finalization, reserve isolation, deadline boundaries and bounded overflow/capacity behavior are covered by the passing matrix. Machine evidence is under `project/artifacts/m03/p0-run/` and mirrored by `project/artifacts/implementation/verification.json`.

AC01-AC33 remain separate and unaccepted. Priority 2 is now active: structured evidence manifests, wallet reconciliation, independently controlled reviewer operations, provider integration within approved credits, and two complete case-to-settlement journeys. Testnet deployment, paid calls, production secrets and mainnet remain unauthorized. The October 28 implementation baseline is pre-event work. The F17 harness timeout correction and final P0 execution completed November 3 during the official competition window. UX3A geometry, The Bench naming, neutral avatars and the immutable reference remain preserved.

All older status sections below are preserved historical checkpoints; their global M02 blocker and active-next-task language are superseded by this notice.

## Current implementation checkpoint | CONTRA-2026-10-29-IMPL-M03-IN-PROGRESS

Real NEAR Sandbox execution is unblocked in WSL Ubuntu x86_64 with glibc 2.39 and hard open-file limit 1048576. Rust 1.98.0, the checksum-pinned NEAR Sandbox 2.13.4 binary, production Wasm and fault Wasm are verified. The 20 Rust SDK tests pass. Live Sandbox receipts now prove creation, consent, cancellation, exact funding, immutable terms, evidence-bound primary commit/reveal, callback-confirmed native payout with a beneficiary balance increase of exactly 1 NEAR, challenge blocking, and a decisive fresh review that reverses ACCEPT to REJECT and settles to the creator. A targeted fresh-review timeout test also passes and settles the original ACCEPT verdict to the beneficiary with `KEEP_PRIMARY`.

The first live run exposed a harness defect: block fast-forward was interpreted as seconds and overshot contractual deadlines. A second run exposed expired transaction hashes after very large block jumps. The corrected harness advances conservatively in bounded chunks and uses valid 610-second protocol intervals. Failure and passing logs are preserved under `project/artifacts/implementation/`. This checkpoint is not P0 completion: all 18 requested financial categories, multi-case conservation, callback split failures, concurrency, overflow, storage and gas measurements still require live coverage. AC01-AC33 remain unaccepted. No testnet deployment, paid provider use or secrets occurred.

## Current implementation checkpoint | CONTRA-2026-10-28-IMPL-M02

Actual implementation start: October 28, 2026 UTC, pre-event, explicitly owner-authorized. Branch implementation/oct28. M01 source saved at 5401cbfd4e0309cf9f15cd70ff246aaa419f75e8; final M02 commit is reported in the delivery. Historical date gates below no longer prevent development. UX3A reference is unchanged by this implementation branch; The Bench is the active name.

Implemented Rust escrow, registry, consent, evidence-bound commit/reveal, challenge/fresh-review and callback-safe intent/retry logic; API/evidence/authentication/cost ledger; approved-layout frontend workflows and gated wallet/provider adapters. Verification: 20 Rust SDK mocked-environment tests, 16 service/encoding tests, production/fault Wasm export separation and wallet bundle build. Fifteen measured 1200x900 rectangles equal the approved reference. Screenshots show truthful chain-unavailable mode, not a fabricated successful journey. See docs/IMPLEMENTATION_OCT28.md and project/artifacts/implementation/verification.json.

Financial milestone remains BLOCKED: stock NEAR Sandbox requires 65535 file descriptors; host hard limit is 16384. Authored Sandbox scenarios have not run. No real transfer, live independent AI adjudication or external wallet journey is verified. AC01-AC33 are not fully accepted; I1-I10 have partial unit evidence only. No testnet deployment, paid calls, production secrets or mainnet actions. UNKNOWN payouts remain locked without retry; Meta $3/Baseten $3/Modal $5 caps unchanged. Owner acceptance remains pending. First next action is real Sandbox financial proof on a compatible host.

## Current implementation checkpoint | CONTRA-2026-10-28-IMPL-M01

Owner authorized implementation beginning October 28 UTC, superseding the earlier November 1 gate. Work branch: implementation/oct28, based on UX3C e57cc94 plus preserved naming commit e875a58. This is pre-event code and must not be claimed as competition-window implementation. UX3A remains frozen; active product name is The Bench.

Escrow/reviewer Rust source and production Wasm build exist. Fourteen Rust SDK mocked-environment tests pass; real Sandbox tests are BLOCKED by host hard file-descriptor limit 16384 versus Sandbox requirement 65535. No real transfer or callback recovery is verified. Unknown payout outcomes remain locked with no retry. See docs/IMPLEMENTATION_OCT28.md for limits and remaining acceptance work. Backend/frontend integration is in progress. Paid inference, testnet deployment and production secrets remain separately gated; budgets unchanged.

Earlier checkpoint sections below are historical and superseded where inconsistent with this authorization.

## Current authoritative checkpoint | CONTRA-2026-10-28-UX3C

Date: 2026-10-28. Starting baseline plan/ux3b at af0dd97558f134ac9269c7fb58cc7613df6b8202. Current work branch: plan/ux3c. This notice supersedes earlier active NEXT and gap-status text, which remains historical below.

Completed: six authoritative v1 documents (ABI, state machine, committee policy, settlement recovery, commitments, threat model); exact public/private interfaces, JSON/Borsh types, deposits/gas assumptions, deterministic idempotency/events, six-operator 3+3 committee, creator-only unfunded cancel and beneficiary consent, normalized refund/payout lifecycle, single immutable payout intent and callback guards. G01-G07 RESOLVED at specification level with corresponding future acceptance tests. UX3A design and references remain frozen at bee5a74.

Substantive freeze decisions: original undecided review still uses creator-refund fallback; an inconclusive challenged fresh review retains the original decisive verdict to avoid profitable timeout challenges. The losing party may challenge once, within immutable deadlines. Permissioned creator allowlist limits sponsor-storage spam. Unknown payout outcome, including successful transfer with failed callback, stays locked pending with NO MVP recovery or retry. I7/I10 liveness is qualified accordingly; no second transfer is permitted while prior outcome is unknown.

Verification: AC01-AC33/I1-I10 traceability reviewed, method/type/state/deposit consistency and local document-link checks; 12 vote + challenge bundle + case/terms/payout fixtures (16 total) independently byte/hash checked with Node, Python and OpenSSL. These are documentation/serialization checks, NOT Rust, sandbox, browser-integration or smart-contract tests. All future acceptance tests remain NOT RUN.

Remaining execution gates: exact dependency/ABI compilation, worst-case storage/gas measurement, sandbox financial/race/callback-fault tests, separately controlled reviewer evidence, budget/credit verification and deployment/key-control authorization. Known residual risks are in THREAT_MODEL_V1. No unresolved G01-G07 specification alternative remains; callback-unknown liveness is an explicit limitation, not a promised future fix.

Next: on/after November 1 UTC, author fresh contracts/adjudication source and sandbox tests for create/accept/cancel/fund, accounting, payout intent, private callback and verified-failure retry. Prove I1/I2/I3/I10, including SR05 successful transfer + callback failure, before reviewer/service/frontend integration. No deployment, model calls, secrets, mainnet, actual transactions or spending. Meta $3/Baseten $3/Modal $5 caps unchanged.

## Preserved earlier checkpoints (superseded where inconsistent)


## Current authoritative checkpoint | UX3B

The owner approved and froze UX3A at bee5a7481d56c86d4c9860280b8367f82af0cb5a on 2026-10-28. Earlier pending/rejected visual statements below are historical, not the current owner verdict. UX3B delivers protocol workflow mapping and engineering acceptance criteria only. No UX3A source or visual asset was changed.

Deliverables: docs/UX3B_FUNCTIONAL_INTEGRATION_MAP.md and docs/UX3B_ENGINEERING_ACCEPTANCE.md. These map all dashboard controls and actions A01-A23 to conceptual contract methods, proposed APIs, roles, transaction states and failure recovery. AC01-AC33 specify future verification and are NOT RUN. G01-G07 record unresolved ABI/state/committee/recovery decisions explicitly.

Next: resolve and pin G01-G07, then begin fresh eligible-window engineering on or after November 1, 2026 UTC. Do not expand implementation at this checkpoint. Keep approved design/ux3a reference-only and separate from future apps/web and contracts/adjudication source. No deployment, transactions, live service integration or provider spending occurred. Branch: plan/ux3b.

## Preserved prior checkpoint record



UX3A final correction: replaced sidebar library approximations with source-derived glyph assets and preserved the full spatial margin texture in a recolored derivative. Recaptured and reviewed the final combined comparison. Internal visual QA passed after corrections; font rasterization remains an explicit P3 limitation. Owner acceptance remains pending.
Checkpoint ID: CONTRA-2026-10-28-UX3B
Date: 2026-10-28
Phase: Pre-hackathon functional integration specification
Owner acceptance: UX3A approved and frozen at bee5a7481d56c86d4c9860280b8367f82af0cb5a; UX3B planning delivered
Repository: Private `kellyxy110/CONTRA`, created and synchronized on `main`
Deployment: None
Onchain code: None
AI provider spend: None incurred by this package

## Repository baseline | 2026-10-28

- Remote: `https://github.com/kellyxy110/CONTRA`
- Visibility: Private
- Default branch: `main`
- Initial baseline commit: `351e90d73c93577f8798e45c2e8bb45bff3e082a`
- Deployment and repository secrets: None

## Visual direction update (v1.1)

- Owner approved specific dark cinematic graph-first source image as the exact target composition (D-015).
- NEAR mint, coral and amber will replace source status colors while respecting information hierarchy.
- Detailed mapping written in `docs/VISUAL_DIRECTION.md`; input screenshot embedded under `design/reference/`.
- Previous v1.0 screenshot/sidebar design is superseded for composition, without changing protocol logic.

## Completed in the previous blueprint checkpoint

- Product thesis and MVP boundaries documented.
- Single-contract, NEAR-testnet-first architecture specified.
- Case and settlement states, challenge path, and transfer recovery rules specified.
- Primary journey, navigation and responsive screen architecture specified.
- NEAR-aligned color tokens written.
- Browser-only design reference built with simulated cases and clear disclaimers. This is not hackathon competition implementation and must not be represented as such.
- Benchmark scenario plan and measurement principles documented.
- Cost control policy and service responsibilities documented.
- Handoff, decision ledger and change log created.

## Quality checks

- Chromium and Playwright rendered the application at 1200 x 900, 768 x 1024 and 390 x 844.
- Desktop reference comparison and all three viewport screenshots are stored in `project/artifacts/ux2b/`.
- Node selection, inspector updates, search, evidence filtering, graph/list modes, zoom, fit, arrow-key list navigation, challenge-path selection and reduced-motion behavior passed.
- No horizontal document overflow occurred at the tested widths. Inspector actions and the local case-question input remained reachable on tablet and mobile.
- Browser console and page error capture returned zero errors after adding an inline favicon.
- Playwright found one overlapping-control defect at desktop size. Bottom clearance was added between the inspector and assistant dock, then the complete suite passed.
- UX2C reran the same 22-check Playwright baseline after the visual recovery. All checks passed with zero console or page errors.

## Not completed

- No actual NEAR contract was implemented or tested.
- No AI provider integration or API calls were made.
- No independent security audit or external reviewers were engaged.
- No deployment, CI workflow, live demo or formal hackathon submission.
- No GenLayer head-to-head benchmark results.

## Risks

1. An onchain reviewer registry does not establish real operator independence.
2. Adjudication depends on signed offchain AI findings and evidence integrity.
3. Transfer promises on NEAR need callback-aware failure recovery.
4. Token budgets and application-level cutoffs do not guarantee a provider-side hard billing cap.
5. Multiple simultaneous hackathon projects compete for the same engineering attention.

## Next checkpoint

Owner visual decision on CONTRA-2026-10-28-UX2C. If accepted, freeze the pre-event screen map and wait until November 1 UTC before beginning contract implementation.

## Resume rule

When resuming, read STATUS.md, DECISIONS.md, CHANGELOG.md, NEXT.md, then the relevant specification. Append changes to the log. Do not restart branding, naming, palette, architecture or cost allocation unless a new finding requires a documented decision revision.

## Latest handoff checkpoint | CONTRA-2026-10-27-VH1

- Versioned agent handoff package v1.2 prepared with all prior blueprint specifications.
- The original 1200 x 900 reference is present and checksum matches upload: `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`.
- Source screenshot remains unmodified. It is a design reference, not a live screen.
- `HANDOFF_TO_CODING_AGENT.md` is the next agent entrypoint; `docs/VISUAL_INTEGRATION_SPEC.md` and `docs/DESIGN_REFERENCE_INTEGRITY.md` define new constraints.
- No visual rebuild, UI screenshot acceptance, code implementation, NEAR deployment, model usage or actual benchmark results claimed.
- Next checkpoint: CONTRA-2026-10-29-UX2 following interactive visual design review.

## Latest implementation checkpoint | CONTRA-2026-10-29-UX2A

- Replaced the legacy sidebar prototype with a graph-first Judgment Room using NEAR colors and local fixtures.
- Added selectable typed nodes, dynamic inspector data, graph and list modes, search, evidence filtering, zoom, fit, keyboard list navigation, reduced-motion handling and responsive layouts.
- Added truthful README badges for stage, network, blueprint, GitHub owner and deployment state.
- JavaScript syntax, reference checksum, em dash and generic-copy scans passed.
- Browser surfaces were unavailable, so rendered visual comparison, responsive screenshots and interaction acceptance remain unverified.
- No remote, commit, push, deployment, transaction, model call or provider spend occurred.

Repository safeguard: GitHub owner is `kellyxy110`. Remote name and URL remain unassigned. Do not create a remote, push, set secrets or deploy until repository details and timing are approved.

## Latest visual verification checkpoint | CONTRA-2026-10-28-UX2B

- Actual Chromium screenshots and a side-by-side desktop comparison were produced.
- The implementation preserves the reference anatomy: compact floating controls, left-root graph, curved links, highlighted evidence node, 66/34 graph-to-inspector balance, dark contextual rail and separate assistant dock.
- Honest divergence: the CONTRA graph has fewer leaf nodes and lower visual density than the source because it represents one evidence fixture without decorative records. Typography is larger for readability, and mobile uses a compact graph plus list fallback instead of shrinking the full desktop graph.
- Explicit owner acceptance has not been recorded.

## Latest visual recovery checkpoint | CONTRA-2026-10-28-UX2C

- Owner rejected UX2B for visual fidelity despite its passing functional checks.
- Rebuilt the desktop composition around the immutable reference geometry without changing the reference asset or using it as a page background.
- Root orb is anchored near x=120 and y=470. Semantic group centers sit near x=355. A compact property and evidence leaf column fans out near x=620 to x=640.
- Restored delicate luminous cubic branches, compact controls, restrained case metadata, cinematic negative space, a bounded analytics-style inspector and an independent assistant dock.
- Added only truthful subnodes derived from existing criteria, digests, validation limits, viewport fixture, review basis and settlement guard data.
- Fresh Chromium screenshots are stored in `project/artifacts/ux2c/`. Owner acceptance remains pending.


## Latest checkpoint | CONTRA-2026-10-28-UX3A

- Implemented separate HTML/CSS/JavaScript dashboard study at design/ux3a/index.html on branch design/ux3a.
- Source is the newly supplied 1200 x 900 dashboard, SHA-256 1d4b982d638e86829387c87bef61d7b121f59b1e87913d4606b73142e0e15480. It is distinct from the earlier graph image.
- Browser measured shell x=60, y=45, width=1080, height=810; sidebar=53; columns=255/472/299. Captured at a 1200 x 900 iframe viewport.
- Retained eight-sector radar, source avatar assets, four reviewer cards, three material cards, three task cards and three activity cards.
- Browser-verified search, chart/material tabs, pagination, challenge details and session-only counterexample note. No application console errors; browser extension metadata errors excluded explicitly.
- Fixed asset base paths, one radar radius, compact-card overflow, filtering pagination bounds and typography loading.
- Exact pixel identity is not claimed: icon glyphs and microtypographic rasterization remain approximations. Owner acceptance remains PENDING.
- Existing graph study and protocol files are preserved on the base branch. No deployment, NEAR transaction, smart contract or paid API work occurred. Spend $0.
- Next: owner reviews UX3A comparison and identifies any remaining fidelity corrections. Do not freeze acceptance on the owner's behalf.

