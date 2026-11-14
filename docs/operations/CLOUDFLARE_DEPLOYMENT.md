# Cloudflare Free deployment and recovery

Status: publicly deployed with exact wallet-confirmed Testnet signing enabled and server-side transaction dispatch disabled. The machine-readable execution record is [`config/m09-cloudflare-authority-proposal.json`](../../config/m09-cloudflare-authority-proposal.json).

## Browser wallet transaction boundary

Production may expose wallet-confirmed signing without a per-operation Worker redeployment when `CONTRA_WALLET_CONFIRMATION_AUTHORISED=true`. This does not grant the application custody or general signing authority. Before every handoff, the Worker reloads the persisted operation, checks the authenticated account, revalidates the exact payload against current Testnet contract state, enforces the contract destination and method allowlist, and limits the attached deposit to at most 1 NEAR. The wallet must then display and approve that exact transaction.

`retry_payout`, reviewer administration and storage sponsorship remain excluded from this browser-confirmed path. UNKNOWN operations remain locked and cannot be redispatched. The legacy digest-scoped environment gate remains available for exceptional, separately authorised operations.

Public origin: `https://contra-near.pages.dev`. Pages project: `contra-near`. Verified Pages deployment: `88bd4a69.contra-near.pages.dev`. Verified backend Worker version: `7134221e-6ee1-477d-9352-6a52ea841db5`. Wrangler authenticated the verified owner account locally. Its personal login identifier is omitted from active public metadata. The credential remains encrypted locally and was not printed or committed. The current OAuth grant is not represented as a dedicated least-privilege API token.

Pages serves the static frontend and same-origin `/api/*` proxy. A private `BACKEND` service binding invokes the existing Worker inside Cloudflare, so browser requests expose only `contra-near.pages.dev` and the personal Worker hostname is absent from active source. The Worker and `ContraState` Durable Object remain unchanged resources. The legacy public Worker route now returns HTTP 404, while Pages readiness remains HTTP 200.

## Preflight

1. Confirm the Cloudflare account is on Workers Free and the expenditure ceiling is USD 0.
2. Verify account ID `0a8fd0acd086e68c9b558159fac0d7a8`, the `contra-testnet` Worker, `ContraState` SQLite Durable Object and public origin.
3. Prefer a dedicated least-privilege deployment token for future automation. Never commit or print it.
4. Run `npm ci`, `npm test`, `npm run test:cloudflare`, `npm run build:cloudflare` and `npm run check:cloudflare`.
5. Confirm Wrangler's dry-run names only the intended Worker, SQLite migration and Static Assets directory.
6. Keep `CONTRA_LIVE_SIGNING_AUTHORISED=false` until the separate browser custody, participant consent, reviewer independence and funded authority gates are complete.

## Readiness

`/api/live` proves only that the Worker responds. `/api/ready` requires the complete SQLite schema plus a fresh, non-stale final NEAR testnet observation for `contra-contestation.testnet`. Storage-only health is unready. RPC failure, stale observations, schema loss and quota failure return an explicit failure and never imply transaction confirmation.

## Free capacity

Cloudflare documentation rechecked on 10 November 2026 records 100,000 Worker requests per day, a 10 ms Worker CPU allowance, 128 MB memory, 20,000 Static Asset files, 25 MiB per asset and 5 GB SQLite Durable Object storage per Free account. Free-tier overages fail instead of automatically becoming paid usage. The application caps each immutable artifact at 1 MB and maps storage exhaustion to an explicit rejected write.

## Backup and recovery

`ContraState.backup()` produces a digest-bound `CONTRA_CLOUDFLARE_BACKUP_V1` package containing all eight authoritative tables. It is an operator-only Durable Object RPC and is not exposed through the public Worker routes. Store exports only at the destination approved in the final authority packet.

Cloudflare SQLite Durable Objects also provide point-in-time recovery bookmarks for the prior 30 days. Remote PITR is unavailable in local development and must be tested only after resource and deployment authority exists. A remote restore is destructive and requires a separate incident decision. Capture the current and pre-restore bookmarks, stop public writes, restore the named object, verify schema, operation identities, artifacts and chain observation, then reopen traffic. Worker code rollback does not roll back Durable Object data or migrations.

## Rollback

Deploying a prior Worker version is permitted only when it remains compatible with the applied `ContraState` migration. Do not delete or recreate the namespace. If readiness fails after a code release, route traffic away, retain the object, export evidence and deploy the last schema-compatible version. No rollback procedure may redispatch an UNKNOWN transaction.
