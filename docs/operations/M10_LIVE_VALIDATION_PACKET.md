# M10 live validation packet

This is the single external-action packet for M10.3. It contains no credential, private key, financial authority or claim of completed independent review.

## Verified existing identities

- Contract: `contra-contestation.testnet`
- Current contract code hash: `EtUc3f99vfTwVoRJfS9MNCirxpQ5KpNFNen7XZUD7LA2`
- Creator: `contra-creator.testnet`, Windows Credential Manager custody
- Beneficiary: `contra-beneficiary2.testnet`, independently controlled browser wallet
- Beneficiary public key: `ed25519:GTqSSmZ73Vmo7p6UXvTL6G1NAuy339oJLuxEtPU6z5Zg`
- Beneficiary readiness: final RPC verified one FullAccess key and 1 Testnet NEAR. The operator completed NEP-413 authentication and supplied a control and participation declaration. Exact case-terms consent remains a separate onchain action after case creation.
- Network: NEAR Testnet only
- Public application: `https://contra-near.pages.dev`
- Live financial signing: disabled

## Reviewer action required

Six different human operators are required. Each person supplies one independently controlled Testnet account, an account-control NEP-413 signature, explicit participation consent, custody attestation, conflict disclosure, availability for both commitment and reveal deadlines, and a stable operator identifier derived from their disclosure. Final contract registry read-back at block `277570514` verified all six accounts as active and confirmed. The contract-selected slots are:

| Committee | Slot | Status |
| --- | ---: | --- |
| Primary | 1 | `appeal.testnet` active and confirmed |
| Primary | 2 | `appeal2.testnet` active and confirmed |
| Primary | 3 | `appeal3.testnet` active and confirmed |
| Fresh appeal | 1 | `primary1.testnet` active and confirmed |
| Fresh appeal | 2 | `primary2.testnet` active and confirmed |
| Fresh appeal | 3 | `primary3.testnet` active and confirmed |

The creator, beneficiary, contract account and exposed diagnostic identity `openkey7551.testnet` are ineligible. One person cannot control multiple slots or appear in both committees. Invitation wording and the technical onboarding procedure are in `REVIEWER_INVITATION_TEMPLATE.md` and `REVIEWER_ONBOARDING.md`.

## Provider action required

| Provider | Required owner input | Hard boundary |
| --- | --- | --- |
| Meta | Revalidate current balance, pricing and residual billing exposure immediately before the exact case-bound request | Account authentication, model access and one 110 microUSD smoke are verified. Production execution remains disabled until an authorised case exists. Maximum programme allocation is USD 3. |
| Modal | Bind the exact authorised Meta proposal digest to the protected verifier request | Protected function, Proxy Auth and a zero-token deterministic smoke are verified. Production execution remains disabled until an authorised proposal exists. Maximum programme allocation is USD 5. |

Secrets must be installed interactively with Wrangler and never sent through chat, committed files, frontend assets or logs. Each provider is enabled independently only after its full gate passes.

## Journey authority required

The two drafts are in `config/m10-live-journeys.example.json`. Reviewer registration and beneficiary identity are verified. They cannot become executable until the case-specific participant operator digests, exact terms, evidence digests, deadlines, attached deposits, transaction order and payout expectations are frozen. `buildLiveJourneyPacket` then creates a canonical packet digest and stable operation identifiers.

The existing proposed ceilings are at most 1 testnet NEAR attached to any transaction and at most 2 testnet NEAR across both journeys. These limits are not spending authority. The final packet digest, exact expiry, authorised signers and allowed methods require one explicit owner approval before any funded transaction.

On any UNKNOWN transaction, stop writes, retain the original operation ID and transaction hash, and reconcile receipts and contract state. Never redispatch.
