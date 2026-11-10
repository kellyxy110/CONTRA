# Proposed public backend architecture

Status: prepared, not deployed and not authorised.

## Selected architecture

Use Cloudflare Workers with Static Assets and one SQLite-backed Durable Object class named `ContraState`. Requests for a financial operation are routed to one named object, which provides a single serial transaction boundary for operation identity, wallet handoff, transaction hashes, sessions, immutable evidence and chain observations.

This is a deliberate migration from the Node.js process and filesystem SQLite implementation. D1 is not the financial source of truth because it does not provide the same per-operation serial coordination boundary. R2 is not required for the current evidence limit: immutable artifacts up to 1 MB are stored by digest in Durable Object SQLite. R2 may be evaluated later only if an existing Free allocation and a fail-closed zero-cost boundary are verified.

Official operational references:

- [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Durable Objects limits](https://developers.cloudflare.com/durable-objects/platform/limits/)
- [Durable Objects pricing and Free allocation](https://developers.cloudflare.com/durable-objects/platform/pricing/)
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)

## Cost and security boundary

No hosting spend is authorised. The hard ceiling is USD 0. The account must remain on Workers Free, no automatic paid upgrade is allowed and quota exhaustion must reject work rather than change financial state. As verified on 9 November 2026, Workers Free documents 100,000 requests per day, 10 ms Worker CPU per invocation, 20,000 static files per version and 25 MiB per static file. SQLite Durable Objects are available on Free with a 5 GB account storage allocation, and storage exhaustion rejects writes. These provider limits must be rechecked immediately before deployment.

The Worker receives only server-side secrets through Cloudflare secret bindings. Public ingress exposes only HTTPS. Allowed origins remain narrow. Account and API-token access use named operators and least privilege. The Cloudflare entrypoint implements the frontend integration routes for authentication, testnet reads, immutable records, reviewer access and wallet recovery. Server-side transaction dispatch, live wallet handoff and paid provider execution remain disabled.

## Deployment and recovery checks

1. Build from the frozen release SHA and verify `npm ci`, repository tests, Cloudflare tests and the wallet bundle.
2. Create the `contra-testnet` Worker and SQLite `ContraState` Durable Object migration on a Workers Free account.
3. Initialise empty state or import a separately verified recovery export when that mechanism is complete.
4. Start with live signing disabled. `/api/live` reports process availability, while `/api/ready` requires both the Durable Object schema and a fresh NEAR final-block observation.
5. Configure the authorised testnet contract only after M08 deployment evidence exists.
6. Route traffic only when readiness proves intact storage and fresh expected chain identity.
7. Test isolate eviction, durable-state recovery, storage failure, session isolation and an exported backup and restore before public use.
8. Retain deployment logs without session tokens, private keys or provider credentials.

Worker rollback means deploying a prior version that remains compatible with the applied Durable Object migration. Durable Object migrations are not automatically reversible. Contract deployment itself also has no automatic rollback. A replacement contract deployment requires a new artifact hash, preflight and owner-bound plan.
