# Consolidated external authorisation packet

Status: draft only. This document requests one bounded owner decision. It does not authorise a deployment, signature, funded transaction, hosting change, provider call or secret transfer.

The machine-readable proposal is [`config/testnet-authorisation-proposal.json`](../../config/testnet-authorisation-proposal.json). Recompute both digests with:

```sh
node scripts/external-authorisation-packet.mjs config/testnet-authorisation-proposal.json
```

Current draft packet SHA-256: `bdd7df5bcb8c4b028e47cdaa8646e9cfc9189da5a9eab38be0fc9174a97fab0f`.

Current draft deployment-intent SHA-256: `c8de2e2dc97172c1a181d726693c8b1f4b119d554d7e011345b39963e71ed630`.

The proposal names `contra-contestation.testnet` as both contract account and signer, uses an owner-controlled Ledger, caps the complete M08 testnet plan at 5 NEAR, and requires at least 8 NEAR before execution. These are proposed limits, not permission to spend. The account name must be confirmed available and controlled before approval.

## Exact approval procedure

1. The owner confirms or replaces the proposed account, ceiling, minimum balance and custody method.
2. The owner supplies only the public signer key. Private material remains on the Ledger and never enters chat, Git, CI or application storage.
3. Engineering builds the production WASM and inserts its SHA-256. Read-only preflight confirms the account, full-access public key, balance, current code hash and fresh testnet final block.
4. The script emits the final packet and deployment-intent digests.
5. The owner approves that exact deployment-intent digest, with approval and expiry timestamps. Any field change invalidates approval.
6. Within that scope, execution may deploy once, initialise once, inspect code and state, and run the bounded acceptance journey. UNKNOWN financial operations are never blindly redispatched.

The checked-in draft deliberately lacks the public key, artifact hash and owner signature. Its digest is exact for the draft, but it is not an executable approval. This prevents a preliminary proposal from being reused after material fields change.

## Hosting, reviewers and providers

The same packet consolidates the remaining inputs:

- approve one Fly.io Machine, one encrypted Fly Volume, HTTPS ingress and an external encrypted backup destination, with a proposed infrastructure ceiling of USD 15 per month;
- name three primary and three fresh reviewers under six distinct operators, with no operator overlap;
- separately authorise any provider account and amount, never exceeding programme ceilings of USD 3 Meta, USD 3 Baseten and USD 5 Modal.

Hosting and provider entries remain disabled until separately approved. Provider secrets and hosting credentials belong only in their server-side secret facilities.
