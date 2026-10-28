# UX3A visual QA

Source: design/reference/IMG_7409.jpeg, unchanged 1200 x 900 JPEG.
Implementation: project/artifacts/ux3a/desktop-1200x900.jpg.
Combined evidence: project/artifacts/ux3a/comparison.jpg (2400 x 900, source left).
State: initial fixture dashboard, first page, Criteria and Evidence tabs selected.
Viewport: 1200 x 900 CSS pixels inside an iframe, captured in cloud Chromium at 1x. Browser capture cropped to the exact iframe region; no scaling, recoloring or alteration of the source file. Source bytes remain unchanged.

## Verified composition

Shell: x60/y45, 1080 x 810. Sidebar: 53. Content columns: 255/472/299. Left section boundaries y370/y490; middle y204/y583; right y509. Source geometry reproduced to within roughly 1-3 CSS pixels. Radar center x604/y404, radius135, circular dashed rings and eight filled sectors. Source card counts, region ordering and avatar placements retained.

## Iterations

1. First working render: found an asset base-path defect, oversized left-lower radar sector and compact-task text crowding. Fixed base URL, sector radius and compact text wrapping.
2. Compared the combined source and render, then corrected card offset, task rhythm, original mark and font loading. Added local Inter with license and source-derived grain.
3. Final browser DOM verified exact shell and column measurements and loaded Inter. Final combined image reviewed at full view. Individual browser render and source also inspected for the chart, profile/reviewer cards, tasks and material typography.

## Required fidelity surfaces

- Layout: primary geometry and card hierarchy reproduced. Content substitutions intentionally change line lengths.
- Typography: local Inter is a visual match, but the original font identity and antialiasing are not proven. This prevents a claim of exact pixel equality.
- Palette: approved mint, obsidian, deep slate, soft white, coral and amber with alpha blends. Original image remains in its original colors.
- Assets: original faces retained as extracted image assets; original mark recolored in a derivative; source JPEG never edited. Lucide glyphs approximate the original navigation glyphs rather than matching every path.
- Copy: CONTRA case/evidence/reviewer/protocol fixture data; visible Simulated designation. AI proposed, challenged and callback-dependent settlement meanings retained.

## Interaction evidence

Browser verified task and activity pagination, record search, material tabs, chart tab, challenge details, editable counterexample note and session save confirmation. JavaScript syntax checks passed. No application errors found in browser console; extension metadata errors excluded. No live providers, transactions or spending.

## Remaining findings

- [P2] Strict reference acceptance still requires matching each navigation glyph and proving or further refining font metrics. Current glyphs are close library equivalents. Exact identity cannot be claimed.
- [P2] Reference grain is approximated from a source margin strip; its full spatial texture differs from the source backdrop.
- Responsive redesign was intentionally not introduced because UX3A requires the fixed reference composition. The previous responsive study remains untouched.

Owner approval: pending. This report does not grant acceptance.

## Final asset correction

The previous P2 sidebar-glyph finding was corrected by extracting the actual source glyph shapes as transparent recolored raster assets. The backdrop finding was corrected by preserving the full source margin texture spatially, recolored through approved palette blends, with all source interface content removed from the backdrop derivative. A new browser render and combined comparison were captured and opened after those corrections. The prior blocked result is retained in the iteration history above, not the final status.

Remaining P3: exact original font identity cannot be proved from the JPEG. Inter is locally loaded and visually compared; subpixel antialiasing and some secondary library control glyphs may differ. No claim of mathematical pixel identity or owner acceptance is made.

final result: passed
