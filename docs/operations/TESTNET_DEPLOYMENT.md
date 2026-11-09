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

The versioned plan template is [`config/testnet-deployment.example.json`](../../config/testnet-deployment.example.json). It contains no signing material. Copy it outside the repository or to an ignored local path, then fill only the checksum of the exact release artifact, public account, public key, custody classification, funding ceiling and owner-authorisation metadata. Do not reuse a checksum from a different runner or build. The owner authorisation must contain `approved_plan_sha256`, which binds the exact network, account, public key, artifact, cost limits and initial contract configuration.

Run the offline assessment after building the production artifact:

```sh
node scripts/testnet-deployment-preflight.mjs path/to/approved-plan.json
```

Before authorisation, the example exits with status 2 and lists every missing owner-controlled input. That is an expected blocked result, not a deployment failure.

After a complete plan is separately authorised, the read-only network check is:

```sh
node scripts/testnet-deployment-preflight.mjs path/to/approved-plan.json --online-readonly
```

This validates the live chain ID, final block freshness, current code hash, account balance and exact full-access public key. It writes `ci-output/testnet-deployment-preflight.json` and prints the complete `near` deployment command for inspection. It never invokes the command, accesses a private key, signs or broadcasts.

## Evidence required after authorisation

Archive the account, signer identity without secret material, artifact checksum, deployment transaction hash, finalised receipts, deployed code hash, RPC block identity, ABI result and explorer links. Read the deployed state through the real RPC and compare the onchain code hash with the tested artifact.

Failures, UNKNOWN outcomes or contradictory hashes stop the procedure. Deployment must never be retried blindly.
