# Judge guide

This guide separates what is public now from what requires a future authorised deployment.

## Route A: public verification without credentials

1. Inspect the public repository, MIT licence, architecture, protocol, threat model and dependency assessment.
2. Review archived local Sandbox receipts, evidence digests, reviewer commitments and exact settlement results.
3. Review the benchmark plan and explicit limitations.
4. When the authorised testnet deployment exists, use the account and transaction links recorded in this guide. No live link is claimed yet.

## Route B: reproduce locally

Use Ubuntu 24.04 x86_64 with Node.js 26.13.0, Rust 1.98.0 plus `wasm32-unknown-unknown`, and an open-file hard limit of at least 65535. From a clean clone, run:

```sh
npm run judge:local
```

No wallet, private key, paid provider or external credential is required. The command performs a clean install, repository and Rust tests, production and fault WASM builds, ABI and commitment checks, the wallet bundle, pinned Sandbox installation and the complete controlled journey. It exits nonzero if the result lacks genuine local Sandbox receipts, immutable evidence, non-binding AI artifacts, reviewer commitment and reveal, fresh reversal, exact 1 NEAR creator refund, BASE_REFUND timeout, zero wallet redispatch or zero AI-created commitments.

Expected final output begins with `[JUDGE] PASS` and the machine report is written to `ci-output/judge-quickstart/report.json`. Provider and external-wallet operations remain explicitly simulated. Follow [reproducibility](../testing/REPRODUCIBILITY.md) for individual commands and retained artifact locations.

## Route C: explore testnet

BLOCKED pending owner-authorised testnet deployment, backend hosting and funded wallet signing. The future route will provide read-only contract and case inspection without a wallet, plus a bounded signed route for authorised testnet accounts. Privileged keys and unrestricted funded accounts will never be published.

## Verification matrix

| Judge action | Expected evidence | Current route |
| --- | --- | --- |
| Inspect funded agreement | Immutable terms and exact escrow state | Local Sandbox artifacts |
| Review AI proposal | Model fixture identity, citations and non-binding proposal status | Controlled workflow |
| Inspect counterexample | Linked evidence and contested criterion | Controlled workflow |
| Observe challenge | Ordinary settlement blocked | Sandbox journeys |
| Review committee decision | Authenticated commitments, reveals and quorum | Sandbox journeys |
| Inspect settlement | Finalised receipt and exact recipient | Sandbox journeys |
| Restart workflow | Durable recovery without redispatch or duplicate payout | Repository tests and controlled workflow |
| Submit malformed output | Explicit rejection with no reviewer vote | Repository tests |
| Inspect cost report | Actual local gas, zero provider spend and stated limitations | M03 evidence and project status |

Historical evidence is labelled by checkpoint. Live network evidence will be added only after the corresponding transaction occurs.

The current [AC01 to AC33 acceptance matrix](ACCEPTANCE_MATRIX.md) records exact evidence classes, commit and CI links, and every remaining limitation. Its current result is 23 PASS, 8 PARTIAL and 2 BLOCKED.
