# Next execution task

## Active next task | Reviewer risk-map correction verification

Publish `ci/reviewer-risk-map`, require Core, Security and full Integration on the correction head, then merge under the standing green-check policy. After merge, reviewer-control changes with their dedicated test file must route to focused Sandbox coverage unless another changed path independently requires full verification.

## Active next task | CI optimisation remote verification

Publish `ci/optimise-sandbox-runtime`, open its focused PR into `implementation/oct28` and require fresh Core, Security and full Integration results. Verify the policy selects full because integration infrastructure and Sandbox timing changed. Confirm both isolated comprehensive jobs pass, inspect their timing artifacts and record actual wall-time improvement on the PR. Merge under the standing green-check policy only when the aggregate gate and required checks are green. Then reevaluate PR 3 against the advanced implementation branch and preserve the concurrent reviewer-control branch.

## Active next task | M06 Phase 1 final owner merge gate

Preserve `CONTRA-2026-11-07-IMPL-M06-P1-WALLET-FINAL`, PR 4, PR 3 and `stash@{0}`. Obtain one fresh Core, Security and affected Linux Integration run on the intended final PR 4 head. Confirm branch protection, mergeability, final diff and review-conversation state. Do not merge until the owner explicitly authorizes it. If all checks pass, report M06 Phase 1 ready for owner merge approval with exact commit and run links. Acceptance remains 21 PASS, 10 PARTIAL and 2 BLOCKED.

After owner-authorized merge into `implementation/oct28`, verify the target commit and required checks, preserve PR 3's independent boundary, create `feat/m06-reviewer-control`, and recover only the reviewer portion of the preserved stash. Implement reviewer onboarding, registry verification, signer-control disclosure, primary and fresh committee separation, evidence authorization, commit-reveal failure handling, quorum recovery and session continuity. No live signing, deployment, paid inference, production-secret change, UI redesign or demo work is authorized.

## Active next task | M06 Phase 1 wallet safety CI and owner review

Preserve checkpoint `CONTRA-2026-11-07-IMPL-M06-P1-WALLET-SAFETY`, PR 4, PR 3 and the original `stash@{0}`. Push the corrective wallet head, obtain fresh Core, Security and affected Linux Integration results, resolve any actionable failure and document the resolved review findings in PR 4. Do not merge either PR without explicit owner approval. Contract CI is required only if contract or protocol source changes; full financial P0 is required only if settlement or financial invariants change.

After PR 4 passes and the owner authorizes its merge, create a separate reviewer-control feature branch and PR from the updated `implementation/oct28`. Recover only the reviewer portion of the preserved stash. Implement onboarding, registry verification, operator-control disclosure, frozen disjoint committees, evidence access, commitment and reveal failure cases, quorum timeout recovery and session continuity. Keep the six Sandbox keys described as single-process fixtures. Do not sign live transactions, deploy, use paid inference, change secrets, or start UI and demo work.

## Active next task | M06 Phase 1 wallet PR verification

Preserve `CONTRA-2026-11-07-IMPL-M06-P1-WALLET`, wallet code commit `379ff4e0111336da33579357a08c341ce6273dcb`, PR 4 and the original `stash@{0}` until its reviewer and provider portions are safely recovered into their separate feature branches. Core `42373449517`, Security `42373449483` and affected Integration `42373449454` passed on the wallet code. Contract CI was not required because no contract or protocol code changed. Full P0 was not required because no financial invariant or settlement path changed.

Leave PR 4 unmerged for owner approval. After owner-directed merge, create the separate reviewer-control feature branch and PR from the updated implementation branch, recovering only the reviewer portion of the preserved stash. Do not sign a live transaction, deploy, use paid inference, change production secrets or start UI and demo work.

## Active next task | M05.1 integration PR review

Preserve product-source baseline `34c836bbd02dc672325800b2951714ee6e935659`, CI merge `a1eedc929758d3e9f16dffb78fee64da5820817e` and the genuine Core, Security, Contract and Integration results. Open the integration pull request from `implementation/oct28` to `main`, review the complete accumulated contract, backend, dependency, documentation and stored-artifact diff, and leave it unmerged for explicit owner approval. Keep automatic merge disabled and required Core plus Security protection active.

After M05.1 is accepted, resume the safely stashed M06 non-billable external-wallet simulation. The exact first M06 unit is NEP-413 session recovery plus rejected or interrupted wallet-call recovery with persisted transaction identity, finalized receipt reconciliation and duplicate-dispatch prevention. Do not sign a live transaction, deploy, use paid inference or change production secrets.

## Active next task | M06 non-billable wallet and reviewer preparation

Preserve checkpoint `CONTRA-2026-11-07-IMPL-M05-R03`, including the fresh 18/18 P0 matrix and two passing local journeys. Audit and complete the external wallet lifecycle in simulation first: NEP-413 session recovery, rejection, redirect recovery, timeout, stale reads, persisted transaction identifiers, finalized receipt reconciliation and idempotency under concurrent requests. Do not sign a live transaction.

Then prepare actual reviewer account, permission, committee and signer-control procedures. Keep primary and fresh committees operator-disjoint, test invalid, duplicate, conflicting and late submissions, and retain truthful shared-control disclosure. Continue provider format and failure testing with non-billable fixtures only.

Configured CONTRA testnet contract reads, testnet signing, deployment, paid inference and production-secret changes remain blocked pending separate owner authorization and the required external resources. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED.

## Active next task | M05 R03 complete local regression and remaining backend fault tests

Preserve checkpoint `CONTRA-2026-11-07-IMPL-M05-R02`. Run `npm run test:p0` and `npm run test:m04:journeys` on the compatible Linux Sandbox host so the startup, migration, rate-control and persistence changes receive a full financial and two-journey regression. Save actual results without replacing the accepted M03 and M04 evidence if the host is unavailable.

Reevaluate AC01 through AC33 individually after fresh compatible-host evidence. Configured CONTRA testnet contract reads remain blocked until deployment is separately authorized and a deployed account exists.

Do not deploy, sign, use paid inference or change production secrets. Visual and demo work remains deferred.

## Active next task | M05 R02 failure recovery, rate limits and Sandbox regression

Preserve checkpoint `CONTRA-2026-11-07-IMPL-M05-R01`. Add bounded request-rate enforcement for authentication, artifact writes, evaluation and transaction routes. Extend case-isolation and origin tests, including stale sessions, malicious host/origin combinations, cross-case object access and oversized request behavior. Add abrupt-process and write-fault tests around object persistence, transaction state and budget reservations. Document backup and restore for the durable SQLite plus object directory as one atomic deployment volume.

On the compatible Linux host, rerun the complete local Sandbox financial and two-journey regressions against the new startup and migration path. Do not infer a Sandbox pass from the 44 service tests. A configured CONTRA testnet contract read remains blocked because deployment is not authorized and no deployed account exists. Do not deploy, sign, use paid providers or change production secrets. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED until individually reevaluated against fresh evidence.

Visual polish, radar refinement, screenshot comparison and demo production remain suspended. Preserve the minimal operational client, immutable reference, The Bench naming and active UX3A dependencies. Current hackathon tracks are `security` and `open`; fetch the live rules again before submission.

## Active next task | M04.3 owner visual review

Preserve checkpoint CONTRA-2026-11-04-IMPL-M04.3-P3. Present the inspected visible-viewport screenshots, three-state radar comparison, exact metric table and browser reports for explicit owner review. Do not mark visual acceptance without the owner's response. A manual assistive-technology screen-reader session remains open and must be recorded separately if performed. AC31 and AC32 remain blocked until authorized testnet deployment and live provider records prove their frozen scope. Do not deploy, use paid inference, add production secrets, or perform testnet or mainnet operations without separate authorization.

## Active next task | M04.3 Phase 3 browser verification and visual evidence

Preserve checkpoint CONTRA-2026-11-04-IMPL-M04.3-P2. Run visible-viewport verification in Chromium, installed Windows Chrome and Firefox across 1536 x 676, 1366 x 768, 1200 x 900, 1440 x 900, 1920 x 1080, 768 x 1024, 390 x 844 and 320px effective width. Verify every stable workspace, keyboard navigation, browser Back, Escape, focus restoration, zoom, reduced motion and connected, disconnected, unavailable, pending, challenged and settled states. Rerun service, frontend, wallet and relevant journey regressions, confirm retained Sandbox settlement evidence and record manual screen-reader testing separately. Inspect all actual screenshots before the final checkpoint. Do not claim owner acceptance.

## Active next task | M04.3 Phase 2 accurate and readable radar

Preserve checkpoint CONTRA-2026-11-04-IMPL-M04.3-P1. Define meaningful Criteria, Evidence and Overall scopes, display every sector value directly, and preserve exact numerator, denominator, source and observation time. Distinguish measured zero, unavailable, inaccessible and not applicable. Never convert evidence authorization or network failures to zero. Verify no selected case, created/unfunded, funded/no evidence, evidence/incomplete review, provisional, active challenge, incomplete fresh review, settled unchallenged, settled challenged and missing/inaccessible/not-applicable states. Use genuine Sandbox records where available and label deterministic fixtures. Submit side-by-side visible-viewport radar screenshots for at least three distinct states with exact values before Phase 3.

## Active next task | M04.2 owner visual acceptance and external gates

Preserve checkpoint CONTRA-2026-11-03-IMPL-M04.2-P3. The owner reviews the final desktop, tablet and mobile screenshots plus the running local populated application and either grants explicit visual acceptance or identifies a precise correction. Complete a manual assistive-technology screen-reader session and Linux Chromium verification when a compatible browser binary is available. AC31 and AC32 remain blocked until testnet deployment and paid provider use are separately authorized, credits and pricing are reverified and six genuinely independently controlled reviewers are available. Do not deploy, use paid inference, add production secrets, or perform testnet or mainnet operations without authorization.

## Active next task | M04.2 Phase 3 navigation and complete UX verification

Preserve checkpoint CONTRA-2026-11-03-IMPL-M04.2-P2. Audit every visible component and replace major workflow dialogs with stable navigable views for Overview, Cases, Evidence, Challenges, Reviewers, Settlement/history, Lab and Settings. Preserve focused dialogs only for focused actions. Verify browser Back, direct navigation, selected-case context, focus restoration and accurate loading, empty, partial, challenged, settlement-pending, settled and failure states. Run Windows Chrome, Linux Chromium and another available engine where practical, keyboard and accessibility checks, 125 and 200 percent zoom, both genuine Sandbox journeys and the full responsive matrix. Record manual screen-reader coverage as PARTIAL unless actually performed. Do not deploy, use paid inference, add production secrets, or perform testnet or mainnet operations.

## Active next task | M04.2 Phase 2 operational radar semantics

Preserve checkpoint CONTRA-2026-11-03-IMPL-M04.2-P1. Replace configuration-derived radar completion with operational measurements for Evidence, Provenance, Review, Finality, Challenge, Quorum, Keyboard and Criteria. Each sector must expose its exact numerator, denominator and source, render an independent radial depth and report N/A when evidence is insufficient. Add deterministic tests for all eight sectors across zero, partial and full case states, then capture the required close-ups and rerun the responsive matrix. Preserve the Phase 1 document-scroll correction, UX3A hierarchy, frozen UX3C protocol and P0 safeguards. Do not deploy, use paid inference, add production secrets, or perform testnet or mainnet operations.

## Active next task | M04.1 owner acceptance and authorized external gates

Preserve checkpoint CONTRA-2026-11-03-IMPL-M04.1-P3. The owner reviews the final desktop, tablet, mobile, zoom and UX3A comparison screenshots and gives explicit visual acceptance or precise corrections. A manual assistive-technology screen-reader session remains open. Separately resolve the crates.io DNS or use a Cargo-equipped verified host before claiming a fresh Rust rerun, and review the upstream `near-sandbox` dependency advisories without breaking the accepted P0 environment. AC31 and AC32 remain blocked until testnet and paid provider use are separately authorized, credits are reverified and six genuinely independently controlled reviewers are available. Do not deploy, use paid inference, add production secrets, or perform testnet or mainnet operations without that authorization.

## Active next task | IMPL-M04.1 Phase 3 end-to-end UX acceptance

Preserve checkpoint CONTRA-2026-11-03-IMPL-M04.1-P2. Make browser tooling portable, then verify account connection, case selection, all tabs, search, pagination, dialogs, Back, Escape, focus restoration, stale and unavailable states, permission errors, keyboard navigation, reduced motion, 125 and 200 percent zoom, 320px effective width, chart semantics and contrast. Reuse the retained genuine Sandbox cases for complete unchallenged and challenged workflow evidence, rerun relevant financial and service regression gates, and update AC01-AC33 only where new evidence satisfies the frozen text. Produce final screenshots, browser and accessibility reports, and an unresolved-issues register for explicit owner visual acceptance. Do not deploy, use paid inference, add production secrets, or perform testnet or mainnet operations.

## Active next task | IMPL-M04.1 Phase 2 radar and interface refinement

Preserve checkpoint CONTRA-2026-11-03-IMPL-M04.1-P1. Correct the full-coverage radar so rings, spokes and eight sector boundaries remain distinct, implement responsive device-pixel-ratio rendering, and capture zero, partial and full coverage close-ups. Refine exact NEAR amount disclosure, compact case identity, human-readable status text, completed review-window state, materials, reviewer details and event history using genuine case records. Preserve the approved 1200 hierarchy, neutral avatars, UX3C invariants and Phase 1 responsive matrix. Pass the Phase 2 visual and information-accuracy gate before Phase 3. Do not deploy, use paid inference, add production secrets, or perform testnet or mainnet operations.

## Active next task | External authorization and acceptance gates

Preserve checkpoint CONTRA-2026-11-03-IMPL-M04. Owner reviews the three populated local screenshots and gives explicit visual acceptance or precise corrections. AC31 and AC32 cannot pass their frozen exact scope until the owner separately authorizes testnet deployment and live provider use, credits and pricing are reverified, six genuinely independently controlled reviewer operators are available, and actual provider/testnet records reproduce both journeys. Remaining partial checks include browser Back/focus restoration, external wallet rejection/redirect, injected index lag, full pagination/case-switch matrices and 320px at 200 percent screen-reader review. Do not perform testnet, paid inference, production-secret or mainnet work without authorization.

## Active next task | IMPL-M04 integrated local journeys and acceptance

Preserve checkpoint CONTRA-2026-11-03-IMPL-M04-R01. On the compatible WSL host, execute two complete API-backed local Sandbox journeys using structured evidence and persisted transaction records: one unchallenged callback-confirmed settlement and one criterion-bound challenge with a decisive fresh reversal and correct settlement. Save receipt and evidence linkage, balances, final states and screenshots from real populated cases. Then run desktop/mobile accessibility and navigation checks, evaluate AC01-AC33 individually, correct README badges and environment/visibility statements, and update all five logs. Do not enable testnet or paid inference.

## Active next task | IMPL-M04 reviewer and evaluator operations

Preserve checkpoint CONTRA-2026-11-03-IMPL-M04-W01. Complete reviewer disclosure manifests, registry and frozen committee inspection, explicit common-control warnings, independent commit/reveal packages, challenge and fresh-review operations. Complete Meta primary/fresh, Baseten adversarial and Modal verifier response normalization with non-billable fixtures for citations, prompt injection, idempotency and all cost gates. Do not claim Sandbox accounts controlled by this process are independent. Do not enable paid calls.

## Active next task | IMPL-M04 wallet and receipt reconciliation

Preserve checkpoint CONTRA-2026-11-03-IMPL-M04-E01. Implement durable transaction states for preparing, awaiting signature, broadcast, pending, confirmed, failed and unknown. Persist transaction hashes and receipt observations, reconcile safe reloads, expose source block and fetch timestamps on chain reads, detect stale snapshots and keep UNKNOWN payout attempts locked. Verify local Sandbox signing and recovery without enabling external testnet transactions. Then continue reviewer disclosure and fixture-only provider integration.

## Active next task | Priority 2 functional integration

P0 financial verification passed on November 3, 2026. Continue with structured per-criterion evidence manifests and content-addressed artifacts, wallet reconciliation and transaction freshness, independently controlled reviewer operations, provider adapters within the approved Meta $3, Baseten $3 and Modal $5 envelopes, and two complete local case-to-settlement journeys. One journey must settle an unchallenged agreement. The second must confirm a challenge and reach a different fresh-review verdict before settlement.

Keep AC01-AC33 acceptance evidence explicit and separate. Do not claim local reviewer accounts are independent operators. No testnet deployment, paid provider call, production secret or mainnet operation is authorized. Preserve UNKNOWN payout locks, UX3A geometry, The Bench naming and the immutable design reference.

Older task sections below are historical and superseded where inconsistent.

## Active next task | IMPL-M02

On a Linux x86_64 host allowing 65535 open files, run node scripts/setup-sandbox.mjs, node scripts/build-contracts.mjs and npm run test:sandbox. Fix real Wasm/runtime failures; prove native balance deltas, SR05 successful-transfer/failed-callback lock, verified-failure liquidity timing, concurrent-case conservation and worst-case gas/storage. Current host cannot run Sandbox; source/services/UI are saved without financial acceptance. Then finish structured per-criterion manifests, external wallet redirects, source block/timestamp envelopes and independently controlled reviewer/provider integration. Testnet deployment, paid usage and production secrets still need separate authorization. If financial proof is still outstanding November 1, it is the first event-window engineering task; record only new changes as event-window work.

## Active task - October 28 owner authorization (supersedes former date gate)

Continue IMPL-M03 from the compatible Ubuntu Sandbox host. Rerun the complete corrected Sandbox suite, then expand it to the full 18-category financial matrix. Prioritize failed-transfer callback combinations, SR05, duplicate and concurrent finalization, multi-case reserve conservation, deadline boundaries, overflow, wrong-intent callbacks, and worst-case storage and gas. Save structured receipts, exact balance deltas, environment metadata and gas totals. Do not accept AC01-AC33, deploy testnet or use paid providers until all required evidence is verified. Approved UX3A remains frozen and the product name remains The Bench.

Checkpoint: CONTRA-2026-10-28-UX3C
Date: 2026-10-28
Starting baseline: plan/ux3b, af0dd97558f134ac9269c7fb58cc7613df6b8202
Work branch: plan/ux3c
Approved design: bee5a7481d56c86d4c9860280b8367f82af0cb5a, unchanged

## Current next task

On or after November 1, 2026 UTC, create fresh contracts/adjudication source and a sandbox harness. Pin Rust/SDK/toolchain and implement storage reserves/accounting, immutable creation identity/terms, beneficiary acceptance, creator-only cancel, exact funding, single payout intent, private callback and verified-failure-only retry. Prove I1/I2/I3/I10 using the v1 acceptance plan, especially SR05 successful transfer plus failed callback and SR06 failed transfer plus failed callback. No second transfer from unknown outcome. A harness-only decision fixture may reach settlement for tests, but no production verdict bypass may be exported.

Then integrate frozen committee/reviewer adjudication and evidence/provider services, followed by the approved frontend visual system. Do not implement submission code before November 1. Pre-event design remains separate and cannot be imported as eligible implementation. No deployment, secrets, paid models or mainnet actions are authorized here. Preserve Meta $3, Baseten $3, Modal $5 caps and no unauthorized cash spending.

## Mandatory resume references

STATUS.md, DECISIONS.md, CHANGELOG.md, this file; docs/CONTRACT_ABI_V1.md and its five companion v1 documents; amended UX3B map and AC01-AC33. G01-G07 are RESOLVED AT SPECIFICATION LEVEL, not implemented/proven. Exact gas/storage budgets are frozen assumptions that must pass worst-case sandbox measurement before funding. Unknown payout recovery is deliberately absent, not an open permission to invent a manual workaround.

Registry/operator evidence, separately controlled six-member availability, credit verification, key-control disclosure and testnet deployment authorization remain launch gates. Documented residual fairness/liveness risks remain. Keep design/ux3a and reference assets frozen.

## Historical NEXT record

# Next execution task

Task ID: CONTRA-PREP-UX3B
Current checkpoint: CONTRA-2026-10-28-UX3B
Date: 2026-10-28
UX3A owner acceptance: APPROVED, frozen at bee5a7481d56c86d4c9860280b8367f82af0cb5a.
UX3B: Integration map and engineering acceptance criteria delivered; implementation not expanded.

## Resume sequence

Read STATUS.md, DECISIONS.md, CHANGELOG.md, this file, docs/UX3B_FUNCTIONAL_INTEGRATION_MAP.md, docs/UX3B_ENGINEERING_ACCEPTANCE.md, then docs/PROTOCOL.md and docs/ARCHITECTURE.md. The UX3B owner direction supersedes older graph-first composition instructions and prior approval-pending statements.

## Precise next task

Resolve and pin G01-G07 in a versioned ABI/state/committee/recovery specification and shared commitment vectors. Do not invent completed interfaces. Before November 1, 2026 UTC, keep work to planning/design; eligible code must be freshly authored in separate apps/web, contracts/adjudication and service directories during the eligible window. Do not import the pre-event runnable study as competition implementation.

The first eligible engineering slice is create/fund and callback-safe payout/refund sandbox safety, then authorized testnet proof. Follow with evidence, primary/adversarial evaluation, authenticated reviewer commit/reveal, confirmed challenge, fresh review and callback-confirmed settlement. Use AC01-AC33 as release gates. Deliver both AC31 unchallenged and AC32 challenged case-to-settlement evidence before unrelated features.

Keep approved design/ux3a unchanged. Map functional navigation/drawers/workflow screens through the integration specification, preserving desktop composition. Every live field must identify source/freshness, unknowns stay unknown and service failure must not silently fall back to fixture values. Contract and provider integrations currently remain unavailable. No deployment, secrets, paid calls or mainnet actions are authorized by this checkpoint.

## Historical NEXT record (superseded)

# Next execution task

Task ID: CONTRA-PREP-UX-02
Current checkpoint: CONTRA-2026-10-28-UX2C
Timing: Complete before November 1, 2026
Objective: Begin a new product redesign brief from the preserved repository baseline.

## Start here

1. Preserve UX2B and UX2C screenshots and logs as historical evidence.
2. Define the redesign scope and acceptance criteria with the owner without reopening protocol safety decisions.
3. Produce the new visual direction in code and verify it at the required breakpoints.
4. Do not deploy, consume paid APIs or begin smart contract implementation before the applicable authorization and timing gates.

## Constraints

- Pre-November 1 artifacts are design-only, not hackathon product implementation.
- No live model calls, GPU execution, API spend or blockchain transactions are required for visual acceptance.
- Preserve NEAR testnet escrow state machine, pending-transfer callbacks and financial safety requirements.
- Maintain zero unauthorized out-of-pocket spending.
- GitHub owner identity is `kellyxy110`. Remote repository name and URL remain unassigned.

## First November 1 engineering task

Initialize the chosen repository and Rust NEAR contract; write case creation, funding and callback-safe settlement sandbox tests. Then implement the approved graph-first UI from the accepted design.

## Handoff v1.2 clarification

Agent starts from `HANDOFF_TO_CODING_AGENT.md`. SHA-256 verify original image before starting, and after any package/build changes. Do not edit the source image even to apply NEAR colors. NEAR color adaptation belongs exclusively to the new coded UI. Keep every feature tied to actual case state or a clearly marked fixture. Deliver a high-fidelity working design study for owner acceptance before claiming the UI is ready.


## Current task supersession | UX3A

The owner's 2026-10-28 UX3A instruction supplies the dashboard composition and overrides the earlier graph-first layout for this design study. The contract blueprint, safety requirements, historical study and event timing gate remain intact. Review project/artifacts/ux3a/comparison.jpg and design/ux3a/index.html. Owner approval has not been given. Resolve remaining fidelity concerns before freezing the screen as accepted.

