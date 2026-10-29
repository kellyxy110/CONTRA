# CONTRA

> M03: real Sandbox runs on the compatible WSL host are recorded at c0800c8; the older global M02 blocker is superseded. This cloud session has its own descriptor limit and the refreshed P0 report remains incomplete. Run `npm run test:p0` on WSL for the corrected nine-test suite plus eighteen financial categories. Current local proof is 28 Rust SDK tests, 19 service/report tests and successful builds, not completion of the financial matrix. See [M03 handoff](docs/FINANCIAL_VERIFICATION_M03.md). Active avatars are neutral; frozen reference assets remain unchanged.

![Stage: pre-event implementation](https://img.shields.io/badge/stage-pre--event%20implementation-00EC97?style=flat-square&labelColor=0B1110)
![Network: NEAR testnet planned](https://img.shields.io/badge/network-NEAR%20testnet%20(planned)-0B1110?style=flat-square)
![Protocol: UX3C frozen](https://img.shields.io/badge/protocol-UX3C%20frozen-FF8678?style=flat-square&labelColor=0B1110)
![GitHub owner: kellyxy110](https://img.shields.io/badge/GitHub%20owner-kellyxy110-F4BD68?style=flat-square&logo=github&labelColor=0B1110)
![Deployment: none](https://img.shields.io/badge/deployment-none-9BAAA4?style=flat-square&labelColor=0B1110)

**Every judgment can be challenged.**

CONTRA is a NEAR adjudication prototype under implementation. Its Rust contract combines escrow, evidence-bound commit/reveal judgments, challenges and callback-safe settlement. Independent live operator adjudication and real Sandbox settlement are not yet verified.

> Actual implementation began October 28, 2026 with owner authorization, before the official competition. Do not claim this code as competition-window work. Approved design/ux3a remains a separate design reference. Twenty Rust SDK mocked-environment tests and sixteen service/encoding tests pass; Sandbox execution is blocked on this host and no deployment or live AI call has occurred. See docs/IMPLEMENTATION_OCT28.md.

## Start here

Implementation commands (Node 24+, Rust 1.99.1, wasm32-unknown-unknown):

```sh
npm ci
npm test
npm run test:contract
node scripts/build-contracts.mjs
npm run build:wallet
npm run dev
```

The dashboard at localhost:4173 preserves approved UX3A geometry and assets. Default mode reports chain unavailable and submits no transactions. On a host with an open-file hard limit of at least 65535, install the pinned official binary with `node scripts/setup-sandbox.mjs`, run `npm run test:sandbox`, then start `CONTRA_SANDBOX=1 npm run dev`. This creates local controlled accounts only. No testnet deployment or paid inference is included. External-wallet adapter compiles but is disabled pending separate testnet authorization; it has not been verified in a funded wallet flow.

Saved checkpoints and test limitations: [October 28 implementation record](docs/IMPLEMENTATION_OCT28.md). SDK tests and build checks are not real NEAR Sandbox transfers, production readiness or owner acceptance.

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

Repository: [kellyxy110/CONTRA](https://github.com/kellyxy110/CONTRA), private. No repository secrets or deployment have been configured.

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
