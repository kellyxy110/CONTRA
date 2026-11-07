# Decision ledger

## D-068 | CI checks are clean, risk-based and historically explicit | 2026-11-07

ACCEPTED: use GitHub-hosted Ubuntu 24.04, exact Node 26.13.0, lockfiles and action commit pins. Cache package downloads only, never installed platform binaries. Require core and security checks for every integration pull request; additionally require contract, Sandbox integration and full P0 according to affected paths and financial risk. Keep the complete F01 through F18 gate off documentation-only and unrelated changes. Treat retrospective evidence review as a current integrity check against exact historical product SHAs, never as proof that Actions ran during M03, M04 or M05. Preserve both the historical M05 Wasm hash and the rustfmt-normalized CI build hash while enforcing exact production and fault-only exports. Do not merge `main`, enable automatic merge or weaken a failed assertion without owner authority.

## D-067 | Linux P0 wallet builds use isolated native dependencies | 2026-11-07

ACCEPTED: when the P0 runner executes on Linux, install wallet build dependencies in a temporary Linux-native directory and never reuse the Windows `node_modules` tree. Preserve the original cross-platform failure transcript and require the same strict P0 predicate after reconciliation. A platform repair cannot override a failed financial category, missing receipt, missing balance observation, gas violation or failed Sandbox process.

## D-066 | Compatible Ubuntu is the verified local Sandbox host | 2026-11-07

ACCEPTED: use the installed `Ubuntu` WSL distribution for reproducible local Sandbox execution because it satisfies the pinned binary's GLIBC and process requirements. Keep the Windows and Ubuntu-22.04 pre-launch failures as diagnostic evidence. A successful local journey run does not imply testnet readiness, external signer control or reviewer independence.

## D-065 | Rate controls and backup boundaries are explicit | 2026-11-07

ACCEPTED: bound authentication challenges, signature verification, artifact writes, evaluator requests and transaction dispatch by remote address or authenticated account. A configured public origin overrides Host-based same-origin inference. Treat SQLite plus the content-addressed `objects` directory as one durable volume. Backups are offline, checkpointed, integrity-checked copies of the complete directory. Backup or restart never authorizes retry of an UNKNOWN operation.

## D-064 | Remove visual-only tooling only after dependency mapping | 2026-11-07

ACCEPTED: remove superseded standalone studies, capture wrappers and visual-only browser matrices from the active tree while preserving Git history, immutable references, financial evidence and functional browser coverage. Keep the UX3A styles, icons, font, texture and logo assets currently imported by the operational client. Do not turn design cleanup into a frontend rewrite during M05.

## D-063 | Live hackathon rules govern eligibility and tracks | 2026-11-07

ACCEPTED: treat the live `nearhackathon.com/HACKATHON.md` as the governing eligibility and submission source. Current Q-001 makes code since the 2026-10-19 announcement eligible. Preserve the factual 2026-10-28 CONTRA implementation start without relabelling history. Prioritize track `security` and include `open` as an additional applicable track. Recheck the live rules before submission, display the complete payload for owner approval and submit only once.

## D-062 | Runtime selection and persistence fail closed | 2026-11-07

ACCEPTED: application startup must explicitly select `unavailable`, `sandbox` or `testnet`. Testnet startup validates URL, network identity, node synchronization, contract account, deployed code and finalized block access before serving. Durable state uses versioned SQLite plus content-addressed files with integrity checks. Any interrupted nonterminal operation becomes `UNKNOWN` on restart and cannot be presented as confirmed or blindly retried.

## D-061 | M05 through M07 product completion supersedes active visual gates | 2026-11-07

ACCEPTED: suspend UI polish, radar refinement, screenshot comparison and demo production. Preserve completed M03 and M04 evidence and the minimal operational frontend. Complete runtime, persistence, authentication, wallet, reviewer, provider and full agreement-to-settlement verification first. Owner visual acceptance is deferred and is no longer the active next task. Testnet deployment, signing, paid provider usage and production-secret changes remain separately gated.

## D-060 | M04.3 local browser gate complete with owner acceptance separate | 2026-11-04

ACCEPTED: complete the M04.3 local engineering gate because all three phases pass sequentially, actual rendered screenshots were inspected, three browser engines pass the full viewport matrix, and both real local Sandbox journeys still settle correctly. Keep owner visual acceptance and manual screen-reader review as separate open gates. Keep AC31 and AC32 blocked until their frozen testnet and live-provider requirements are separately authorized and proven. A local controlled six-account run is not reviewer independence evidence.

## D-059 | Radar status and lens semantics are explicit | 2026-11-04

ACCEPTED: measured zero is a valid `0%` with a nonzero denominator. `N/A` means the measurement does not apply, `Locked` means protected records require participant authorization, `Unavailable` means retrieval failed, and `Missing` means an expected record was not returned. None of these non-measured states may render as measured zero. Criteria, Evidence and Overall are scoped lenses, not cosmetic tabs: Criteria covers acceptance records, Evidence covers adjudication readiness and Overall covers all eight lifecycle sectors. Each rendered metric retains exact numerator, denominator, source, status and observation time. Coverage remains separate from model confidence, evidence truthfulness and settlement authority.

## D-058 | Primary desktop workspace must fit the visible short viewport | 2026-11-04

ACCEPTED: the Overview at 1536 x 676 must fit case summary, progress, complete radar, primary actions and navigation inside the visible viewport without document or independent column scrolling. Extended reviewer lists, evidence records and event history belong in their stable workspaces; Overview may show compact sourced summaries and direct links. Use flexible desktop grid rows rather than cumulative fixed minimum heights. Preserve the three-column identity and 1200 x 900 visual system, but viewport usability takes precedence over the historical 810px minimum-height dependency. This supersedes the M04.2 short-desktop document-scroll approach in D-055 while retaining its prohibition on three independent scrollbars.

## D-057 | Stable routed workspaces complete the M04.2 local frontend gate | 2026-11-03

ACCEPTED: major workflows use stable navigable views with direct hash routes and selected-case context. Dialogs remain for focused actions only. Complete the M04.2 local frontend gate because the sequential responsive, operational radar and end-to-end verification gates pass without changing UX3C protocol or P0 financial safeguards. Keep owner visual acceptance, manual assistive-technology review, external wallet behavior, authorized testnet execution, paid providers and genuinely independent reviewer operators as separate gates. Record Linux Chromium as blocked when its browser binary cannot be downloaded; do not infer a pass from Windows Chromium.

## D-056 | Radar progress requires operational records | 2026-11-03

ACCEPTED: configuration presence never counts as radar completion. Evidence requires retrievable source linkage per frozen criterion. Provenance requires retrievable source bytes plus origin, capture time and submitter. Review and quorum use the selected round's actual reveals. Finality uses completed decision, payout intent, callback observation and settlement milestones. Challenge is N/A without a confirmed challenge and otherwise tracks its fresh-review lifecycle. Keyboard fulfillment requires an independently recorded and verified FULFILLED evaluation. Criteria completion requires separate evidence and evaluation records. The three visual tabs may change lens labeling but cannot change operational truth. This supersedes the configuration-derived portions of D-053 while preserving its N/A, segmentation and non-authority rules.

## D-055 | One document scroll supersedes bounded desktop column scrolling | 2026-11-03

ACCEPTED: the owner rejected the three independently scrolling desktop columns introduced by D-052. Preserve the responsive column hierarchy but let the shell grow with content and assign short-screen vertical scrolling to the document. Do not set desktop `.left`, `.middle` or `.right` to `overflow-y:auto`, and do not reserve three scrollbar gutters. Retain intentional bounded scrolling only inside focused components such as dialogs or horizontal tab rails. Raise ordinary dashboard copy to a readable scale and verify both empty and genuine populated states at the owner-reported 1536 x 676 size. This decision supersedes only the bounded desktop column-scroll portion of D-052.

## D-054 | M04.1 local frontend gate complete with external acceptance separate | 2026-11-03

ACCEPTED: complete M04.1 at the local frontend scope because all three sequential gates pass against empty and genuine populated states, browser tooling is portable, the approved 1200 geometry is exact, responsive and radar acceptance matrices pass, and the complete local journeys remain valid. Keep owner visual acceptance, manual assistive-technology review, external wallet behavior, testnet cases, paid providers and independent reviewer operators separate. Do not convert the failed Cargo dependency-fetch attempt into a contract test result; preserve the accepted M03 evidence because no contract source changed. Record unresolved upstream NEAR Sandbox dependency audit findings without applying breaking downgrades that weaken the verified environment.

## D-053 | Radar coverage remains a sourced segmented measurement | 2026-11-03

ACCEPTED: render each radar sector from the existing numerator and denominator definitions, with separate low-opacity fills and persistent rings, spokes and boundaries. Denominator zero remains N/A and is never painted as measured zero. Full coverage may fill every sector only when the genuine case metrics are complete, but the chart grid must remain visually dominant enough to preserve segmentation. Canvas pixels follow the rendered size and device pixel ratio. Coverage remains descriptive UI state and never authorizes judgment or settlement.

## D-052 | Preserve 1200 geometry and adapt outside it | 2026-11-03

ACCEPTED: keep the approved 1200 x 900 UX3A shell geometry exact while allowing proportional desktop growth, bounded column scrolling on short screens, an ordered tablet flow and a full-width phone flow. On phones, preserve all navigation by placing the existing controls in a horizontally scrollable top rail instead of compressing content beside a 53px sidebar. Responsive acceptance requires both empty and genuine populated state checks, no page horizontal overflow or clipped sections, and 44px coarse-pointer targets. This is an implementation adaptation outside the frozen reference viewport, not a visual redesign.

## D-051 | M04 local integration complete, external acceptance gates remain | 2026-11-03

ACCEPTED: complete M04 Priority 2 at the authorized local scope because both required Sandbox journeys pass through the integrated API with structured evidence, authenticated reviewer operations, persisted transaction histories, exact balance deltas and callback-confirmed settlement. The challenged journey produces a different final verdict. Keep AC01-AC33 statuses separate: 20 PASS, 11 PARTIAL and 2 BLOCKED. Do not mark AC31 or AC32 passed because their frozen text requires authorized testnet and actual provider records. Do not claim the six local reviewer accounts are independent. Repository visibility is a verified public fact, not a setting changed by this milestone. Owner visual acceptance remains separate.

## D-050 | Reviewer control is disclosed separately from account count | 2026-11-03

ACCEPTED: reviewer registry records are joined to canonical disclosure artifacts only by their exact onchain digest. Stable operator identifiers derive from the declared controlling operator label, while each attestation binds account control, custody, procedure, conflicts, sources and limitations. Account count or distinct fixture operator values are not evidence of independent control. Local Sandbox signers remain explicitly disclosed as one-process fixtures. Provider outputs remain proposed findings and cannot register reviewers, sign votes, determine contract finality or authorize settlement.

## D-049 | Persist transaction lifecycle and final-read provenance | 2026-11-03

ACCEPTED: every local signed operation records an ordered lifecycle from preparation through a terminal or unknown state. Operation ID and payload hash enforce idempotency; transaction hash and receipt remain linked to the initiating account. Reload reconciliation reads the durable server record. UNKNOWN remains locked and is never translated into failure or retry permission. Contract views used by The Bench carry finality, block identity and observation time so stale data can be disclosed. External testnet signing remains disabled without separate authorization.

## D-048 | Structured evidence manifests are append-only case records | 2026-11-03

ACCEPTED: `CONTRA_EVIDENCE_V1` is the Priority 2 evidence envelope. Every manifest covers each frozen criterion exactly once and cites one or more immutable source objects. Source bytes, media type, size, origin, capture time and submitting participant are digest-bound in canonical JSON. Access is limited to authenticated case participants. A correction creates a new digest and references an earlier manifest for the same case with a reason; it never replaces prior bytes. The Bench must distinguish stored records from the exact digest selected onchain. This evidence coverage is observable state, not a judgment or payout authority.

## D-047 | P0 financial gate complete, AC acceptance remains separate | 2026-11-03

The clean compatible-host `npm run test:p0` execution exited 0 with the nine-test baseline at 9/9 and F01-F18 at 18/18. Accept this as completion of the M03 P0 financial verification gate, supported by raw receipts, account snapshots, gas and storage measurements. Do not treat it as automatic AC01-AC33 acceptance, testnet authorization, independent reviewer proof or provider readiness. Preserve UNKNOWN payout locks and production/fault export separation. Priority 2 may begin under existing wallet, reviewer, provider, secret and spending restrictions. October 28 implementation remains pre-event; the F17 timeout correction and final verification are November 3 competition-window work.

## D-045 | M03 financial gate and execution evidence | 2026-10-29

The WSL Sandbox runs at c0800c8 supersede the old global M02 blocker; distinguish this session's local descriptor limit from project-wide capability. P0 completion requires the full corrected baseline, all eighteen named categories, actual receipts/balance observations, SDK exact-boundary/overflow proofs, measured callback gas and zero budget violations. Blocked, missing, duplicated or unexecuted tests cannot pass the gate. Fault-only probes are absent from production; no matching fabricated single payout result or UNKNOWN counter mutation is allowed. Do not advance Priority 2 integration or AC acceptance from unit/build success alone. Existing pre-event disclosure and financial/spending safeguards remain unchanged.

## D-046 | Neutral active avatars | 2026-10-29

Owner explicitly requested removal of hardcoded human photographs from active frontend. Use a neutral SVG with the approved NEAR palette and existing image dimensions. Preserve UX3A geometry, The Bench naming, original JPEG and frozen reference photographs unchanged. No design cycle or new product feature is introduced.

## D-043 - Preserve financial execution gate and truthful integration states

Accepted 2026-10-28: continue owner-authorized source implementation while Sandbox is blocked by the host hard descriptor limit. SDK tests, Wasm builds and browser geometry do not authorize financial acceptance. No alternate runtime result, fixture receipt or blind UNKNOWN payout retry may substitute for real Sandbox proof. Frontend source reuses frozen UX3A geometry/assets with disclosed October 28 pre-event provenance; reference files remain unchanged. Missing chain/service/per-criterion evidence is unavailable/N/A. External wallets and paid providers remain gated and unverified, with initial credit ceilings unchanged.

## D-042 - Owner authorizes October 28 implementation

Accepted 2026-10-28: remove the internal November 1 implementation restriction. Start actual engineering now against frozen UX3C and approved UX3A, retaining The Bench naming and historical records. All October 28 implementation is pre-event work. Sandbox only; testnet deployment, paid inference and production secrets still require separate authorization. Credit ceilings remain Meta $3, Baseten $3, Modal $5. SDK tests do not establish Sandbox financial correctness; UNKNOWN payouts remain non-retryable.

Use ACCEPTED, PROPOSED or BLOCKED as the status. Do not silently change an accepted decision. Supersede it by appending a new decision entry.

| ID | Status | Decision | Reason | Date |
| --- | --- | --- | --- | --- |
| D-001 | ACCEPTED | Project name: CONTRA | Short, adversarial, protocol-ready | 2026-10-27 |
| D-002 | ACCEPTED | Core thesis: adjudication via conventional NEAR contracts and offchain AI | Challenge architectural necessity of specialized AI blockchain | 2026-10-27 |
| D-003 | ACCEPTED | NEAR testnet first | Safe, demonstrable transactions | 2026-10-27 |
| D-004 | ACCEPTED | Dark-first palette: #00EC97, #0B1110, #16221D, #F5F7F5, #FF8678, #F4BD68 | Recognizable NEAR mint plus CONTRA challenge identity | 2026-10-27 |
| D-005 | ACCEPTED | Meta $10 credits; Baseten $10 credits; Modal $30 monthly | User-reported resource pools | 2026-10-27 |
| D-006 | ACCEPTED | Start with credit allocations $3 Meta, $3 Baseten, $5 Modal; no unauthorized cash spending | Conservative budget and headroom | 2026-10-27 |
| D-007 | ACCEPTED | Versioned logs and checkpoints required for every milestone | Prevent repeated decisions and context loss | 2026-10-27 |
| D-008 | ACCEPTED | Official submission deadline November 14, 2026 at 23:59 UTC, target November 13 | Leave margin for failed deploys and submission issues | 2026-10-27 |
| D-009 | PROPOSED | Single Rust escrow and adjudication contract for MVP | Reduce integration risk | 2026-10-27 |
| D-010 | PROPOSED | Permissioned three-reviewer pilot with quorum and one challenge review | Honest scoped security model | 2026-10-27 |
| D-011 | PROPOSED | One native NEAR escrow use case with no token issuance | Complete vertical slice | 2026-10-27 |
| D-012 | PROPOSED | Browser-first Judgment Room as signature screen | Makes evidence, disagreement and enforcement visible | 2026-10-27 |
| D-013 | PROPOSED | One challenge review round as the MVP appeal mechanism; further appeal tiers deferred | Maintain deadline realism | 2026-10-27 |
| D-014 | PROPOSED | Static recorded demo fixtures with a bounded live inference option | Demonstrate reliably at low cost | 2026-10-27 |

## Unresolved project governance

- GitHub owner identity is assigned to `kellyxy110`; remote repository name, URL and deployment identity remain unassigned.
- The hackathon accepts one submission per team. Confirm participation arrangements if multiple projects enter.
- Verify live credits, expiration dates, provider billing, and provider-side limits before making charged requests.

## New design reference decision | 2026-10-27

| ID | Status | Decision | Reason | Date |
| --- | --- | --- | --- | --- |
| D-015 | ACCEPTED | User-supplied `design/reference/control-ai-policy-dashboard.jpeg` is the exact visual composition reference for CONTRA. Use cinematic dark graph-first canvas; spatial root-to-leaf relations; low-glow curved links; compact top control bar; contextual right inspection rail; bottom-right assistant input. Recolor with approved NEAR mint, dark teal, coral and amber tokens. | Specific user-selected target supersedes generic dashboard wireframe | 2026-10-27 |
| D-016 | PROPOSED | Desktop case view uses a 66/34 graph-and-context split with responsive inspector drawer on mobile. The graph remains a real navigation and evidence inspection system, with text/list accessibility fallback. | Preserve the reference while preventing decorative, unreadable, or inaccessible workflow | 2026-10-27 |

The visual reference supersedes the layout guidance in `docs/UX.md` and the previous `design/judgment-room.html` **for aesthetic and layout direction only**. The original contract/escrow safety logic, states, palette, cost budget and hackathon schedule remain in force. No claim of visual fidelity or browser verification has been established for the legacy prototype.

## Reference asset preservation and agent handoff | 2026-10-27

| ID | Status | Decision | Reason | Date |
| --- | --- | --- | --- | --- |
| D-017 | ACCEPTED | Preserve exact user-uploaded reference image byte-for-byte; no crop, recolor, resize, re-encode, annotations or replacements | Owner explicitly forbade altering the image | 2026-10-27 |
| D-018 | ACCEPTED | Recreate the image's composition as actual interactive CONTRA UI with approved NEAR palette, never use static source as faux product | Respect visual fidelity and functional integrity simultaneously | 2026-10-27 |

D-017 clarifies D-015. Palette adaptations apply to the newly coded UI ONLY, not the original asset.

## Repository identity assignment | 2026-10-27

| ID | Status | Decision | Reason | Date |
| --- | --- | --- | --- | --- |
| D-019 | ACCEPTED | GitHub owner identity is `kellyxy110`. Remote repository name and URL remain unassigned. | Owner supplied the account during checkpoint CONTRA-2026-10-29-UX2 | 2026-10-27 |

## Visual verification record | 2026-10-28

| ID | Status | Decision | Reason | Date |
| --- | --- | --- | --- | --- |
| D-020 | ACCEPTED | UX2B browser artifacts and Playwright results are the verification record for the current design study. They do not constitute owner visual acceptance. | Separates measured browser behavior from the owner's approval decision | 2026-10-28 |

## UX2B owner verdict and UX2C recovery | 2026-10-28

| ID | Status | Decision | Reason | Date |
| --- | --- | --- | --- | --- |
| D-021 | ACCEPTED | UX2B is rejected for visual fidelity. Its 22 passing browser checks remain useful regression evidence only. | The sparse flowchart, oversized inspector, altered relationship rhythm and missing compact fan-out did not reproduce the approved reference | 2026-10-28 |
| D-022 | PROPOSED | UX2C is the corrected visual candidate for owner review. Do not treat it as accepted until the owner explicitly approves its fresh renders. | Visual acceptance is an owner gate, separate from functional verification | 2026-10-28 |

## Repository creation authorization | 2026-10-28

| ID | Status | Decision | Reason | Date |
| --- | --- | --- | --- | --- |
| D-023 | ACCEPTED | Create private GitHub repository `kellyxy110/CONTRA`, initialize the current workspace and push the redesign baseline. | Owner explicitly authorized repository creation | 2026-10-28 |
| D-024 | ACCEPTED | Product redesign will follow repository creation. UX2C remains historical visual evidence, not an accepted final design. | Owner rejected the current implementation and stated the product will be redesigned | 2026-10-28 |


## UX3A exact dashboard reference | 2026-10-28

| ID | Status | Decision | Reason | Date |
| --- | --- | --- | --- | --- |
| D-025 | ACCEPTED | Owner's new attached dashboard is the definitive UX3A composition. Preserve sidebar, three columns, sector radar, panels and cards. Only approved palette and CONTRA content may change. | Explicit UX3A owner instruction supersedes graph-first composition for this study | 2026-10-28 |
| D-026 | ACCEPTED | Preserve earlier references, functional blueprint and logs. New source lives at design/reference/IMG_7409.jpeg without replacing the graph reference. | Historical integrity | 2026-10-28 |
| D-027 | ACCEPTED | Owner approval is mandatory. Browser QA does not imply owner acceptance. | Explicit owner acceptance requirement | 2026-10-28 |

## UX3B owner approval and integration mapping | 2026-10-28

| ID | Status | Decision | Reason | Date |
| --- | --- | --- | --- | --- |
| D-028 | ACCEPTED | UX3A visual design is owner-approved and frozen at bee5a7481d56c86d4c9860280b8367f82af0cb5a. Preserve its sidebar, three-column layout, radar, cards, typography and NEAR colors. | Explicit owner statement in UX3B request supersedes pending approval records | 2026-10-28 |
| D-029 | ACCEPTED | UX3B first delivers functional integration map and engineering acceptance criteria before implementation expands. Complete case-to-settlement journey takes priority; navigation, drawers and workflow screens use frozen visual system. | Explicit owner scope | 2026-10-28 |
| D-030 | ACCEPTED | Protocol UI must distinguish local/service work, AI proposed findings, contract provisional/challenged states and callback-confirmed settlement. Replace fixtures only as verified live sources become available. | Truthful state requirement | 2026-10-28 |
| D-031 | PROPOSED | Resolve G01-G07 in the UX3B map: cancellation ABI, committee assignment, refund-state normalization, creation idempotency/events, serialization/deposits, operator independence and callback reconciliation. | Exposes blueprint gaps before dependent implementation without silently changing protocol | 2026-10-28 |

Pre-event design remains separate from eligible-window implementation. No new spending, deployment, secrets or mainnet authorization. API routes and ABI refinements in UX3B are proposals, not deployed interfaces.

## UX3C definitive protocol freeze | 2026-10-28

Status ACCEPTED below records engineering decisions finalized under the owner's explicit UX3C instruction, not a claim of deployed/tested code or a new independent security approval. D-031's alternatives are resolved/superseded by this freeze.

| ID | Status | Definitive decision | Engineering test obligation |
| --- | --- | --- | --- |
| D-032 | ACCEPTED | G01: creator-only cancel_case in Draft, rejects after funding; beneficiary must accept immutable terms digest before exact funding | ST01/ST08, AC07/23 |
| D-033 | ACCEPTED | G02: owner-attested and reviewer-confirmed registry; deterministic six eligible distinct declared operators, fixed 3+3, 2-of-3, no funded replacements; insufficient six rejects funding | CM01-CM07, AC12-14/17/18 |
| D-034 | ACCEPTED | G03: one canonical payout pipeline, no RefundPending; original unresolved -> base creator refund; fresh inconclusive retains primary decisive verdict; decisive fresh result can overturn | ST02-ST08, AC13/16-19 |
| D-035 | ACCEPTED | G04: creator/request identity persists; immutable Borsh terms digest; exact payload idempotency and successful finalized-receipt typed event streams; immutable creator allowlist for sponsor-funded pilot admission | ID01-ID05/ABI01, AC04-07/24/25/28 |
| D-036 | ACCEPTED | G05: ABI v1 public/private method/type/deposit/serialization/gas policy and domain-separated SHA-256 with shared vote, bundle, creation, terms and intent vectors frozen in six v1 documents | ABI01-ABI04/CV01-CV08, AC05/12/13/33 |
| D-037 | ACCEPTED | G06: declared operator identities/control disclosures, account confirmations and operator-disjoint fresh review; permissioned pilot is not Sybil-proof or independently decentralized by account count | CM01-CM08, AC10/14/26/29 |
| D-038 | ACCEPTED | G07: unique immutable intent/recipient/amount, directly linked self-only native-transfer callback, retry only authentic Failed result; no unknown-outcome recovery or unsafe retry in MVP | SR01-SR13, AC19-22/24 |
| D-039 | ACCEPTED | Challenge abuse: only losing party, one criterion-bound challenge, fixed preselected fresh jury/deadline and KEEP_PRIMARY_V1 on inconclusive fresh review; no new token/bond. Explicitly supersedes fresh-unresolved automatic refund interpretation | ST05/ST06, AC16-18/32 |
| D-040 | ACCEPTED | I7 bounds adjudication, not payment under callback uncertainty; I10 recovery is verified-failure only. Callback-unknown may strand payment state/funds indefinitely; I2 never bypassed by admin/manual retry | SR05/SR06/SR08, AC22 |

All tests above are specifications and NOT RUN in contract. State/method authority is docs/CONTRACT_ABI_V1.md and its linked v1 companions. Credit limits, separate pre-event design and November 1 source-eligibility boundary remain unchanged. No owner-facing visual redesign or new spending/deployment authorization.

## Product naming update | 2026-10-28

| ID | Status | Decision | Reason | Date |
| --- | --- | --- | --- | --- |
| D-041 | ACCEPTED | Rename the active product surface from Judgment Room to The Bench in frontend title/header, active navigation references and product documentation. The name-only substitution is explicitly authorized within the UX3A freeze; all layout, typography, colors, components and assets remain unchanged. | Explicit owner naming instruction | 2026-10-28 |

Historical log entries, archived design prototype paths and protocol method names remain unchanged. Earlier product-name references in historical logs describe their original checkpoints. UX3C remains the active protocol checkpoint; G01-G07 decisions, first November 1 Rust/sandbox milestone, credit limits and execution boundaries are unchanged. No redesign or additional feature is authorized by this naming update.

## IMPL-M03 Sandbox execution | 2026-10-29

| ID | Status | Decision | Reason | Date |
| --- | --- | --- | --- | --- |
| D-043 | ACCEPTED | Pin the implementation toolchain to Rust 1.98.0. | The prior 1.99.1 channel did not provide Cargo in the execution environment, while current NEAR dependencies require Rust 1.95 or newer. Rust 1.98.0 builds and passes all 20 contract tests. | 2026-10-29 |
| D-044 | ACCEPTED | Sandbox deadline tests use 610-second intervals and bounded, timestamp-checked block advancement. | Protocol validation requires at least 600 seconds. Directly converting seconds to block counts caused deadline overshoot, and large single jumps caused expired transaction hashes. | 2026-10-29 |

