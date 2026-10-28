# Decision ledger

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

