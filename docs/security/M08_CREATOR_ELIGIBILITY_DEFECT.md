# M08 creator eligibility defect

## Finding

The deployed `get_config` result identifies `contra-contestation.testnet` as both the contract account and the sole member of `creator_allowlist`. Contract case preparation first requires the caller to be allowlisted, then rejects a creator equal to `env::current_account_id()`. The intersection of those rules is empty for the deployed state.

The official testnet RPC reconfirmed this configuration at final block `277008099`, hash `5LurWxEQdEjjpMbuSxjdMBjh814q8feijeusetMKgjbP`. The public observation is retained in [`project/artifacts/m09/creator-eligibility.json`](../../project/artifacts/m09/creator-eligibility.json).

The M08 deployment originally had no eligible creator. M09.1 repaired the deployed allowlist through the separately authorised, one-time upgrade procedure. `contra-creator.testnet` is now the sole eligible creator. AC31 and AC32 remain BLOCKED because their complete live wallet, reviewer and provider journeys have not yet executed.

## Safety impact

Escrow and payout invariants are not bypassed. The defect is a fail-closed availability failure before case creation. The deployed artifact and state must not be changed without a new bounded authorisation.

## Remediation options

1. Preferred if the existing contract exposes no allowlist mutation: deploy the identical approved contract to a replacement account and initialise it with a distinct, verified creator account. This creates a new contract identity and requires a new artifact, account, funding, signer and acceptance digest even when the WASM bytes are unchanged.
2. Versioned upgrade: add an owner-only, one-yoctoNEAR allowlist mutation method with explicit event, bounded list validation and migration tests, then upgrade the existing account. This changes the ABI and code hash and requires full contract, financial P0 and upgrade authorisation.
3. State migration to a new contract version: export the empty initial state, deploy a versioned replacement and initialise a valid creator allowlist. This is appropriate only while no cases or escrow exist, and still requires a new deployment authorisation.

Changing or bypassing the creator inequality is not recommended because it prevents the contract account from becoming a payout party and preserves separation between contract custody and participant identity.

## Current decision

NO-GO for live wallet signing or funded case creation. Read-only contract inspection and local Cloudflare implementation remain safe. No redeployment, upgrade, replacement account or signed remediation is authorised by this report.
