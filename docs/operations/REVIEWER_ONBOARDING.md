# Independent reviewer onboarding

Status: procedure prepared. Six independently controlled operators have not yet been demonstrated.

CONTRA requires three primary and three fresh reviewers. Each reviewer account must have a distinct controlling operator, and no operator may control an account in both committees.

## Control evidence

Each operator signs a NEP-413 statement containing the reviewer account, operator disclosure revision, intended committee, conflict declaration, availability window, statement expiry and a server challenge nonce. The backend verifies the signature, account, recipient, nonce, expiry and replay status. The signed statement is retained as an immutable audit artifact without publishing private personal data.

An administrator confirms registry eligibility and activation. Committee membership is then frozen with the agreement terms. Account switching, expired sessions, duplicate registration and contradictory disclosure revisions fail closed.

## Rehearsal and schedule

Before a live journey, every operator independently authenticates, inspects the authorised evidence, commits one fixture vote and reveals it after the commitment phase. The rehearsal records signer identity, operator disclosure revision and timestamps. A shared browser, shared key store or operator-assisted bulk signing fails the independence gate.

The owner must schedule all six operators across the contract's actual commitment, reveal, challenge and fresh-review windows. Nonparticipation is a valid tested outcome and must reach deterministic quorum or timeout fallback, never an AI-selected verdict.

Fixture accounts remain useful for local regression, but they are disclosed as one-process controls and do not satisfy this procedure.
