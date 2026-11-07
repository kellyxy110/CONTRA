# M05 runtime and backend checkpoints

Checkpoint: `CONTRA-2026-11-07-IMPL-M05-R01`

## Completed

- Added explicit `unavailable`, `sandbox` and `testnet` startup modes.
- Wired the testnet RPC adapter into application startup.
- Added startup validation for RPC URL, testnet network identity, node sync status, contract account syntax, deployed contract code and finalized block access.
- Added finalized contract reads with block height, block hash, block timestamp, observation time, age, stale state and block-regression detection.
- Added finalized transaction inspection that distinguishes pending, failed and confirmed results.
- Added genuine chain and persistence details to the health and configuration responses.
- Added versioned SQLite migrations, full synchronous writes, integrity checks, content-addressed object audits and conservative restart recovery to `UNKNOWN`.
- Verified idempotent budget reservations through two database connections.
- Added same-origin and configured-origin write enforcement, JSON content-type enforcement and restrictive security headers.
- Removed superseded visual studies, capture wrappers and visual-only browser matrices after checking active frontend dependencies.

## Observed verification

- `npm test`: 44/44 passed at R01.
- Live read-only `status` request to `https://rpc.testnet.near.org`: returned `chain_id=testnet`, `syncing=false` and a current finalized testnet head.
- Local unavailable-mode startup: health returned explicit unavailable chain state and SQLite schema version 2 with integrity `ok`.
- No testnet contract was configured or queried because no authorized deployed CONTRA account exists.
- No Sandbox journey was rerun in this checkpoint. Accepted M03 and M04 evidence remains unchanged.

## Remaining M05 work

- Run the complete Sandbox financial regression on the compatible Linux host.
- Add a configured-contract read test after a testnet deployment is separately authorized and exists.
- Complete API rate limiting and deeper case-isolation fuzzing.
- Exercise abrupt process termination around object, transaction and reservation writes.
- Finish deployment storage documentation and backup/restore verification for the selected host.
- Reevaluate AC01 through AC33 only after fresh evidence satisfies each frozen requirement.

## R02 security and storage continuation

Checkpoint: `CONTRA-2026-11-07-IMPL-M05-R02`

- Added bounded per-account or per-address limits for NEP-413 challenges and verification, artifact writes, provider evaluation and transaction dispatch.
- Added `Retry-After` on rate-limit responses.
- Made configured public origin authoritative so a forged Host header cannot create a false same-origin match.
- Added participant isolation verification proving an artifact linked only to case A cannot be read through case B.
- Added offline WAL checkpoint, storage audit and full-volume backup preparation.
- Added restore verification for SQLite records and immutable object bytes.
- Added failure coverage for missing object files.
- Added expiry pruning support for sessions and challenges.
- Verified every frontend asset retained after design cleanup is still served by the operational application.

R02 also verifies abrupt child-process exit after artifact persistence, provider reservation and transaction broadcast. Artifact bytes and the reservation survive, while the interrupted broadcast operation recovers only as `UNKNOWN`. Expired session and challenge pruning preserves active records.

Concurrent limiter calls admit only the configured bound, and an aborted partial JSON request writes no challenge and does not stop the service.

R02 result: `npm test` passes 52/52. No Sandbox, testnet transaction, deployment, provider or secret operation occurred.

## Sandbox regression attempt

The first Windows attempt passed the old descriptor-only preflight but failed before Sandbox launch because the Unix `ps` utility was unavailable. The WSL retry used Linux x86_64 with a 1,048,576 hard file limit, Node and Cargo, but the pinned Sandbox binary could not start because that WSL distribution lacks GLIBC 2.38 and 2.39. Neither attempt started Sandbox or executed a transaction. The preflight now checks native Linux, `ps`, binary presence and binary executability in addition to the file limit, so these hosts fail early with an accurate blocker.

The individual M05 review is in `docs/M05_AC_REVIEW.md`. Totals remain 21 PASS, 10 PARTIAL and 2 BLOCKED.

## R03 compatible-host Sandbox result

The installed `Ubuntu` WSL distribution provides GLIBC 2.39, native process tools and a hard file limit of 1,048,576. It passed the strengthened preflight and completed `npm run test:m04:journeys` at `2026-11-07T03:48:16.497Z`.

- 44 of 44 persisted operations ended `CONFIRMED`.
- All 44 operation transaction hashes were unique.
- All 44 matching receipts reported success.
- The unchallenged PRIMARY ACCEPT path paid the beneficiary exactly 1 NEAR.
- The challenged path reversed PRIMARY ACCEPT to FRESH REJECT and paid the creator exactly 1 NEAR.
- Both payout intents ended `SUCCESS_VERIFIED` after callbacks.
- All six reviewer accounts were controlled by one local process. No independent-operator claim is made.

This journey run is accompanied by a fresh complete P0 regression on the same compatible host. All 18 financial categories and nine corrected baseline Sandbox tests passed. The retained evidence records 454 transactions, 753 receipt outcomes, 46 balance/storage snapshots, maximum transaction gas `35926618795729`, maximum callback gas `17002377317045`, maximum storage 17,470,225 bytes and zero gas-budget violations.

The initial P0 parent exited 2 because WSL attempted to use Windows-installed esbuild. The failed transcript is retained. A clean Linux-native dependency install under `/tmp` rebuilt esbuild 0.28.2 and reproduced the wallet bundle twice at SHA-256 `b2dae16e02c234a8ac162ae25e923831ffc9095cc98f9fe4a3a629d414d61143`. Reconciliation through the unchanged strict `p0Complete` predicate produced final gate exit 0. Future Linux P0 runs use the isolated helper automatically.

No testnet transaction, signing, deployment, live provider request, production secret or spending occurred. Acceptance totals remain 21 PASS, 10 PARTIAL and 2 BLOCKED.
