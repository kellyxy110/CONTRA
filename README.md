# CONTRA

> Product-first core work is active. M05 R03 freshly passes the complete 18-category P0 financial regression and both local Sandbox journeys. Runtime modes, finalized RPC metadata, durable SQLite plus object storage, restart recovery, backend controls and failure tests are implemented. External wallet, independent reviewer, live provider and configured testnet-contract gates remain open. UI polish and demo production are deferred until core verification is complete.

![Stage: mixed provenance](https://img.shields.io/badge/stage-mixed%20provenance-00EC97?style=flat-square&labelColor=0B1110)
![Network: NEAR testnet planned](https://img.shields.io/badge/network-NEAR%20testnet%20(planned)-0B1110?style=flat-square)
![Protocol: UX3C frozen](https://img.shields.io/badge/protocol-UX3C%20frozen-FF8678?style=flat-square&labelColor=0B1110)
![P0 Sandbox: passed](https://img.shields.io/badge/P0%20Sandbox-passed-00EC97?style=flat-square&labelColor=0B1110)
![M04 local journeys: 2 passed](https://img.shields.io/badge/M04%20local%20journeys-2%20passed-00EC97?style=flat-square&labelColor=0B1110)
![Service and coverage tests: 52 passed](https://img.shields.io/badge/service%20and%20coverage%20tests-52%20passed-00EC97?style=flat-square&labelColor=0B1110)
![M04.3 browser checks: 315 passed](https://img.shields.io/badge/M04.3%20browser%20checks-315%20passed-00EC97?style=flat-square&labelColor=0B1110)
![GitHub owner: kellyxy110](https://img.shields.io/badge/GitHub%20owner-kellyxy110-F4BD68?style=flat-square&logo=github&labelColor=0B1110)
![Repository: public](https://img.shields.io/badge/repository-public-F4BD68?style=flat-square&logo=github&labelColor=0B1110)
![Deployment: none](https://img.shields.io/badge/deployment-none-9BAAA4?style=flat-square&labelColor=0B1110)

**Every judgment can be challenged.**

CONTRA is a NEAR adjudication prototype under implementation. Its Rust contract combines escrow, evidence-bound commit/reveal judgments, challenges and callback-safe settlement. Two complete local Sandbox settlements are verified through the integrated application. Independent live operator adjudication, paid-provider interoperability, external-wallet settlement and testnet deployment are not yet verified.

> Actual implementation began October 28, 2026 with owner authorization. The live hackathon rules say code since the October 19 announcement is eligible. The repository still records the exact October 28 start and does not rewrite history. No deployment or live paid AI call has occurred. See docs/IMPLEMENTATION_OCT28.md.

## Start here

Implementation commands (Node 24+, Rust 1.98.0, wasm32-unknown-unknown):

```sh
npm ci
npm test
npm run test:contract
node scripts/build-contracts.mjs
npm run build:wallet
npm run test:m04:journeys
npm run test:frontend:install
CONTRA_QA_ROOT=http://127.0.0.1:4173 npm run test:frontend
npm run dev
```

The safe default is explicit chain-unavailable mode. Copy `.env.example` values into the server environment, not a committed `.env` file. Runtime modes are:

| Mode | Required configuration | Expected result |
| --- | --- | --- |
| `unavailable` | `CONTRA_CHAIN_MODE=unavailable` | Health reports no chain and no transaction can be submitted. |
| `sandbox` | `CONTRA_CHAIN_MODE=sandbox` plus the pinned local Sandbox binary | Local controlled accounts and reproducible Sandbox workflows. |
| `testnet` | `CONTRA_CHAIN_MODE=testnet`, `CONTRA_RPC_URL`, `CONTRA_CONTRACT_ACCOUNT`, durable `CONTRA_DATA_DIR` | Startup fails closed unless the RPC is testnet, synchronized and the account contains deployed contract code. Reads include finalized block provenance. External signing remains disabled. |

The full dependency install and Sandbox commands require the compatible Linux host because the pinned `near-sandbox` package does not install its binary on Windows. For Windows frontend-only work, use `npm ci --ignore-scripts`, then `npm run test:frontend:install`. The browser test command requires a running retained local Sandbox app through `CONTRA_QA_ROOT`; it does not create transactions.

The minimal operational client is available at localhost:4173. Default mode reports chain unavailable and submits no transactions. On a host with an open-file hard limit of at least 65535, install the pinned official binary with `node scripts/setup-sandbox.mjs`, run `npm run test:sandbox`, then start with `CONTRA_CHAIN_MODE=sandbox npm run dev`. This creates local controlled accounts only. No testnet deployment or paid inference is included. External-wallet adapter compiles but is disabled pending separate authorization; it has not been verified in a funded wallet flow.

Saved checkpoints and test limitations: [October 28 implementation record](docs/IMPLEMENTATION_OCT28.md), [M03 financial verification](docs/FINANCIAL_VERIFICATION_M03.md), [M04 acceptance matrix](docs/M04_ACCEPTANCE.md), [M04.1 frontend acceptance](docs/M041_ACCEPTANCE.md), [M04.2 visual correction acceptance](docs/M042_ACCEPTANCE.md), and [M04.3 desktop and radar acceptance](docs/M043_ACCEPTANCE.md). Local Sandbox proof is not testnet deployment, independent operator proof, live provider verification, production readiness or owner visual acceptance.

1. `project/STATUS.md` is the authoritative project checkpoint.
2. `project/DECISIONS.md` contains accepted decisions and their rationale.
3. `project/CHANGELOG.md` records package changes.
4. `project/NEXT.md` gives the next task and acceptance criteria.
5. `docs/PRD.md` defines the product and proof of success.
6. `docs/PROTOCOL.md` defines states, safety rules and reviewer mechanics.
7. `docs/UX.md` maps the product and The Bench interactions.
8. `docs/ARCHITECTURE.md` maps contract and offchain boundaries.
9. `docs/BENCHMARKS.md` defines fair measurement and experiment guardrails.
10. `docs/M05_RUNTIME_BACKEND.md` records the current runtime and persistence checkpoint.
11. `docs/HACKATHON_COMPLIANCE.md` tracks live eligibility and submission requirements.
12. `docs/DURABLE_STORAGE.md` defines the single-volume backup and restore procedure.
13. `benchmarks/case-plan.csv` contains 30 benchmark scenario plans, not results.
14. `AGENTS.md` is the coding agent handoff and guardrail document.

Repository: [kellyxy110/CONTRA](https://github.com/kellyxy110/CONTRA), verified public on November 3, 2026. No repository secrets or deployment have been configured.

## Fixed constraints

- Eligible code window: October 19 through November 14, 2026 under current Q-001. Submission acceptance runs November 1 through November 14 at 23:59 UTC.
- Internal target: submit November 13, 2026.
- Actual product implementation began October 28 with owner authorization. Preserve that exact provenance even though current rules make it eligible.
- Network: NEAR testnet, native NEAR escrow for demonstration.
- Initial AI usage allocation: Meta $3, Baseten $3, Modal $5, from confirmed user-reported pools of $10, $10, and $30 monthly respectively.
- No unapproved out-of-pocket spending.
- Never present multiple accounts controlled by one operator as decentralization.
- Never treat LLM agreement as proof of objective truth.
- No em dash character in project copy, code, documentation, or metadata.
- README badges must describe verified state only, not fabricated CI or deployment success.

## Verified external references

- Hackathon: https://nearhackathon.com/
- NEAR developer documentation: https://docs.near.org/

Verification date for hackathon rules: November 7, 2026. The fetched copy is `HACKATHON.md`. Recheck the live source before submission.

## Deferred visual work

Visual polish, screenshot comparison and demo production are suspended during M05 through M07. The minimal operational frontend retains required UX3A assets because the current client imports them. The immutable reference remains preserved for the later scheduled UI phase.

## Owner-approved exact visual reference (v1.2)

**Coding-agent entrypoint:** `HANDOFF_TO_CODING_AGENT.md`. Original, unmodified image at `design/reference/control-ai-policy-dashboard.jpeg`; checksum and preservation rule in `docs/DESIGN_REFERENCE_INTEGRITY.md`. UI composition mapping in `docs/VISUAL_INTEGRATION_SPEC.md`. The source image must not be cropped, recolored, replaced, edited or re-encoded. Build the NEAR-colored UI separately in code.
