# M09 live-wallet authority proposal

The machine-readable draft is [`config/m09-wallet-authority-proposal.json`](../../config/m09-wallet-authority-proposal.json). It is deliberately non-executable.

The repaired contract code hash is `EtUc3f99vfTwVoRJfS9MNCirxpQ5KpNFNen7XZUD7LA2`. The verified creator is `contra-creator.testnet`, controlled by the full-access public key `ed25519:61VyeNdx9dTGwvQB6QFW8ZjNDejkXwP7qFhqGx6iz1AZ` held in Windows Credential Manager. The distinct beneficiary is `contra-beneficiary.testnet`, controlled by the full-access public key `ed25519:9GmL7B19aWFiJV3EsXbPBzaRxViKVmZjGPYFQHvwJBks` in a separate Windows Credential Manager entry. Faucet transaction `EXWgEjHa76etMyVGANLkPhw6t3AQvue3iLkWF8zeEwZo` created the beneficiary with 10 testnet NEAR at final block `277054382`.

Before live signing can be enabled, the final packet must bind exact creator and beneficiary testnet accounts, their public keys and custody evidence, permitted methods, maximum attached deposit per transaction, total journey expenditure, expiry and owner approval. The packet must also identify the immutable contract code hash and network.

The proposed limits of 1 testnet NEAR per transaction and 2 testnet NEAR for the journey are planning limits, not spending authority. Live signing remains disabled until browser-wallet proof, independently confirmed participant control and consent, six eligible reviewer operators, exact case terms, an unexpired packet digest and explicit owner approval are recorded.

The creator and beneficiary keys each completed a real NEP-413 challenge, verification, session recovery, renewal, replay rejection and disconnect exercise against official testnet RPC without broadcasting a transaction. Public evidence is retained under `project/artifacts/m09/`. This establishes keychain-backed authentication, not browser-wallet UI operation. Browser connect, account switching, rejection and refresh behaviour remain covered by deterministic regressions but require a live browser-wallet exercise before the packet can become executable.

The deployed contract currently has zero registered reviewers. Its preparation rules require six active, confirmed and operator-disjoint reviewers before a valid case can be prepared. Beneficiary consent requires an exact 1 yoctoNEAR `accept_terms` call before exact escrow funding. No case creation or funding is authorised while those prerequisites remain unmet.

No private key, seed phrase, wallet secret or unrestricted funded account belongs in this packet.
