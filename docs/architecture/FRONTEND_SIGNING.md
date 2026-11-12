# Frontend signing boundary

The browser authenticates with a NEP-413 message and keeps transaction signing in the connected Testnet wallet. A recovered session alone does not provide a signer. Every contract action is checked by the server's existing `/api/wallet/prepare` validator against the authenticated account, contract method, arguments, deposit and current case or reviewer state. Handoff remains behind the server authority gate.

After a wallet response, the browser records the transaction hash and requests receipt reconciliation. If signing or broadcasting ends without a known final receipt, the persisted operation ID is shown for inspection. The interface does not automatically redispatch an UNKNOWN operation. Payout retry is offered only when the contract reports `TransferFailed` and supplies the exact intent and attempt.

A reviewer stores an evidence-bound human finding separately from the binding vote. The browser calculates the commitment with the shared protocol encoding, displays a fresh nonce and finding digest for the reviewer to retain, then asks the wallet to sign the commit call. During reveal, the browser recomputes the commitment and rejects mismatched disposition, finding or nonce before asking the wallet to sign. Development fixtures establish interface behaviour only; they do not establish independent human review or financial authority.

The present Cloudflare signing gate is disabled. Enabling it requires server-side exact bounded authority and valid account control; the browser cannot override that gate.
