# Programme blockers

This register consolidates owner-controlled and external requirements. Engineering and CI defects are resolved within focused pull requests. A simulated result never closes an external blocker.

| ID | Severity | Phase | Root cause and impact | Resolution owner | Corrective action and required evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| B-M08-01 | P0 | M08 | No authorised testnet contract account, funding or signing authority. Real deployment and acceptance receipts cannot exist. | Owner | Provide the dedicated `.testnet` account, custody model, permitted access-key scope, funding ceiling and explicit deployment and funded-signing authorisation. | BLOCKED |
| B-M09-01 | P0 | M09 | No production-compatible hosting and durable volume access has been supplied. A public API cannot be deployed safely. | Owner | Provide approved hosting access, domain and HTTPS/origin configuration, durable volume and backup destination, monitoring destination and deployment authority. | BLOCKED |
| B-M09-02 | P0 | M09 | Live external wallet signing is not authorised. | Owner | Authorise named testnet accounts, permitted methods, maximum attached deposits and funded journey budget after B-M08-01 is satisfied. | BLOCKED |
| B-M10-01 | P1 | M10 | Six separately controlled reviewer operators are not available. Fixture accounts cannot prove independence. | Owner | Recruit and identify three primary and three fresh reviewers, collect control disclosures and conflicts, and schedule signed participation. | BLOCKED |
| B-M10-02 | P1 | M10 | Provider access, model identifiers, credits, billing controls and paid calls are not authorised. | Owner | Provide server-side accounts or delegated access and separately approve a bounded amount within Meta $3, Baseten $3 and Modal $5 programme ceilings. | BLOCKED |
| B-M11-01 | P1 | M11 | Demo, X publication, final frontend design and submission remain owner-directed. | Owner | Supply final frontend design and later authorise publication and submission after the engineering handoff. | DEFERRED |

## Consolidated owner access request

One response may satisfy the external gates by providing:

1. The dedicated NEAR testnet contract account, ownership proof, access-key policy, funding ceiling and explicit permission to deploy and sign funded testnet acceptance transactions.
2. Approved backend hosting, domain, durable storage, backup, monitoring and deployment access.
3. Six distinct reviewer operators and their availability for primary and fresh committees.
4. Provider accounts, exact permitted models, verified credits and billing controls, plus a separately approved spend per provider.

Private keys, seed phrases and provider secrets must be supplied only through approved secret-management channels, never chat, repository files or logs.
