# Frontend visual and interaction acceptance

## Authority

The only active desktop Overview references are:

- `design/approved/overview-dark.jpeg`, SHA-256 `3b184ab7c74fd3106d858c4b5e465c746b72136a189963de55264791e51111f4`.
- `design/approved/overview-light.jpeg`, SHA-256 `e00b0fa987058aaf5ef8d6371e1eced0be02e33a0702e66aca156e9bc5002a41`.

Historical frontend material is not an implementation reference. Protocol, security and financial records remain authoritative for behaviour.

## Runtime modes

| Mode | How to use it | Authority |
| --- | --- | --- |
| Deterministic visual fixture | Start `npm run dev`, then open `http://127.0.0.1:4173/?mode=fixture` | Simulated Overview records only. The status label states that the records have no financial authority. The mode is accepted only on localhost. |
| Real empty or unavailable data | Start `npm run dev` without Testnet configuration | Honest unavailable and zero-record compositions. It never turns unavailable contract data into zero. |
| Read-only Testnet | Supply the documented Testnet runtime variables and keep signing disabled | Final contract reads through the configured RPC. |
| Authorised transaction | Existing exact operation-specific server gate only | Requires the authenticated account, persisted operation ID and payload hash. A browser or fixture flag cannot enable it. |

Browser API reads use a bounded 15-second client timeout. A stalled response therefore becomes an explicit unavailable state instead of leaving the interface in a permanent loading state.

## Visual evidence procedure

1. Run `npm run test:browser`.
2. Run `npm run build:visual-comparison`.
3. Inspect `ci-output/visual-comparison/overview-dark-side-by-side.png` and `overview-light-side-by-side.png` at native size.
4. Inspect the expanded, collapsed, empty, tablet and mobile captures in `ci-output/`.

Core CI uploads the generated screenshots and side-by-side comparisons as run artifacts. Presence assertions alone do not constitute visual acceptance.

## Control audit

| Destination or control | Handler and authoritative boundary | Loading, failure and recovery behaviour |
| --- | --- | --- |
| Sidebar | Local accessible toggle; desktop preference persists in local storage | Expanded by default, text control becomes `Expand` when collapsed, mobile menu closes after navigation |
| Navigation | Hash routes with one `aria-current=page` destination | Challenge coral remains semantic and does not replace the mint active state |
| Theme and period | Local preference plus authoritative case-period filtering | Dark is default, both themes persist, unavailable records remain unavailable |
| Overview case and round selectors | Contract case list, `get_round` and protected evidence routes | Selector changes recompute the timeline, evidence and reviewer chart; failed reads show truthful empty states |
| Cases | Contract preview, immutable terms storage and exact wallet preparation | Validation errors remain visible; signing appears only when the server releases the exact operation |
| Evidence | Immutable manifest and protected artifact APIs | Unauthorised reads fail; stored data remains offchain until an exact signed submission succeeds |
| Evaluations | Account-scoped job history, case-bound Meta proposal and Modal verification routes | Provider controls render only when readiness is `READY`; failures remain non-binding and recoverable |
| Challenges | Criterion-bound counterexample storage and exact challenge preparation | Eligibility and deadline restrictions remain visible; no fixture can file a live challenge |
| The Bench | Invitation, signed consent, appointed workspace, encrypted commit and reveal recovery | Wrong accounts are denied; plaintext reviewer nonces are never persisted |
| Settlement | Receipt inspection, operation status and known-hash reconciliation | UNKNOWN without a hash remains locked and cannot be redispatched |
| Constellations | Separate eight-axis evidence comparison | Missing and protected data remain distinct; no Overview doughnut is replaced |
| Activity | Event filter and linked case navigation | Empty and unavailable activity are explicit |
| Settings | Session renew, disconnect and theme preference | Expired sessions and failed disconnects remain visible without granting authority |

## Accepted browser scope

The automated interaction suite covers Chromium and Firefox at 320, 375, 768, 1024, 1280, 1366, 1440 and 1920 pixels. It exercises all ten destinations, mobile navigation, sidebar persistence, active navigation, both themes, case and round selection, protected artifacts, validation, UNKNOWN locking, session recovery and controlled network failures.
