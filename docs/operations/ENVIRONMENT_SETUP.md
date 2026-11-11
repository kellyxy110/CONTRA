# Environment setup

CONTRA separates local Node configuration, Cloudflare public configuration and secrets. Example files contain placeholders only. Real credentials belong in ignored local files, Windows Credential Manager or Cloudflare Worker secrets.

## Node runtime

Use `.env.local.example` for a disconnected local service or `.env.testnet.example` for read-only Testnet access. The Node process consumes environment variables supplied by the shell. It does not load dotenv files automatically.

The canonical Node RPC variable is `CONTRA_RPC_URL`. Cloudflare uses `NEAR_RPC_URL` because it is an existing deployed Worker binding. This platform boundary is intentional until a separately tested binding migration is deployed.

Testnet startup requires:

- `CONTRA_CHAIN_MODE=testnet`
- an HTTPS `CONTRA_RPC_URL`
- a valid `.testnet` `CONTRA_CONTRACT_ACCOUNT`
- origin-only `CONTRA_PUBLIC_ORIGIN` and `CONTRA_ALLOWED_ORIGINS` values
- bounded RPC timeout and staleness values

URLs containing credentials, query strings or fragments are rejected. Public origins cannot include paths.

## Financial controls

`CONTRA_LIVE_SIGNING_AUTHORISED=false` is the safe public setting. Changing an environment value alone never grants transaction authority. Live signing additionally requires an immutable authority packet, permitted methods, exact identities, contract identity, deposits, expiry and server validation.

The example `CONTRA_MAX_TRANSACTION_NEAR` and `CONTRA_MAX_JOURNEY_NEAR` values document proposed packet limits. They are not active spending authority in the read-only runtime.

## Cloudflare

The public Worker is `contra-testnet`; the Pages project is `contra-near`; durable state remains in the existing SQLite-backed `ContraState` object. The checked-in Worker variables are public configuration, not secrets.

Validate without deploying:

```sh
npm ci
npm run test:cloudflare
npm run check:cloudflare
```

Cloudflare Free remains capped at USD 0 with no authorised automatic upgrade. The current public provider endpoint remains disabled. Do not configure provider secrets until the Worker consumes them and the corresponding provider is separately authorised.

## Secret hygiene

- Never commit `.env`, `.env.*`, `.dev.vars` or `.dev.vars.*` files without the `.example` suffix.
- Never place a seed phrase, private key, API key or proxy secret in browser assets.
- Never print secret values in CI, logs, screenshots or support transcripts.
- Rotate a suspected credential at its provider, update the secure store and verify the old credential is rejected.
- Treat `wrangler secret put` as a deployment because it creates and activates a Worker version.

## Verification

Run `npm test`, `npm run build:wallet`, `npm run test:cloudflare`, `npm run check:cloudflare` and the source policies before promotion. A successful dry run proves packaging only, not provider access or external readiness.
