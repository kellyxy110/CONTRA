# Post-hackathon follow-up

CONTRA's hackathon engineering release is complete. This record preserves optional live validation work that can continue after submission without changing the released product claims or protocol safeguards.

## Live Testnet evidence journey

The following authorised Testnet case was started during final validation:

- Case ID: `9f0d318014e13a33c3366af0638aa48d3f07cc1cbb1c509753b416d188670c7d`
- Terms digest: `9b5461ffc4cab66557d4920523a2cc0fd2467e07d8227876627961cfb3d194db`
- Creation transaction: `BMHQ6RErNSoBxkr8Agu7jnvxQR5d3DhFjPKxrF1zqcji`
- Terms acceptance transaction: `8Qpht7S5qHAfnf3YwyuSexfrFSp1cue27YK4duowNRY8`
- Funding transaction: `9cbfVTCQj9h76BBnr1uwypuBToPg93hrbcHwoNaqKdLh`
- Funded amount: `0.1 NEAR`
- Off-chain evidence digest awaiting an authorised on-chain submission: `a94bc567c6fc42c8e9b16afdb80a8b458ee33d9a20c4bbd61cb70fe649de52f8`

## Remaining validation actions

1. Reconcile the persisted evidence operation before preparing any replacement operation.
2. Submit the evidence only through an exact, operation-scoped wallet authorisation.
3. Complete primary and appeal reviewer commit and reveal actions using the independently controlled reviewer wallets.
4. Exercise the challenge path, finality transition and settlement only after the relevant account holders approve each transaction.
5. Record finalised receipts, balance changes and contract state after every write.
6. Preserve UNKNOWN operation locks and never redispatch an operation without authoritative reconciliation.
7. Remove public Demo Mode only after the desired complete live journey has been independently verified.

The local authority packet drafts remain intentionally untracked. They can contain short-lived operational details and must be regenerated or revalidated before use.
