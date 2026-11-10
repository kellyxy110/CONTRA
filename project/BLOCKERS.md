# Programme blockers

This register consolidates owner-controlled and external requirements. Engineering and CI defects are resolved within focused pull requests. A simulated result never closes an external blocker.

| ID | Severity | Phase | Root cause and impact | Resolution owner | Corrective action and required evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| B-M08-01 | P0 | M08 | The verified account, faucet balance, empty code, OS-keychain signer and production artifact exist, but account-creation approval does not authorise deployment. Real deployment and acceptance receipts cannot yet exist. | Owner | Explicitly approve deployment-intent digest `18793ae8cc5d246c606f3557983f622a7b2624bff2ddf2ccb83c9d965cfd2df5` before its 16 November 2026 expiry, including the existing 5 NEAR maximum deployment and acceptance ceiling. Private material remains in Windows Credential Manager. | BLOCKED |
| B-M09-01 | P0 | M09 | No authorised Cloudflare account, Workers destination or deployment credential has been supplied. The Cloudflare Free migration is locally testable but a public API cannot be claimed. | Owner | Approve the exact Cloudflare account, `contra-testnet` Worker, `ContraState` SQLite Durable Object namespace and static-assets destination. Supply a least-privilege deployment token through approved secret management. Confirm that the account remains on Workers Free with a USD 0 ceiling and no automatic paid upgrade. | BLOCKED |
| B-M09-02 | P0 | M09 | Live external wallet signing is not authorised. | Owner | Authorise named testnet accounts, permitted methods, maximum attached deposits and funded journey budget after B-M08-01 is satisfied. | BLOCKED |
| B-M10-01 | P1 | M10 | Six separately controlled reviewer operators are not available. Fixture accounts cannot prove independence. | Owner | Recruit and identify three primary and three fresh reviewers, collect control disclosures and conflicts, and schedule signed participation. | BLOCKED |
| B-M10-02 | P1 | M10 | Provider access, model identifiers, credits, billing controls and paid calls are not authorised. | Owner | Provide server-side accounts or delegated access and separately approve a bounded amount within Meta $3, Baseten $3 and Modal $5 programme ceilings. | BLOCKED |
| B-M11-01 | P1 | M11 | Demo, X publication, final frontend design and submission remain owner-directed. | Owner | Supply final frontend design and later authorise publication and submission after the engineering handoff. | DEFERRED |

## Consolidated owner access request

The exact draft and digest procedure are in `docs/operations/OWNER_AUTHORISATION_PACKET.md`. One response may satisfy the external gates by providing:

1. Explicit digest-bound permission to deploy and sign the bounded testnet acceptance transactions from the already verified `contra-contestation.testnet` OS-keychain account.
2. Approved Cloudflare Free account, Worker and SQLite Durable Object resources, optional domain, recovery export destination and least-privilege deployment access. The hosting expenditure ceiling is USD 0.
3. Six distinct reviewer operators and their availability for primary and fresh committees.
4. Provider accounts, exact permitted models, verified credits and billing controls, plus a separately approved spend per provider.

Private keys, seed phrases and provider secrets must be supplied only through approved secret-management channels, never chat, repository files or logs.
