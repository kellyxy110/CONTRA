# Phase 3 external action packet

This packet contains the only actions that cannot be completed by repository engineering. It does not authorise a transaction, provider call or reviewer appointment.

## Six independent reviewer responses

Each slot must be completed by a different human who independently controls one NEAR Testnet account. The creator, beneficiary, contract account and `openkey7551.testnet` are ineligible.

| Committee | Slot | Required operator action |
| --- | ---: | --- |
| Primary | 1 | Accept invitation, authenticate the stated account, sign the exact control statement, disclose custody and conflicts, and confirm availability |
| Primary | 2 | Accept invitation, authenticate the stated account, sign the exact control statement, disclose custody and conflicts, and confirm availability |
| Primary | 3 | Accept invitation, authenticate the stated account, sign the exact control statement, disclose custody and conflicts, and confirm availability |
| Fresh appeal | 1 | Accept invitation, authenticate the stated account, sign the exact control statement, disclose custody and conflicts, and confirm availability |
| Fresh appeal | 2 | Accept invitation, authenticate the stated account, sign the exact control statement, disclose custody and conflicts, and confirm availability |
| Fresh appeal | 3 | Accept invitation, authenticate the stated account, sign the exact control statement, disclose custody and conflicts, and confirm availability |

For every slot retain the invitation digest, account ID, operator digest, disclosure digest and revision, NEP-413 verification receipt, custody attestation, conflict clearance, consent, availability window and expiry. Do not send private keys, seed phrases, identity documents or private evidence.

After all six responses pass technical validation, the contract owner signs six exact `set_reviewer` calls. Each operator then signs their own exact `confirm_reviewer` call. Final registry read-back must show six active, confirmed and eligible records, with no account or operator overlap between committees.

## Participant and journey freeze

The allowlisted creator must control `contra-creator.testnet`. The beneficiary must independently control and consent as `contra-beneficiary.testnet`. Freeze the following separately for the unchallenged and challenged journeys:

- case policy, criteria, terms digest and evidence manifests
- primary and fresh committee assignments
- funding, challenge bond and payout amounts
- commitment, reveal, challenge and settlement deadlines
- ordered contract methods, signers and attached deposits
- expected state transitions and recipient balances
- recovery procedure for pending and UNKNOWN outcomes

Call `preview_case` only after registry readiness. Use its returned case identity and terms digest to create the first persisted operation. The owner then approves that exact operation ID, payload hash, signer, method, contract, deposit and expiry. A ceiling is not authority for an unspecified transaction.

## Provider execution

Meta `muse-spark-1.3` and Modal `contra-deterministic-verifier-v1` remain the only active providers. Revalidate Meta credits, residual billing exposure and the cumulative USD 3 ceiling immediately before the exact case-bound call. Modal must verify the immutable Meta proposal digest within its USD 5 ceiling. Both outputs remain non-binding. Baseten is historical only.

## Production administration

The public application is healthy. Before any new deployment, Wrangler must be authenticated to project account `0a8fd0acd086e68c9b558159fac0d7a8`. Never deploy from another account and never recreate the existing `ContraState` Durable Object.

## Stop conditions

Stop writes on any identity mismatch, expired consent, duplicate operator, changed packet digest, unavailable finality proof, exceeded limit or UNKNOWN transaction. Preserve the original operation and reconcile its known transaction hash. Never rebroadcast blindly.
