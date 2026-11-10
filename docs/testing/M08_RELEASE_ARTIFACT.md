# M08 release artifact verification

The `M08 Release Artifact` workflow builds the production Contestation WASM on Ubuntu 24.04 and records its source commit, byte size and SHA-256 as a retained CI artifact. It also installs checksum-pinned near-cli-rs `0.30.1`. The authorised deployment plan now uses Windows OS-keychain signing.

Run `42700073759` recorded production artifact SHA-256 `49cff947a68ae2fddbc5843c22fad1d655162e50b1e81957443584ca90377a5f` and size 631190 bytes. Faucet transaction `4dZ1NxvX35Hq4JDnEREik6Mtc1A2C6nKrCjTDePyUH5D` created `contra-contestation.testnet`. Two independent RPCs verified its 10 NEAR balance, empty code and full-access public key `ed25519:Ecmz6dGRxCXaLqJSjqbQf5XkjoCjF158ovj7XZ2upX2y`.

The authorisation packet tests prove that M08 readiness does not depend on M09 hosting or M10 provider approval. They now require the observed account key to match the deployment signer and confirm that missing digest-bound owner approval keeps deployment blocked.
