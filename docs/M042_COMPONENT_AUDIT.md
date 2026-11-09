# M04.2 component audit

Checkpoint: `CONTRA-2026-11-03-IMPL-M04.2-P3`

Owner visual acceptance: pending

## Visible surface audit

| Surface | Source of truth | Interaction | Verified states |
| --- | --- | --- | --- |
| Product shell and sidebar | Local route and account state | stable hash navigation, keyboard focus, mobile navigation strip | desktop, tablet, mobile, zoom, reduced motion |
| Account identity | wallet adapter and persisted session | connect, disconnect, reload recovery | disconnected, connected, unavailable |
| Case summary | selected canonical case | case selection and direct route | empty, partial, challenged, settled |
| Review window | chain timestamps and case state | read only disclosure | open, completed, unavailable |
| Reviewer cards | committee and disclosure records | disclosure inspection | primary, fresh, common-control warning |
| Case progress | canonical lifecycle state | details route | pending, challenged, settled |
| Radar | operational coverage records | criteria, evidence and overall lenses | N/A, partial, full fixture |
| Materials | manifest, review, criterion and protocol records | tabs and focused evidence action | empty, populated, denied, failure |
| Tasks | canonical case and transaction state | settlement action route | pending, settled, locked UNKNOWN |
| Activity feed | persisted event records | pagination | empty, multi-page, settled |
| Cases workspace | canonical case list | case selection, Back, direct route | two genuine cases, empty |
| Evidence workspace | structured manifests and source hashes | inspect and submit focused action | genuine record, unavailable, denied |
| Challenges workspace | challenge bundle and fresh-review state | inspect counterexample and outcome | no challenge, confirmed, reversed |
| Reviewers workspace | registry, committees and disclosures | inspect operator disclosure | primary and fresh rounds |
| Settlement workspace | payout intent, receipts and callback | authenticated focused action | pending, failed, UNKNOWN, settled |
| Lab workspace | non-billable provider and policy state | read only inspection | providers gated, fixture verification |
| Settings workspace | local display and network settings | direct route and controls | connected, disconnected |

## Navigation decision

Overview, Cases, Evidence, Challenges, Reviewers, Settlement, Lab, Settings and Activity are stable navigable views. Account connection, evidence submission and settlement confirmation remain focused dialogs because they are bounded actions rather than primary workspaces.

## Verification summary

- End-to-end browser checks: 54/54 pass.
- Responsive checks: 46/46 empty and 46/46 genuine populated pass.
- Radar checks: 13/13 browser checks and 3/3 deterministic subtests pass.
- Browser matrix: Windows Chrome 4/4, Chromium 4/4 and Firefox 4/4 pass.
- Local journeys: 44 persisted operations and receipts, two exact 1 NEAR callback-confirmed settlements, one fresh-review ACCEPT to REJECT reversal.
- Console errors: zero in passing browser runs.
- Reference SHA-256: `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`.

## Remaining issues

1. Owner visual acceptance is pending.
2. Manual assistive-technology screen-reader verification remains PARTIAL.
3. Linux Chromium is blocked because the WSL browser binary download could not complete. Windows Chromium passed and is not used as a substitute claim for Linux.
4. External wallet rejection and redirect behaviour remains gated.
5. Authorised testnet journeys, paid provider records and six genuinely independent reviewer operators remain unavailable, so AC31 and AC32 stay BLOCKED.
6. No testnet deployment, paid inference, production secret or mainnet operation is authorised.
