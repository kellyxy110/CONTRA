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

- No reusable eligible wallet was evidenced. Under explicit owner authorisation, `contra-creator.testnet` was created with a dedicated Windows Credential Manager key and faucet-only funding.
- Official final RPC observed public key `ed25519:61VyeNdx9dTGwvQB6QFW8ZjNDejkXwP7qFhqGx6iz1AZ`, FullAccess permission and 10 testnet NEAR. Creation transaction: `EMxMRnCQH4fyGzk8YrMoLvxFAuhrGsy6EXppShiNLnrB`.
- The contract key was not reused. No private key or seed phrase was printed or recorded. Owner-funded expenditure is zero.
- Final Linux-built production WASM SHA-256 and allowed-export report.
- Final source commit and ABI checksum.
- Maximum testnet expenditure and expiry.
- Fresh final-state observations and immutable owner approval digest.

AC31 and AC32 remain BLOCKED.

## Proposed execution authority

The immutable proposal file SHA-256 is `fa488567ef9f9fc9727dab78d1dc16d27b20479dba41725e7027099c6875bbb3`.

It proposes only these operations before `2026-11-16T00:00:00Z`:

1. Deploy production WASM SHA-256 `ce57c375dc0f0dccab1619ffddcbf7113059a45963fab8452db26d2ccbca5447` once to `contra-contestation.testnet` using its verified Windows keychain signer.
2. After final code-hash reconciliation, call `repair_creator_allowlist` once with `["contra-creator.testnet"]` and exactly 1 yoctoNEAR.

The combined ceiling is `100000000000000000000000` yoctoNEAR, or 0.1 testnet NEAR. The proposal stops on any identity mismatch, expired or absent approval, cost excess or UNKNOWN transaction. The owner-authorisation field is null. Therefore this digest is a proposal for approval and is not authority to execute.

## Executed remediation

The owner subsequently approved the exact proposal digest. Fresh preflight verified both keychain identities, the M08 code, zero cases and zero held, inflight or paid liabilities. Transaction `4AbVrJHeJTJHoA95c5owniYaXLJmEBkETsWrQxuGzvXz` deployed the exact approved replacement bytes and reached final `SuccessValue`. The deployed SHA-256 is `ce57c375dc0f0dccab1619ffddcbf7113059a45963fab8452db26d2ccbca5447` and NEAR code hash is `EtUc3f99vfTwVoRJfS9MNCirxpQ5KpNFNen7XZUD7LA2`.

Transaction `2qQYh7sdkyLKN9uuDUHJ8pSYcwyviZgtNQJykWmaKKTj` then called the one-time repair with `["contra-creator.testnet"]`, 30 TGas and exactly 1 yoctoNEAR. It reached final `SuccessValue`. Final configuration contains only the independent creator account and the eligibility validator reports `can_create_case: true`.

Combined measured balance consumption was `0.0048511016886709` testnet NEAR, below the 0.1 ceiling. No case, escrow or payout operation occurred.
