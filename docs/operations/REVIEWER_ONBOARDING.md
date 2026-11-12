# Independent reviewer onboarding

Status: invitation and verification procedure prepared. Six independently controlled operators have not yet been demonstrated.

CONTRA requires three primary reviewers and three fresh reviewers. Each reviewer must control a distinct NEAR account, disclose the controlling operator and custody method, consent to participation and declare conflicts. No operator may control an account in both committees. Six local fixture keys do not establish six independent operators.

The public, secret-free readiness shape is defined by [`config/m10-external-readiness.example.json`](../../config/m10-external-readiness.example.json). `assessReviewerReadiness` requires exactly six valid testnet accounts, six distinct operator identifiers, three members per committee, verified control-statement signatures, explicit conflict clearance and a current availability window. The checked-in example has no reviewers and therefore fails closed.

## Invitation process

1. Generate one `CONTRA_REVIEWER_INVITATION_V1` document for each numbered committee slot with `buildReviewerInvitation`.
2. Send the invitation privately to a prospective operator. Do not prefill an operator identity or create an account on their behalf.
3. The operator returns explicit consent, their reviewer account, operator identity digest, immutable disclosure digest, custody attestation, conflicts and availability for both commit and reveal phases.
4. Run `assessReviewerResponses`. It must report six distinct accounts and six distinct declared operators with no missing response.
5. Independently verify account control and the operator disclosures. The automated result is technical readiness, not proof of real-world independence.
6. The contract owner registers the exact reviewer record. The reviewer then confirms the exact disclosure revision using their own wallet.
7. Freeze disjoint primary and fresh committees only after all six records are active and confirmed.

An invitation authorises review only. It cannot create a vote, authorise a transaction, settle a case or turn an AI proposal into a contract decision. Missing consent, duplicate control, conflicts or missed deadlines must remain visible and fail closed.

## Control evidence

Each operator must sign a NEP-413 statement containing the reviewer account, invitation digest, operator identifier, exact disclosure digest, custody declaration, conflicts, availability window, statement expiry and a server challenge nonce. The authenticated operator requests that statement from `POST /api/reviewer/control-challenge`, then submits its wallet signature through `POST /api/reviewer/respond`. The Worker verifies the signature against a current Testnet access key, consumes the one-time challenge and prevents a consented disclosure revision from being replaced. These controls establish account control and immutable technical evidence. They do not establish that six different humans control the accounts.

The contract owner must separately sign `set_reviewer` for the exact account, operator and disclosure digests. Each reviewer must then sign `confirm_reviewer` for that exact revision and digest. Registry read-back must show six active, confirmed records before committee membership is frozen with the agreement terms. Account switching, expired sessions, duplicate registration and contradictory disclosure revisions fail closed.

## Rehearsal and schedule

Before a live journey, every operator independently authenticates, inspects the authorised evidence, commits one fixture vote and reveals it after the commitment phase. The rehearsal records signer identity, operator disclosure revision and timestamps. A shared browser, shared key store or operator-assisted bulk signing fails the independence gate.

The owner must schedule all six operators across the contract's actual commitment, reveal, challenge and fresh-review windows. Nonparticipation is a valid tested outcome and must reach deterministic quorum or timeout fallback, never an AI-selected verdict.

Fixture accounts remain useful for local regression, but they are disclosed as one-process controls and do not satisfy this procedure. Reviewer readiness does not authorise provider usage, contract deployment, wallet signing or spending. Use [the invitation template](REVIEWER_INVITATION_TEMPLATE.md) for recruitment without creating fictional operators.
