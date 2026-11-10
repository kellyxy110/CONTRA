# Consolidated external authorisation packet

Status: draft only. This document requests one bounded owner decision. It does not authorise a deployment, signature, funded transaction, hosting change, provider call or secret transfer.

The machine-readable proposal is [`config/testnet-authorisation-proposal.json`](../../config/testnet-authorisation-proposal.json). Recompute both digests with:

```sh
node scripts/external-authorisation-packet.mjs config/testnet-authorisation-proposal.json
```

Current draft packet SHA-256: `37c36d7d7af72254d62c01fb478fa8789f0634645c261a722b0a051a21b4785b`.

Current draft deployment-intent SHA-256: `18793ae8cc5d246c606f3557983f622a7b2624bff2ddf2ccb83c9d965cfd2df5`.

The owner authorised Windows OS-keychain custody and faucet creation on 10 November 2026. Faucet transaction `4dZ1NxvX35Hq4JDnEREik6Mtc1A2C6nKrCjTDePyUH5D` created `contra-contestation.testnet` with full-access public key `ed25519:Ecmz6dGRxCXaLqJSjqbQf5XkjoCjF158ovj7XZ2upX2y`. The private key remains in Windows Credential Manager and was not printed, exported or committed.

Official NEAR RPC and FastNEAR independently observed the account with 10 NEAR, empty code and the exact full-access key at final blocks `276992312` and `276992319`. The faucet supplied the opening balance, so owner-funded opening expenditure was zero. The separate proposed deployment and acceptance ceiling remains 5 NEAR and is not authorised by account creation.

Packet readiness is separated by milestone. M08 contract deployment can become ready while M09 hosting and M10 provider usage remain blocked. Hosting or provider approval can never authorise M08.

## Exact approval procedure

1. The verified account, Windows OS-keychain custody, public key, artifact and ceiling are frozen in the deployment intent.
2. Private material remains in Windows Credential Manager and never enters chat, Git, CI or application storage.
3. GitHub's supported Ubuntu 24.04 runner builds the production WASM and records its SHA-256. Read-only preflight confirms the account, full-access public key, balance, current code hash and fresh testnet final block.
4. The script emits the final packet and deployment-intent digests.
5. The owner approves that exact deployment-intent digest, with approval and expiry timestamps. Any field change invalidates approval.
6. Within that scope, execution may deploy once, initialise once, inspect code and state, and run the bounded acceptance journey. UNKNOWN financial operations are never blindly redispatched.

The checked-in draft now lacks only owner approval bound to the exact deployment-intent digest. Its digest is not executable until that bounded approval is supplied. Any material field change invalidates approval.

GitHub run `42700073759` built the production WASM on Ubuntu 24.04 from tested source and recorded SHA-256 `49cff947a68ae2fddbc5843c22fad1d655162e50b1e81957443584ca90377a5f`, size 631190 bytes. near-cli-rs `0.30.1` is checksum-pinned. The verified deployment command will use `sign-with-keychain` only after digest-bound deployment approval.

## Hosting, reviewers and providers

The same packet consolidates the remaining inputs:

- approve one Cloudflare Workers Free destination, the `ContraState` SQLite Durable Object class, Static Assets and a recovery export destination, with a hard infrastructure ceiling of USD 0 and no automatic paid upgrade;
- name three primary and three fresh reviewers under six distinct operators, with no operator overlap;
- separately authorise any provider account and amount, never exceeding programme ceilings of USD 3 Meta, USD 3 Baseten and USD 5 Modal.

Hosting and provider entries remain disabled until separately approved. Provider secrets and hosting credentials belong only in their server-side secret facilities.
