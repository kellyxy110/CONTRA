# M09 creator eligibility remediation decision

## Root cause

M08 initialised `contra-contestation.testnet` with the contract account as its only creator. `create_case` correctly rejects a creator or beneficiary equal to the contract account. The deployment preflight and constructor previously checked only syntax, size and ordering, so the invalid combination passed both gates.

## Decision

**UPGRADE EXISTING CONTRACT** is recommended, subject to a new immutable owner authorisation and a separately verified creator account.

The candidate upgrade adds no contract field and therefore preserves the existing Borsh state layout. It adds `repair_creator_allowlist`, callable only by the configured owner with exactly 1 yoctoNEAR and only while the stored allowlist equals `[contra-contestation.testnet]`. The replacement must be non-empty, sorted, unique, limited to eight entries and exclude the contract account. The exact legacy-state guard makes the repair one-time without adding migration state. Future initialisation also rejects any allowlist containing the contract account.

## Option comparison

| Property | Upgrade existing | Replacement contract |
| --- | --- | --- |
| Account and custody | Preserves account and Windows keychain key | Needs a new account or additional account-control procedure |
| State | Same Borsh layout; current empty case and financial state retained | New state and new public contract identity |
| Privilege | One-time, exact-state repair only | Full deployment and initialisation authority on another account |
| Integration changes | Contract code hash and ABI only | Cloudflare, wallet, frontend, evidence and documentation account references |
| Rollback | Redeploy approved M08 bytes before repair; after repair, restore code but retain corrected state | Abandon replacement and retain defective original, with split evidence |
| Principal risk | Upgrade key remains powerful because it is full access | More custody, funding, configuration and identity surface |

Replacement is technically possible because the existing public key has FullAccess, but key reuse would increase its blast radius and still require account creation, funding and configuration changes. It offers no safety advantage while the deployed contract has no cases, held escrow, inflight payout or paid balance.

## Compatibility and safety

- Contract fields, field order, collection prefixes, canonical serialisation and commitment domains are unchanged.
- Existing methods and their semantics are unchanged.
- The ABI gains one administrative method and the code hash changes.
- The contract account remains prohibited as creator and beneficiary.
- Settlement, callback, UNKNOWN, storage reserve and escrow conservation logic is unchanged.
- Six local Sandbox reviewer identities remain fixtures, not independent operator evidence.

## Execution sequence, not authorised

1. Verify the exact source and Linux production WASM checksum.
2. Verify account, owner, current code hash, current allowlist, zero liabilities and the recorded full-access key at finality.
3. Deploy the approved replacement WASM once.
4. Reconcile its final receipt and code hash before any method call.
5. Call `repair_creator_allowlist` once with the separately verified creator account and 1 yoctoNEAR.
6. Reconcile the receipt, read the resulting configuration and prove a second repair fails.
7. Stop on UNKNOWN or contradictory evidence. Never rebroadcast blindly.

No step above is authorised by this decision document.

## Rollback and recovery

Before the repair call, the approved M08 WASM can be redeployed to restore the old code while leaving state unchanged. After a successful repair, reverting the code does not revert state and is unnecessary. Any UNKNOWN deployment or repair outcome locks subsequent writes until the original transaction is reconciled. Replacement remains the contingency only if a compatible upgrade cannot be verified.

## Inputs still required for executable authority

- The repository contains no evidence of an existing eligible creator wallet. Read-only RPC returned `UNKNOWN_ACCOUNT` for the preferred dedicated name `contra-creator.testnet`. Creation is not authorised.
- Proposed custody is a new dedicated key in Windows Credential Manager, generated only after explicit account-creation authorisation. The contract key must not be reused.
- Proposed funding is the testnet faucet with zero owner-funded expenditure. If the faucet is unavailable, stop and obtain a separate bounded funding approval.
- After authorised creation, verify the public key, FullAccess permission, balance and independent account identity through official RPC before binding it into the upgrade packet.
- Final Linux-built production WASM SHA-256 and allowed-export report.
- Final source commit and ABI checksum.
- Maximum testnet expenditure and expiry.
- Fresh final-state observations and immutable owner approval digest.

AC31 and AC32 remain BLOCKED.

The current non-executable draft file SHA-256 is `b585157e6c18aa47aaeb7155149978fae0637264be1a4fd1fc6c678858cb0a81`. This is an evidence checksum, not an execution authorisation digest.
