# CONTRA documentation

Start with the [project README](../README.md) for the product, current verified state, development commands and public application.

## Active documentation

| Topic | Source |
| --- | --- |
| Interface and browser verification | [Frontend browser verification](testing/FRONTEND_BROWSER.md) |
| Completion and acceptance | [Functional acceptance matrix](testing/FUNCTIONAL_ACCEPTANCE_MATRIX.md) |
| System boundaries | [Architecture](ARCHITECTURE.md), [durable storage](DURABLE_STORAGE.md) |
| Contract and protocol | [Protocol](PROTOCOL.md), [state machine](STATE_MACHINE_V1.md), [ABI](CONTRACT_ABI_V1.md), [committee policy](COMMITTEE_POLICY_V1.md) |
| Settlement guarantees | [Settlement recovery](SETTLEMENT_RECOVERY_V1.md), [commitment test vectors](COMMITMENT_TEST_VECTORS.md) |
| Security | [Threat model](THREAT_MODEL_V1.md), [dependency audit](security/DEPENDENCY_AUDIT.md) |
| Operations | [Cloudflare deployment](operations/CLOUDFLARE_DEPLOYMENT.md), [runtime service](operations/RUNTIME_SERVICE.md), [environment setup](operations/ENVIRONMENT_SETUP.md) |
| External participant controls | [Reviewer onboarding](operations/REVIEWER_ONBOARDING.md), [reviewer invitation template](operations/REVIEWER_INVITATION_TEMPLATE.md) |
| Tests and reproducibility | [Reproducibility](testing/REPRODUCIBILITY.md), [judge guide](judges/JUDGE_GUIDE.md), [acceptance matrix](judges/ACCEPTANCE_MATRIX.md) |

## Historic records

Earlier `M0x` milestone acceptance reports, UX planning documents, hackathon records and `project/` checkpoint logs document decisions and historical evidence. They are retained for traceability, not presented as current implementation instructions. Superseded handoffs should not be used to direct engineering work. Where a historical record conflicts with the current source or test evidence, verify the current implementation.

Do not delete records tied to signed authority, threat analysis, Testnet transactions, financial verification or referenced screenshots merely to reduce the Markdown file count. Git history preserves removed obsolete handoffs.

**Current implementation source of truth:** `main`, active pull requests, the three-phase plan, the contract and backend code, and the cumulative acceptance evidence.
