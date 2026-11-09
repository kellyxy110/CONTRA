# M08 release artifact verification

The `M08 Release Artifact` workflow builds the production Contestation WASM on Ubuntu 24.04 and records its source commit, byte size and SHA-256 as a retained CI artifact. It also installs checksum-pinned near-cli-rs `0.30.1` and verifies that the testnet deployment command supports `sign-with-ledger` without connecting a device, signing or broadcasting.

Run `42700073759` recorded production artifact SHA-256 `49cff947a68ae2fddbc5843c22fad1d655162e50b1e81957443584ca90377a5f` and size 631190 bytes. Ledger device control, the account public key and any signature remain external authority boundaries.

The authorisation packet tests prove that M08 readiness does not depend on M09 hosting or M10 provider approval. They also prove that missing account ownership, signer identity or digest-bound owner approval keeps deployment blocked.
