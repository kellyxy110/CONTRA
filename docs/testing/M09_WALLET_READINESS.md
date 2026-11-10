# M09 wallet readiness verification

Run the focused authority gate with:

```sh
npm run test:m09:wallet-authority
```

The gate verifies the repaired testnet contract identity, creator identity, distinct beneficiary requirement, expenditure bounds, expiry, immutable approval digest and server-controlled signing flag. It must remain unready while any required identity, approval or live-signing condition is absent.

The complete repository command includes these regressions:

```sh
npm test
```

Receipt reconciliation, restart recovery and UNKNOWN locking remain covered by the M06 wallet lifecycle tests. Controlled transports do not establish live wallet signing. A read-only RPC observation establishes network and contract state only and creates no transaction.
