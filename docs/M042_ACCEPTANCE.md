# M04.2 visual correction acceptance record

Checkpoint: `CONTRA-2026-11-03-IMPL-M04.2-P3`

Branch: `implementation/oct28`

Starting commit: `c33813fe52aa1ab18994e1831f5fb7fbcbf70fd1`

Owner visual acceptance: pending

## Phase 1 result

The short desktop layout now uses one document scrollbar. The left, middle and right columns no longer set `overflow-y:auto` or reserve independent scrollbar gutters. The shell grows with its content while preserving the approved three-column hierarchy, 1200px shell origin and 1080px width. The 1536 x 676 and 1366 x 768 layouts use document scrolling instead of three competing panel scroll regions.

The base reading size is 13px. Secondary text is at least 10px, ordinary labels are 11px or larger, the empty case heading wraps instead of truncating and the radar has enough vertical space to keep its lower labels separate from the legend. Existing tablet and phone flows remain intact.

## Verification

| State | Viewports | Checks | Result |
| --- | --- | --- | --- |
| Empty and chain unavailable | 1200 x 900, 1366 x 768, 1536 x 676, 1440 x 900, 1920 x 1080, 768 x 1024, 390 x 844, 320 x 844 | horizontal overflow, clipped sections, column scroll ownership, minimum text size, heading truncation, short-screen document scroll, console errors | 46/46 pass |
| Genuine settled Sandbox case | Same eight viewports | same matrix against case `756d7a074c66104dcdf563f5a02a3a719bd41545a6953c1639184622244cf072` | 46/46 pass |

Before captures are in `project/artifacts/m042/phase1/before/`. Corrected empty and populated captures plus exact measurements are in `project/artifacts/m042/phase1/after-empty/` and `project/artifacts/m042/phase1/after-populated/`.

The immutable reference SHA-256 remains `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`.

## Phase 1 gate

PASS. Phase 2 may proceed. This gate does not approve the current radar semantics. Phase 2 must replace configuration-derived completion with operational numerator, denominator and source rules for all eight sectors, add deterministic tests for each measurement and capture zero, partial and full states.

No contract, protocol, payout safeguard, external wallet, paid provider, testnet, mainnet, deployment or production secret changed. Owner visual acceptance remains pending.

## Phase 2 result

The radar now measures operational records instead of configured fields. Its eight fixed sectors are:

| Sector | Numerator | Denominator | N/A rule |
| --- | --- | --- | --- |
| Evidence | Frozen criteria whose selected manifest entries link only to retrievable source digests | Frozen criteria | N/A when participant evidence state is unavailable |
| Provenance | Retrievable selected-manifest sources with origin, capture time and submitter | Selected-manifest sources | N/A when no selected manifest is available |
| Review | Completed reveals in the selected primary or fresh round | Appointed slots in that round | N/A when round slots are unavailable |
| Finality | Completed final disposition, payout intent, observed callback and settled milestones | Four settlement milestones | Never inferred from configured settlement fields |
| Challenge | Confirmed counterexample, fresh commit, fresh reveal and fresh resolution | Four challenge milestones | N/A when no challenge was confirmed |
| Quorum | Largest matching disposition count, capped at threshold | Policy threshold | N/A when no selected round exists |
| Keyboard | Independently recorded, verified FULFILLED keyboard criteria | Keyboard criteria with an available evaluation record set | N/A when evaluation records are unavailable |
| Criteria | Valid linked evidence records plus independently recorded evaluation records | Two records per frozen criterion | N/A when participant evidence state is unavailable |

The canvas uses the same exported depth function as the deterministic tests, keeps the eight sector boundaries visible and labels 25, 50, 75 and 100 percent rings. The three tabs cannot change underlying measurements. Case switching selects primary or fresh review records and changes the challenge sector only when a confirmed challenge exists.

Deterministic coverage tests pass 3/3 and exercise eight progressive states with exact numerator, denominator, source and render depth checks. Browser information checks pass 13/13 against zero state, both genuine Sandbox cases and a clearly identified deterministic full-coverage visual fixture. Empty and populated responsive regressions each pass 46/46. Screenshots and reports are under `project/artifacts/m042/phase2/`.

The genuine challenged case renders Evidence 1/1, Provenance 1/1, Review 2/3, Finality 4/4, Challenge 4/4, Quorum 2/2, Keyboard 0/1 and Criteria 1/2. It therefore preserves the actual two-reviewer quorum and does not claim an independently recorded keyboard evaluation that does not exist.

## Phase 2 gate

PASS. Phase 3 navigation, state, accessibility and full browser verification may proceed. The full screenshot is a deterministic visual fixture, not a live case or provider result. Owner visual acceptance remains pending.

## Phase 3 result

Major workflows now use stable navigable views for Overview, Cases, Evidence, Challenges, Reviewers, Settlement, Lab, Settings and Activity. Hash routes preserve the selected case, support direct entry and keep browser Back behavior predictable. Dialogs remain limited to focused actions such as account connection, evidence submission and settlement action confirmation.

The final end-to-end browser suite passes 54/54 checks. It covers account connect and disconnect, genuine case switching, every stable view, direct navigation, browser Back, focus restoration, evidence actions, material and radar tabs, search, pagination, reload reconciliation, stale reads, unavailable chain, permission denial, service failure, pending and failed transfer states, UNKNOWN payout locking, reduced motion, contrast, effective zoom, tablet and mobile layouts and zero console errors.

Empty and genuine populated responsive matrices each pass 46/46 checks at 1200 x 900, 1366 x 768, 1536 x 676, 1440 x 900, 1920 x 1080, 768 x 1024, 390 x 844 and 320 x 844. Operational radar browser checks pass 13/13 and deterministic measurement tests pass 3/3.

The browser matrix passes 4/4 in installed Windows Google Chrome, 4/4 in Playwright Chromium and 4/4 in Firefox. Linux Chromium is BLOCKED because the compatible WSL browser download timed out at the primary host and failed DNS resolution at alternate hosts. This is not reported as a browser pass. Manual assistive-technology screen-reader verification remains PARTIAL.

Both local Sandbox workflows were executed again. The retained report contains 44 persisted operations and receipts, exact 1 NEAR callback-confirmed settlement in each case and a challenged ACCEPT to REJECT fresh-review reversal. The records are under `project/artifacts/m042/phase3/sandbox/`.

Final captures are `project/artifacts/m042/phase3/final-desktop-1200x900.png`, `final-tablet-768x1024.png` and `final-mobile-390x844.png`. Component audit and unresolved items are recorded in `docs/M042_COMPONENT_AUDIT.md`.

## Phase 3 gate

PASS at the authorized local scope. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED because the new local evidence does not satisfy the separately gated testnet, live provider, external wallet, independent operator or manual screen-reader requirements. Owner visual acceptance remains pending.
