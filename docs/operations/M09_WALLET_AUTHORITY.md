# M09 live-wallet authority proposal

The machine-readable draft is [`config/m09-wallet-authority-proposal.json`](../../config/m09-wallet-authority-proposal.json). It is deliberately non-executable.

Current draft SHA-256 over canonical JSON: `3e220ddaad397e0965351063940ede1160f5b959c52e00fa559d767dfeabd03a`. Filling any required field changes this digest. Approval must bind the final recomputed digest, not this incomplete draft.

Before live signing can be enabled, the final packet must bind exact creator and beneficiary testnet accounts, their public keys and custody evidence, permitted methods, maximum attached deposit per transaction, total journey expenditure, expiry and owner approval. The packet must also identify the immutable contract code hash and network.

The current deployment has no eligible creator. Live signing remains disabled even if the missing packet fields are supplied. Creator-eligibility remediation requires its own contract decision and authorisation.

No private key, seed phrase, wallet secret or unrestricted funded account belongs in this packet.
