# CI integration risk policy

Checkpoint: `CONTRA-2026-11-07-CI-SANDBOX-OPT`

The maintained mapping in `ci/integration-risk-map.json` classifies the complete pull request diff. Unknown paths fail safe to full verification. The policy job publishes the selected level and reason as an artifact. The integration gate verifies that the required jobs executed and succeeded. A skipped Sandbox job is never described as an executed pass.

| Change category | Required level | Executed coverage |
| --- | --- | --- |
| Documentation, provider fixtures, offline deployment preflight and frontend-only work | Fast | Core and Security, including repository tests and affected builds |
| Wallet, RPC, reviewer and backend interaction | Focused | Explicitly mapped Sandbox transaction, committee, timeout and UNKNOWN scenarios |
| Contract, protocol, settlement, Sandbox harness or unclassified work | Full | Nine-test baseline and both complete contestation journeys |
| Pull request into `main`, release branch, schedule or manual full request | Full | Nine-test baseline and both complete contestation journeys |

F01 through F18 remain in the separate Full Financial P0 workflow. This routing does not remove or weaken that gate.

## Runtime design

The previous Integration job ran the baseline and journeys serially. Run `42408934712` measured 48 minutes 17 seconds for the baseline and 21 minutes 52 seconds for the journeys, with total wall time 70 minutes 51 seconds.

Full verification now runs those suites on isolated GitHub-hosted runners in parallel. Each runner performs its own checkout, dependency installation, contract build, Sandbox install and artifact upload. No worker, account, database or artifact path is shared. Wall time is bounded by the slower suite instead of their sum.

Sandbox deadline advancement still targets the exact contract timestamps. The helper first observes the finalised timestamp and height change from one fast-forwarded block, then calculates a bounded jump that remains below the target. It recalibrates after every jump and rejects non-advancing or non-positive observations. Contract deadlines and contestation semantics are unchanged.

Every Sandbox job retains the 90-minute timeout. Timing files are uploaded with job artifacts. The optimisation PR supplies the first after-change measurements; its remote results are recorded on the PR because adding a result-only commit would unnecessarily repeat comprehensive verification.

| Representative change | Expected feedback |
| --- | --- |
| Provider or documentation only | Core and Security, target under 10 minutes |
| Wallet or reviewer backend | Core, Security and focused Sandbox |
| Contract-sensitive | Core, Security, Contract and parallel full Integration |
| Release verification | Complete parallel Integration plus applicable Contract and Financial P0 gates |

Branch protection continues to require Core and Security. `integration-gate` is the truthful aggregate result available for protection when repository rules are updated. Ambiguous classification always selects full verification.
