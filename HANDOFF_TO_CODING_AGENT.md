# CONTRA agent handoff: blueprint and exact reference integration

## Current owner authorization - 2026-10-28 implementation

The owner has removed the internal November 1 coding gate. Implement now on implementation/oct28 using frozen UX3C and UX3A, with The Bench naming. October 28 code is pre-event and must be disclosed. Sandbox is authorized; testnet deployment, paid usage and production secrets still need separate authorization. Earlier date restrictions below are preserved history and no longer govern implementation. See project/STATUS.md and docs/IMPLEMENTATION_OCT28.md for actual tests and blockers. Never retry an UNKNOWN payout.

## Authoritative protocol handoff | UX3C

Checkpoint CONTRA-2026-10-28-UX3C freezes G01-G07 at specification level. Start with docs/CONTRACT_ABI_V1.md and its five linked v1 companions, then the amended UX3B acceptance map. Earlier conceptual ABI/fallback/recovery and graph-first design instructions below are historical. UX3A stays approved/frozen at bee5a7481d56c86d4c9860280b8367f82af0cb5a. Implementation begins October 28 by explicit owner authorization. Testnet deployment, production secrets and paid calls remain separately gated. The immediate task is Rust escrow/accounting and Sandbox financial-invariant proof including successful transfer with failed callback; NEVER retry an unknown transfer. New code is separate from pre-event design. Registry trust, buyer-favored base fallback, retained wrong-primary risk and stranded-unknown payout limitation must be disclosed. No claim of executed contract tests or safe mainnet readiness.


## Current owner direction | UX3B, 2026-10-28

UX3A is APPROVED and FROZEN at bee5a7481d56c86d4c9860280b8367f82af0cb5a. The approved sidebar/three-column dashboard, radar, cards, typography and NEAR colors supersede the older graph-first composition instructions below. Preserve design/ux3a and all original references unchanged. Read docs/UX3B_FUNCTIONAL_INTEGRATION_MAP.md and docs/UX3B_ENGINEERING_ACCEPTANCE.md before new engineering. UX3B delivers planning only, not implementation expansion. Keep contract/protocol invariants; the former date gate is removed by the October 28 authorization. Historical text below is preserved; earlier approval-pending and composition statements are superseded by this explicit owner direction.


**Handoff ID:** CONTRA-HO-2026-10-27-V12  
**Project checkpoint:** CONTRA-2026-10-27-VH1  
**Status:** Blueprint handoff prepared. Source visual approved. New visual prototype NOT built or accepted. Contract NOT built.  
**Target platform:** NEAR testnet  
**Hackathon build window:** November 1 through November 14, 2026, 23:59 UTC  
**Internal target:** Submit November 13, 2026

## Your mission

Build CONTRA as a NEAR-native adjudication proof of concept. Conventional NEAR Rust contracts must coordinate escrow, reviewer authentication, votes, disputes, deadlines, appeals and settlement. Independent offchain evaluators generate evidence-bound judgments that can be falsified or challenged. Our research question is whether useful decentralized AI adjudication requires a specialized AI blockchain. Do not assert that this prototype matches GenLayer's full security model.

**Immediate priority:** Turn the owner's exact accepted screenshot into a faithful, functional graph-first CONTRA The Bench design, while preserving the supplied image with ZERO modifications. Then use the accepted design as the November 1 engineering reference.

## Mandatory first reads

1. `AGENTS.md`
2. `project/STATUS.md`
3. `project/DECISIONS.md`
4. `project/CHANGELOG.md`
5. `project/NEXT.md`
6. `docs/VISUAL_DIRECTION.md` and `docs/VISUAL_INTEGRATION_SPEC.md`
7. `docs/PRD.md`, `docs/PROTOCOL.md`, `docs/UX.md`, `docs/ARCHITECTURE.md`, `docs/BENCHMARKS.md`
8. `design/reference/control-ai-policy-dashboard.jpeg` (the actual source image)

Do not reopen accepted naming, thesis, palette, visual direction, spending allocations or milestone dates. If you find a concrete contradiction, log a new proposed decision instead of silently rewriting an accepted one.

## Absolute source-image preservation rule

- The file `design/reference/control-ai-policy-dashboard.jpeg` is the **exact user-uploaded image**. Copy and store it unchanged. Do not crop, resize, recompress, recolor, filter, redraw, annotate, overlay, enhance, denoise, generate a substitute, or edit its bytes in any way.
- Original format: JPEG, 1200 x 900 pixels. Original SHA-256: `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`.
- Before and after any branch, packaging or handoff, check `sha256sum design/reference/control-ai-policy-dashboard.jpeg` against that checksum. A mismatch is an immediate failure. Do not commit a changed image.
- The source screenshot is an immutable **design reference**, not a substitute for live product UI. Render the visual components as new code, using true CONTRA data and the approved NEAR palette. Do not embed the screenshot as a fake product screen or use it to conceal nonfunctional interactions.
- For side-by-side QA, show the source image in its original 4:3 aspect ratio with `object-fit: contain` and no color effects. Preserve the file unchanged even when the browser scales it for display.

## Exact design mapping

The accepted reference is a 1200 x 900 dark cinematic control dashboard. Preserve its visible design grammar, composition and visual density as closely as feasible in a working interface:

| Source position | CONTRA implementation | Faithfulness requirement |
| --- | --- | --- |
| Top-left tiny icon, brand and hamburger | CONTRA mark, menu, `Built on NEAR` ecosystem attribution | Small, unobtrusive top bar, no bulky header |
| Top-center floating controls | Graph/list toggle, zoom, fit, evidence filters, layout and search | Compact dark buttons with fine borders, subtle focus and real interactions |
| Main left/center canvas | Root agreement node with category nodes for criteria, evidence, reviewers, challenges and settlement | Broad open negative space, fine curved luminous links, small precise nodes |
| Source's highlighted category card | Currently selected evidence or review cluster | Warm/mint perimeter glow, one clear selection, not a wall of cards |
| Right-top context label | Case identifier, status, round and NEAR network | Single compact contextual title |
| Tall right-side card | Selected-node evidence/protocol inspector | Same spatial weight, corner treatment, hierarchy and stacked facts |
| Dark KPI tiles | Locked testnet escrow, evidence count, reviewer quorum, challenge deadline | No unverified figures or generic business KPIs |
| Lower right insight section | Contradiction details, evidence citations and independent reviewer findings | Source-linked and visibly provisional until resolved |
| Bottom-right prompt | Evidence-grounded case assistant / command input | Disable live inference by default, no unbounded spending |

**Approximate desktop proportions at 1200 x 900:** graph canvas starts at the left edge and uses about 65% of the width; right context rail occupies about 33%, beginning around x=800 and y=120; first graph/root node sits roughly 12% from the left and 50% down; middle grouping near x=300 to 440; linked leaf column around x=630 to 730; assistant dock near bottom right. The screenshot is the authority for the exact visual balance, not these approximate coordinates.

**The screenshot itself retains its original colors.** Rebuild the product *in code* with approved CONTRA/NEAR tokens: `#00EC97` mint, `#0B1110` obsidian, `#16221D` deep slate, `#F5F7F5` soft white, `#FF8678` challenge coral, `#F4BD68` pending amber. Keep highlights restrained and reserve coral for actual disputes. No gratuitous gradients or generic SaaS card walls.

## Functionality must follow the visual graph

The graph is a real evidence/provenance explorer. Edges represent explicitly typed relationships, not decoration. Clicking or keyboard-selecting any graph item updates the right inspector and the active path. Support graph zoom, fit, evidence type filters, search, switch to accessible list view, and opening original evidence or verified NEAR receipt links when available. All controls must work; if a feature is deferred, remove the control rather than leaving a false affordance.

Case concepts must map correctly: `Agreement -> acceptance criterion -> evidence artifact -> evaluator finding -> objection/challenge -> fresh review -> final settlement`. Do not imply a model's assertion means the case has settled. Show distinct statuses `AI proposed`, `reviewer accepted`, `challenged`, `unresolved`, `transfer pending`, `settled`, and `transfer failed`.

For mobile, preserve the composition's identity using a compact graph, accessible case list and a collapsible bottom-sheet inspector. Keep operation-critical information available at 320px width and 200% text zoom. Ensure keyboard controls, visible focus, reduced-motion mode, and WCAG-conscious contrast. Do not rely on green/red color alone.

## Product blueprint and security gates

The MVP is one complete, NEAR-testnet-native escrow case: creator freezes requirements and funds agreement, submitter adds evidence digest, authorized reviewers commit and reveal, provisional judgment triggers a challenge window, independent review can overturn it, and contract settles or refunds only after proper finality. NEAR asynchronous transfers require a verified callback and idempotent recovery; record `SettlementPending` before transferring, and `Settled` only after success.

The AI workers use Meta for primary evaluation, Baseten for an adversarial second model, and Modal for short-lived verification tasks, subject to actual credit eligibility and verified provider limits. Initial allocations are Meta $3, Baseten $3, Modal $5 out of user-reported $10, $10 and $30 monthly allowances. No unapproved cash spending; no always-on GPUs. Use a server-side budget governor with provider allowlists, token caps, timeouts, idempotency, atomic budget reservations, a persistent usage ledger and fail-closed refusal after budget depletion. An application cap does not replace a provider-side billing hard stop.

Do not confuse multiple reviewer accounts controlled by the same operator with independent validators. No mainnet funds, native token issuance, unsupported claims of security equivalence, or fabricated test/deployment badges.

## Timeline and execution sequence

**October 28 onward: Owner-authorized implementation.** Build the working escrow, reviewer, service and frontend product against UX3C and approved UX3A. Label all pre-November-1 code as pre-event work. Deliver tests and screenshots without claiming unavailable Sandbox proof. Never edit the original screenshot.

**Nov 1-2: Contract thin slice.** Create Rust `near-sdk` case/fund/refund/release scaffolding, sandbox tests for funded amounts, authorization, async payout callback failures and duplicate attempts; NEAR testnet transaction proof.

**Nov 3-4: Reviewer protocol.** Commit/reveal with domain-separated hashes, quorum, deadlines, authenticated reviewers and tamper-resistant evidence commitments.

**Nov 5-6: AI + evidence.** Credit-bounded Meta/Baseten integration, Modal verifier and evidence manifests. One real proposed finding and a reproducible counterexample.

**Nov 7-8: Challenge + settlement.** Complete one challenged case with re-review and contract-enforced testnet settlement. This is the essential hackathon demo.

**Nov 9-10: UI integration.** Connect the accepted graph-first interface to real case views, signed wallet actions and transaction receipts. Ensure simulated and onchain states are never confused.

**Nov 11-12: Security and measured evaluation.** Test adversarial evidence, replay attacks, timeouts, callback failures and recorded benchmark subsets; freeze features on Nov 12.

**Nov 13: Submission.** Publish reproducible repo, truthful badges, short screen recording, X demo and official form. Official close is Nov 14 at 23:59 UTC.

If a milestone slips, cut feature scope, not escrow correctness. The assistant box, animated camera polish and complex graph layouts are secondary to a complete adjudication and settlement flow.

## Required deliverables for the next agent checkpoint

1. A visually faithful desktop CONTRA The Bench with real graph selection and dynamic inspector, implemented as a working product beginning October 28, with pre-event source provenance disclosed.
2. A mobile alternative, accessible list fallback and working toolbar interactions.
3. Source-vs-implementation visual review at 1200 x 900 and two additional responsive sizes. Report layout divergence honestly.
4. Screenshots or a recording of the working prototype. Do not substitute a static image as evidence of functionality.
5. Updated `project/STATUS.md`, `project/CHANGELOG.md`, `project/NEXT.md`, and a new entry in `project/SESSION_LOG.md` stating what was tested, what passed and what's blocked.
6. The original, untouched JPEG still present and SHA-256 verified.

## Definition of done for visual checkpoint

The source screenshot is unchanged by hash; key regions preserve reference proportions; original structure is translated into CONTRA data without the unrelated source policy content; core graph controls work; right inspector follows actual selection; challenge status has accurate contract semantics; responsive and keyboard flows pass; live model spend remains $0 for visual work; owner has explicitly accepted the visual result. Do not mark acceptance on the owner's behalf.

## Agent response format

At the end of the task, report exactly:

- Checkpoint ID and commit hash/branch if any
- What was actually built, not planned
- Reference image checksum verification
- Files added or edited
- Tests executed with results and screenshots/previews
- NEAR transaction IDs, if actually executed
- Actual provider credit usage (or zero)
- Remaining blockers
- One precise next action

Avoid em dash characters in code, copy, documentation, metadata and commits. Preserve all verified existing decisions and logs. Never fabricate results or imply deployment succeeded unless it did.


## Repository identity
The owner assigned GitHub account `kellyxy110` and authorized creation of private repository `CONTRA` on 2026-10-28. Do not set repository secrets or deploy until separately approved.
