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
