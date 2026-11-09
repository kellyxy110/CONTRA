# Reproducibility

## Supported clean host

- Ubuntu 24.04 x86_64
- Node.js 26.13.0
- Rust 1.98.0 with `wasm32-unknown-unknown`
- Open-file hard limit of at least 65535 for NEAR Sandbox

## Clean verification

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm run test:contract
node scripts/build-contracts.mjs
node scripts/ci-contract-abi.mjs
node scripts/ci-commitment-vectors.mjs
npm run build:wallet
node scripts/ci-policy.mjs core
node scripts/ci-policy.mjs security
npm run check:docs
```

The repository suite currently contains 102 tests, including five deployment-preflight cases that verify secret rejection, authorisation binding, artifact identity, network identity, full-access key scope, account funding and stale-chain failure. Four runtime-operations cases verify exclusive durable-volume ownership, live-process exclusion, same-host crash reclamation, failed-start cleanup and graceful restart. Explicit CI routing covers the non-signing deployment path.

The preparation-only deployment assessment is expected to remain blocked until the owner-controlled fields are supplied:

```sh
node scripts/testnet-deployment-preflight.mjs config/testnet-deployment.example.json
```

It exits with status 2 and writes a blocker report. It does not sign or broadcast.

## Local NEAR execution

```sh
node scripts/setup-sandbox.mjs
npm run test:sandbox
npm run test:m04:journeys
npm run test:m06:controlled
```

The baseline verifies real local NEAR transfers, deadline behaviour, challenge lockout, fresh-review reversal, callback failure and UNKNOWN protection. The controlled workflow combines simulated external-wallet and provider transports with actual local Sandbox contract calls. Each report identifies that boundary.

## Expected artifacts

- Sandbox receipt and balance reports under `project/artifacts/implementation/`
- Journey operations and receipts under `project/artifacts/m04/local-journeys/`
- Controlled workflow output under `ci-output/m06-controlled-workflow/` in CI
- Contract export report under `ci-output/contract-abi.json`

Historical artifact names are preserved. Current builds use `contra_contestation.wasm` and receive new checksums rather than rewriting old evidence.
