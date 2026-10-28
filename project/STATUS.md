# CONTRA status checkpoint

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

