# Programme blockers

This register consolidates owner-controlled and external requirements. Engineering and CI defects are resolved within focused pull requests. A simulated result never closes an external blocker.

| ID | Severity | Phase | Root cause and impact | Resolution owner | Corrective action and required evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| B-M08-01 | P0 | M08 | The approved artifact is deployed and initialised with final receipts, matching downloaded bytes and bounded expenditure. | Owner | Preserve transaction `BjVBFX1Fe1YsMejSs6B5mMKjfqKFvR9J7YV3dU8EqUfr`, code hash and retained evidence. No additional deployment is authorised. | RESOLVED |
| B-M09-01 | P0 | M09 | The `contra-testnet` Worker, Static Assets and SQLite `ContraState` Durable Object are publicly deployed under the USD 0 boundary. Storage and fresh-chain readiness pass. A dedicated least-privilege automation token and recovery export destination remain optional hardening items. | Engineering | Preserve signing-disabled configuration, monitor Free limits and configure a recovery export destination before accepting irreplaceable live evidence. | RESOLVED |
| B-M09-02 | P0 | M09 | Meteor Wallet completed genuine NEP-413 authentication with a disposable Testnet account on the public application path. Creator and beneficiary custody remains in Windows Credential Manager and was not imported. Participant consent, exact funded case terms and funded authority remain absent. | Owner and participants | Collect independently signed creator and beneficiary consent, freeze the exact journey packet and request one bounded financial authorisation. Proposed limits remain 1 testnet NEAR per transaction and 2 testnet NEAR total, not spending authority. | PARTIAL |
| B-M09-03 | P0 | M09 | The original creator allowlist was invalid. The authorised empty-state upgrade and one-time repair installed code hash `EtUc3f99vfTwVoRJfS9MNCirxpQ5KpNFNen7XZUD7LA2` and set the sole creator to `contra-creator.testnet`. | Owner | Preserve upgrade and repair evidence. Any future code or allowlist change requires separate authority. | RESOLVED |
| B-M10-01 | P1 | M10 | Six separately controlled reviewer operators are not available. Fixture accounts cannot prove independence. | Owner | Use `docs/operations/M10_LIVE_VALIDATION_PACKET.md` to recruit three primary and three fresh reviewers, then collect NEP-413 control signatures, consent, custody and conflict disclosures and scheduled availability. | BLOCKED |
| B-M10-02 | P1 | M10 | Meta and Baseten secrets are installed but remain gated by model and financial evidence. The protected Modal verifier is deployed and returns HTTP 401 without Proxy Auth, but its dedicated Proxy Auth token is not installed. | Owner and provider account administrators | Create and install a dedicated Modal Proxy Auth token, complete one deterministic authenticated verification, and resolve each provider's independent model, credit, pricing, billing and bounded spending gates. | PARTIAL |
| B-M10-03 | P1 | M10 | Cloudflare schema 3 implements durable provider reservations, jobs, immutable proposal records, UNKNOWN locking, usage accounting and audit history. Live execution remains independently gated. | External provider owners | Supply credentials, verified catalogue/model, pricing, credits, billing controls and bounded spending authority. | RESOLVED ENGINEERING |
| B-M10-04 | P1 | M10 | Cloudflare schema 3 implements immutable six-slot invitations, account and operator separation, NEP-413 account-scoped consent, withdrawal and audit recovery. | Independent reviewer operators | Recruit and verify six separately controlled human operators. | RESOLVED ENGINEERING |
| B-M11-01 | P1 | M11 | The owner-supplied frontend is implemented and under protected release verification in PR 73. Demo, X publication and submission remain separate owner-directed actions. | Owner and engineering | Merge and deploy the verified implementation, then preserve demo and submission as separately authorised publication work. | IN PROGRESS |

## Consolidated owner access request

The current single action package is `docs/operations/M10_LIVE_VALIDATION_PACKET.md`. One coordinated response may satisfy the external gates by providing:

1. Live browser-wallet proof, independent participant consent and final bounded wallet authority for the verified `contra-creator.testnet` and `contra-beneficiary.testnet` identities.
2. Optional Cloudflare recovery export destination and a dedicated least-privilege automation token. Interactive deployment administration is verified through the owner account. The hosting expenditure ceiling remains USD 0.
3. Six distinct reviewer operators and their availability for primary and fresh committees.
4. Provider accounts, exact permitted models, verified credits and billing controls, plus a separately approved spend per provider.

Private keys, seed phrases and provider secrets must be supplied only through approved secret-management channels, never chat, repository files or logs.
# M10.4 provider activation blockers

- `B-M10-02-META`: The Worker secret is installed. Standard `muse-spark-1.3` is selected, but account, credit and provider-side hard spending-control evidence remain incomplete. Status: SECRET INSTALLED, LIVE EXECUTION GATED.
- `B-M10-02-BASETEN`: The Worker secret is installed. Authenticated exact model selection, credit evidence and hard billing control remain incomplete. Status: SECRET INSTALLED, LIVE EXECUTION GATED.
- `B-M10-02-MODAL`: The protected verifier is deployed as `ap-2wMup9xpnApV3ehbwwjKrK` and rejects unauthenticated requests with HTTP 401. A dedicated Proxy Auth token is not installed, so authenticated verification and Worker activation remain gated. Status: DEPLOYED, PROXY AUTH PENDING.
