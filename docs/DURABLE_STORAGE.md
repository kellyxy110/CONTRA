# Durable storage operations

CONTRA stores financial operation state, sessions, provider reservations and artifact indexes in SQLite. Evidence and findings are immutable files under the same data directory. The database and `objects` directory form one storage unit and must live on one durable volume.

## Configuration

Set `CONTRA_DATA_DIR` to a dedicated persistent directory. Never point it at a deployment image layer, temporary directory, repository root or memory-only filesystem. The safe local default is `.data`.

Startup performs:

1. Versioned schema migrations inside immediate transactions.
2. SQLite integrity verification.
3. Content-addressed object presence, size and SHA-256 verification.
4. Conservative recovery of interrupted nonterminal operations to `UNKNOWN`.

An `UNKNOWN` operation remains locked. A restart is not evidence that its transaction failed.

## Offline backup

1. Stop the CONTRA process cleanly so no API request can mutate storage.
2. Run `npm run check:storage -- <absolute-data-directory>`.
3. Confirm `integrity` is `ok`, `checkpointed` is true and both object error lists are empty.
4. Snapshot or copy the entire data directory as one unit, including `contra.sqlite`, any SQLite side files and `objects/`.
5. Store the backup with access control appropriate for private evidence.

Do not copy only the SQLite file or only the objects directory.

## Restore verification

1. Restore the complete directory to a new dedicated path while the service is stopped.
2. Run `npm run check:storage -- <restored-directory>`.
3. Start with `CONTRA_DATA_DIR=<restored-directory>` in `unavailable` mode first.
4. Inspect `/api/health` and confirm schema version and integrity before enabling Sandbox or testnet reads.

Backup and restore do not authorize transaction retries, deployment, signing or paid provider activity.
