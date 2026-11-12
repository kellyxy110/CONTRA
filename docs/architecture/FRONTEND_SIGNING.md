# Frontend signing boundary

The browser authenticates with a NEP-413 message and keeps transaction signing in the connected Testnet wallet. A recovered session alone does not provide a signer. Every contract action is checked by the server's existing `/api/wallet/prepare` validator against the authenticated account, contract method, arguments, deposit and current case or reviewer state. Handoff remains behind the server authority gate.

After a wallet response, the browser records the transaction hash and requests receipt reconciliation. If signing or broadcasting ends without a known final receipt, the persisted operation ID is shown for inspection. The interface does not automatically redispatch an UNKNOWN operation. Payout retry is offered only when the contract reports `TransferFailed` and supplies the exact intent and attempt.

A reviewer stores an evidence-bound human finding separately from the binding vote. The browser calculates the commitment with the shared protocol encoding, displays a fresh nonce and finding digest for the reviewer to retain, then asks the wallet to sign the commit call. During reveal, the browser recomputes the commitment and rejects mismatched disposition, finding or nonce before asking the wallet to sign. Development fixtures establish interface behaviour only; they do not establish independent human review or financial authority.

The present Cloudflare signing gate is disabled. Enabling it requires server-side exact bounded authority and valid account control; the browser cannot override that gate.


## Frontend acceptance dependencies

| Journey | Browser contract | Backend-dependent acceptance |
| --- | --- | --- |
| Dashboard | POST `/api/view` with `envelope: true`. `list_cases` provides items and a cursor, `get_config` provides reserve totals, and `get_events` accepts `case_id: null`, `after_seq`, and `limit`. | Read finalised Testnet case, reserve and activity data. |
| Case creation | POST `/api/terms`, then `preview_case` through `/api/view`. POST `/api/wallet/prepare` returns the operation ID and payload hash. | Eligible creator, authorised handoff, wallet approval, a final receipt and `get_case` read-back after reload. |
| Wallet reconciliation | POST `/api/wallet/handoff`, `/api/wallet/broadcast`, and `/api/wallet/reconcile`. GET `/api/operation?id=…` retrieves the persisted operation. | Testnet signature and final receipt matching the prepared operation. |
| Evidence and challenge | POST `/api/evidence` or `/api/counterexample` with a participant session. Protected reads use `/api/evidence/manifests` and `/api/counterexample/records`. | Persisted provenance and the corresponding contract transition. |
| Evaluation | GET `/api/config` exposes fixture availability. GET and POST `/api/provider/jobs` require a session. POST supports enabled development fixtures. | A case-scoped live execution endpoint and persisted provider result are required for live acceptance. |
| Review and settlement | Reviewer actions require an eligible session and assignment. `get_round` and `get_payout` provide contract state. Receipt and recovery use `/api/receipt` and the wallet reconciliation endpoints. | Independent reviewer evidence and finalised settlement state. |

Browser fixtures verify rendering and interaction. Live acceptance requires real endpoint responses and, for writes, finalised receipts and persisted read-back.
