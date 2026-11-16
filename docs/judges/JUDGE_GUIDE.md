# Judge guide

This guide separates public Testnet evidence, credential-free local reproduction and optional wallet exploration. It does not treat fixtures as live evidence or claim a completed challenged Testnet appeal.

## Current public release

| Resource | Verified value |
| --- | --- |
| Application | [contra-near.pages.dev](https://contra-near.pages.dev/) |
| NEAR network | Testnet |
| Contract | [`contra-contestation.testnet`](https://testnet.nearblocks.io/address/contra-contestation.testnet) |
| Contract code hash | `EtUc3f99vfTwVoRJfS9MNCirxpQ5KpNFNen7XZUD7LA2` |
| Settled case | `e6bb304c52aeb9b0251b052c05c8796913e7246280a3300dd7b8badc6ada7278` |
| Settlement receipt | [`GJDsDsQwssCGxjmYMh1d3ee3LkyHzamx887k1CVyBEfk`](https://testnet.nearblocks.io/txns/GJDsDsQwssCGxjmYMh1d3ee3LkyHzamx887k1CVyBEfk) |
| Settlement result | Callback-authenticated `SUCCESS_VERIFIED`, one payout attempt, exact `0.1 NEAR` `BASE_REFUND` to `contra-creator.testnet` |

The public readiness endpoint reports Durable Object integrity and a fresh finalised Testnet observation. The application and contract can be inspected without a wallet. Protected evidence and account-scoped application records require an authenticated eligible account.

## Route A: public verification without credentials

1. Open the [public application](https://contra-near.pages.dev/). Demo Mode is explicitly labelled and cannot sign, spend, call providers or modify Testnet state.
2. Open [`/api/live`](https://contra-near.pages.dev/api/live) and [`/api/ready`](https://contra-near.pages.dev/api/ready). Confirm service liveness, SQLite Durable Object integrity, `network: testnet`, the expected contract account and a fresh non-regressed final block.
3. Inspect [`contra-contestation.testnet`](https://testnet.nearblocks.io/address/contra-contestation.testnet) and its public transaction history.
4. Inspect the [final settlement receipt](https://testnet.nearblocks.io/txns/GJDsDsQwssCGxjmYMh1d3ee3LkyHzamx887k1CVyBEfk). It records the live case's final callback-confirmed settlement.
5. Review the retained [settlement and provider evidence](../../project/artifacts/phase3/live-settlement-provider-evidence-2026-11-14.json). The Meta proposal and Modal verification are retrospective, non-binding artifacts. They did not create votes, change the verdict or authorise settlement.
6. Review the [protocol](../PROTOCOL.md), [architecture](../ARCHITECTURE.md), [threat model](../THREAT_MODEL_V1.md) and [acceptance matrix](ACCEPTANCE_MATRIX.md).
7. Review the current [Core](https://github.com/kellyxy110/CONTRA/actions/workflows/core.yml), [Security](https://github.com/kellyxy110/CONTRA/actions/workflows/security.yml), [Contract](https://github.com/kellyxy110/CONTRA/actions/workflows/contract.yml) and [Integration](https://github.com/kellyxy110/CONTRA/actions/workflows/integration.yml) results.

The verified live settlement used the contract's no-quorum `BASE_REFUND` policy. It is not evidence of a completed challenged appeal journey.

## Route B: reproduce locally

Use Ubuntu 24.04 x86_64 with Node.js 26.13.0, Rust 1.98.0 plus `wasm32-unknown-unknown`, and an open-file hard limit of at least 65535. From a clean clone, run:

```sh
npm run judge:local
```

No wallet, private key, paid provider or external credential is required. The command performs a clean install, repository and Rust tests, production and fault WASM builds, ABI and commitment checks, the wallet bundle, pinned Sandbox installation and the complete controlled journey. It exits nonzero if the result lacks genuine local Sandbox receipts, immutable evidence, non-binding AI artifacts, reviewer commitment and reveal, fresh reversal, exact 1 NEAR creator refund, BASE_REFUND timeout, zero wallet redispatch or zero AI-created commitments.

The run finishes with `[JUDGE] PASS` and writes its machine report to `ci-output/judge-quickstart/report.json`. Provider calls and external-wallet activity in this route are explicitly mocked or simulated. Follow [reproducibility](../testing/REPRODUCIBILITY.md) for individual commands and retained artifact locations.

## Route C: explore Testnet with a wallet

This route is available. It proves wallet authentication and account-scoped inspection, but it does not grant a judge general transaction authority.

1. Open [CONTRA](https://contra-near.pages.dev/) and select the live Testnet data mode rather than Demo Mode.
2. Select **Connect wallet** and choose a displayed wallet that supports Testnet and NEP-413 message signing.
3. Approve the domain-bound authentication message in the wallet. Authentication proves control of the selected account but cannot move funds or vote.
4. Inspect Settings for the connected account, Testnet network, contract address and session state.
5. Inspect the available account-scoped Cases, Evidence, Evaluations, The Bench, Settlement and Activity records. Protected records remain unavailable to unrelated accounts by design.
6. Disconnect from Settings when finished. The application retains no private key or seed phrase.

Every contract mutation requires an eligible account, a persisted operation, an exact payload hash, a matching server-side authority and a separate wallet confirmation. Judges are not given privileged keys, funded accounts or blanket signing permission. An empty or access-denied workspace is therefore an expected security result for an unrelated wallet.

## Verification matrix

| Judge action | Expected evidence | Evidence class |
| --- | --- | --- |
| Open the application | Public interface, explicit Demo or Testnet boundary, no credential required | Production |
| Inspect service readiness | Durable storage integrity and fresh finalised Testnet block | Production read-only |
| Inspect the deployed contract | Testnet account, code and public transaction history | Public Testnet |
| Inspect the funded case settlement | Finalised receipt, one payout attempt and exact 0.1 NEAR creator refund | Genuine Testnet |
| Review the Meta proposal | Model identity, citations, proposal digest and non-binding status | Genuine retrospective provider execution |
| Review Modal verification | Verification digest bound to the exact Meta proposal digest | Genuine retrospective provider execution |
| Observe a complete challenge reversal | Primary ACCEPT reversed to fresh REJECT with exact payout | Local NEAR Sandbox |
| Review committee enforcement | Appointed reviewers, commitment, reveal, quorum and committee separation | Sandbox plus Testnet registry evidence |
| Restart the workflow | Durable recovery without redispatch or duplicate payout | Repository and controlled-workflow tests |
| Submit malformed provider output | Explicit rejection without a reviewer vote or settlement transition | Repository tests |
| Run the judge command | Complete controlled journey and retained machine report | Local NEAR Sandbox |

## Evidence boundaries and limitations

- The public contract and application are live on NEAR Testnet.
- The retained Testnet case was funded and settled through the no-quorum `BASE_REFUND` fallback.
- Meta and Modal executed against that closed case retrospectively. Their artifacts remained non-binding.
- Six distinct Testnet reviewer accounts were registered and used during live validation. Operator independence is based on the supplied signed control disclosures and is not independently audited by the repository.
- A complete challenged Testnet journey with counterevidence, fresh appeal review and final settlement remains post-hackathon work.
- The complete challenged reversal, timeout fallback, duplicate-payout protection and exact-recipient assertions remain reproducible through genuine local NEAR Sandbox execution.
- No Mainnet deployment, unrestricted funded judge account or public signing key is provided.

The current [AC01 to AC33 acceptance matrix](ACCEPTANCE_MATRIX.md) records the evidence class and remaining limitation for each criterion.
