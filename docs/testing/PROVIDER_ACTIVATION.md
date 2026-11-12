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
