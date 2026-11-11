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

The verified Standard Model API endpoint is `https://api.meta.ai/v1/chat/completions`. `muse-spark-1.3` remains the proposed primary and fresh-review model. The official catalogue recommends Spark 1.3 for new work. Access to the owner's account has not been verified. Contributor variants must not be used for case evidence because their prompts, files, context and responses may be used for training.

Create a unique application key in the Model API dashboard and store it as `META_API_KEY` only in the server secret store. Standard Spark 1.3 pricing observed on 2026-11-11 is USD 1.25 per million input tokens and USD 4.25 per million output tokens, with USD 0.15 cached input. Meta documents only a spend alert, not a hard usage cap. Therefore the provider-side hard-limit gate is currently unavailable and Meta must remain disabled even after a key is installed unless the owner accepts a separately documented control or Meta adds a genuine hard cap. The programme ceiling is USD 3, not automatic spending permission.

## Baseten

The Model API endpoint is `https://inference.baseten.co/v1/chat/completions`. Keep `BASETEN_MODEL` empty until the authenticated catalogue and a schema-enforcing adversarial model are verified. For production, create a team key with `Call certain models`, restrict it to the selected model and environment, and set an expiry. Baseten exposes OpenAI-compatible Chat Completions and structured outputs, but no exact model or provider-side hard billing cap has been verified for CONTRA. The programme ceiling is USD 3.

## Modal

Modal requires a deployed protected Web Function before CONTRA has an endpoint to call. `MODAL_TOKEN_ID` and `MODAL_TOKEN_SECRET` are deployment-tool credentials, not Web Function proxy credentials. Freeze the function code and deployment identity, set `requires_proxy_auth=True`, then use a separately scoped Proxy Token through `MODAL_PROXY_KEY` and `MODAL_PROXY_SECRET`. The Starter plan currently includes USD 30 monthly compute credit, but credits do not cover every product and are not authority to spend. Configure a Workspace budget and a USD 5 spend limit before any call. The programme ceiling is USD 5.

No Modal function or model is currently claimed.

## Local installation

1. Copy `.env.providers.example` to an ignored local file.
2. Add only the credential for the provider being tested.
3. Keep every live flag false during non-billable validation.
4. Run provider configuration and fixture tests.
5. Record redacted account, model, pricing and billing-limit evidence.
6. Request one bounded owner authorisation for the immutable execution packet.

Credential-independent verification:

```sh
npm test
npm run test:cloudflare
node --test tests/m10-external-readiness.test.mjs tests/m10-environment.test.mjs
```

Credential installation, only after the gates above are satisfied:

```sh
npx wrangler secret put META_API_KEY
npx wrangler secret put BASETEN_API_KEY
npx wrangler secret put MODAL_PROXY_KEY
npx wrangler secret put MODAL_PROXY_SECRET
```

Each command reads the secret interactively. Never pass a secret on the command line or place it in a committed file. Installing a secret does not enable live execution; the corresponding verified model, endpoint, billing and owner-authorisation gates must also pass.

## Cloudflare secrets

Do not add provider secrets to the current Worker yet. Its `/api/evaluate` route is deliberately disabled and does not consume provider secrets. Once a reviewed Worker adapter and durable budget ledger are merged, stage secrets with the Wrangler versions workflow so a secret change is not silently deployed outside the approved release.

## Rotation and incident response

Revoke the old credential first when compromise is suspected. Preserve only non-secret credential identifiers and timestamps in the audit record. Any ambiguous provider call retains its budget reservation until billing reconciliation and is never blindly retried.

## Official references

- Meta Model API: <https://dev.meta.ai/docs/overview>
- Meta models: <https://dev.meta.ai/docs/models>
- Meta pricing and rate limits: <https://dev.meta.ai/docs/pricing-rate-limits>
- Meta authentication: <https://dev.meta.ai/docs/authentication>
- Baseten Model APIs: <https://docs.baseten.co/inference/model-apis/overview>
- Baseten pricing and limits: <https://docs.baseten.co/inference/model-apis/pricing-and-limits>
- Baseten API keys: <https://docs.baseten.co/organization/api-keys>
- Modal Web Function proxy authentication: <https://modal.com/docs/guide/webhook-proxy-auth>
- Modal budgets: <https://modal.com/docs/guide/budgets>
- Modal pricing: <https://modal.com/pricing>
- Cloudflare secrets: <https://developers.cloudflare.com/workers/configuration/secrets/>
