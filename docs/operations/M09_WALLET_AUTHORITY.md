# M09 live-wallet authority proposal

The machine-readable draft is [`config/m09-wallet-authority-proposal.json`](../../config/m09-wallet-authority-proposal.json). It is deliberately non-executable.

The repaired contract code hash is `EtUc3f99vfTwVoRJfS9MNCirxpQ5KpNFNen7XZUD7LA2`. The verified creator is `contra-creator.testnet`, controlled by the full-access public key `ed25519:61VyeNdx9dTGwvQB6QFW8ZjNDejkXwP7qFhqGx6iz1AZ` held in Windows Credential Manager.

Before live signing can be enabled, the final packet must bind exact creator and beneficiary testnet accounts, their public keys and custody evidence, permitted methods, maximum attached deposit per transaction, total journey expenditure, expiry and owner approval. The packet must also identify the immutable contract code hash and network.

The current Windows keychain inventory contains the contract and creator identities only. No distinct beneficiary account or key is available. The proposed limits of 1 testnet NEAR per transaction and 2 testnet NEAR for the journey are planning limits, not spending authority. Live signing remains disabled until a distinct beneficiary, exact case terms, custody evidence, an unexpired packet digest and explicit owner approval are recorded.

Read-only official RPC verification may proceed without signing. The browser wallet lifecycle, receipt reconciliation and UNKNOWN recovery are implemented and tested with controlled transports. Windows keychain custody does not itself prove browser wallet or NEP-413 signing, so those live capabilities remain unverified until an authorised signing exercise succeeds.

No private key, seed phrase, wallet secret or unrestricted funded account belongs in this packet.
