# CONTRA agent operating instructions

You are implementing CONTRA, a NEAR-native adjudication proof-of-concept. Your context comes from local files, not from assumptions about earlier chats.

## Current product-first directive

M05 through M07 core functionality, security, persistence, wallet, reviewer, provider and full workflow verification take priority. Suspend visual polish, radar refinement, screenshot comparison and demo production until the owner schedules them after core completion. Do not restart completed M03 or M04 work. Preserve the immutable reference and required active frontend assets, but remove obsolete visual-only tooling only after dependency checks. No testnet deployment, signing, paid inference or production-secret change is authorized.

The live `https://nearhackathon.com/HACKATHON.md` is the governing eligibility and submission source. Fetch it again before submission. Current rules accept code since the 2026-10-19 announcement. Record that CONTRA implementation actually began 2026-10-28 and never rewrite commit history. Primary track is `security`; additional applicable track is `open`.

## Mandatory resume order

1. project/STATUS.md
2. project/DECISIONS.md
3. project/CHANGELOG.md
4. project/NEXT.md
5. Relevant docs and tests

Always report checkpoint ID, tasks completed, files changed, tests executed, unresolved blockers and the exact next step. Add an entry to CHANGELOG.md and update STATUS.md after each milestone. Never claim tests, transactions or deployments that did not happen.

## Non-negotiable engineering constraints

- Owner authorized implementation beginning October 28, 2026. Record that actual date. Current official Q-001 makes code since October 19 eligible, but eligibility does not permit rewriting the actual creation date. Keep approved design reference assets separate from production source; preserve The Bench naming. Sandbox and read-only public testnet RPC checks are authorized. Testnet deployment, signing, paid provider use and production secrets require separate authorization.
- Never include em dash characters in source, copy, SEO text or documentation.
- Use meaningful README badges, verified from reality. Do not invent CI pass or deployment success badges.
- NEAR testnet only until explicitly approved otherwise. No mainnet assets.
- No new token for v1; escrow native NEAR only.
- No unapproved spending. Start with $3 Meta, $3 Baseten, $5 Modal usage envelopes, subject to verified credits.
- Secrets only in server environments. No secrets in browser assets, build logs or commits.
- Prefer immutable evidence hashes and content-addressed artifacts; minimize personal data and avoid putting private case evidence onchain.
- Accept a judgment only through deterministic smart contract checks, never because an AI model asserted finality.
- Do not describe a single operator's multiple reviewer keys as decentralized validator independence.
- Preserve settlement safety under asynchronous payout failure and retry.

## Mandatory handoff format

Checkpoint:
Summary of work:
Accepted decisions preserved:
Files changed:
Tests and observed results:
Transactions and deployments (verified only):
Spending and credit reconciliation:
Remaining blockers:
Next task:

## Handoff v1.2 and immutable owner screenshot

Read `HANDOFF_TO_CODING_AGENT.md` before making design or implementation changes. The exact user-supplied image at `design/reference/control-ai-policy-dashboard.jpeg` is read-only, with SHA-256 `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`. Never alter or regenerate it. Preserve its composition in a coded working frontend using CONTRA/NEAR tokens, without faking functionality by displaying a static screenshot.

## Repository ownership safeguard
The owner assigned GitHub account `kellyxy110` and authorized repository `CONTRA` on 2026-10-28. GitHub verified its current visibility as public on 2026-11-03. Remote pushes must target that repository. Do not change repository visibility, set repository secrets or deploy without separate owner approval.
