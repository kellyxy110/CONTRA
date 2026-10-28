# Reference-faithful integration specification v1.2

## Source of truth

`design/reference/control-ai-policy-dashboard.jpeg` is the immutable reference (JPEG 1200 x 900). `docs/DESIGN_REFERENCE_INTEGRITY.md` defines exact preservation. The image must not be altered for any reason.

Owner direction: use this precise composition for CONTRA. Build a coded live graph-first interface with NEAR colors. If forced to choose between a generic dashboard pattern and the reference screenshot, choose the source image's composition. The image is not to be edited or used as an unclickable fake interface.

## Spatial and interaction requirements

1. **Background:** close to black with low-opacity teal atmospheric falloff; controlled negative space. Favor restrained gradients and subtle depth, not glowing futuristic clichés.
2. **Graph:** dominant left/center visual, roughly two-thirds of screen. Single luminous agreement root at x≈12%, y≈52%; three to five level-1 category cards near x≈26-38%, with a highlighted selected category; thin cubic edges sweeping to clustered leaves near x≈53-62%. Primary graph must remain the visual anchor.
3. **Top controls:** little menu button left, CONTRA brand at upper left, compact floating cluster centered, new case/search/wallet actions upper right. Minimize chrome. Keep icon-label semantics and focus treatment accessible.
4. **Right rail:** one tall rounded contextual panel at around x≈67-99%, y≈13-86%. Title first, state badge, evidence/judgment summary, two or four metric tiles, challenge/assessment detail and a clearly marked next step. The rail should feel like one coherent surface.
5. **Assistant:** small bottom-right floating input dock. MVP may show `Case questions (demo fixture)` and local evidence-linked answers; no live credit usage required. If not implemented, disable honestly.
6. **Aesthetics:** source's very thin connections, restrained lines, delicate light pools, compact nodes and polished controls. Avoid full-width app headers, left sidebar menus, oversized charts, chunky neon borders or irrelevant KPI cards.
7. **Fonts:** readable sans-serif labels and mono for hashes; preserve compact feel while maintaining legible body and accessible small text.
8. **Responsive:** for narrow widths, switch to a compact graph with a bottom inspector drawer and accessible list. Never simply shrink 1200 x 900 content until it becomes unreadable.

## Color tokens in the coded product only

- Primary CTA, verified action: `#00EC97`
- Background: `#0B1110`
- Surface: `#16221D`
- Primary text: `#F5F7F5`
- Challenges/contradictions: `#FF8678`
- Pending/unresolved: `#F4BD68`

The original screenshot is protected and stays in its original colors. Never modify it to match these tokens.

## Graph data and UI contract

Implement fixture-backed entities and typed edges first:

- Node types: `agreement`, `criterion`, `evidence`, `review_round`, `finding`, `counterclaim`, `challenge`, `settlement`.
- Relationship types: `requires`, `supports`, `contradicts`, `evaluated_by`, `challenges`, `resolved_by`, `settled_by`.
- Inspectable properties: stable ID, label, actor/account, evidence URI/digest, timestamp, current state, related transaction link if confirmed.
- Edge hover/focus: show relationship type and associated source; line color alone is insufficient.
- Toolbar: select layout, zoom in/out, fit, filter, search, switch graph/list, new case route. Never show a decorative button that does nothing.

Use sample case data about an accessibility-related web deliverable, not the source image's laws or policy text. Explicitly label any fixture as `Simulated`. Every inspector and counterclaim must resolve against the same shared case store.

## Visual QA acceptance

Compare rendered 1200 x 900 screenshots side by side with unmodified source. Include breakpoints around 768 and 390 px. Check root position, graph width, curve clustering, overlay positions, right rail footprint, atmospheric lighting, and microtypography. Report divergences rather than declaring exact pixel identity. Include keyboard-only navigation, screen reader labels, reduced motion, safe focus, and contrast checks. Owner approval gates the reference design freeze.
