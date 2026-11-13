# CONTRA engineering instructions

## Current authority and work order

Implement the [three-phase completion plan](docs/COMPLETION_PLAN.md). Start with the latest `main` and open pull requests, preserving completed backend work from PRs #96 and #97. Frontend PR #95 and functional PR #100 merged. Owner visual acceptance is reopened, and the approved dark/light screenshots in `design/approved/` are the sole active visual authority.

Work continuously through independently authorised documentation, implementation, code review, tests and deployment verification. Do not request routine approval for normal engineering actions. Merge reviewed changes when the required checks are green and branch protections permit. Continue independent work while human-held signing or provider gates remain closed.

## Engineering constraints

- Never expose private keys, NEAR seed phrases, provider secrets, reviewer nonces or sensitive case evidence.
- Do not enable signing, paid inference, create reviewer identities, perform transfers, alter allowlists or change secrets beyond the exact existing authorisation.
- Preserve immutable terms, six independently controlled eligible reviewers, disjoint primary and fresh committees, challenge lockouts, one payout intent and callback-authenticated settlement.
- UNKNOWN payout operations remain locked unless an authoritative known transaction hash can be reconciled. Never blind-rebroadcast.
- AI proposals and Modal verifications remain non-binding. Live provider execution requires case, round, evidence, model and budget readiness.
- Use native NEAR on Testnet only; no token or mainnet rollout is authorised.
- Follow only `design/approved/overview-dark.jpeg` and `design/approved/overview-light.jpeg` for desktop Overview geometry. Previous graph-first and UX2/UX3 designs are historical. Preserve mint #00EC97, coral #FF8678, slate #16221D, obsidian #0B1110 and soft white #F5F7F5. Implement the accessible sidebar collapse, and retain both doughnut charts even in an honest empty-data presentation.
- Do not use em dash characters in copy, code, tests or Markdown.
- README badges and all claimed tests, receipts, spending, deployment and reviewer independence must be verifiable.

## Verification and reporting

Before merging, inspect the current PR diff, required Core/Security/Integration/contract checks and relevant hosted browser coverage. Validate backend security when touching frontend integrations. Keep code and docs aligned, run `npm run check:docs` and preserve audit artifacts.

Update the cumulative acceptance evidence and relevant project log for each substantial engineering milestone. Individual capabilities use PASS, PARTIAL, BLOCKED, FAIL or NOT STARTED; final Visual Fidelity, Functional Completeness and Production Readiness remain independently judged.

Do not make historical handoff files authoritative. Current instructions are this file, the three-phase plan, current source, specifications and verified tests. Retain historical evidence in Git history.

## External boundaries

Genuine reviewer onboarding, creator wallet custody, explicit operation-specific signing and paid provider activation remain independently controlled. Use existing approved ceilings without asking again for redundant permission, but do not extrapolate an earlier ceiling into permission to broadcast a different transaction or change production secrets.

The NEAR Testnet contract is `contra-contestation.testnet`. The public application is https://contra-near.pages.dev/. No complete funded Testnet settlement receipt has yet been verified.
