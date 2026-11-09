# M05 R02 AC01 through AC33 review

Checkpoint: `CONTRA-2026-11-07-IMPL-M05-R02`

This review preserves the exact criteria in `docs/UX3B_ENGINEERING_ACCEPTANCE.md`. M05 evidence strengthens several criteria but does not remove any missing external-wallet, independent-operator, provider, testnet, assistive-technology or owner-acceptance requirement.

| AC | Status | M05 review |
| --- | --- | --- |
| AC01 | PARTIAL | Immutable reference checksum still matches. Visual acceptance is deferred, not waived. |
| AC02 | PASS | Existing routed operational client remains. Removed files were visual-only; retained client assets return 200. |
| AC03 | PASS | Git history and the actual 2026-10-28 implementation start remain intact. Current official Q-001 makes code since 2026-10-19 eligible. |
| AC04 | PASS | Unavailable mode blocks mutation. Testnet startup is read-only and fails closed on wrong network or contract configuration. |
| AC05 | PASS | No frozen term, amount, deadline, fallback or committee rule changed. |
| AC06 | PARTIAL | Restart recovery now locks interrupted creation operations as UNKNOWN. External wallet rejection and redirect recovery remain missing. |
| AC07 | PASS | Financial rules and accepted P0 evidence are unchanged. No M05 transaction occurred. |
| AC08 | PASS | Startup audits immutable object presence, size and SHA-256. Backup and restore preserve bytes and links. |
| AC09 | PASS | Evidence authorisation and onchain digest rules are unchanged. |
| AC10 | PARTIAL | Provider fixtures remain evidence-bound. Actual provider interoperability remains unauthorised and unverified. |
| AC11 | PARTIAL | Reservations remain atomic across two SQLite connections and survive abrupt process exit. Billing reconciliation still requires authorised usage. |
| AC12 | PASS | Commitment encoding and appointed reviewer rules are unchanged. |
| AC13 | PASS | Reveal and quorum requirements are unchanged. |
| AC14 | PARTIAL | Committee disjointness remains implemented. Independent controlling operators remain unavailable. |
| AC15 | PARTIAL | Challenge evidence is unchanged. Manual external-wallet challenge flow remains unverified. |
| AC16 | PASS | Challenge and finalize ordering is unchanged. |
| AC17 | PASS | Fresh-review reversal rules are unchanged. |
| AC18 | PASS | Contract deadline and fallback rules are unchanged. |
| AC19 | PASS | Intent-before-transfer ordering is unchanged. M05 never maps an unavailable or pending receipt to confirmed. |
| AC20 | PASS | Callback authority and exact payout proof remain covered by accepted P0 and M04 evidence. |
| AC21 | PASS | Verified-failure retry rules remain unchanged. |
| AC22 | PASS | Interrupted BROADCAST and PENDING operations recover only as UNKNOWN with hashes retained. No blind retry was added. |
| AC23 | PASS | Cancellation rules are unchanged. |
| AC24 | PARTIAL | Versioned durable operations, restart recovery, receipt states and hash persistence are stronger. External wallet rejection, redirect and signed recovery remain missing. |
| AC25 | PARTIAL | Finalised block height, hash, timestamp, age, stale state and block regression are now explicit. Complete field-by-field source review against a deployed contract remains unavailable. |
| AC26 | PASS | Explicit unavailable mode, failed startup validation and RPC failure never fall back to fixtures or successful state. |
| AC27 | PASS | Operational coverage logic remains tested. Visual refinement is suspended without changing authority or semantics. |
| AC28 | PARTIAL | Canonical case isolation remains. Broader duplicate-event and multipage data coverage remains incomplete. |
| AC29 | PASS | Configured-origin validation defeats forged Host matching. Rate limits, aborted-body safety, session expiry, challenge expiry, replay checks and cross-case artifact denial pass. Credential-pattern scans found no current-tree or Git-history match. |
| AC30 | PARTIAL | Existing keyboard and responsive evidence remains. Manual screen-reader verification is still incomplete and deferred with UI work. |
| AC31 | BLOCKED | Authorised testnet journey and actual provider records do not exist. Local Sandbox evidence cannot substitute. |
| AC32 | BLOCKED | Authorised challenged testnet journey and actual provider records do not exist. Local Sandbox evidence cannot substitute. |
| AC33 | PASS | Startup modes, RPC read and receipt routes, rate failures, storage recovery and operational client entries retain explicit mappings and failure states. |

Result: 21 PASS, 10 PARTIAL, 2 BLOCKED. No criterion was weakened or upgraded from incomplete evidence.
