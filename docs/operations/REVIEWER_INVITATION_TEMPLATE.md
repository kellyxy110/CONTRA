# CONTRA reviewer invitation template

This template prepares delivery of a generated `CONTRA_REVIEWER_INVITATION_V1` document. It is not evidence that a reviewer exists or is independent.

## Invitation

- Network: NEAR Testnet
- Contract: `contra-contestation.testnet`
- Committee: `[primary or fresh]`
- Slot: `[1, 2 or 3]`
- Invitation digest: `[SHA-256]`
- Expiry: `[ISO 8601 UTC]`

The invited operator must independently control the stated NEAR Testnet account. The operator must authenticate with that wallet, sign the domain-bound control statement, provide a current custody disclosure, declare conflicts and explicitly consent to both commitment and reveal participation.

## Required response

- Reviewer account
- Controlling operator digest
- Disclosure digest and revision
- Verified NEP-413 control-statement receipt
- Custody attestation
- Conflict disclosure
- Availability for commitment and reveal windows
- Explicit acceptance and participation consent

Do not send private keys, seed phrases, personal identity documents or private evidence.

## Authority boundary

The invitation permits evidence review only after registry activation and committee assignment. It cannot authorise transactions, create a contract vote, settle a case or give an AI artifact binding authority.

## Withdrawal and replacement

An operator may decline or withdraw before committee freeze. Replacement requires a new invitation and a complete independent verification. After funding freezes the committee, membership cannot be replaced. Nonparticipation then follows the contract quorum and timeout policy.
