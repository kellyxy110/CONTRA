# Reference dashboard integration

The attached dashboard composition guides the CONTRA overview: a dark teal navigation rail, four pale financial and case cards, paired analytical panels, and an activity panel. The photographic surroundings and the reference's HR language are excluded. CONTRA uses contestation language and its established colour tokens.

## Routes and data

| Surface | Source | Action and authority |
| --- | --- | --- |
| Overview totals | `get_config.reserve_summary` and paged `list_cases` | State links open a filtered cases view. Financial values are contract reserve values. |
| Case list and detail | `list_cases`, `get_case`, `get_round`, `get_events` | Creator and beneficiary actions pass through `/api/wallet/prepare`, server handoff, the wallet and receipt reconciliation only when signing is authorised. |
| Evidence | Protected `/api/evidence/manifests`, `/api/evidence`, `/api/artifact` | The evidence board lists eligible contract cases. A beneficiary can store an immutable manifest. Submission uses `submit_evidence` only when the contract state and signing gate permit it. |
| Challenges | `get_case`, `get_round`, `/api/counterexample` | The challenge board lists contract cases for inspection. An eligible losing party can store a counterexample. Filing uses `file_challenge` only after the role, state, deadline and signing gate pass. |
| Reviewers | `list_reviewers`, protected invitation, disclosure, workspace, finding and audit APIs | Offchain findings remain distinct from binding contract votes. Six-slot fixtures are development evidence, not independent people. |
| Settlement | `get_payout`, `/api/receipt`, `/api/operation`, `/api/wallet/reconcile` | The settlement board lists cases with resolution or payout state. A failed payout can be retried only under contract rules. An UNKNOWN operation is inspected and reconciled, never automatically redispatched. |
| Providers | `/api/config`, protected `/api/provider/jobs` | Readiness and recorded jobs are displayed. No inference result is invented. |

## Current release gates

The Cloudflare production signing handoff remains disabled pending exact bounded server authority. The frontend can prepare, sign and reconcile the supported methods when the server gate is legitimately enabled, and otherwise displays the specific blocked state. Provider live execution remains subject to verified credentials, credits and enforceable budgets. Genuine independent reviewer evidence and funded Testnet journeys remain separate acceptance requirements.

Visual fidelity and functional completeness require separate rendered and live journey evidence. Passing fixture tests and route smoke tests alone do not establish either release gate.

## Integrated dashboard candidate

Hosted browser checks capture the dark overview at five viewport widths and the desktop light theme. The local server exposes the unavailable-chain state without fabricated records.

Evaluation result inspection is account- and case-bound. Browser fixtures cover result display and denied retrieval. Durable Object tests cover cross-account and cross-case denial.

Reviewer consent is not granted by a recovered session. The invited account must reconnect a NEP-413 capable wallet and sign a one-time control challenge bound to the invitation, operator digest, disclosure digest and availability window. Decline and pre-freeze withdrawal remain authenticated lifecycle actions.
