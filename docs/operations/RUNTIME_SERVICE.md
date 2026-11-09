# Runtime service contract

Status: deployment preparation only. No hosting provider, public service or production secret is configured or claimed.

[`config/runtime-service.example.json`](../../config/runtime-service.example.json) is the portable minimum contract for an operational CONTRA backend. It is intentionally provider-neutral.

## Process and storage

- Run `node services/api/server.mjs` as exactly one replica.
- Mount one durable volume at the absolute directory supplied by `CONTRA_DATA_DIR`.
- Never share that SQLite volume between concurrent processes or attach it to an ephemeral application image.
- Allow at least 60 seconds for graceful termination. The runtime drains accepted HTTP work, closes SQLite and the chain adapter, then releases its verified data lease.
- Terminate TLS at an approved HTTPS ingress and set `CONTRA_PUBLIC_ORIGIN` plus the narrow `CONTRA_ALLOWED_ORIGINS` list.
- Supply secrets only through the selected host's server-side secret facility. The example contract contains none.

## Probes

`GET /api/live` answers only whether the HTTP process can serve a response. It does not query SQLite or NEAR and never claims the application is ready.

`GET /api/ready` audits SQLite and content-addressed objects, then requires the configured chain adapter to report `ready`. It returns HTTP 503 for unavailable or stale chain state, corrupt or missing evidence, or any failed storage audit. Orchestrators must remove an unready instance from traffic without treating liveness as chain finality.

`GET /api/health` remains the detailed operator view, including real network identity, finality metadata, persistence state, wallet gates, provider availability and reviewer-control disclosure.

## Provider-neutral deployment checklist

1. Validate the exact release SHA and clean dependency installation.
2. Configure one replica, a persistent volume, HTTPS ingress and narrow origins.
3. Start in `unavailable` mode and verify `/api/live` is 200 while `/api/ready` is 503.
4. Verify a restored backup before using its volume.
5. Configure the authorised testnet RPC and already deployed contract only after the separate M08 gate is complete.
6. Require `/api/ready` to show the expected network, contract, final block and intact persistence before routing traffic.
7. Exercise graceful termination and confirm the data lease is removed before restart or backup.

This contract does not authorise hosting deployment, contract deployment, wallet signing, funded transactions, paid inference or production-secret changes.
