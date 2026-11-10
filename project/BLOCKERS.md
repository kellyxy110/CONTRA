# Programme blockers

This register consolidates owner-controlled and external requirements. Engineering and CI defects are resolved within focused pull requests. A simulated result never closes an external blocker.

| ID | Severity | Phase | Root cause and impact | Resolution owner | Corrective action and required evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| B-M08-01 | P0 | M08 | The approved artifact is deployed and initialised with final receipts, matching downloaded bytes and bounded expenditure. | Owner | Preserve transaction `BjVBFX1Fe1YsMejSs6B5mMKjfqKFvR9J7YV3dU8EqUfr`, code hash and retained evidence. No additional deployment is authorised. | RESOLVED |
| B-M09-01 | P0 | M09 | The `contra-testnet` Worker, Static Assets and SQLite `ContraState` Durable Object are publicly deployed under the USD 0 boundary. Storage and fresh-chain readiness pass. A dedicated least-privilege automation token and recovery export destination remain optional hardening items. | Engineering | Preserve signing-disabled configuration, monitor Free limits and configure a recovery export destination before accepting irreplaceable live evidence. | RESOLVED |
| B-M09-02 | P0 | M09 | Distinct creator and beneficiary accounts pass keychain-backed NEP-413 verification, and the public Pages frontend passes Chromium/Firefox rendering. Existing custody keys must not enter browser storage. The current MyNearWallet testnet selector stalls before redirect, while its hostname is intermittently unavailable through the local resolver. Genuine browser-wallet signatures, participant consent, exact case terms and funded authority remain absent. | Engineering and upstream wallet | Verify an officially supported MyNearWallet testnet path or adopt another authorised NEP-413-capable testnet wallet, then complete disposable-profile authentication without importing custody keys. Verify participant consent before requesting any funded immutable packet. Proposed limits remain 1 testnet NEAR per transaction and 2 testnet NEAR total, not spending authority. | BLOCKED |
| B-M09-03 | P0 | M09 | The original creator allowlist was invalid. The authorised empty-state upgrade and one-time repair installed code hash `EtUc3f99vfTwVoRJfS9MNCirxpQ5KpNFNen7XZUD7LA2` and set the sole creator to `contra-creator.testnet`. | Owner | Preserve upgrade and repair evidence. Any future code or allowlist change requires separate authority. | RESOLVED |
| B-M10-01 | P1 | M10 | Six separately controlled reviewer operators are not available. Fixture accounts cannot prove independence. | Owner | Recruit and identify three primary and three fresh reviewers, collect control disclosures and conflicts, and schedule signed participation. | BLOCKED |
| B-M10-02 | P1 | M10 | Provider access, model identifiers, credits, billing controls and paid calls are not authorised. | Owner | Provide server-side accounts or delegated access and separately approve a bounded amount within Meta $3, Baseten $3 and Modal $5 programme ceilings. | BLOCKED |
| B-M11-01 | P1 | M11 | Demo, X publication, final frontend design and submission remain owner-directed. | Owner | Supply final frontend design and later authorise publication and submission after the engineering handoff. | DEFERRED |

## Consolidated owner access request

The exact draft and digest procedure are in `docs/operations/OWNER_AUTHORISATION_PACKET.md`. One response may satisfy the external gates by providing:

1. Live browser-wallet proof, independent participant consent and final bounded wallet authority for the verified `contra-creator.testnet` and `contra-beneficiary.testnet` identities.
2. Approved Cloudflare Free account, Worker and SQLite Durable Object resources, optional domain, recovery export destination and least-privilege deployment access. The hosting expenditure ceiling is USD 0.
3. Six distinct reviewer operators and their availability for primary and fresh committees.
4. Provider accounts, exact permitted models, verified credits and billing controls, plus a separately approved spend per provider.

Private keys, seed phrases and provider secrets must be supplied only through approved secret-management channels, never chat, repository files or logs.
