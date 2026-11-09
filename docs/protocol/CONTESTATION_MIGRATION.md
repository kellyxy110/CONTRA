# Contestation terminology migration

## Scope

Current source, builds, tests, CI, active documentation and product copy use Contestation as the canonical protocol category. The Rust package is `contra-contestation`, its source lives in `contracts/contestation/`, and the production artifact is `contra_contestation.wasm`.

## Compatibility decision

The migration changes repository identity and build paths only. The Rust contract source is moved without semantic edits. Public method names, JSON arguments, Borsh state layout, event schema, account identifiers, commitment encodings, domain separators, canonical serialisation, payout identities, SQLite migrations, challenge deadlines and settlement rules are unchanged.

No live contract has been deployed. A future deployment therefore uses the new artifact name without requiring onchain state migration. If an external consumer has cached the old local build path, it must update that path. It does not need to update an ABI method or serialized payload.

## Historical evidence

Machine-generated M03 and implementation evidence retains original compiler output and paths. Rewriting those files would corrupt provenance. Source policy excludes `project/artifacts/` from terminology enforcement but continues to scan those files for em dash and credential policy violations.

Current documentation may describe historical milestones using the canonical product term while preserving dates, commit identifiers, measurements and outcomes. Git commits, pull-request discussions, receipts and signed artifacts are never rewritten.

## Enforcement

`scripts/ci-policy.mjs` rejects obsolete terminology in current tracked paths and text, and rejects invented actor names. The only permitted matches are preserved machine evidence under `project/artifacts/`.

## First renamed artifact verification

Built on Ubuntu with Rust 1.98.0 from the unchanged Rust source:

| Artifact | SHA-256 |
| --- | --- |
| `contra_contestation.wasm` | `117ab8b854fad4d13d31e4e930b85f88c365c7d285273c66a361c1f46cfaa196` |
| `faults.wasm` | `30571d4d45673b1e7b4493abaea8c76d02e460784db41776c4b4e9500958c003` |

The ABI check reports 29 production exports and four additional fault-only exports, matching baseline commit `34c836bbd02dc672325800b2951714ee6e935659`. Exact commitment, case, terms and payout vectors match the frozen v1 values.

GitHub-hosted Ubuntu run `42573377248` independently produced and archived:

| Artifact | SHA-256 |
| --- | --- |
| `contra_contestation.wasm` | `49cff947a68ae2fddbc5843c22fad1d655162e50b1e81957443584ca90377a5f` |
| `faults.wasm` | `d3b8d3f452c6e07916e7c693615657bd657a2ad3281a0f5783462546b36ce00e` |

Deployment must bind the checksum of the exact reviewed release artifact. A checksum from another runner or historical build is not interchangeable deployment proof.
