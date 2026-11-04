# M04.3 desktop and radar correction acceptance record

Checkpoint: `CONTRA-2026-11-04-IMPL-M04.3-P1`

Owner visual acceptance: rejected for M04.2, pending for M04.3

## Phase 1 root cause

At 1536 x 676, the M04.2 implementation rendered an 842px shell and a 787px main workspace. The document height was 882px, 206px taller than the visible viewport. The direct causes were the desktop `min-height:810px` shell, `min-height:756px` main columns and cumulative fixed section minimums.

The initial correction also exposed 31px of concealed middle-column overflow at 1200 x 900. That overflow came from a 105px progress row, 410px radar row and 272px materials minimum inside a 756px column.

## Phase 1 implementation

- Short desktops use a shell height of `calc(100vh - 24px)` with no minimum-height dependency.
- The three columns use explicit flexible grid rows.
- The primary Overview keeps case summary, progress, complete radar, primary actions and navigation visible.
- Overview shows two reviewer summaries, a compact materials count and one recent activity.
- Full reviewer, evidence and activity records remain available through stable routed workspaces.
- Desktops at 850px or taller use a centered 810px shell without document-margin overflow.
- No desktop column uses an independent scrollbar.

## Phase 1 verification

Command: `npm run test:frontend:desktop:m043`

The final run passes horizontal-overflow and console checks at all eight viewports. All five desktop viewports additionally pass shell, navigation, case summary, progress, radar, canvas, primary-action, document-scroll, column-scroll, control-visibility and minimum-text checks.

| Viewport | Shell bottom | Radar bottom | Document height | Result |
| --- | ---: | ---: | ---: | --- |
| 1536 x 676 | 664 | 571 | 676 | PASS |
| 1366 x 768 | 756 | 663 | 768 | PASS |
| 1200 x 900 | 855 | 614 | 900 | PASS |
| 1440 x 900 | 855 | 614 | 900 | PASS |
| 1920 x 1080 | 945 | 704 | 1080 | PASS |

Tablet 768 x 1024, mobile 390 x 844 and effective-width 320 x 844 pass horizontal-overflow and console checks. Their single-document flow remains intentionally scrollable.

The mandatory corrected screenshot is `project/artifacts/m043/phase1/desktop-short-1536x676.png`. The before image, all target viewport captures and `desktop-fit-report.json` are in the same directory. Each is a visible-viewport screenshot, not a full-page capture.

## Phase 1 gate

PASS. The screenshots were inspected after the numerical checks. Phase 2 may proceed. Owner visual acceptance is not claimed.
