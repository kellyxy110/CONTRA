# Provider activation verification

Provider activation is tested without exposing credential values or enabling financial signing.

Run the repository and Cloudflare regression gates before deployment:

```sh
npm test
npm run test:cloudflare
npm run check:cloudflare
```

The Cloudflare suite verifies that `POST /api/operator/provider-probe` returns HTTP 401 when the short-lived server activation secret is absent. During a bounded activation window, the authenticated route calls only the documented provider catalogue or deterministic Modal verifier endpoint. Its response is restricted to provider status, redacted model identifiers, usage metadata and response digests. Delete `CONTRA_ACTIVATION_KEY` after recording the results.

An authenticated probe is readiness evidence, not reviewer authority, a contract verdict or permission to settle. Any ambiguous call remains charged against the provider's durable reservation until billing is reconciled.

The Modal deployment test also requires `verification_core.py` to be copied into the function image. This prevents a protected endpoint from deploying successfully but failing during container import.

The separately authenticated `POST /api/operator/provider-smoke` path is limited to the verified Meta model. Before its single bounded request it creates a USD 0.01 maximum durable reservation under the USD 3 cumulative cap. A provider permits only one active reservation at a time. Explicit success reconciles reported tokens at the verified per-token rates; timeout, malformed output or uncertain status becomes `UNKNOWN` and retains the reservation.

The accepted live activation evidence is one 49-token Meta response reconciled at 110 microUSD and one Modal deterministic verification reporting zero model tokens. Baseten authentication succeeded, but no exact account-visible model was returned, so its live execution remains disabled.

Case-bound production execution is covered by the Cloudflare Durable Object suite. The test creates immutable evidence and requirement artifacts, executes a Meta proposal through the same strict schema used by the Worker, binds a Modal verification to the saved proposal digest and asserts that both records retain `binding_authority: false`. The route also checks authenticated case participation, exact round identity, idempotency and cumulative reservations. Production remains disabled unless every provider readiness flag is true, so this controlled transport test is not live case inference evidence.

Reviewer onboarding tests separately verify six disjoint slots, immutable consent, operator-identity matching and rejection of a changed consent revision. Genuine consent additionally requires the public Worker's one-time NEP-413 control challenge. Fixture signatures do not establish human independence.
