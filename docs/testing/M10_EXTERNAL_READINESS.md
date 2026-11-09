# M10 external readiness verification

Run the focused readiness regressions with:

```sh
node --test tests/m10-external-readiness.test.mjs
```

The checks require six distinct signed reviewer operators, exact three-member primary and fresh committees, no account or operator overlap, current disclosures, conflict clearance and scheduled availability. Provider readiness is evaluated separately for Meta, Baseten and Modal and requires an account, exact model identity, non-billable smoke evidence, verified credits and pricing, billing controls, server-side secrets and an explicit owner authorisation within the existing ceiling.

These checks do not call a provider, sign a transaction or infer M08 deployment authority. Fixture output cannot satisfy a live-provider or independent-reviewer requirement.
