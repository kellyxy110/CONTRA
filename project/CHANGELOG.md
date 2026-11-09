# Change log

## 2026-11-09 | M08 independent readiness and Linux artifact

Separated M08, M09 and M10 external readiness states and added fail-closed regressions. Dual read-only RPC probes found `contra-contestation.testnet` absent. GitHub run `42700073759` built the production WASM on Ubuntu 24.04 with SHA-256 `49cff947a68ae2fddbc5843c22fad1d655162e50b1e81957443584ca90377a5f` and verified the checksum-pinned near-cli-rs Ledger command surface without signing. No external action or spending was authorised.

## 2026-11-09 | Cloudflare Free persistence foundation

Replaced the active Fly.io proposal with Cloudflare Workers Free, Static Assets and a SQLite-backed Durable Object. Added serial operation, transaction, session, immutable-artifact and chain-observation persistence with conservative UNKNOWN handling. Added six Cloudflare regressions and a Wrangler dry-run build. Corrected a test-discovered artifact SQL binding defect before commit. Hosting remains undeployed and the hard ceiling is USD 0.

## 2026-11-09 | Release audit and consolidated external preparation

Corrected stale current-task records after the judge route reached `main` at `024eef7ec9e684eaab53e2a834c458f9ed5fc302`. Added a digest-bound single external-authorisation packet, a proposed Ledger-controlled `contra-contestation.testnet` deployment with 5 NEAR ceiling, a single-writer Fly.io hosting design, independent-reviewer onboarding and current official provider-interface references. Corrected Meta's allowed host to `api.meta.ai` and required the Baseten model identity in its request envelope. Added focused regressions. No external action or spending was authorised.

## 2026-11-09 | M11 credential-free judge quick-start

Merged acceptance-review PR 28 as `29206ecf4295181a84466319edd87f5c075671b9` after Core `42626681412`, Security `42626681362` and comprehensive Integration `42626681341` passed. Promotion PR 29 merged the accepted tree into `main` as `9a17ac082e3e92b70449f71e4080048a7fd7ebd1` after Core `42628250853`, Security `42628250899` and comprehensive Integration `42628250807` passed.

Added `npm run judge:local` for a clean Ubuntu verification of source, contract, wallet and the controlled local NEAR Sandbox journey. Added an independently checked `CONTRA_JUDGE_QUICKSTART_V1` report, explicit comprehensive-risk mapping and CI artifact retention. The runner rejects missing Sandbox identity, ambiguous external boundaries, incorrect settlement, non-deterministic timeout, redispatch or AI-created commitments. No live network, signing, provider or deployment authority was added.

PR 30 passed Core `42635548335`, Security `42635548331` and comprehensive Integration `42635548332` on final head `45c80a424e0e77cb00a192094c54c01174467c22`, then merged into `implementation/oct28` as `2e52098130f62922a3a49ec1121c66a5a9bf3301`. The judge route passed in 5m42s, the nine-test baseline in 7m39s and both complete journeys in 4m19s.

## 2026-11-09 | M11 acceptance evidence review

Merged frontend-interface PR 26 as `59de0f9b57b5245aaae1bb6d90d0df7c7f17b5bd` after Core `42623963739`, Security `42623963706` and risk-selected Integration `42623963635` passed. Promotion PR 27 merged the accepted tree into `main` as `a74445527dd66f2ff0c684887849346f7951416e` after Core `42624205902`, Security `42624205805` and comprehensive Integration `42624205937` passed.

Reevaluated all 33 frozen acceptance criteria with exact evidence classes, commit and CI links, limitations and external blockers. Added a mechanical 33-row and status-total check. AC06 and AC24 advance from PARTIAL to PASS based on completed Sandbox creation and durable controlled wallet lifecycle evidence. The new result is 23 PASS, 8 PARTIAL and 2 BLOCKED. No live, independent or deployed criterion was upgraded from fixtures.

## 2026-11-09 | M09 frontend integration contract

Merged service-readiness PR 24 as `6a327e68a95d409f9dcc914fb02b3b88e05d7db9` after Core `42619092396`, Security `42619092408` and comprehensive Integration `42619092337` passed. Promotion PR 25 merged the identical accepted tree into `main` as `737e034e41b2fa24a8db9651f9173fac7c9d1a77` after Core `42620546576`, Security `42620546479` and comprehensive Integration `42620546482` passed.

Added a versioned machine-readable frontend contract covering all 35 API routes, operational views, access classes, provenance fields and transaction states. Added the owner-frontend integration guide with trust boundaries, authentication recovery, wallet reconciliation, evidence and reviewer handling, error states and accessibility requirements. Added a route-drift regression to the service suite. No UI redesign, deployment, signing, provider call, transaction, secret change or spending occurred.

## 2026-11-09 | M09 service readiness

Added separate liveness and readiness probes. Liveness no longer implies NEAR or storage health. Readiness audits SQLite and immutable objects and requires the chain adapter to report ready; unavailable and stale states fail with HTTP 503. Added a provider-neutral single-replica service contract with a persistent single-writer volume, HTTPS ingress requirement and 60-second termination grace period. Four focused tests cover ready, unavailable, stale and service-definition states. No hosting deployment or secret change occurred.

Before this unit, PR 22 merged verified backup and restore as `803f26e32cd650ac097325786bb951c3f23a0f05` and PR 23 promoted it to `main` as `ab0b0b97a2a62951ad51528f56851f5bde576ace`. Runs `42596444044`, `42596444011`, `42596444025`, `42613304075`, `42613304248` and `42613304123` passed. Spending remained $0.

## 2026-11-09 | M09 backup and restore package

Added an offline backup command that acquires exclusive storage ownership, checkpoints and audits SQLite, copies the complete database and immutable object store, and writes a per-file SHA-256 manifest. Added independent restore verification that rejects changed, missing, additional and symbolic-link entries before database and artifact integrity checks. Four focused tests cover a clean restored package plus live-owner, nested-path, non-empty-destination, corruption, omission, addition and symbolic-link failure paths. The full repository passes 108/108 tests. No contract, transaction or financial behaviour changed.

Before this unit, PR 20 merged M09 runtime ownership as `d083c9a2602205e56219d0d8d204d2ab1b0dc228` and PR 21 promoted it to `main` as `f76f2765ce29c076e512d799531271210df882f8`. Runs `42588657676`, `42588657855`, `42588657590`, `42592062881`, `42592062883` and `42592062838` passed. No deployment, signing, provider usage or spending occurred.

## 2026-11-09 | M08 promoted and M09 durable runtime ownership

Merged deployment-preflight PR 18 as `38470d1e26d0714b99dbda979eb6e7d285db940f` and promotion PR 19 into `main` as `5041df54f3700a6594469faf8972b370cb14800f`. Exact-head Core, Security and comprehensive Integration passed on both boundaries. No deployment, signing or funded transaction occurred.

Started the separate M09 runtime-operations unit. Added an exclusive durable-data lease, live-process exclusion, safe same-host terminated-process reclamation, failed-start cleanup and graceful request-draining shutdown. Added four focused tests and updated storage and reproducibility guidance. Local results are 102/102 repository tests, 4/4 focused runtime tests, wallet build, Core and Security policy, 50-document link validation and documentation-impact coverage. Contract, settlement and financial logic are unchanged; spending remains $0.

## 2026-11-09 | M08 deployment preflight preparation

Added a fail-closed, non-signing testnet deployment plan, validator, read-only target inspection and five regression tests. Owner authorisation now binds the exact public deployment intent by SHA-256. The validator rejects secret-bearing plans, mainnet, signer-account mismatches, artifact changes, incompatible full-access keys, contradictory code hashes, inadequate funding and stale final blocks. Added explicit fast-gate routing for this preparation-only path and updated deployment, reproducibility, blocker and README guidance. Local results: 98/98 repository tests, 14/14 focused routing and preflight tests, wallet build, Core policy, Security policy and 50-document link validation passed. A read-only public RPC status call observed a synced NEAR testnet node at block `276888350`; no account was queried and no transaction was signed or sent.

M07 completed before this unit. PR 16 merged source head `c9b00547be0deaa801a7ffbf5181114036acfbac` as `6cc9416119e773e022c0bbcc9c5646544ba25e5b`; PR 17 promoted it to `main` as `4d284ae51a89eeefa17b871636152cb9989de94d`. Runs `42573377309`, `42573377260`, `42573377248`, `42573377299` and `42573405407` passed Core, Security, Contract, comprehensive Integration and F01 through F18. The main promotion passed comprehensive run `42578517604` plus its companion checks. Actual spend remained $0.

## 2026-11-09 | M07 Contestation release-candidate preparation

Renamed the active contract directory, Rust crate, production WASM and full journey job to the canonical Contestation identity. Updated all build, Sandbox, test, policy and artifact paths while leaving Rust semantics, ABI, state, commitment vectors and settlement invariants unchanged. Added active-tree terminology enforcement, documentation-link and documentation-impact checks, programme blocker tracking, repository audit classification, dependency assessment, testnet deployment preparation, reproducibility instructions and a three-route judge guide. Rebuilt the README as the current product entrypoint. Preserved immutable historical evidence without moving or rewriting it.

Remediated the inherited critical and high npm path by retaining compatible `near-sandbox` 0.1.5 and overriding `tar` from 6.2.1 to 7.5.22. A clean Linux install proved that `near-sandbox` 0.3.5 cannot replace the legacy interface required by `near-workspaces` 5.0.0. The current audit reports 15 low findings, zero moderate, zero high and zero critical. The tar override remains subject to the complete Linux Sandbox and financial gates. Local repository tests pass 92/92 and wallet, source, security, link and formatting checks pass. No tracked file was deleted. No external transaction, deployment, provider call, secret change or spending occurred.

## 2026-11-08 | M06 controlled workflow complete and promoted

- PR 11 merged controlled workflow head `184768e0d36a5be6bb2dd2ffc587e22f5c2d86fb` into `implementation/oct28` as `721964b2f4fb5c6b69767e864bb717e8b32c9afb`.
- Core `42471496896`, Security `42471496910` and Integration `42471496909` passed. The controlled Sandbox job archived 46 receipts, 47 operations, reviewer audit events, failure evidence and durable SQLite plus immutable objects.
- Protected ancestry sync PR 13 passed Core, Security and full Integration `42472276558`, then merged as `1844eb9017bbda265a029d2d6bbc533ad69db951`.
- Promotion PR 12 passed Core `42472865448`, Security `42472865451` and full Integration `42472865460`, then merged into `main` as `b32cd8868470b5b2ad41a5ee5503752f95c54d17`.
- Both protected branches contain the accepted M06 milestone. No deployment, live signing, live provider call, secret change or spending occurred.

## 2026-11-08 | M06 controlled workflow gate in progress

- Created `test/m06-controlled-workflow` from verified implementation commit `46ba7521ef96c58060f7b21b821a553f076382d8`.
- Added a connected M06 runner covering wallet handoff interruption, durable restart recovery, duplicate callbacks, account isolation, reviewer disclosure and committee separation, immutable evidence, strict Meta and Baseten proposals, Modal proposal verification, malformed provider output, quorum timeout, human fixture votes, challenge reversal and exact creator refund.
- Added dependency-injected provider transport at the API composition boundary so the connected HTTP route can be verified without network calls or secrets.
- Added a full-risk Integration job that executes the runner on an isolated Linux NEAR Sandbox host and uploads receipts, operations, reviewer audit history, failure evidence and the consolidated report.
- Passed 89/89 local repository tests, the wallet production bundle, Core policy and Security policy. The Windows host did not execute Sandbox.
- Merged promotion PR 10 after Core `42466893121`, Security `42466893179` and full Integration `42466893124` passed. Main merge commit is `c3fcdf3a5dea8a5a34673d4e1f6b27c4b95f157c`.
- No live signing, provider endpoint, testnet or mainnet transaction, deployment, production secret or spending occurred.

## 2026-11-08 | M06 consolidated merge checkpoint

- Merged PR 7 reviewer risk routing at `4f5c03234c3b2b01aa2e8765e64da465f0b02eaa` after full Integration passed.
- Merged PR 6 reviewer control at `b4c86ec0d8bd2ab18c1f02534ce0eb2ce9d88fdc` after Core, Security and focused Integration passed.
- Merged PR 3 into `main` at `278efcffaca499f22ae775999c0ef2879f32920d` after Core, Security, Contract and comprehensive Integration passed.
- Merged PR 8 provider interoperability at `6900a94ae40a88c06cb03365cdd806cb9ecdb0e7` after Core, Security and focused Integration passed.
- Preserved the inherited dependency baseline, financial assertions, provider stash, zero-spend status and all restricted-action gates.

## 2026-11-08 | IMPL-M06-P3 provider interoperability

- Added strict Meta, Baseten and Modal request adapters and provider-specific response extraction.
- Added criterion-complete finding validation, evidence-state consistency and exact citation checks.
- Added immutable raw response provenance and bounded usage metadata.
- Added Modal verification bound to an existing AI proposal without voting or settlement authority.
- Added explicit model-interface gating and unverified proposed Meta model metadata.
- Expanded non-billable provider tests for request shapes, injection isolation, malformed output, contradictions, idempotency, timeout retention, budgets and provenance.

## 2026-11-07 | IMPL-M06-P2 reviewer control local gate

Added reviewer-control operations for exact active registry and disclosure matching, six-account and six-operator committee disjointness, phase-aware commit and reveal validation, missing-reviewer and quorum diagnostics, frozen vote commitment construction, and evidence-bound finding verification. Corrected reviewer confirmation preparation so the signer, active registry revision and disclosure digest must all match.

Advanced SQLite to schema version 5 with durable encrypted reveal recovery packages, finalised registry observations and append-only reviewer audit records. Recovery packages are account and round scoped, idempotent for identical metadata, reject conflicting commitments or findings, survive restart and never expose another reviewer's ciphertext. Added protected reviewer control, workspace, recovery and audit endpoints. All outputs preserve the statement that distinct fixture accounts and declared operators do not prove independent control.

Dedicated reviewer tests pass 7/7, combined reviewer and wallet integration tests pass 17/17 and the repository suite passes 76/76. Wallet bundle, syntax, diff, Core policy, Security policy and dependency baseline checks pass. The inherited dependency baseline remains 17 findings. PR 4 was merged into `implementation/oct28` as `4bd6bc163cd3c6a1b4097eb2f01a749f54e97e03` before this unit. No live signing, transaction, deployment, paid inference, production secret or spending occurred.

## 2026-11-07 | Reviewer CI risk-map correction

- Added `tests/m06-reviewer*.test.mjs` to the explicit reviewer focused mapping.
- Added a regression for a combined reviewer source and reviewer test diff.
- Preserved full classification for this risk-map correction and all unknown paths.

## 2026-11-07 | CI Sandbox optimisation

- Recorded PR 4 merge head `3ef42d08ef29897e9d48c599dd311ce8d5dd9d6f`, merge SHA `4bd6bc163cd3c6a1b4097eb2f01a749f54e97e03` and its three passing pre-merge runs.
- Added a versioned fast, focused and full integration risk map with fail-safe unclassified handling.
- Added seven routing and adaptive block-planning tests and included them in the repository suite.
- Split comprehensive baseline and journey verification into isolated parallel jobs with separate evidence and timing artifacts.
- Added a truthful aggregate integration gate and preserved the 90-minute Sandbox timeout and separate F01 through F18 workflow.
- Replaced repeated conservative block stepping with finalised-height calibration without shortening contract deadlines.
- Local results: policy tests 7/7 and repository tests 76/76 passed; Core and Security policies and the wallet build passed. GitHub run `42418916525` passed policy, the isolated nine-test baseline, both complete journeys and the aggregate gate. PR 5 merged as `963e27edb4a7cbf8570d652b4a2b3fa6fe2b806a`.

## 2026-11-07 | IMPL-M06-P1 final wallet hardening

Made finalised RPC transaction hash presence, format and exact equality mandatory. Added signer and contract checks in the RPC adapter, independent inner-hash and exact gas checks in lifecycle verification, final block identity validation, and UNKNOWN classification for stale or regressed success observations. Receipt-integrity exceptions now lock the durable operation UNKNOWN rather than being treated as ordinary RPC unavailability.

The complete browser recovery audit identified one related P1 defect: a wallet-returned hash was lost if the server callback failed before persistence. The client now saves that hash before the callback and, after reload, attaches it through the existing first-hash-only callback for receipt reconciliation. It never invokes the wallet or redispatches the transaction during recovery.

Added controlled regressions for matching, missing, empty, malformed and different hashes; signer and contract mismatch; extra actions; changed arguments; incorrect gas and deposit; missing finality; unknown and explicit-failure execution status; stale, regressed and contradictory block observations; malformed proof UNKNOWN locking; and delayed browser hash recovery. Initial regressions failed at the identified boundaries. Final focused tests pass 34/34 and the full repository passes 69/69. Wallet bundle, syntax, diff, Core policy, Security policy and dependency-baseline checks pass locally. The accepted dependency baseline remains 17 inherited findings. Fresh PR 4 CI is pending on the final commit. No contract, financial invariant, transaction, signing, deployment, paid inference, secret or spend changed.

## 2026-11-07 | IMPL-M06-P1 wallet safety corrections

Added durable signing handoff state, restart-safe prepared intents, post-handoff UNKNOWN locking, unique transaction-hash ownership and atomic terminal receipt persistence. Added a server-only live-signing authorisation gate while retaining non-billable preparation with live execution disabled by default. Tightened RPC result classification to explicit NEAR success and failure variants, validated returned transaction identity and final block freshness, and prevented ambiguous finality from becoming confirmation.

Changed browser recovery to retain UNKNOWN operation IDs, account identity and known hashes across reloads; added account-scoped restoration and safe corrupt-storage handling. Added pre-fix regressions that failed in five places, then expanded focused coverage for restart before and after handoff, concurrent handoff, delayed callbacks, rejection authority, duplicate hashes, explicit finality, stale observations, wallet invocation order and account-isolated restoration. Final focused result is 31/31, repository result is 66/66, M05 runtime is 18/18, wallet build and local Core/Security policy checks pass. The dependency baseline remains 17 inherited findings with no new failure. Windows Sandbox preflight blocked before launch, so fresh Linux Integration CI remains pending. No contract, transaction, signing, deployment, paid provider, production secret or spend changed.

## 2026-11-07 | IMPL-M06-P1 external wallet lifecycle local gate

Recovered the wallet portion of the preserved M06 stash onto `feat/m06-wallet-lifecycle` without applying its reviewer or provider work. Added strict external-call policy, durable pre-signing intents, session inspection, renewal and revocation, transaction-hash callbacks, finalised receipt reconciliation, network and payload matching, block-regression rejection and restart recovery. Added browser adapter helpers for stable operation identifiers, reload-visible pending operations, explicit rejection, interruption locking and delayed callback recovery.

Added eight controlled wallet lifecycle tests covering policy, receipt integrity, restart, concurrent prepare, conflicting reuse, repeated callbacks, rejection, missing redirect, delayed receipts, RPC failure, stale observations, UNKNOWN safety and session/account isolation. Updated M05 recovery expectations for schema version 3 and added finalised receipt block metadata. `npm test` passes 60/60, the focused M05/service/wallet run passes 51/51 and `npm run build:wallet` passes. Published code commit `379ff4e0111336da33579357a08c341ce6273dcb` in PR 4. Genuine Core `42373449517`, Security `42373449483` and Integration `42373449454` passed. Integration reran the nine-test baseline and both full journeys, then validated receipts and balances. No contract source, financial assertion, live transaction, signing, deployment, paid inference, secret or spend changed.

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

## 2026-11-07 | IMPL-M05-R01 runtime, finalised reads and durable recovery

Added explicit unavailable, Sandbox and testnet startup configuration. Wired testnet RPC into startup with endpoint, chain identity, sync, account, deployed-code and finalised-block validation. Added finalised read provenance, stale and regressed block detection, authenticated finalised receipt inspection and genuine health metadata. Replaced implicit SQLite setup with two recorded migrations, FULL synchronous mode, integrity and content-object audits, conservative restart recovery to UNKNOWN and two-connection reservation verification. Tightened origin, JSON and browser security headers. Added 9 M05 runtime tests; the complete service and coverage suite passes 44/44. Verified live public testnet RPC status read-only, without a configured CONTRA contract, transaction or deployment.

Recorded the product-first M05 through M07 directive, live hackathon Q-001 eligibility, `security` plus `open` tracks and one-time submission safeguards. Added MIT license, safe environment example, hackathon checklist and M05 checkpoint report. Removed superseded standalone visual studies, capture wrappers and visual-only matrix tools after confirming the operational client still depends on selected UX3A assets. Preserved immutable references, functional browser coverage, protocol source and financial evidence. No Sandbox rerun, testnet transaction, signing, provider request, production secret, deployment or spending occurred.

## 2026-11-07 | DOC-HACKATHON-01 live hackathon instructions

Fetched the live `https://nearhackathon.com/HACKATHON.md` response and added it at repository root as `HACKATHON.md`. Recorded upstream SHA-256 `903794f4b656b456eaee087941517d024a33633641d167b90c3f060d381d9aed`. Normalized seven upstream em dash characters to ASCII punctuation to comply with repository policy without removing rule content; local SHA-256 is `81022d6f7c4d3033d581a1cdd90d50f60d5eb382722cd9034b2aa404cd64a8af`. No implementation, contract, test, transaction, deployment, paid provider, secret or repository setting changed. The live source says to read it again before submission because dates and rules may change.

## 2026-11-04 | IMPL-M04.3-P3 browser verification and visual evidence

Added a portable Windows Chrome, Playwright Chromium and Firefox matrix across eight required viewports, with 315 passing visible-viewport, overflow, radar, typography, console, keyboard, Back, Escape, focus and reduced-motion checks. Added reproducible genuine-case captures at every supported size and inspected the actual 1536 x 676, 1200 x 900, tablet, mobile and mobile-radar images. Corrected an ambiguous navigation selector in the existing end-to-end suite. Reexecuted both local Sandbox journeys on an isolated port after the first attempt encountered the existing server on port 4173. The successful rerun recorded 44 confirmed operations and receipts, two exact 1 NEAR receiver balance deltas, PRIMARY ACCEPT settlement and a FRESH REJECT reversal, both with callback SUCCESS. Repository tests pass 35/35, radar checks pass 17/17, desktop checks pass, and the wallet bundle builds. No contract, protocol, payout invariant, paid provider, deployment, secret, testnet or mainnet change occurred. Manual screen-reader testing and owner visual acceptance remain open.

## 2026-11-04 | IMPL-M04.3-P2 accurate radar values and retrieval states

Rebuilt coverage metrics around explicit measured, not-applicable, inaccessible, unavailable and missing states. Corrected the frontend retrieval path so HTTP authorisation and network failures remain explicit instead of becoming false source absence. Added read-only disconnected case coverage with protected sectors marked Locked. Added direct percentage or status text at every sector label, persistent 25/50/75/100 rings, status markers, complete accessible chart text and exact metric metadata. Defined distinct Criteria, Evidence and Overall lens scopes and made Overall the default. Added exhaustive lifecycle unit tests and 17 rendered-browser checks for exact values, label boundaries and overlap, tab profiles, protected data, genuine case switching and console output. Generated three-state side-by-side and genuine Sandbox radar captures. Repository tests pass 35/35 and the Phase 1 viewport matrix remains clean. No contract, protocol, payout, transaction, provider, deployment, secret, testnet or mainnet change occurred.

## 2026-11-04 | IMPL-M04.3-P1 visible desktop workspace

Removed the fixed 810px and 756px desktop minimum-height dependencies and replaced cumulative section minimums with flexible three-column grid rows. Added a short-desktop layout that fits a 652px shell and 597px primary workspace inside the 1536 x 676 viewport. Reduced Overview reviewer cards to two summaries, made materials a compact count on short desktops and limited Overview activity to the newest event, with direct links to the existing Reviewers, Evidence and Activity workspaces. Corrected a separately detected 31px concealed middle-column overflow at 1200 x 900 and centreed the desktop shell without document-margin overflow. Added `tests/m043-desktop-fit.mjs` with visible-viewport, scrollbar, section-boundary, control visibility, typography, horizontal-overflow and console assertions across eight viewports. The final matrix passes and actual screenshots were inspected. No protocol, contract, financial safeguard, provider, deployment, secret, testnet or mainnet state changed.

## 2026-11-03 | IMPL-M04.2-P3 stable navigation and complete UX verification

Replaced major workflow dialogs with stable hash-routed views for Overview, Cases, Evidence, Challenges, Reviewers, Settlement, Lab, Settings and Activity while retaining dialogs for focused actions. Preserved selected-case context, direct routes and browser Back behaviour. Added complete state, keyboard, focus, responsive, zoom, reduced-motion, contrast and console verification. Results: 54/54 end-to-end checks, 46/46 empty and 46/46 genuine populated responsive checks, 13/13 radar checks, 3/3 deterministic coverage subtests and 12/12 browser-matrix checks across Windows Chrome, Chromium and Firefox. Linux Chromium remains blocked by WSL browser-download network failure. Reexecuted both local Sandbox journeys with 44 persisted operations and receipts, exact 1 NEAR callback-confirmed settlements and challenged ACCEPT to REJECT reversal. Added the component audit, final screenshots and acceptance evidence. No protocol, Rust contract, deployment, paid call, production secret, testnet or mainnet action occurred. Owner visual acceptance remains pending.

## 2026-11-03 | IMPL-M04.2-P2 operational radar measurements

Replaced configuration-derived radar completion with eight operational numerator and denominator rules. Added source retrieval checks for manifest sources, explicit criterion evaluation metadata, selected-round review and quorum calculations, actual settlement and challenge milestones, and an exported render-depth function shared by browser rendering and tests. Replaced eleven-percent rings with 25, 50, 75 and 100 percent markers. Added deterministic eight-state coverage tests and browser checks for zero, genuine partial, case switching, tabs and deterministic full coverage. Results: 3/3 coverage subtests, 13/13 interface checks and 92/92 responsive checks across empty and genuine populated states. Saved close-ups and reports under `project/artifacts/m042/phase2/`. No contract, protocol, deployment, paid call, production secret, testnet or mainnet operation occurred. Phase 3 navigation and complete UX verification is next.

## 2026-11-03 | IMPL-M04.2-P1 coherent responsive shell

Removed independent desktop overflow and stable scrollbar gutters from the three content columns. Made the shell grow with content so 1536 x 676 and 1366 x 768 use one document scrollbar. Raised the reading scale, restored the complete empty heading, separated lower radar labels from its legend, and retained the existing tablet and phone flows. Added a portable M04.2 responsive test and package command covering eight viewports, exact scroll ownership, clipping, page overflow, minimum text size, heading visibility and console errors. Empty and genuine populated states each pass 46/46 checks. Saved before and after screenshots and measurements under `project/artifacts/m042/phase1/`. Reference checksum and em dash scans pass. No protocol, contract, deployment, paid inference, production secret, testnet or mainnet action occurred. Phase 2 radar semantics is next.

## 2026-11-03 | IMPL-M04.1-P3 complete frontend UX gate

Pinned Playwright, added portable browser setup and test commands, and removed all user-specific module and Chromium paths. Added account disconnect, persistent-operation reconciliation availability, serialized async navigation, dialog history state, browser Back behaviour, Escape close and reliable focus restoration. Added 58 end-to-end checks for genuine case switching, all navigation and tabs, search, pagination, settlement retry lock, reload recovery, stale and failed reads, permission denial, reduced motion, semantics, contrast, 125 and 200 percent effective zoom and final screenshots. Legacy browser checks pass 16/16, service tests 29/29 and wallet build passes. Updated README badges, environment commands, M04 acceptance and new M04.1 acceptance report. Fresh Rust execution was blocked before tests by crates.io DNS and missing offline cache; no contract change or pass is claimed. Windows frontend-only clean install passes with `npm ci --ignore-scripts`; dependency audit limitations are recorded. No deployment, testnet, mainnet, paid inference or production secret occurred.

## 2026-11-03 | IMPL-M04.1-P2 radar and interface gate

Rebuilt the radar renderer around responsive canvas dimensions and device pixel ratio, separate eight-sector fills, visible ring and spoke layers, dynamic labels and genuine metric metadata. Added automated zero, partial, full and mobile radar checks plus close-up captures. Refined financial display to readable NEAR with exact yoctoNEAR details, shortened case headings with full digest access, translated contract codes, corrected completed review windows, and clarified material, reviewer and event history text. Added a side-by-side comparison with the approved UX3A desktop. Gate results: 15/15 interface checks, 26/26 empty responsive checks, 29/29 populated responsive checks and 29/29 service tests. Reference checksum and em dash scan pass. No contract, protocol, external transaction, deployment, paid inference, secret, testnet or mainnet action occurred. Next: Phase 3 complete UX, accessibility and portable-browser verification.

## 2026-11-03 | IMPL-M04.1-P1 responsive layout gate

Replaced the fixed-size-only behaviour outside the approved viewport with proportional wide-desktop columns, intentional short-desktop panel scrolling, an ordered tablet flow and a full-width phone layout with scrollable navigation. Removed fixed content heights that clipped populated records and added coarse-pointer target sizing. Added a portable environment-configured responsive Chromium test covering seven target viewports, exact 1200 shell geometry, overflow, clipping, accessible names, touch targets and console errors. Empty state passed 26/26 checks. The initial genuine populated run correctly failed on undersized targets; those controls were fixed and the complete populated run passed 29/29. Saved fourteen screenshots and two measurement reports under `project/artifacts/m041/phase1/`. Reexecuted both authorised local Sandbox journeys to provide genuine populated state; 44 operations and receipts passed with the prior exact settlement results. No protocol, contract, deployment, paid inference, secret, testnet or mainnet change occurred. Next: Phase 2 radar and information refinement.

## 2026-11-03 | IMPL-M04 full local product integration

Completed structured evidence manifests, source provenance, corrections, participant access, transaction lifecycle and final-read metadata, reviewer control disclosures, human finding/counterexample artifacts, and Meta/Baseten/Modal non-billable adapter validation. Added a reproducible API-backed Sandbox journey runner. Two journeys passed with 44 confirmed operations and receipts: unchallenged ACCEPT to beneficiary and challenged primary ACCEPT to fresh REJECT to creator. Each receiver gained exactly 1 NEAR and each payout callback recorded SUCCESS. Added genuine populated-case desktop, tablet and mobile captures plus 16 passing Chromium checks. Corrected the verified tablet overflow/radar clipping defect without changing desktop geometry. Added the individual AC01-AC33 matrix at 20 PASS, 11 PARTIAL and 2 BLOCKED. Corrected README Rust and repository visibility facts and added truthful M04 badges. Final gates: 29 service tests, 28 Rust tests, wallet build, checksum and em dash scan pass. No testnet, paid call, production secret, deployment or mainnet action occurred.

## 2026-11-03 | IMPL-M04-R01 reviewer disclosures and provider fixtures

Added canonical reviewer control disclosures with stable operator identifiers and exact registry digest joins. Connected The Bench registry operations to disclosure creation and added explicit one-process Sandbox control warnings. Split Meta, Baseten and Modal request/response normalization, added structured source citations and prompt-injection boundaries, and retained response, idempotency and budget enforcement. Added Meta primary/fresh, Baseten adversarial and Modal verifier fixture tests. `npm test` passes 28/28. No live provider call, paid usage, transaction, deployment or secret occurred. Next: integrated Sandbox journeys, populated screenshots, accessibility and AC matrix.

## 2026-11-03 | IMPL-M04-W01 wallet lifecycle and read freshness

Replaced the single initial UNKNOWN operation state with persisted PREPARING, AWAITING_SIGNATURE, BROADCAST, PENDING and terminal state transitions. Added ordered transition history, transaction hashes, receipt/error timestamps, duplicate dispatch protection and automatic reload reconciliation. Added final-block metadata envelopes for Sandbox and testnet RPC reads and visible stale-read state in The Bench. `npm test` passes 24/24; syntax, whitespace and em dash checks pass. No new Sandbox transaction was executed in this milestone, so the two M04 journeys remain open. External testnet use remains gated.

## 2026-11-03 | IMPL-M04-E01 structured evidence integration

Added canonical per-criterion evidence manifests, exact source hashes, bounded provenance, participant-only access and append-only same-case corrections. Added manifest persistence and listing without altering immutable blobs. Connected The Bench evidence records, criteria cards and Evidence/Provenance radar values to the exact onchain-selected manifest. Added validation and HTTP tests for complete criterion coverage, hash mismatch, immutable corrections, cross-case rejection, participant authorisation and onchain linkage. `npm test` passes 22/22; syntax and em dash checks pass. No contract change, transaction, deployment, paid call, secret or spending occurred. Next: wallet transaction lifecycle and stale-read reconciliation.

## 2026-11-03 | IMPL-M03 P0 financial verification complete

Corrected Sandbox worker lifecycle and finality synchronization, made release-mode failure assertions evidence-based, raised only F17's harness timeout to 40 minutes, and preserved all financial assertions. A clean `npm run test:p0` run passed 28 Rust SDK tests, 19 service/report tests, nine baseline Sandbox tests and all eighteen financial categories. Captured 454 transactions, 753 receipt outcomes, 46 balance/storage snapshots, maximum transaction gas 35,923,793,821,747, maximum callback gas 17,000,817,633,275 and maximum storage 17,470,225 bytes, with zero gas-budget or reserve-coverage violations. Production Wasm excludes all four fault-only exports. Shortened the UX3A empty-state copy to `No records` without geometry changes. Refreshed machine evidence and the M03 handoff. No deployment, paid call, production secret or mainnet operation occurred. October 28 source remains pre-event; the F17 timeout correction and final verification are November 3 competition-window work. AC01-AC33 remain unaccepted. Next: Priority 2 evidence, wallet, independent reviewer, provider and two-journey integration.

## 2026-10-29 | IMPL-M03 financial matrix and neutral avatars

Resumed c0800c8. Preserved its successful WSL evidence and explicitly superseded M02's global blocker. Authored eighteen isolated financial categories, SDK exact-deadline/overflow/unexpected-result tests, fault-only counter/callback probes, root/callback gas and account/storage capture, complete helper receipt journaling and a nonzero incomplete P0 gate. Twenty-eight SDK tests pass in each build; nineteen service/report tests and both Wasm/wallet builds pass. This host's rerun stopped at descriptor preflight: eighteen categories remain BLOCKED, P0 incomplete, no new financial measurements claimed. Replaced all active human photographs with neutral SVG; reference assets unchanged and fifteen desktop rectangles preserved. Refreshed verification and handoff. No deployment, paid call or production secret configuration.

## 2026-10-29 | IMPL-M03 in progress - Real Sandbox financial execution

Moved execution to compatible Ubuntu x86_64 with glibc 2.39 and hard open-file limit 1048576. Pinned Rust 1.98.0, passed all 20 Rust tests, rebuilt production and fault Wasm, installed checksum-pinned NEAR Sandbox 2.13.4 and executed real transactions. Verified exact 1 NEAR balance transfer and callback-confirmed settlement, plus a challenged case whose fresh committee reversed the original verdict. Corrected the Sandbox clock helper after real receipts proved deadline overshoot and expired block-hash behaviour. Targeted `KEEP_PRIMARY` timeout now passes. Saved raw failure and passing evidence. P0 remains incomplete pending the rest of the 18-category matrix, gas/storage measurement and full rerun.

## 2026-10-28 | IMPL-M02 - Functional integration source and verification evidence

Extended M01 with preallocated case storage, strict ABI argument handling, complete RoundView slots, callback mismatch/duplicate handling, shared Rust creation/terms/payout vectors and 20 SDK tests. Added participant-authenticated immutable evidence and criteria retrieval, durable UNKNOWN transaction operations, NEP-413 verification, capped idempotent provider proposals and 16 service/encoding tests. Added The Bench functional workflows in separate apps/web source, gated external wallet adapter, coverage/N/A counters, responsive forms, pinned Sandbox setup and reproducible verification scripts. Production/fault Wasm and wallet bundles build. Saved source-resolution side-by-side, mobile form, geometry and test evidence. Financial execution remains BLOCKED by host file limit; no deployment/live providers/real paid settlement claimed. UX3A reference and historical logs preserved.

## 2026-10-28 | IMPL-M01 - Actual implementation begins before event

Owner removed November 1 implementation gate (D-042). Added Rust escrow/contestation contract, canonical commitment encoding, Sandbox scenarios, immutable evidence/cost-ledger services and API foundation. Production Wasm builds; 14 Rust SDK tests pass. Sandbox execution blocked by host open-file hard limit. No deployment or paid calls. The Bench naming and frozen UX3A preserved. No claim of competition-window authorship or proven real settlement.


- UX3C verification record: project/artifacts/ux3c/spec-validation.json, including six specification SHA-256 values, 33 acceptance/10 invariant/7 gap coverage checks and 16 independent byte/hash fixture results. Contract/sandbox acceptance remains NOT RUN.

UX3A final correction: replaced sidebar library approximations with source-derived glyph assets and preserved the full spatial margin texture in a recoloured derivative. Recaptured and reviewed the final combined comparison. Internal visual QA passed after corrections; font rasterization remains an explicit P3 limitation. Owner acceptance remains pending.
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
- Accepted D-015: graph-first cinematic UI is now the exact desktop visual reference; NEAR mint, coral and amber remain the colour vocabulary.
- Added detailed source-to-CONTRA component mapping and non-colour graph semantics in `docs/VISUAL_DIRECTION.md`.
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

## v1.2.4 | 2026-10-28 | Repository baseline authorisation

- Owner authorised creation of private repository `kellyxy110/CONTRA`.
- Current blueprint, logs, immutable reference and visual QA artifacts form the redesign baseline.
- Added repository ignore rules for local tooling, secrets and generated output.
- Product redesign is the next design milestone. No deployment, paid API use or smart contract work was authorised by this decision.
- Created private GitHub repository `kellyxy110/CONTRA`, set `main` as the default branch and pushed baseline commit `351e90d73c93577f8798e45c2e8bb45bff3e082a`.


## v1.3 | 2026-10-28 | UX3A dashboard reference implementation

- Added separate source-faithful dashboard study, immutable new reference, local server and screenshot comparison page.
- Preserved graph study, older source, all protocol requirements and historical logs.
- New study uses approved colours and CONTRA fixture records within the source panel geometry, plus original sector radar and avatar images.
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
- Recorded D-041. Preserved historical log text and archived prototype paths. No contract methods, ABI, state machine, committee/recovery rules, commitment vectors, CSS, JavaScript behaviour, reference images or other visual assets changed.
- UX3A remains approved with this owner-authorised naming-only exception. UX3C protocol work and first November 1 fresh Rust escrow/sandbox milestone continue unchanged.
- Validation: exact frontend text-substitution comparison and scoped diff inspection; no protocol/sandbox testing claimed. No deployment, provider use, secrets, mainnet action or spending.

