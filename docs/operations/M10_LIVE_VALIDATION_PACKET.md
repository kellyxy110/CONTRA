# M10 live validation packet

This is the single external-action packet for M10.3. It contains no credential, private key, financial authority or claim of completed independent review.

## Verified existing identities

- Contract: `contra-contestation.testnet`
- Current contract code hash: `EtUc3f99vfTwVoRJfS9MNCirxpQ5KpNFNen7XZUD7LA2`
- Creator: `contra-creator.testnet`, Windows Credential Manager custody
- Beneficiary: `contra-beneficiary.testnet`, separate Windows Credential Manager custody
- Network: NEAR Testnet only
- Public application: `https://contra-near.pages.dev`
- Live financial signing: disabled

## Reviewer action required

Six different human operators are required. Each person supplies one independently controlled Testnet account, an account-control NEP-413 signature, explicit participation consent, custody attestation, conflict disclosure, availability for both commitment and reveal deadlines, and a stable operator identifier derived from their disclosure. The slots are:

| Committee | Slot | Status |
| --- | ---: | --- |
| Primary | 1 | Operator required |
| Primary | 2 | Operator required |
| Primary | 3 | Operator required |
| Fresh appeal | 1 | Operator required |
| Fresh appeal | 2 | Operator required |
| Fresh appeal | 3 | Operator required |

The creator, beneficiary, contract account and exposed diagnostic identity `openkey7551.testnet` are ineligible. One person cannot control multiple slots or appear in both committees. Invitation wording and the technical onboarding procedure are in `REVIEWER_INVITATION_TEMPLATE.md` and `REVIEWER_ONBOARDING.md`.

## Provider action required

| Provider | Required owner input | Hard boundary |
| --- | --- | --- |
| Meta | Revalidate current balance, pricing and residual billing exposure immediately before the exact case-bound request | Account authentication, model access and one 110 microUSD smoke are verified. Production execution remains disabled until an authorised case exists. Maximum programme allocation is USD 3. |
| Modal | Bind the exact authorised Meta proposal digest to the protected verifier request | Protected function, Proxy Auth and a zero-token deterministic smoke are verified. Production execution remains disabled until an authorised proposal exists. Maximum programme allocation is USD 5. |

Secrets must be installed interactively with Wrangler and never sent through chat, committed files, frontend assets or logs. Each provider is enabled independently only after its full gate passes.

## Journey authority required

The two drafts are in `config/m10-live-journeys.example.json`. They cannot become executable until all six reviewer records, genuine participant consent, exact terms, evidence digests, deadlines, attached deposits, transaction order and payout expectations are frozen. `buildLiveJourneyPacket` then creates a canonical packet digest and stable operation identifiers.

The existing proposed ceilings are at most 1 testnet NEAR attached to any transaction and at most 2 testnet NEAR across both journeys. These limits are not spending authority. The final packet digest, exact expiry, authorised signers and allowed methods require one explicit owner approval before any funded transaction.

On any UNKNOWN transaction, stop writes, retain the original operation ID and transaction hash, and reconcile receipts and contract state. Never redispatch.
