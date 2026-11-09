# CONTRA

*A decentralised contestation protocol for evidence-based decisions and enforceable outcomes on NEAR.*

**Product promise:** Every consequential decision should withstand a challenge.

[![Core CI](https://github.com/kellyxy110/CONTRA/actions/workflows/core.yml/badge.svg?branch=main)](https://github.com/kellyxy110/CONTRA/actions/workflows/core.yml)
[![Security CI](https://github.com/kellyxy110/CONTRA/actions/workflows/security.yml/badge.svg?branch=main)](https://github.com/kellyxy110/CONTRA/actions/workflows/security.yml)
[![Contract CI](https://github.com/kellyxy110/CONTRA/actions/workflows/contract.yml/badge.svg?branch=main)](https://github.com/kellyxy110/CONTRA/actions/workflows/contract.yml)
![Network: local Sandbox verified](https://img.shields.io/badge/network-local%20Sandbox%20verified-00EC97?style=flat-square&labelColour=0B1110)
![Testnet deployment: pending authorisation](https://img.shields.io/badge/testnet%20deployment-pending%20authorisation-F4BD68?style=flat-square&labelColour=0B1110)
![Licence: MIT](https://img.shields.io/badge/licence-MIT-00EC97?style=flat-square&labelColour=0B1110)

CONTRA enables consequential decisions to be challenged, reviewed against immutable evidence and resolved through enforceable rules. AI contributes evidence-bound proposals, reviewers evaluate contested claims, challenges prevent premature settlement, and the NEAR contract applies the final result or agreed fallback. AI cannot cast votes, change frozen terms or authorise payments.

The current repository contains the Rust contract, durable API, wallet lifecycle, reviewer controls, provider fixtures, operational client and reproducible local NEAR Sandbox journeys. No testnet contract, public backend, live provider call or independent six-operator committee is claimed yet.

## Contents

- [Why CONTRA](#why-contra)
- [Lifecycle](#lifecycle)
- [Architecture and trust](#architecture-and-trust)
- [Verified implementation state](#verified-implementation-state)
- [Quick start](#quick-start)
- [Reproduce the contestation journeys](#reproduce-the-contestation-journeys)
- [Testing and evidence](#testing-and-evidence)
- [Security and limitations](#security-and-limitations)
- [Judge and deployment paths](#judge-and-deployment-paths)
- [Benchmarks](#benchmarks)
- [Project provenance](#project-provenance)
- [Licence and acknowledgements](#licence-and-acknowledgements)

## Why CONTRA

Escrow and consequential automated decisions need more than a model response. They need frozen terms, attributable evidence, authenticated review, a challenge window and deterministic settlement. CONTRA makes those transitions auditable and places final financial authority in a NEAR smart contract rather than an AI service or application server.

Creators and beneficiaries use the protocol to define and fund an agreement. Evidence contributors submit content-addressed material. Appointed reviewers commit and reveal votes. Challengers identify a contested criterion and counterevidence. Auditors and judges can inspect the resulting state, receipts and exact payout result.

## Lifecycle

1. A creator defines immutable criteria, beneficiary, deadlines and primary and fresh reviewer committees.
2. The beneficiary consents and the creator funds exact native NEAR escrow.
3. Evidence is stored offchain with immutable digests and bound to the onchain case.
4. AI evaluators may propose cited findings, but those artifacts remain non-binding.
5. Authenticated reviewers commit and reveal decisions against the frozen evidence identity.
6. A valid challenge locks ordinary settlement and activates the disjoint fresh committee.
7. The contract resolves quorum or timeout outcomes and creates one immutable payout intent.
8. Settlement becomes final only after the authenticated NEAR callback verifies the transfer outcome. UNKNOWN outcomes stay locked and are never blindly retried.

Authoritative behaviour is defined in [the protocol specification](docs/PROTOCOL.md), [state machine](docs/STATE_MACHINE_V1.md), [contract ABI](docs/CONTRACT_ABI_V1.md) and [settlement recovery rules](docs/SETTLEMENT_RECOVERY_V1.md).

## Architecture and trust

| Component | Responsibility | Authority boundary |
| --- | --- | --- |
| NEAR Contestation contract | Terms, committees, commit and reveal, challenge, resolution and payout | Sole financial and resolution authority |
| API and durable store | Authentication, transaction intents, evidence objects, audit history and recovery | Cannot fabricate finalised chain state |
| External wallet adapter | NEP-413 identity and user-approved calls | Live signing disabled unless server configuration authorises it |
| AI evaluators | Evidence-bound proposals and verification | Cannot vote, mutate terms or settle |
| Reviewers | Human findings, commitments and reveals | Must match frozen committee and signer identity |
| Operational client | Minimal workflow and state inspection | Not a source of financial truth |

See [architecture](docs/ARCHITECTURE.md), [threat model](docs/THREAT_MODEL_V1.md), [durable storage](docs/DURABLE_STORAGE.md) and [dependency assessment](docs/security/DEPENDENCY_AUDIT.md).

## Verified implementation state

| Capability | Current evidence |
| --- | --- |
| Contract and financial safety | 18-category F01 to F18 local P0 gate previously passed with archived receipts and balance evidence |
| Repository tests | 108 tests pass on the M09 backup-and-restore working tree |
| Local complete journeys | Unchallenged beneficiary payout and challenged primary reversal to creator refund pass in local NEAR Sandbox |
| Wallet safety | Simulated signing handoff, restart, UNKNOWN recovery, identity matching and duplicate prevention pass |
| Reviewer controls | Six-account fixture, operator disclosure, committee separation, commitment and reveal recovery pass |
| Provider interoperability | Meta, Baseten and Modal transports use non-billable fixtures with strict provenance and authority separation |
| Testnet deployment | Pending explicit owner authorisation, account and funded signing authority |
| Public backend | Not deployed |
| Independent reviewers | Not yet demonstrated; local accounts are one-process fixtures |
| Live provider usage | Not authorised and not performed; spend is $0 |

The acceptance baseline remains 21 PASS, 10 PARTIAL and 2 BLOCKED until AC01 to AC33 are independently reevaluated. See [project status](project/STATUS.md) and [blockers](project/BLOCKERS.md).

## Quick start

Supported clean host: Ubuntu 24.04, Node.js 26.13.0, Rust 1.98.0 and the `wasm32-unknown-unknown` target.

```sh
git clone https://github.com/kellyxy110/CONTRA.git
cd CONTRA
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm run test:contract
node scripts/build-contracts.mjs
npm run build:wallet
```

Expected results are 108 repository tests, 28 Rust library tests, production and fault WASM builds with separated exports, and a wallet bundle. The repository tests include exclusive durable-volume ownership, same-host crash recovery, graceful runtime restart, manifest-bound backup and tamper-detecting restore coverage. Dependency lifecycle scripts are disabled because CONTRA installs its checksum-pinned Sandbox binary explicitly. The same install command supports Windows source, service and frontend work, but Sandbox execution remains Linux-only.

The API defaults to safe unavailable mode:

```sh
cp .env.example .env
npm run dev
```

`GET http://127.0.0.1:4173/api/health` reports the configured chain and durable-store state. Unavailable mode refuses transaction submission.

## Reproduce the contestation journeys

On the supported Linux host:

```sh
node scripts/setup-sandbox.mjs
npm run test:sandbox
npm run test:m04:journeys
npm run test:m06:controlled
```

These commands use local NEAR Sandbox accounts and deterministic provider and external-wallet simulations. They do not deploy to testnet, call paid providers or prove independent reviewer control. Expected outcomes include exact 1 NEAR settlement to the beneficiary in the unchallenged journey, exact creator refund after a fresh-review reversal in the challenged journey, and no duplicate payout after repeated finalisation.

Detailed clean-start and artifact instructions are in [reproducibility](docs/testing/REPRODUCIBILITY.md).

## Testing and evidence

- [M03 financial verification](docs/FINANCIAL_VERIFICATION_M03.md)
- [M04 acceptance evidence](docs/M04_ACCEPTANCE.md)
- [M05 runtime and backend](docs/M05_RUNTIME_BACKEND.md)
- [M06 provider interoperability](docs/M06_PROVIDER_INTEROPERABILITY.md)
- [CI risk policy](docs/CI_RISK_POLICY.md)
- [Historical machine evidence](project/artifacts/)

Historical evidence retains its original names, paths, timestamps and outputs. Current source uses Contestation terminology. The migration does not rewrite commits or signed and transaction evidence.

## Security and limitations

The contract preserves immutable terms, exact deposits, disjoint committees, deterministic quorum, challenge lockouts, callback-authenticated settlement and UNKNOWN payout protection. The M07 dependency remediation removes the inherited critical and high npm findings by retaining the compatible Sandbox harness and overriding its archive parser to `tar` 7.5.22. Fifteen low findings remain in the NEAR JavaScript cryptography and wallet graph and are disclosed in [the dependency assessment](docs/security/DEPENDENCY_AUDIT.md).

Important limitations:

- No public testnet deployment or funded live wallet journey exists yet.
- Six local reviewer accounts are fixtures controlled by one process, not independent operators.
- Provider model availability, identifiers, credits and billing are not operationally verified.
- SQLite and content-addressed objects require one durable volume and coordinated backup.
- Passing the hackathon engineering gate will not establish production readiness or decentralised governance.

Secrets belong only in server environments. No private key, seed phrase or provider secret may enter browser assets, logs or commits.

## Judge and deployment paths

[The judge guide](docs/judges/JUDGE_GUIDE.md) separates public inspection, credential-free local reproduction and the future authorised testnet route. Until testnet deployment exists, the live route is explicitly blocked rather than simulated.

[The testnet deployment runbook](docs/operations/TESTNET_DEPLOYMENT.md) defines the fail-closed preflight, custody requirements, artifact verification and evidence record. The checked-in public plan template and offline validator report missing owner-controlled inputs without accessing a key. Deployment, funded signing, provider spend and production-secret changes require separate owner authorisation.

## Benchmarks

[The benchmark plan](docs/BENCHMARKS.md) and [30-case scenario plan](benchmarks/case-plan.csv) are inputs, not completed results. No comparative superiority claim is made. Future results must publish denominators, failures, costs, timings and ground-truth limitations.

## Project provenance

Actual implementation began on 28 October 2026 with owner authorisation. Current hackathon rules accept code since the 19 October announcement, but CONTRA preserves the exact start date and Git history. Primary track is `security`; additional applicable track is `open`. See [hackathon compliance](docs/HACKATHON_COMPLIANCE.md).

The owner controls final frontend design, demo production, public X publication and submission. This engineering programme maintains the existing operational client and does not replace the approved visual reference.

## Licence and acknowledgements

CONTRA is available under the [MIT licence](LICENSE). It uses NEAR Protocol, near-sdk, NEAR JavaScript libraries, NEAR Wallet Selector and the provider interfaces documented in the repository. AI-assisted development is disclosed through the repository history and project records; AI outputs do not become protocol authority.
