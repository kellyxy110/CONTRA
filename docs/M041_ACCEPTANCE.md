# M04.1 frontend implementation and acceptance record

Checkpoint: `CONTRA-2026-11-03-IMPL-M04.1-P3`

Branch: `implementation/oct28`

Starting commit: `533506063ea60d65b742dd7ce15b61f89d069c6a`

Phase 1 commit: `c1262199c80f7eadaca10b1f04cd72630ee9d9a3`

Phase 2 commit: `879edf984a7265184045f0bdf10a8fd05b9f938b`

Owner visual acceptance: pending

## Result

The Bench preserves the approved 1200 x 900 UX3A shell at 1080 x 810 with origin x 60, y 45. It adapts to all requested desktop, tablet and phone viewports without page horizontal overflow or clipped sections. The radar retains eight sectors and renders genuine zero, partial and full measurements with visible rings, spokes and boundaries. The interface exposes readable NEAR amounts, exact yoctoNEAR details, full case IDs, readable protocol states, completed review timing, reviewer control disclosure, material provenance and UTC contract history.

## Phase gates

| Gate | Verification | Result |
| --- | --- | --- |
| Phase 1 responsive | Empty Chromium matrix | 26/26 pass |
| Phase 1 responsive | Genuine populated Chromium matrix | 29/29 pass |
| Phase 2 information and radar | Zero, partial, full, DPR and mobile checks | 15/15 pass |
| Phase 2 regression | Empty plus populated responsive matrices | 55/55 pass |
| Phase 3 browser UX | Navigation, dialogs, recovery, failures, zoom and accessibility | 58/58 pass |
| Legacy populated browser regression | Desktop, tablet, mobile and reduced motion | 16/16 pass |
| Service regression | Node service and P0 report tests | 29/29 pass |
| Wallet bundle | esbuild production bundle | pass |

The Rust contract was not changed. A fresh Windows Rust rerun did not execute because the host DNS server failed for `index.crates.io`, and offline mode lacked `near-primitives`. WSL had no Cargo installation. The prior accepted M03 result of 28/28 Rust tests and all P0 financial evidence remains unchanged. This environment failure is not represented as a passing rerun.

## Genuine Sandbox records

The Phase 1 run executed both local journeys again and retained the server for Phase 2 and Phase 3 browser work.

| Journey | Case | Result | Receiver delta |
| --- | --- | --- | --- |
| Unchallenged | `09006893b15ef0827d69fa080166091ffef49bd1f2a695bcbcb729a7a133f3c9` | Primary ACCEPT, callback-confirmed beneficiary settlement | 1 NEAR |
| Challenged | `d3b67258309c992880dfa38dceae0163551ce1ebc350d981e7667e0514440ef3` | Primary ACCEPT, fresh REJECT, callback-confirmed creator settlement | 1 NEAR |

The run contains 44 confirmed operations, 44 unique successful receipts and two structured manifests. All six reviewer accounts remain disclosed as controlled by one local process. They are not evidence of independent operators.

## Browser and accessibility coverage

Automated checks cover:

- 1200 x 900, 1366 x 768, 1440 x 900, 1920 x 1080, 768 x 1024, 390 x 844 and 320 x 844.
- 960 x 720 effective layout at 125 percent zoom and 320 x 422 effective layout at 200 percent zoom.
- Empty, chain-unavailable and genuine populated states.
- Connect, disconnect, case switching, all sidebar views, all radar and material tabs, task mode, search and activity pagination.
- Dialog keyboard entry, Escape close, browser Back close and focus restoration.
- Persisted transaction reconciliation after reload, stale-read disclosure, unavailable service state and unauthorized evidence rejection.
- Named controls, landmarks, chart semantics, 44px coarse-pointer targets, reduced motion, soft-white contrast and NEAR-mint contrast.
- Portable Playwright imports with no user-specific browser or module path.

The browser report is `project/artifacts/m041/phase3/e2e-report.json`. Final desktop, tablet, phone and zoom screenshots are in the same directory.

## Remaining issues and external gates

- Explicit owner visual acceptance is pending.
- A manual screen-reader session with assistive technology remains pending. Automated semantics pass, but this is not represented as a manual audit.
- AC31 and AC32 remain blocked at their frozen exact scope because testnet and paid provider activity are not authorized.
- External wallet rejection and redirect behavior remains gated with testnet use.
- Six independently controlled reviewer operators are not available. Local accounts share one process.
- Cargo dependency retrieval failed on this Windows host because `index.crates.io` DNS resolution failed. No contract source changed.
- `npm audit --omit=dev` reports 14 low, 2 high and 1 critical production-tree finding, primarily through `near-workspaces`, `near-sandbox` and its pinned `tar` dependency. No nonbreaking upstream fix is available from the current dependency graph. Do not process untrusted tar archives through that development dependency.
- Plain `npm ci` is not a Windows Sandbox install path because `near-sandbox` rejects Windows. Use the compatible Linux host for full setup. Windows frontend-only setup uses `npm ci --ignore-scripts`.

No testnet deployment, mainnet transaction, paid inference, production secret or repository deployment occurred. Owner visual acceptance must be explicit.
