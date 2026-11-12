# Provider credential setup

Meta and Baseten credentials are installed in the Cloudflare Worker, but both providers remain independently gated. The Modal verifier is deployed, but its dedicated Proxy Auth token is not installed. Fixture transports prove schema, citation, budget and trust-boundary behaviour only. They are not live inference evidence.

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

The protected deterministic verifier is deployed as Modal app `ap-2wMup9xpnApV3ehbwwjKrK` at `https://boredom407--contra-verifier-verify.us-east.modal.run`. An unauthenticated POST returned HTTP 401 on 11 November 2026. No authenticated verification has completed because a dedicated Proxy Auth token is not yet installed.

The reviewed function source is `services/modal/app.py`; its deterministic validation core is `services/modal/verification_core.py`. The Modal image pins Python 3.13 and `fastapi[standard]` 0.121.1 because Modal no longer installs FastAPI automatically for `fastapi_endpoint`. It accepts only `CONTRA_PROVIDER_VERIFICATION_REQUEST_V1`, recomputes the immutable proposal digest, checks exact case, terms and round identity, restricts every nested citation to the supplied evidence set and returns a non-binding `CONTRA_PROVIDER_VERIFICATION_V1` result. It performs no model inference and reports zero tokens.

The deployed source was produced with:

```sh
modal deploy services/modal/app.py --name contra-verifier --profile boredom407
```

The required HTTP 401 negative test passes. The next step is to create a dedicated Proxy Auth token and install only that token pair in Cloudflare. Do not install the local `ak-` and `as-` deployment credentials in the Worker.

## Exact owner inputs

Do not send any credential through chat. Enter each value only into its provider dashboard, the local ignored environment file or Wrangler's interactive prompt.

- Meta: one new Model API application key for Standard `muse-spark-1.3`, plus redacted evidence of account access, available credit and the Usage page. Meta currently exposes usage alerts rather than a verified hard spend cap, so installing the key does not satisfy the billing gate.
- Baseten: one expiring team API key restricted to `Call certain models`, the exact selected model ID and environment, plus redacted credit, pricing and billing-control evidence. Do not create a broad administrator key.
- Modal: Workspace deployment credentials are needed only on the trusted machine that deploys the verifier. The Worker needs a separately scoped Proxy Token pair, the protected `.modal.run` function URL and frozen function ID. Configure a Workspace budget and USD 5 spend limit first.

The Modal deployment token pair (`MODAL_TOKEN_ID` and `MODAL_TOKEN_SECRET`) must never be installed in the CONTRA Worker. Only `MODAL_PROXY_KEY` and `MODAL_PROXY_SECRET` belong there.

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

Credential installation is interactive. From the repository root, verify the target first:

```sh
npx wrangler whoami
npx wrangler secret list --config wrangler.jsonc
```

After the reviewed provider-readiness release is deployed, install only the credentials the owner has obtained:

```sh
npx wrangler secret put META_API_KEY --config wrangler.jsonc --name contra-testnet
npx wrangler secret put BASETEN_API_KEY --config wrangler.jsonc --name contra-testnet
npx wrangler secret put MODAL_PROXY_KEY --config wrangler.jsonc --name contra-testnet
npx wrangler secret put MODAL_PROXY_SECRET --config wrangler.jsonc --name contra-testnet
npx wrangler secret list --config wrangler.jsonc
```

Each command reads the secret interactively and deploys a new Worker version containing that secret. Run it only after the reviewed provider-readiness release is live. Never pass a secret on the command line or place it in a committed file. Installing a secret does not enable live execution because all non-secret provider gates remain false.

## Cloudflare secrets

The Worker reports independent, redacted provider readiness through `/api/config`. Credential values are never returned. The execution route remains fail closed until the provider-specific model, account, credit, pricing, hard billing limit, bounded owner spending authority and live-enable gates all pass. `/api/evaluate` remains disabled; the authenticated durable provider-jobs contract is the stable integration boundary.

After credential installation, first verify that `/api/config` changes only that provider's `credential_installed` gate. Authentication or catalogue probes must use a provider-documented non-billable endpoint. If no such endpoint exists, stop before a model call and obtain bounded spending authority.

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
