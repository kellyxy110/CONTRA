# Provider credential setup

All three live providers are currently `CREDENTIALS_PENDING`. Fixture transports prove schema, citation, budget and trust-boundary behaviour only. They are not live inference evidence.

## Common activation gates

Each provider is independently disabled unless all of the following are true:

1. The exact provider account and interface are verified.
2. A model or protected function identifier is frozen.
3. Credits, pricing and a provider-side billing limit are verified.
4. The owner authorises a bounded amount.
5. The server credential is installed outside Git.
6. The endpoint is on the HTTPS allowlist.
7. Per-request and programme limits are valid.
8. The provider-specific `*_LIVE_ENABLED` flag is explicitly enabled.

Missing Meta credentials must not disable Baseten or Modal, and the reverse also applies. AI artifacts remain non-binding proposals.

## Meta

The proposed Standard Model API endpoint is `https://api.meta.ai/v1/chat/completions`. `muse-spark-1.3` is the proposed primary and fresh-review model. Access has not been verified. Contributor modes must not be used for private case evidence.

Store `META_API_KEY` server-side. Verify the exact model, structured-output interface, pricing and billing controls before setting the independent gates. The programme ceiling is USD 3, not automatic spending permission.

## Baseten

The Model API endpoint is `https://inference.baseten.co/v1/chat/completions`. Keep `BASETEN_MODEL` empty until an authenticated catalogue and a schema-enforcing adversarial model are verified. Use an inference-only, team-scoped or model-scoped key where available. The programme ceiling is USD 3.

## Modal

Modal requires a deployed protected Web Function before CONTRA has an endpoint to call. `MODAL_TOKEN_ID` and `MODAL_TOKEN_SECRET` are deployment-tool credentials, not automatically Web Function proxy credentials. Freeze the function code and deployment identity, then use separately scoped `MODAL_PROXY_KEY` and `MODAL_PROXY_SECRET` for the function boundary. The programme ceiling is USD 5.

No Modal function or model is currently claimed.

## Local installation

1. Copy `.env.providers.example` to an ignored local file.
2. Add only the credential for the provider being tested.
3. Keep every live flag false during non-billable validation.
4. Run provider configuration and fixture tests.
5. Record redacted account, model, pricing and billing-limit evidence.
6. Request one bounded owner authorisation for the immutable execution packet.

## Cloudflare secrets

Do not add provider secrets to the current Worker yet. Its `/api/evaluate` route is deliberately disabled and does not consume provider secrets. Once a reviewed Worker adapter and durable budget ledger are merged, stage secrets with the Wrangler versions workflow so a secret change is not silently deployed outside the approved release.

## Rotation and incident response

Revoke the old credential first when compromise is suspected. Preserve only non-secret credential identifiers and timestamps in the audit record. Any ambiguous provider call retains its budget reservation until billing reconciliation and is never blindly retried.

## Official references

- Meta Model API: <https://dev.meta.ai/docs/overview>
- Meta models: <https://dev.meta.ai/docs/models>
- Baseten Model APIs: <https://docs.baseten.co/inference/model-apis/overview>
- Baseten API keys: <https://docs.baseten.co/organization/api-keys>
- Modal Web Function proxy authentication: <https://modal.com/docs/guide/webhook-proxy-auth>
- Cloudflare secrets: <https://developers.cloudflare.com/workers/configuration/secrets/>
