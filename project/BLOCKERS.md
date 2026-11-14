# Programme blockers

This register consolidates owner-controlled and external requirements. Engineering and CI defects are resolved within focused pull requests. A simulated result never closes an external blocker.

| ID | Severity | Phase | Root cause and impact | Resolution owner | Corrective action and required evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| B-M08-01 | P0 | M08 | The approved artifact is deployed and initialised with final receipts, matching downloaded bytes and bounded expenditure. | Owner | Preserve transaction `BjVBFX1Fe1YsMejSs6B5mMKjfqKFvR9J7YV3dU8EqUfr`, code hash and retained evidence. No additional deployment is authorised. | RESOLVED |
| B-M09-01 | P0 | M09 | The `contra-testnet` Worker, Static Assets and SQLite `ContraState` Durable Object are publicly deployed under the USD 0 boundary. Storage and fresh-chain readiness pass. A dedicated least-privilege automation token and recovery export destination remain optional hardening items. | Engineering | Preserve signing-disabled configuration, monitor Free limits and configure a recovery export destination before accepting irreplaceable live evidence. | RESOLVED |
| B-M09-02 | P0 | M09 | Meteor Wallet completed genuine NEP-413 authentication with a disposable Testnet account. Creator and beneficiary custody remains in Windows Credential Manager and was not imported. Exact participant consent and operation-specific browser signing remain absent. | Owner and participants | Establish secure browser control of `contra-creator.testnet`, collect genuine beneficiary participation and freeze the exact journey packet. Existing financial ceilings do not authorise a different or unspecified transaction. | PARTIAL |
| B-M09-03 | P0 | M09 | The original creator allowlist was invalid. The authorised empty-state upgrade and one-time repair installed code hash `EtUc3f99vfTwVoRJfS9MNCirxpQ5KpNFNen7XZUD7LA2` and set the sole creator to `contra-creator.testnet`. | Owner | Preserve upgrade and repair evidence. Any future code or allowlist change requires separate authority. | RESOLVED |
| B-M10-01 | P1 | M10 | Six distinct human-controlled Testnet accounts completed consent, activation, confirmation and committee use for the verified live case. | Six reviewer operators | Preserve the signed control records and require fresh case-specific participation for any later journey. | RESOLVED |
| B-M10-02 | P1 | M10 | Meta produced a genuine case-bound retrospective proposal and Modal verified its immutable digest. Both durable artifacts remain explicitly non-binding. | Engineering and provider owners | Preserve the live digests and fail-closed provider controls. Baseten remains retired. | RESOLVED |
| B-M10-03 | P1 | M10 | Cloudflare schema 3 implements durable provider reservations, jobs, immutable proposal records, UNKNOWN locking, usage accounting and audit history. Live execution remains independently gated. | External provider owners | Supply credentials, verified catalogue/model, pricing, credits, billing controls and bounded spending authority. | RESOLVED ENGINEERING |
| B-M10-04 | P1 | M10 | Cloudflare schema 3 implements immutable six-slot invitations, account and operator separation, NEP-413 account-scoped consent, withdrawal and audit recovery. | Independent reviewer operators | Recruit and verify six separately controlled human operators. | RESOLVED ENGINEERING |
| B-M11-01 | P1 | M11 | Production serves the accepted frontend and reports healthy Durable Object storage plus fresh finalised Testnet reads. The current local Wrangler session is authenticated to account `56583bd411c295f2a4e9f73b60fab3f5`, not project account `0a8fd0acd086e68c9b558159fac0d7a8`, so a new deployment cannot be administered from this session. | Owner and engineering | Reauthenticate Wrangler to the project account only when another production deployment is required. Do not replace `ContraState`. Public readiness remains independently verified. | PARTIAL |
| B-PHASE3-CHALLENGE | P1 | Phase 3 | The verified live case settled through primary no-quorum BASE_REFUND and therefore does not prove a challenged appeal journey. | Owner, participants and reviewers | Freeze and execute one separate challenged Testnet packet with counterevidence, fresh review and final settlement receipts. | BLOCKED EXTERNAL EXECUTION |

## Consolidated owner access request

The current single action package is `docs/operations/M10_LIVE_VALIDATION_PACKET.md`. One coordinated response may satisfy the external gates by providing:

1. Recruit six distinct human reviewer operators, with three primary and three fresh accounts, and collect their signed control, consent, conflict and availability records.
2. Establish secure browser control of `contra-creator.testnet` and collect genuine beneficiary participation for `contra-beneficiary.testnet`.
3. Freeze the exact two journey packets only after reviewer registration and confirmation are visible onchain. Each transaction then requires its own operation-specific authority.
4. After a case exists, revalidate Meta credits and residual billing exposure before enabling the exact case-bound request. Modal remains separately case bound and budget bound.
5. Reauthenticate Wrangler to project account `0a8fd0acd086e68c9b558159fac0d7a8` only before a required production mutation. The hosting ceiling remains USD 0.

Private keys, seed phrases and provider secrets must be supplied only through approved secret-management channels, never chat, repository files or logs.
# Provider activation boundaries

- `B-M10-02-META`: The secret, account and `muse-spark-1.3` model were authenticated, and one bounded smoke reconciled 110 microUSD. Production case execution remains gated by current credit evidence, residual billing exposure, an authorised case and `META_LIVE_ENABLED=false`. Status: CASE-BOUND EXECUTION GATED.
- `B-M10-02-BASETEN`: Retired by owner decision on 12 November 2026. Its Worker secret and active execution path were removed. Historical probe evidence is retained. Status: CLOSED.
- `B-M10-02-MODAL`: The protected verifier `ap-2wMup9xpnApV3ehbwwjKrK`, dedicated Proxy Auth token, USD 5 workspace limit and authenticated zero-token deterministic verification are verified. Production case execution remains gated by an authorised proposal and `MODAL_LIVE_ENABLED=false`. Status: CASE-BOUND EXECUTION GATED.
