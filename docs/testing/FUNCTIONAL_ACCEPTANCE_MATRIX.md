# CONTRA functional acceptance

Browser fixtures establish interface behaviour. Live Testnet execution requires finalised receipts.

## Frontend release gates

| Gate | Evidence | Status | Remaining work |
| --- | --- | --- | --- |
| Visual Fidelity | Refined dark and light Overview renders preserve the approved composition; expanded, collapsed, tablet and mobile evidence is captured in `artifacts/frontend/`; browser coverage rejects malformed SVG icon output | PASS | Production deployment and browser smoke verification completed for the accepted frontend tree |
| Visual hierarchy refinement | Chromium and Firefox geometry, typography and icon assertions across 320px to 1920px | PASS | Page-level KPI icons, aligned doughnut charts, 14px dense tables and strengthened hierarchy supersede the earlier undersized and overflowing render |
| Functional Completeness | Chromium and Firefox action-to-result suite across all ten destinations and eight viewport widths | PASS | The complete challenged Testnet execution remains a separate post-hackathon validation |
| Backend Correctness | Existing contract, authentication, evidence isolation, budget, persistence, UNKNOWN and settlement regressions | PASS | No backend authority was broadened by the frontend recovery |
| Production Readiness | Accepted frontend is deployed; public liveness, Durable Object integrity and fresh finalised Testnet reads return HTTP 200 | PASS | No Mainnet or production-readiness claim is implied |
| Live Testnet Validation | Deployed contract, six-account reviewer registry, funded case, evidence, provider artifacts and callback-confirmed settlement receipt | PARTIAL | The retained case used no-quorum `BASE_REFUND`; a complete challenged Testnet appeal and settlement remains outstanding |

| Destination | Feature and integration | Evidence | Status | Remaining work |
| --- | --- | --- | --- | --- |
| Overview | Approved layout, dark and light themes, authoritative reads, truthful fixture and empty modes, timeline and two independent doughnut charts | Side-by-side reference inspection, production smoke verification and integrated Chromium and Firefox suite at 320 to 1920 pixels | PASS | |
| Cases | Validate terms, preview, prepare and safely cancel an unsigned wallet operation | Repository wallet and browser suites, including explicit pre-handoff cancellation | PASS | Live creation remains separately blocked |
| Cases | Genuine Testnet creation | Finalised case creation, beneficiary acceptance and 0.1 NEAR funding receipts for retained case `e6bb304c...a7278` | PASS | The case ultimately resolved through the frozen no-quorum fallback |
| Evidence | Store immutable manifest, inspect authorised artifacts and show provenance | Integrated browser storage, protected artifact inspection and genuine Testnet evidence submission | PASS | Protected source contents remain account-scoped |
| Evaluations | Authenticated case-bound Meta findings, citations and Modal proposal verification | Cloudflare result-isolation tests and integrated browser forms | PASS | Execution evidence is controlled unless a live provider gate is intentionally enabled |
| Evaluations | Live case-bound inference | Meta proposal `f12b39612...3ff3d` and Modal verification `0e4981b4...a427`, retained in `project/artifacts/phase3/live-settlement-provider-evidence-2026-11-14.json` | PASS | Verified as retrospective closed-case analysis only; artifacts are non-binding |
| Challenges | Store a criterion-bound counterexample and conditionally offer filing | Integrated browser counterexample and signing-denial checks | PASS | Live filing requires an eligible case and exact signing authority |
| The Bench | Invitation lifecycle, signed control consent, personal onchain confirmation and exact committee acknowledgement | Browser lifecycle, signed-control regressions, six-account Testnet registry and scoped signing tests | PARTIAL | The repository cannot independently audit the real-world identity or custody behind the supplied operator disclosures |
| The Bench | Assigned review, human finding, commit and encrypted reveal recovery | Integrated browser workspace plus encrypted package and commitment-vector regressions | PASS | Genuine operator participation remains a separate live requirement |
| Settlement | Inspect receipts and operations, lock UNKNOWN and reconcile a known hash once | Browser recovery regressions plus Testnet transaction `GJDsDs...BEfk`, one payout attempt and exact 0.1 NEAR creator refund | PASS | The receipt proves `BASE_REFUND`, not a challenged appeal settlement |
| Constellations | Compare the eight canonical evidence axes with selectable primary and comparison cases, readable axes and exact values | Chromium and Firefox responsive matrix with measured geometry, exact-value table, missing-axis gaps and protected-data denial | PASS | Live protected measurements remain visible only to eligible case accounts |
| Activity | Filter contract events and open linked cases | Integrated browser activity checks | PASS | |
| Settings | Persist theme, renew or revoke a session and disconnect a wallet | Browser and wallet lifecycle regressions | PASS | Account switching requires the normal reconnect and reauthentication flow |
| Shared navigation | Brand returns to Overview and refreshes read-only data, one active route, challenge icon accent, reduced-motion hover and textual collapse | Chromium and Firefox route matrix plus persisted collapse and valid duotone SVG regression | PASS | Verified in the production release follow-up |
| Theme control | Icon-based Light, Dark and System preference with persistence | Browser theme reload matrix at responsive widths | PASS | |
| Wallet selection | Feature-filtered Testnet NEP-413 picker, expiry-aware restoration, final account balance, account switching and disconnect, with no transaction authority | Wallet lifecycle unit regression and Chromium and Firefox account-menu checks | PASS | Meteor has genuine prior Testnet authentication evidence; Intear and Nightly remain compatibility-verified only and MetaMask or Rabby are not enabled without genuine NEAR Testnet NEP-413 proof |
| Demo Mode | Explicit simulated-data indicator and isolated read-only workspace presentation | Browser Demo route checks and disabled wallet regression | PASS | Remove public control only after Phase 3 live acceptance |
