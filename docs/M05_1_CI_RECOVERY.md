# M05.1 CI recovery and retrospective verification

Checkpoint: `CONTRA-2026-11-07-IMPL-M05.1-CI`

Product-source baseline: `34c836bbd02dc672325800b2951714ee6e935659`

CI setup branch: `ci/m05.1-recovery`

This milestone adds verification infrastructure to the accepted product tree. It does not claim that GitHub Actions existed when M03, M04 or M05 completed, and a current-head run is not proof that every historical commit passed independently.

## Workflow matrix

| Workflow | Job | Scope | Trigger policy |
| --- | --- | --- | --- |
| `core.yml` | `core-node` | Clean install, source policy, JavaScript syntax, 52 repository tests, explicit M05 tests, wallet build and historical evidence review | Pull requests to `main` or `implementation/oct28`, active implementation pushes and manual |
| `contract.yml` | `contract-rust` | rustfmt, strict Clippy, 28 Rust tests, production and fault Wasm, ABI exports and exact commitment vectors | Contract-relevant pull requests and pushes, plus manual |
| `security.yml` | `security-policy` | Full-history credential and restricted-file checks, source policy and dependency audit delta | Every pull request, protected release pushes and manual |
| `integration.yml` | `sandbox-integration` | Pinned Sandbox preflight, nine-test baseline, both M04 journeys, receipts, exact balances and UNKNOWN safety | Relevant pull requests, release candidates and manual |
| `financial-p0.yml` | `financial-p0` | Existing F01 through F18 financial gate with retained receipts, gas, balances, storage and failures | Financially relevant release candidates and manual only |

GitHub-hosted jobs use Ubuntu 24.04, Node 26.13.0, exact lockfiles and action commit pins. The Node cache contains package downloads only. Installed platform binaries and `node_modules` are never cached or reused from Windows.

## Retrospective verification matrix

| Milestone | Exact historical product source | Current retrospective coverage | Historical boundary |
| --- | --- | --- | --- |
| M03 | `bbae5c3f168726a62d704f8bbd3555b679bd5778` | Rust, SDK, production/fault Wasm exports, exact vectors, archived 18/18 P0 evidence with 454 transactions, 753 receipt outcomes and 46 snapshots | Evidence integrity is reviewed now. No claim is made that Actions ran at M03 completion. |
| M04 | `bce586cf223c4120d42d6668c1c707ca84bcadf8` | Service and evidence tests plus archived two-journey evidence with 44 operations, 44 receipts and exact 1 NEAR beneficiary and creator settlements | The six local reviewer accounts remain one-process fixtures, not independent operators. |
| M05 | `34c836bbd02dc672325800b2951714ee6e935659` | Current core tests, wallet build, runtime modes, persistence, restart recovery, RPC failure, stale reads and read-only network behavior | Current-head CI verifies the accepted M05 source plus the separately identified CI infrastructure changes. |

The contract source is rustfmt-normalized for the required formatting gate. Two strict Clippy rewrites remove an unnecessary borrow and use an inclusive range helper without changing the checked bounds. The historical M05 production Wasm SHA-256 remains recorded as `c607adf597dfbf898d8e442fd71b3b75e7032ad47fd808fb50e89e0573fd3ef8`. The rebuilt CI-formatted artifact is `00b8db129470b8d032d0da020018570b6d1950fdbba136645c41dc69d4c506e2`. Both are distinguished in `ci/contract-abi-baseline.json`; current CI enforces the latter plus the exact 29 production and four fault-only exports.

## Security findings

- The source and complete Git history checks found no forbidden private key, GitHub token, AWS key, OpenAI key or NEAR key material.
- Playwright was updated from 1.49.1 to pinned 1.65.0, removing its direct high-severity advisory.
- The accepted dependency baseline still reports 17 inherited findings: 14 low, two high and one critical. The high and critical findings flow through the current NEAR development and Sandbox dependency graph. They are reported as unresolved maintenance risk, not concealed or described as fixed.
- New packages, higher severities or new advisory identifiers fail the security job relative to the recorded baseline.
- Production contract exports and fault-only hooks are checked separately. An unexpected production method or debug hook fails CI.

## Pull request discipline

Future engineering units use focused branches and pull requests. `core-node` and `security-policy` are the global merge requirements. Contract, integration and financial checks are additionally required when their paths or invariants are affected. Skipped or unavailable checks must be reported truthfully. Automatic merge stays disabled.

The CI setup pull request targets `implementation/oct28`. After it passes and is merged, an integration pull request may target `main`, but `main` must not be merged without explicit owner authorization.

## Local verification before the first remote run

- Repository and M05 suite: 52 passed, zero failed.
- Rust contract: 28 passed, zero failed.
- rustfmt: passed.
- Clippy with warnings denied: passed.
- Wallet bundle: passed with Playwright 1.65.0.
- ABI: 29 production exports and four fault-only exports matched.
- Exact commitment, case, terms and payout vectors: passed.
- Historical evidence integrity review: passed.
- Dependency delta check: passed with the 17 unresolved accepted findings disclosed above.

GitHub run and pull request URLs are added only after genuine remote execution.
