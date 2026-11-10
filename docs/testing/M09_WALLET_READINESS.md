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

Receipt reconciliation, restart recovery and UNKNOWN locking remain covered by the M06 wallet lifecycle tests. Browser connect, account switching, rejected signatures and refresh recovery are covered by the browser-wallet regressions.

The live non-financial authentication runner accepts a Windows keychain secret only through standard input and emits public evidence only:

```sh
CONTRA_LIVE_ACCOUNT=ACCOUNT CONTRA_LIVE_PUBLIC_KEY=PUBLIC_KEY node scripts/run-m09-live-auth.mjs < KEYCHAIN_SECRET_INPUT
```

The secret input must come directly from an approved operating-system credential helper and must never be placed in shell history, arguments or repository files. The runner verifies a server-issued NEP-413 challenge against the account's current FullAccess key through official testnet RPC, then checks recovery, renewal, replay rejection and disconnect. It broadcasts no transaction. The retained creator and beneficiary results are in `project/artifacts/m09/live-auth-creator.json` and `project/artifacts/m09/live-auth-beneficiary.json`.

These results do not establish live browser-wallet UI behaviour or participant independence. A funded journey remains blocked until the immutable packet records browser proof, participant consent, six eligible reviewers, exact terms and explicit spending authority.
