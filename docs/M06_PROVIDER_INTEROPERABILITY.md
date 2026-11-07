# M06 provider interoperability

Checkpoint: `CONTRA-2026-11-08-IMPL-M06-P3-PROVIDERS`

This unit validates provider-specific request and response handling with mocked transports only. It does not establish provider access, pricing, credits or live model behavior.

## Provider roles

| Provider | Bounded role | Interface under test | Live status |
| --- | --- | --- | --- |
| Meta | Primary and fresh evidence review | OpenAI-compatible strict JSON schema | Disabled |
| Baseten | Adversarial evidence review | Model endpoint with strict JSON schema and `stream: false` | Disabled |
| Modal | Validation of an immutable AI proposal | Modal function input with strict verification schema | Disabled |

Meta Muse Spark 1.3 is the proposed primary model. Muse Wonder 1.0 is optional escalation metadata only. Neither access nor API behavior is claimed as verified. Baseten and Modal model identifiers remain server configuration and require an explicit model-interface verification gate before live availability.

## Safety boundaries

- Live availability requires owner paid-usage authorization, verified credits, verified pricing, a verified model interface, an allowlisted HTTPS endpoint, a server-side API key and a positive per-request cap.
- Meta and Baseten findings must cover every frozen criterion and cite only case-bound digests.
- Missing, contradictory or insufficient evidence must remain `UNRESOLVED`.
- Provider output cannot supply trusted case, round, provider, model, status or settlement fields.
- Raw bounded responses are stored immutably before parsing so malformed output remains auditable.
- Modal can propose only a verification artifact bound to an existing AI proposal digest. It cannot create a reviewer vote or contract transition.
- A started call with an ambiguous outcome retains its atomic reservation and is never dispatched again under the same idempotency scope.
- Budgets remain capped at $3 Meta, $3 Baseten and $5 Modal. Application caps do not replace provider billing controls.

## Authorization status

No paid inference, live provider request, production secret or provider-side account change is authorized by this checkpoint.
