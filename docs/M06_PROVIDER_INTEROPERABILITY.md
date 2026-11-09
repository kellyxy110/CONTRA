# M06 provider interoperability

Checkpoint: `CONTRA-2026-11-08-IMPL-M06-P3-PROVIDERS`

This unit validates provider-specific request and response handling with mocked transports only. Official provider documentation was rechecked on 9 November 2026. This does not establish account access, credits, authenticated catalogue access or live model behaviour.

## Provider roles

| Provider | Bounded role | Interface under test | Live status |
| --- | --- | --- | --- |
| Meta | Primary and fresh evidence review | Model API at `api.meta.ai`, model-bound strict JSON request | Documentation verified, execution disabled |
| Baseten | Adversarial evidence review | Model API at `inference.baseten.co`, explicit model and `stream: false` | Documentation verified, catalogue and execution disabled |
| Modal | Validation of an immutable AI proposal | Modal function input with strict verification schema | Documentation verified, deployment and execution disabled |

Meta's official catalogue currently lists `muse-spark-1.3` and preview `muse-wonder-1.0`. Spark remains the proposed primary and Wonder remains an optional escalation candidate. The standard, non-contributor privacy mode is required for case evidence. Baseten's exact adversarial model must be selected from the authenticated current catalogue and frozen before a call. Modal remains a bounded function deployment rather than an assumed hosted model. Account access and actual responses remain unverified.

Official references: [Meta overview](https://dev.meta.ai/docs/overview), [Meta models](https://dev.meta.ai/docs/models), [Meta pricing and limits](https://dev.meta.ai/docs/pricing-rate-limits), [Baseten Model APIs](https://docs.baseten.co/inference/model-apis/overview), [Baseten pricing and limits](https://docs.baseten.co/inference/model-apis/pricing-and-limits), [Modal pricing](https://modal.com/pricing) and [Modal GPU guide](https://modal.com/docs/guide/gpu).

## Safety boundaries

- Live availability requires owner paid-usage authorisation, verified credits, verified pricing, a verified model interface, an allowlisted HTTPS endpoint, a server-side API key and a positive per-request cap.
- Meta and Baseten findings must cover every frozen criterion and cite only case-bound digests.
- Missing, contradictory or insufficient evidence must remain `UNRESOLVED`.
- Provider output cannot supply trusted case, round, provider, model, status or settlement fields.
- Raw bounded responses are stored immutably before parsing so malformed output remains auditable.
- Modal can propose only a verification artifact bound to an existing AI proposal digest. It cannot create a reviewer vote or contract transition.
- A started call with an ambiguous outcome retains its atomic reservation and is never dispatched again under the same idempotency scope.
- Budgets remain capped at $3 Meta, $3 Baseten and $5 Modal. Application caps do not replace provider billing controls.

## Authorisation status

No paid inference, live provider request, production secret or provider-side account change is authorised by this checkpoint.
