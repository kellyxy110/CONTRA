# Proposed public backend architecture

Status: prepared, not deployed and not authorised.

## Selected architecture

Use one Fly.io Machine in one owner-approved region, attached to one Fly Volume mounted at `CONTRA_DATA_DIR`. Fly Proxy terminates HTTPS. The service runs exactly one replica, uses the existing exclusive data lease, and receives at least 60 seconds for graceful shutdown. A second concurrently writable Machine is forbidden.

This choice matches CONTRA's current single-writer SQLite and immutable-object design. Fly Volumes are persistent storage attached to a Machine, but they are local to one region and are not automatically replicated to another Machine. The deployment therefore requires tested application-level backup to separate encrypted object storage. Volume snapshots are recovery assistance, not the only backup.

Official operational references:

- [Fly Machines and pricing](https://fly.io/docs/about/pricing/)
- [Fly Volumes overview](https://fly.io/docs/volumes/overview/)
- [Fly application configuration](https://fly.io/docs/reference/configuration/)

## Cost and security boundary

No hosting spend is authorised. The proposal asks for a USD 15 monthly infrastructure ceiling. Before deployment, the owner must approve the current Fly price estimate for the exact Machine, volume, bandwidth and snapshot settings. Alerts should trigger at 50, 80 and 100 per cent of the approved ceiling.

The Machine receives only server-side secrets. The volume contains SQLite and content-addressed evidence and must use the provider's at-rest encryption plus application backup encryption. Public ingress exposes only HTTPS. `CONTRA_ALLOWED_ORIGINS` and `CONTRA_PUBLIC_ORIGIN` remain narrow. SSH and organisation access use named operators and least privilege.

## Deployment and recovery checks

1. Build from the frozen release SHA and verify `npm ci`, repository tests and the wallet bundle.
2. Create one Machine and one volume. Refuse a second writer.
3. Restore a verified backup or initialise an empty volume.
4. Start with chain mode unavailable. `/api/live` must return 200 and `/api/ready` must return 503.
5. Configure the authorised testnet contract only after M08 deployment evidence exists.
6. Route traffic only when `/api/ready` proves intact storage and fresh expected chain identity.
7. Test graceful stop, lease release, offline backup, restore into a new volume and integrity audit.
8. Retain deployment logs without session tokens, private keys or provider credentials.

Rollback means deploying the prior application image against a backup that matches its schema. Contract deployment itself has no automatic rollback. A replacement contract deployment requires a new artifact hash, preflight and owner-bound plan.
