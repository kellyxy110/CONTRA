# M07 repository audit inventory

Date: 9 November 2026

## RETAIN

- `contracts/contestation/`, `services/`, `apps/web/`, `packages/protocol/`, `scripts/`, `tests/` and `.github/workflows/` are active implementation and verification source.
- `design/reference/control-ai-policy-dashboard.jpeg` is immutable owner source with SHA-256 `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`.
- `design/ux3a/` and active frontend assets are retained because the operational client and historical acceptance evidence depend on them.
- `project/artifacts/` receipts, build transcripts, screenshots, balances, gas reports and benchmark inputs remain historical evidence.
- Root configuration, README, licence, agent instructions and build entrypoints remain discoverable.

## ARCHIVE

- Superseded instructions in `project/NEXT.md`, completed milestone documents and older handoff sections remain accessible historical records.
- Historical machine evidence retains original terminology, paths, timestamps and compiler names. It is not rewritten.
- No bulk archive move is made because historical commits, reports and links refer to current paths.

## REORGANISE

- The target `docs/architecture/`, `docs/protocol/`, `docs/security/`, `docs/operations/`, `docs/testing/`, `docs/judges/` and `docs/history/` hierarchy now has active entrypoints.
- Existing authoritative specifications remain in place until a focused link-preserving move has demonstrated value.
- The living README directs new readers to current guidance before historical milestone material.

## REGENERATE

- Production and fault WASM, wallet bundle, CI output and Sandbox reports are derived from pinned source and commands.
- New Contestation WASM checksums are recorded separately after a clean build. Old artifact records are not replaced.

## REMOVE

- No tracked file is removed in this checkpoint. The audit found no disposable tracked material whose deletion outweighed provenance and link risk.
- Ignored `node_modules`, Cargo `target`, `.data`, generated wallet bundle and `ci-output` remain local derived material.

## Findings resolved in this unit

- Renamed the active contract path, crate and artifact identity and updated all dependent build, test, Sandbox and CI paths.
- Added active-tree terminology enforcement and documentation link verification.
- Remediated the inherited critical and high npm path while preserving the local Sandbox harness interface.
- Rebuilt the README and added security, deployment, testing, judge and blocker entrypoints.

## Remaining audit work

- Full Linux Sandbox and P0 runs must prove the dependency override and renamed build paths on the supported host.
- GitHub branch rules and public repository description must be rechecked after merge.
- Testnet, hosted runtime, independent operators and provider access remain external programme gates in `project/BLOCKERS.md`.
