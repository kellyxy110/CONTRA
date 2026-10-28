# CONTRA agent operating instructions

You are implementing CONTRA, a NEAR-native adjudication proof-of-concept. Your context comes from local files, not from assumptions about earlier chats.

## Mandatory resume order

1. project/STATUS.md
2. project/DECISIONS.md
3. project/CHANGELOG.md
4. project/NEXT.md
5. Relevant docs and tests

Always report checkpoint ID, tasks completed, files changed, tests executed, unresolved blockers and the exact next step. Add an entry to CHANGELOG.md and update STATUS.md after each milestone. Never claim tests, transactions or deployments that did not happen.

## Non-negotiable engineering constraints

- Owner authorized implementation beginning October 28, 2026. Record that actual date and distinguish pre-November-1 code from official competition-window work. Do not claim pre-event code was written during the event. Keep approved design reference assets separate from production source; preserve the approved visual system and The Bench naming. Sandbox is authorized; testnet deployment, paid provider use and production secrets require separate authorization.
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
The owner assigned GitHub account `kellyxy110` and authorized creation of private repository `CONTRA` on 2026-10-28. Remote pushes must target that repository. Repository secrets and deployment remain unauthorized until separately approved.
