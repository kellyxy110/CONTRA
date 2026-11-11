# M10 external readiness verification

Run the focused readiness regressions with:

```sh
node --test tests/m10-external-readiness.test.mjs
```

The checks require six distinct signed reviewer operators, exact three-member primary and fresh committees, no account or operator overlap, current disclosures, conflict clearance and scheduled availability. Provider readiness is evaluated separately for Meta, Baseten and Modal and requires an account, exact model identity, non-billable smoke evidence, verified credits and pricing, billing controls, server-side secrets and an explicit owner authorisation within the existing ceiling.

These checks do not call a provider, sign a transaction or infer M08 deployment authority. Fixture output cannot satisfy a live-provider or independent-reviewer requirement.
# M10.4 provider credential activation regressions

`tests/m10-provider-activation.test.mjs` verifies that Cloudflare reports each provider independently, never returns credential values and requires every external and financial gate before reporting `READY`. The Cloudflare Durable Object suite separately preserves atomic reservations, idempotency and UNKNOWN locking. These tests do not establish provider account access or live inference.

`tests/m10-modal-verifier.test.mjs` runs the pure Python verifier regressions and checks that the Modal endpoint declares `requires_proxy_auth=True`. The suite covers an exact immutable proposal, digest mutation, unapproved top-level and nested citations, and unexpected authority-bearing fields. It does not deploy the Modal app or make a paid call.
