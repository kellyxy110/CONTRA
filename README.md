# CONTRA

> M03 P0 financial verification passed on the compatible WSL host. M04 adds structured evidence, transaction reconciliation, reviewer control disclosures, non-billable provider fixtures and two passing local Sandbox journeys. M04.1 adds verified responsive layouts, a segmented genuine-data radar and portable browser tests. See [M04.1 acceptance](docs/M041_ACCEPTANCE.md). Active avatars are neutral; frozen reference assets remain unchanged.

![Stage: mixed provenance](https://img.shields.io/badge/stage-mixed%20provenance-00EC97?style=flat-square&labelColor=0B1110)
![Network: NEAR testnet planned](https://img.shields.io/badge/network-NEAR%20testnet%20(planned)-0B1110?style=flat-square)
![Protocol: UX3C frozen](https://img.shields.io/badge/protocol-UX3C%20frozen-FF8678?style=flat-square&labelColor=0B1110)
![P0 Sandbox: passed](https://img.shields.io/badge/P0%20Sandbox-passed-00EC97?style=flat-square&labelColor=0B1110)
![M04 local journeys: 2 passed](https://img.shields.io/badge/M04%20local%20journeys-2%20passed-00EC97?style=flat-square&labelColor=0B1110)
![Service tests: 29 passed](https://img.shields.io/badge/service%20tests-29%20passed-00EC97?style=flat-square&labelColor=0B1110)
![Frontend checks: 58 passed](https://img.shields.io/badge/frontend%20checks-58%20passed-00EC97?style=flat-square&labelColor=0B1110)
![GitHub owner: kellyxy110](https://img.shields.io/badge/GitHub%20owner-kellyxy110-F4BD68?style=flat-square&logo=github&labelColor=0B1110)
![Repository: public](https://img.shields.io/badge/repository-public-F4BD68?style=flat-square&logo=github&labelColor=0B1110)
![Deployment: none](https://img.shields.io/badge/deployment-none-9BAAA4?style=flat-square&labelColor=0B1110)

**Every judgment can be challenged.**

CONTRA is a NEAR adjudication prototype under implementation. Its Rust contract combines escrow, evidence-bound commit/reveal judgments, challenges and callback-safe settlement. Two complete local Sandbox settlements are verified through the integrated application. Independent live operator adjudication, paid-provider interoperability, external-wallet settlement and testnet deployment are not yet verified.

> Actual implementation began October 28, 2026 with owner authorization, before the official competition. Do not claim that baseline as competition-window work. The F17 harness timeout correction and final P0 verification completed November 3 during the official window. Approved design/ux3a remains separate. No deployment or live paid AI call has occurred. See docs/IMPLEMENTATION_OCT28.md.

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

The full dependency install and Sandbox commands require the compatible Linux host because the pinned `near-sandbox` package does not install its binary on Windows. For Windows frontend-only work, use `npm ci --ignore-scripts`, then `npm run test:frontend:install`. The browser test command requires a running retained local Sandbox app through `CONTRA_QA_ROOT`; it does not create transactions.

The dashboard at localhost:4173 preserves approved UX3A geometry and assets. Default mode reports chain unavailable and submits no transactions. On a host with an open-file hard limit of at least 65535, install the pinned official binary with `node scripts/setup-sandbox.mjs`, run `npm run test:sandbox`, then start `CONTRA_SANDBOX=1 npm run dev`. This creates local controlled accounts only. No testnet deployment or paid inference is included. External-wallet adapter compiles but is disabled pending separate testnet authorization; it has not been verified in a funded wallet flow.

Saved checkpoints and test limitations: [October 28 implementation record](docs/IMPLEMENTATION_OCT28.md), [M03 financial verification](docs/FINANCIAL_VERIFICATION_M03.md), [M04 acceptance matrix](docs/M04_ACCEPTANCE.md), and [M04.1 frontend acceptance](docs/M041_ACCEPTANCE.md). Local Sandbox proof is not testnet deployment, independent operator proof, live provider verification, production readiness or owner visual acceptance.

1. `project/STATUS.md` is the authoritative project checkpoint.
2. `project/DECISIONS.md` contains accepted decisions and their rationale.
3. `project/CHANGELOG.md` records package changes.
4. `project/NEXT.md` gives the next task and acceptance criteria.
5. `docs/PRD.md` defines the product and proof of success.
6. `docs/PROTOCOL.md` defines states, safety rules and reviewer mechanics.
7. `docs/UX.md` maps the product and The Bench interactions.
8. `docs/ARCHITECTURE.md` maps contract and offchain boundaries.
9. `docs/BENCHMARKS.md` defines fair measurement and experiment guardrails.
10. `design/ux3a/index.html` is the active standalone The Bench design study. `design/judgment-room.html` remains a historical prototype.
11. `design/tokens.css` contains shared design tokens.
12. `benchmarks/case-plan.csv` contains 30 benchmark scenario plans, not results.
13. `AGENTS.md` is the coding agent handoff and guardrail document.

Repository: [kellyxy110/CONTRA](https://github.com/kellyxy110/CONTRA), verified public on November 3, 2026. No repository secrets or deployment have been configured.

## Fixed constraints

- Official hackathon: starts November 1, 2026 00:00 UTC; ends November 14, 2026 23:59 UTC.
- Internal target: submit November 13, 2026.
- Actual product implementation began October 28 with owner authorization. That source is pre-event work; separately record changes authored during the official competition window.
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

Verification date for hackathon rules: October 27, 2026. Recheck rules before submission.

## Owner-selected visual update (v1.1)

The original v1.0 layout is superseded. The current local design study follows `docs/VISUAL_DIRECTION.md` and `design/reference/control-ai-policy-dashboard.jpeg`. Owner review is still required.

## Owner-approved exact visual reference (v1.2)

**Coding-agent entrypoint:** `HANDOFF_TO_CODING_AGENT.md`. Original, unmodified image at `design/reference/control-ai-policy-dashboard.jpeg`; checksum and preservation rule in `docs/DESIGN_REFERENCE_INTEGRITY.md`. UI composition mapping in `docs/VISUAL_INTEGRATION_SPEC.md`. The source image must not be cropped, recolored, replaced, edited or re-encoded. Build the NEAR-colored UI separately in code.
