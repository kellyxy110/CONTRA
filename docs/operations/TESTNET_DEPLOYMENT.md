# NEAR testnet deployment

Status: preparation only. No deployment or funded signing is authorised or claimed.

## Required authorisation

Before any external action, record the dedicated testnet contract account, account owner, access-key permissions, custody method, funding ceiling and explicit owner authorisation in the deployment evidence record. Never place a private key or seed phrase in this repository, a command transcript or browser configuration.

## Environment separation

- `unavailable` is the safe default and permits no chain transaction.
- `sandbox` uses controlled local accounts and the pinned local binary.
- `testnet` permits verified read-only RPC configuration. Live signing remains a separate server gate.
- mainnet is unsupported and disabled.

## Reproducible artifact

```sh
npm ci --ignore-scripts --no-audit --no-fund
cargo test --locked --manifest-path contracts/contestation/Cargo.toml --lib -- --test-threads=1
node scripts/build-contracts.mjs
node scripts/ci-contract-abi.mjs
node scripts/ci-commitment-vectors.mjs
sha256sum contracts/contestation/target/wasm32-unknown-unknown/release/contra_contestation.wasm
```

The production artifact must expose only the ABI baseline. Fault-only exports must exist only in `faults.wasm`.

## Preflight requirements

The deployment command must refuse to proceed unless all of the following match the approved record:

1. Network identity is `testnet`.
2. RPC finality is fresh and the chain ID is verified.
3. Contract account is the exact authorised `.testnet` account.
4. Signer account and access key match the custody record and permitted actions.
5. Local production WASM checksum and allowed exports match the release evidence.
6. Expected current code hash or explicit empty-account state is confirmed.
7. Funding and attached deposit remain within the authorised ceiling.

## Evidence required after authorisation

Archive the account, signer identity without secret material, artifact checksum, deployment transaction hash, finalised receipts, deployed code hash, RPC block identity, ABI result and explorer links. Read the deployed state through the real RPC and compare the onchain code hash with the tested artifact.

Failures, UNKNOWN outcomes or contradictory hashes stop the procedure. Deployment must never be retried blindly.
