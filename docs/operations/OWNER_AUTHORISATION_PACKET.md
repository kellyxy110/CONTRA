# Consolidated external authorisation packet

Status: draft only. This document requests one bounded owner decision. It does not authorise a deployment, signature, funded transaction, hosting change, provider call or secret transfer.

The machine-readable proposal is [`config/testnet-authorisation-proposal.json`](../../config/testnet-authorisation-proposal.json). Recompute both digests with:

```sh
node scripts/external-authorisation-packet.mjs config/testnet-authorisation-proposal.json
```

Current draft packet SHA-256: `ecbb22daff344f64638a724b741f2b765a67ffba0aec7385dbc960f1354ac228`.

Current draft deployment-intent SHA-256: `7e4b2fd3c66a5fba9dc429837654d4fb9e5f5e6177c4e9b667306ad3bfba50df`.

The proposal names `contra-contestation.testnet` as both contract account and signer and uses an owner-controlled Ledger. Read-only queries through the official NEAR RPC and FastNEAR at final blocks `276958725` and `276958726` both returned `UNKNOWN_ACCOUNT`. The account does not yet provide ownership, balance, code or public-key evidence and must be created and funded through a separately authorised owner action before approval.

The 8 NEAR minimum is an opening balance that must already exist when deployment preflight begins. It is not charged against the separate 5 NEAR execution-cost ceiling. Creating and funding the account requires its own owner authorisation. The maximum combined owner exposure is therefore 13 NEAR: at most 8 NEAR opening funding plus at most 5 NEAR for deployment and acceptance. No part of either allowance is currently approved.

Packet readiness is separated by milestone. M08 contract deployment can become ready while M09 hosting and M10 provider usage remain blocked. Hosting or provider approval can never authorise M08.

## Exact approval procedure

1. The owner confirms or replaces the proposed account, ceiling, minimum balance and custody method.
2. The owner supplies only the public signer key. Private material remains on the Ledger and never enters chat, Git, CI or application storage.
3. GitHub's supported Ubuntu 24.04 runner builds the production WASM and records its SHA-256. Read-only preflight confirms the account, full-access public key, balance, current code hash and fresh testnet final block.
4. The script emits the final packet and deployment-intent digests.
5. The owner approves that exact deployment-intent digest, with approval and expiry timestamps. Any field change invalidates approval.
6. Within that scope, execution may deploy once, initialise once, inspect code and state, and run the bounded acceptance journey. UNKNOWN financial operations are never blindly redispatched.

The checked-in draft deliberately lacks an existing account, public key, Linux artifact hash and owner signature. Its digest is exact for the draft, but it is not an executable approval. This prevents a preliminary proposal from being reused after material fields change.

near-cli-rs `0.30.1` is checksum-pinned for the Linux release gate. CI verifies the `sign-with-ledger` command surface without connecting a device, signing or broadcasting. Actual device control remains an external authority boundary.

## Hosting, reviewers and providers

The same packet consolidates the remaining inputs:

- approve one Fly.io Machine, one encrypted Fly Volume, HTTPS ingress and an external encrypted backup destination, with a proposed infrastructure ceiling of USD 15 per month;
- name three primary and three fresh reviewers under six distinct operators, with no operator overlap;
- separately authorise any provider account and amount, never exceeding programme ceilings of USD 3 Meta, USD 3 Baseten and USD 5 Modal.

Hosting and provider entries remain disabled until separately approved. Provider secrets and hosting credentials belong only in their server-side secret facilities.
