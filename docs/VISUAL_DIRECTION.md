# CONTRA Visual Direction v1.1

Status: User-selected reference accepted; visual implementation pending
Reference: `design/reference/control-ai-policy-dashboard.jpeg` (user-uploaded screenshot, stored for internal visual reference only)
Decision ID: D-015

## Non-negotiable layout anatomy

1. **Atmospheric full-viewport charcoal/near-black background** with dim deep-teal ambient lighting, restrained grain/depth, and no bright app shell.
2. **Wide graph canvas** consuming approximately two thirds of desktop viewport; primary agreement root anchored left, clustered criterion/evidence nodes near center, downstream reviewer and challenge outcome branches extending right.
3. **Thin, animated-on-change cubic connectors**, varied opacity and soft luminous junctions. Avoid permanently moving decorative animation; respect `prefers-reduced-motion`.
4. **Compact floating controls** pinned to top: menu, graph layouts, fit, zoom, add case, filter, search, wallet/network indicator. Functions must work in the finished product.
5. **Right contextual inspection rail**, rounded dark surfaces, clear selected-node heading, state indicator, outcome/evidence details, actor/reviewer info, case metrics, verifiable transaction links, and next permissible action.
6. **Bottom-right contextual assistant**, visually similar to reference but strictly evidence-grounded, with visible sources and bounded API calls. This is optional for MVP; never allow an assistant-generated statement to settle escrow.
7. **UI typography** uses compact legible sans-serif, understated labels and restrained monospaced hashes. Avoid tiny text that was present in the source screenshot; 14px body is the target minimum for inspection panels.

## Graph semantics

- Root node: funded agreement/case; retain clear case id, wallet and status.
- Center category nodes: acceptance criteria, evidence bundles, adjudicator rounds, challenge events, settlement actions.
- Leaf nodes: specific evidence objects, model findings, counterclaims, verified checks, votes, tx receipts.
- Lines: direction of provenance or dependency, not unspecified visual associations. Every line needs a legend and link details.
- Click or keyboard select node -> inspector updates to actual case data; hover only enhances and never carries unique information.
- Color and text: #00EC97 for verified/permitted action, #FF8678 for challenge/contradiction, #F4BD68 for undecided/provisional, #F5F7F5 for readable text. Background #0B1110 / #16221D. Non-color labels and shapes disambiguate statuses.

## What changes from v1.0

- Replace left sidebar and stacked cards with graph-first full-screen composition.
- Replace right generic settlement column with source-image-style tall contextual rail.
- Keep Cases, Agreement Builder, The Bench, Challenge Arena, and Lab as product capabilities, but navigate them through graph and compact toolbar where appropriate.
- Keep contract state labels, evidence provenance, reviewer authentication, appeal restrictions, settlement callbacks and case-level history prominent.
- Use real graph interaction in the eventual implementation; static screenshot imitation is not acceptable as the working hackathon demo.

## Accessibility and performance requirements

- Graph uses spatial navigation and keyboard-operable node list; mobile switches to compact graph with inspector bottom drawer and an accessible flat case view.
- Do not place primary actionable text on a moving graph edge. 200% zoom and narrow-viewport flow must retain operation-critical details.
- Limit force simulation and animations to graph changes; do not continuously recalculate static graphs or run GPU processes for layout.
- Loading/empty/failure states: sparse evidence, dozens of nodes, offchain provider unavailable, challenge pending, wrong NEAR network, and escrow callback failure.
- Never imply GenLayer parity, deployed transaction, or reviewed evidence in a pre-hackathon design demo.

## Acceptance checkpoints

- Produce reference-faithful high-fidelity desktop screen and mobile alternate, grounded in case state semantics.
- Review proportions, lighting, typography, canvas density and inspector behavior against the uploaded image.
- Prototype controls for selecting nodes and switching case categories without live AI usage.
- Maintain cross-links between graph evidence nodes, adjudicator assertions and source/tx references.
- Have user visually accept the redesigned prototype before using it as November 1 implementation guidance.
