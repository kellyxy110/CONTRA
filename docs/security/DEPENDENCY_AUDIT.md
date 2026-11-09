# Dependency security assessment

Date: 9 November 2026

Scope: locked npm graph on the M07 Contestation migration working tree

## Result

The inherited baseline contained 17 findings: 14 low, two high and one critical. The high and critical findings came from `near-workspaces@5.0.0` to `near-sandbox@0.1.5` to `tar@6.2.1`. The vulnerable archive parser was used by development Sandbox installation and was not imported by the production API or browser bundle. It was nevertheless reachable during clean installation and therefore remained a release blocker.

`near-workspaces@5.0.0` requires the legacy `near-sandbox/install` interface, so replacing the Sandbox package itself is incompatible. The root manifest instead retains `near-sandbox@0.1.5` and overrides only its archive parser to `tar@7.5.22`. Clean installs disable dependency lifecycle scripts, then CONTRA downloads the required NEAR Sandbox 2.13.4 archive directly, verifies its SHA-256 and extracts it with the host `tar` command. The current audit contains 15 low findings and zero moderate, high or critical findings. The override must pass the full Linux Sandbox and financial gates before release.

## Current residual findings

The remaining 15 low package findings originate from `elliptic` through `secp256k1` and the NEAR JavaScript account, cryptography, provider, transaction, wallet-selector and `near-api-js` graph. npm proposes downgrades or incompatible major changes rather than a safe in-range remediation. These libraries are used for NEP-413 verification, RPC transaction parsing, wallet request construction and the local test harness, so they are reachable.

Mitigations:

- Only Ed25519 NEP-413 authentication is accepted by the current API.
- Signer, receiver, method, arguments, deposit, network, transaction hash and finality are independently verified.
- Browser wallet code never receives server provider keys or contract signing keys.
- UNKNOWN outcomes remain locked and are never blindly redispatched.
- Pinned versions, source policy, secret scanning and the accepted-advisory CI baseline prevent unnoticed regression.
- Any future NEAR library upgrade requires wallet, receipt, Sandbox and commitment-vector regression.

## Reproduction

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm audit --json
npm ls near-workspaces near-sandbox tar --all
node scripts/ci-dependency-audit.mjs
```

Expected dependency path:

```text
near-workspaces@5.0.0
  near-sandbox@0.1.5
    tar@7.5.22 overridden
```

The security CI reports newly introduced packages, increased severities and unaccepted advisories. A passing baseline does not mean residual findings are harmless.
