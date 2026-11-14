# CONTRA interaction contract

## Navigation

The logo returns to Overview, scrolls to the top and refreshes read-only Overview data. It preserves theme, sidebar preference and authenticated session. It never interrupts signing.

Every route owns one active navigation state. The period filter appears only on Overview. A workspace that requires a case provides its own picker rather than sending the user elsewhere.

## Theme

Light, Dark and System are keyboard-operable mutually exclusive buttons. The preference persists locally. System follows the operating system after selection. No other preference changes with theme.

## Data modes

Testnet is truthful live or empty data. Demo is explicit simulated data and causes a page-level mode change. Demo does not call protected mutation routes, open wallets, create provider jobs or prepare operations. Demo records never enter live analytics.

## Wallet

Connect opens a compact wallet picker. Only wallets advertising Testnet and message-signing compatibility appear. Selection leads to account discovery, NEP-413 signing and server verification. Error and retry feedback remain inside the dialog. The authenticated account menu shows a read-only final Testnet balance, Switch wallet and Disconnect. Session renewal occurs before expiry when possible. Expiry or an account change requires NEP-413 reauthentication. A session is not transaction authority. A transaction still requires an exact persisted operation and server authority gate.

## Cases and rounds

Selecting a case updates the timeline, protected evidence summary and selected review-round chart. Primary and Appeal are presentation labels for the existing round identities. Search, selection and empty guidance remain keyboard accessible.

## Async states

Controls expose loading by disabling only the initiating control and using a nearby live status. Errors are retained until the user retries or dismisses them. Confirmed, failed, pending and UNKNOWN transaction states are distinct. Refresh recovery reads durable state and never redispatches an operation.

## Demo removal

Public Demo Mode remains until Phase 3 has verified authorised Testnet journeys including case creation, genuine reviewers, challenge, settlement and finalised receipts. At that point public demo controls and public fixture access are removed. Deterministic fixtures remain isolated to development and QA.

