# CONTRA v1.0 product requirements

Date: 2026-10-27
Status: Draft pending acceptance of protocol and UX details

## Product promise

Every consequential AI judgment should be open to a structured, auditable challenge. CONTRA coordinates independent offchain evaluation and onchain enforceable outcomes using general-purpose NEAR smart contracts.

## Falsifiable research hypothesis

A general-purpose blockchain and an application-level review protocol can provide useful evidence-based adjudication and challenge handling without requiring a specialized AI blockchain. This is not a claim of security equivalence to GenLayer. We must measure reliability, latency, costs and reviewer independence under aligned conditions.

## Users and jobs

1. Case creator or payer: lock payment against explicit requirements and see exactly when it can move.
2. Deliverer or claimant: submit artifacts and evidence; see how reviewers reached the decision.
3. Challenger: show a specific contradiction with evidence, not a free-form disagreement alone.
4. Reviewer: inspect case terms, make independent findings, and submit signed votes or counterclaims.
5. Observer or judge: replay a complete case and follow onchain event history without requiring private access.

## MVP case

A payer commissions an accessible web interface. The deliverer submits a repository commit, a hosted build, and test evidence. A primary evaluator proposes that requirements are met. A counterexample evaluator identifies a keyboard navigation failure. The recorded challenge blocks ordinary finalization. Fresh reviewers independently judge the contested claim. The NEAR contract enforces the agreed resolution.

All named prototype accounts, amounts, case IDs and results are sample data until verified by testnet transactions.

## In scope for hackathon

- Wallet connection and NEAR testnet context in working app.
- Create and fund one agreement with frozen criteria and recipient accounts.
- Evidence manifest with content hashes and provenance links.
- Signed reviewer votes, independent evaluator outputs and provisional decision.
- One bounded challenge review round with fresh reviewer set.
- Timeout and unresolved fallback selected and frozen at funding time.
- Escrow payout and payout failure recovery.
- A case workspace, The Bench, Challenge Arena and small benchmark view.
- Clear measurement dashboard with real sample size and methodology.

## Out of scope for hackathon

- Permissionless validator network with full Sybil-resistant staking economics.
- A native CONTRA token, mainnet deposits, insurance, complex slashing, global reputation.
- Arbitrary multi-asset and cross-chain escrow.
- Private evidence proofs and fully verified confidential inference claims.
- Complex multiple-level appeals beyond one fresh challenge review.
- Claim that all GenLayer behaviors or security properties have been reproduced.

## Primary user journey

1. Creator specifies job, binary acceptance criteria, evidence types, adjudicator set, review windows, dispute fallback and payout accounts.
2. Creator reviews exact immutable terms and sends native NEAR to the contract.
3. Deliverer submits an evidence manifest digest and source references before submission deadline.
4. Reviewers commit, then reveal signed or directly authenticated verdicts with evidence references.
5. Contract publishes provisional verdict only after quorum or records unresolved result after timeout.
6. Eligible party raises a challenge with a structured counterexample during the defined window.
7. Fresh reviewer set evaluates challenged requirement; absent a decisive result, contract follows precommitted unresolved policy.
8. Payout enters transfer pending, then settles only after NEAR promise completion callback confirms outcome.
9. Everyone can inspect timeline and transaction details.

## MVP measurable acceptance

- One fund-to-finalization test using genuine NEAR testnet transactions.
- Challenge before deadline prevents the first provisional verdict from settling.
- Replay, duplicate vote and unauthorized caller tests fail safely.
- Evidence and criteria are immutable once funded; amendments require a new case or mutually authorized replacement before funding.
- A failed transfer does not mark the case paid, and retries cannot duplicate payouts.
- 30 designed test cases documented and a clearly labelled executed subset evaluated.
- Cost ledger shows real provider usage, credits remaining when accessible, and unknowns explicitly.

## UX requirements

- Always distinguish 'AI proposed', 'reviewer accepted', 'challenged', and 'settled onchain'.
- Use compact case facts, evidence and counterclaim side by side at desktop sizes.
- On mobile, preserve the same content with tabs and a persistent settlement status.
- Avoid false trust cues: never use 'verified' for unvalidated model text.
- Date times in UTC and visibly tagged as demo, estimated, or chain-confirmed.
- Empty, error, timeout, insufficient evidence and transfer pending states are first-class flows.

## Submission criteria

Official NEAR Hackathon: November 1 to November 14, 2026. Working prototype, public repository, X demo post and submission form links. Target submit November 13. See https://nearhackathon.com/ for latest organizer rules.
