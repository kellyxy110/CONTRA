# CONTRA: three-phase completion plan

**Status:** Active implementation plan  
**Baseline:** `main` at `2db8ad8edea5f1e838a921c42bddf50313cc98e0` (backend PRs #96 and #97 merged) and frontend draft [PR #95](https://github.com/kellyxy110/CONTRA/pull/95) at `825cb661f456283392561205d021cd806d707b39`.  
**Date:** 12 November 2026  
**Authority:** Execute all independently authorised engineering, documentation, testing, review and passing merges without repeated permission requests. Do not broaden financial, wallet, provider or production-secret authority.

## Operating rules

- Follow the phases in order, but run independent tests and safe documentation work in parallel.
- Open focused PRs. Merge each non-draft PR when its required CI, review and security gates pass. A green check alone does not override branch protection, unresolved conflicts or real external authority.
- Preserve the approved desktop Overview, CONTRA branding, responsive workspaces and the NEAR contract's financial invariants.
- Carry forward all genuine backend capability from `main`. Never resolve frontend conflicts by discarding recent reviewer or provider security changes.
- Maintain a cumulative functional acceptance matrix with PASS, PARTIAL, BLOCKED, FAIL and NOT STARTED. Record exact browser, Sandbox, Testnet or production evidence.
- Preserve historical records and links. Remove superseded active instructions only after reference and source-policy checks. Keep immutable evidence, regulatory or hackathon provenance, transaction records and source-linked security decisions.
- No em dash characters in code, copy or repository documentation. No fictional tests, receipts, independent reviewers, budgets or status badges.

## Phase 1: Consolidate and integrate

**Goal:** One coherent frontend, backend and source of truth on `main`.

**Work**
1. Replace the stale README with an accurate public product overview, architecture, operating instructions, verification summary and limitations.
2. Retire the obsolete root coding-agent handoff and consolidate current execution guidance in this plan and `AGENTS.md`. Index active technical documents and label milestone records as historical.
3. Reconcile the 58-commit frontend branch divergence reported against the newer backend merges. Resolve PR #95 conflicts file by file, especially `apps/web`, `services/cloudflare/worker.mjs`, Pages bindings, tests and documentation.
4. Validate the ten approved destinations, themes, responsive behaviour, wallet session and all supported API contracts against the merged Worker. Preserve existing auth, idempotency, signing, reviewer independence and provider budget controls.
5. Run the repository, contract, Cloudflare, wallet, docs-link, source-policy, Core, Security and Integration checks. Run Chromium and Firefox on integrated fixtures, including mobile widths.
6. Complete PR review, merge passing engineering work and deploy the integrated app through the existing release procedure. Verify the deployed commit, routes, `/api/live` and `/api/ready`.

**Exit gate:** Frontend and backend coexist on `main`; no accidental API or security regression; relevant CI and hosted browser checks pass; deployment identity is recorded. A blocked live transaction is not an excuse for an unfinished application interface.

## Phase 2: Close every functional workflow

**Goal:** All independently testable capabilities operate end to end with complete acceptance evidence.

**Work**
1. **The Bench:** Finish reviewer invitation, signed control and consent state, registration, case assignment, protected evidence, human findings, signed commit and reveal, preserved nonce/recovery package, audit and withdrawal, with authoritative eligibility checks.
2. **Evaluations:** Show validated Meta findings and citations, verify Modal proposal-digest and case/round binding, handle errors and missing records, enforce account/case protection, and distinguish fixtures from live execution.
3. **Constellations:** Complete populated and comparative radar geometry tests, correct provenance, missing axes, protected-data denial, keyboard and responsive coverage.
4. **Cases, Evidence, Challenges and Settlement:** Finish duplicate, expiry, rejection, submission, receipt inspection, UNKNOWN locking and refresh/recovery browser paths.
5. **Activity and Settings:** Implement supported filtering, linked records, wallet disconnect and account switch, session recovery and theme persistence.
6. Close each acceptance row with exact API and browser evidence. Run end-to-end workflows under controlled states and local Sandbox, including negative and adversarial paths.

**Exit gate:** Each mandatory independently testable flow is PASS with Chromium/Firefox, integration and relevant security coverage. Any remaining BLOCKED row identifies an actual externally controlled signature, participant, verified case or spend gate. No open implementation gap is labelled as an external blocker.

## Phase 3: Validate the live protocol and release

**Goal:** Demonstrate the complete authorised Testnet journey and publish an evidence-backed release.

**Work**
1. Obtain three primary and three fresh independent human reviewers with disjoint operator control. Use the deployed one-time NEP-413 challenges, disclosures, conflict checks, invitation lifecycle and onchain `set_reviewer`/`confirm_reviewer`.
2. Establish secure browser authority over the allowlisted `contra-creator.testnet` or execute a separately authorised, exact state-compatible allowlist migration. Do not move secret keys into application source.
3. Freeze the real case terms, eligible committee, beneficiary consent, evidence and exact transaction packet. Use only already approved financial ceilings and obtain any missing operation-specific signature before broadcast.
4. Execute and verify real case creation and funding, evidence binding, primary commit/reveal, challenge, fresh review, resolution, final settlement and any recovery scenario permitted by the exact approved packet.
5. Enable Meta and Modal production gates only for an authorised case after independently verifying credentials, valid model, per-provider limits, billing safety, case binding and durable job accounting. Retain non-binding proposal labels.
6. Run final security, financial, browser, performance and deployment smoke checks. Confirm exact production commit, chain receipts, provider audit and durable records; update release notes and README status.

**Exit gate:** Accepted Testnet transactions have finalised receipts and correct contract state; funded settlement is demonstrably correct; security and deployment checks pass; independent participants are verified. If a human-controlled or spending gate remains missing, record **Engineering Complete / Live Validation BLOCKED**, not a fabricated production PASS.

## Release proof and reporting

Maintain a cumulative acceptance matrix in `docs/testing/FUNCTIONAL_ACCEPTANCE_MATRIX.md` after the frontend integration, with source links to all relevant checks and screenshots. Keep historical milestone evidence at its original path unless references are migrated safely.

At every milestone include the branch, commit, PR, required green CI, scope merged, browser checks, security outcome, current deployment and remaining blockers. Do not emit a new handoff after every isolated feature.

**Final outcome:** A professional repository, integrated and fully tested frontend/backend, and an explicitly evidenced real Testnet and production release, with external authority boundaries preserved.
