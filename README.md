# CONTRA

![Stage: pre-hackathon planning](https://img.shields.io/badge/stage-pre--hackathon%20planning-00EC97?style=flat-square&labelColor=0B1110)
![Network: NEAR testnet planned](https://img.shields.io/badge/network-NEAR%20testnet%20(planned)-0B1110?style=flat-square)
![Artifact: blueprint v1.2](https://img.shields.io/badge/blueprint-v1.2-FF8678?style=flat-square&labelColor=0B1110)
![GitHub owner: kellyxy110](https://img.shields.io/badge/GitHub%20owner-kellyxy110-F4BD68?style=flat-square&logo=github&labelColor=0B1110)
![Deployment: none](https://img.shields.io/badge/deployment-none-9BAAA4?style=flat-square&labelColor=0B1110)

**Every judgment can be challenged.**

CONTRA is a proposed NEAR-native adjudication protocol. It combines deterministic onchain case and escrow rules with independent offchain AI evaluation, evidence-bound challenges, and enforceable settlement. The research hypothesis is that existing smart contract infrastructure can support useful decentralized adjudication without a specialized consensus blockchain.

> Status: Preparation blueprint, October 27, 2026. This package is not deployed production software. The prototype HTML uses simulated case data and makes no blockchain transactions. It is a pre-event DESIGN REFERENCE ONLY. Do not treat it as hackathon implementation code or submit its source as work created during the official build window. Reimplement any production UI after the hackathon opens.

## Start here

1. `project/STATUS.md` is the authoritative project checkpoint.
2. `project/DECISIONS.md` contains accepted decisions and their rationale.
3. `project/CHANGELOG.md` records package changes.
4. `project/NEXT.md` gives the next task and acceptance criteria.
5. `docs/PRD.md` defines the product and proof of success.
6. `docs/PROTOCOL.md` defines states, safety rules and reviewer mechanics.
7. `docs/UX.md` maps the product and Judgment Room interactions.
8. `docs/ARCHITECTURE.md` maps contract and offchain boundaries.
9. `docs/BENCHMARKS.md` defines fair measurement and experiment guardrails.
10. `design/judgment-room.html` is the standalone clickable prototype. Open it in a browser.
11. `design/tokens.css` contains shared design tokens.
12. `benchmarks/case-plan.csv` contains 30 benchmark scenario plans, not results.
13. `AGENTS.md` is the coding agent handoff and guardrail document.

Repository: [kellyxy110/CONTRA](https://github.com/kellyxy110/CONTRA), private. No repository secrets or deployment have been configured.

## Fixed constraints

- Official hackathon: starts November 1, 2026 00:00 UTC; ends November 14, 2026 23:59 UTC.
- Internal target: submit November 13, 2026.
- All competition implementation begins on or after November 1.
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
