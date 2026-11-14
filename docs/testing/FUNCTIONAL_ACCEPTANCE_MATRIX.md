# CONTRA functional acceptance

Browser fixtures establish interface behaviour. Live Testnet execution requires finalised receipts.

## Frontend release gates

| Gate | Evidence | Status | Remaining work |
| --- | --- | --- | --- |
| Visual Fidelity | Refined dark and light Overview renders preserve the approved composition; expanded, collapsed, tablet and mobile evidence is captured in `artifacts/frontend/`; browser coverage rejects malformed SVG icon output | PASS | Production deployment and browser smoke verification completed for the accepted frontend tree |
| Visual hierarchy refinement | Page-level KPI icons use complete two-tone filled artwork; both doughnut charts remain contained and aligned; dense tables render at 14px; KPI, timeline, legend and statement weights preserve the approved hierarchy | Chromium and Firefox geometry, typography and icon assertions across 320px to 1920px | PASS | Corrective evidence supersedes the undersized 12px table and overflowing chart render |
| Functional Completeness | Chromium and Firefox action-to-result suite across all ten destinations and eight viewport widths | PASS | Genuine human reviewer actions and operation-specific live transactions remain external gates |
| Backend Correctness | Existing contract, authentication, evidence isolation, budget, persistence, UNKNOWN and settlement regressions | PASS | No backend authority was broadened by the frontend recovery |
| Production Readiness | Accepted frontend is deployed; public liveness, Durable Object integrity and fresh finalised Testnet reads return HTTP 200 | PASS | Full funded-protocol release remains separately blocked on Phase 3 external actors and receipts |
| Live Testnet Validation | Finalised Testnet receipts verify case creation, beneficiary acceptance, exact 0.1 NEAR funding and evidence submission for case `e6bb304c52aeb9b0251b052c05c8796913e7246280a3300dd7b8badc6ada7278` | PARTIAL | Human primary commitment and reveal, challenge and fresh review where applicable, final settlement and payout receipts remain required |

| Destination | Feature and integration | Evidence | Status | Remaining work |
| --- | --- | --- | --- | --- |
| Overview | Approved layout, dark and light themes, authoritative reads, truthful fixture and empty modes, timeline and two independent doughnut charts | Side-by-side approved-reference inspection plus integrated Chromium and Firefox suite at 320 to 1920 pixels | PASS | Production capture remains pending |
| Cases | Validate terms, preview, prepare and safely cancel an unsigned wallet operation | Repository wallet and browser suites, including explicit pre-handoff cancellation | PASS | Live creation remains separately blocked |
| Cases | Genuine Testnet creation | Finalised receipt `Hd3dkxrno2rMnGZHvp7oq2qhrmQdTuiKT3cxcf9eaeQS`; beneficiary acceptance `3RCimJuPMpv5Yw2ftFeXRw7vQNcabFJzHnqZzu3CHTTt`; funding `DBC1iLae4W94vyLCdTNCrxZgJtZyTzeXFNXuYUYDvB5P` | PASS | Subsequent protocol stages remain independently gated |
| Evidence | Store immutable manifest, inspect authorised artifacts and show provenance | Integrated browser storage and protected artifact inspection plus finalised Testnet submission `HRoBPKBciBkpWS5ZqcL4ngc195WhmwKwZ6aPS5Xvn4Bm` for digest `f3d8882feb17e0b16c8b8dd4e598ff7234a04951c772ebba208521578ed2a508` | PASS | Protected access and exact-operation signing restrictions remain enforced |
| Evaluations | Authenticated case-bound Meta findings, citations and Modal proposal verification | Cloudflare result-isolation tests and integrated browser forms | PASS | Execution evidence is controlled unless a live provider gate is intentionally enabled |
| Evaluations | Live case-bound inference | Case-bound Worker execution and durable budget tests | BLOCKED | Existing authorised case and intentional production provider enablement |
| Challenges | Store a criterion-bound counterexample and conditionally offer filing | Integrated browser counterexample and signing-denial checks | PASS | Live filing requires an eligible case and exact signing authority |
| The Bench | Invitation lifecycle, signed control consent, personal onchain confirmation and exact committee acknowledgement | Browser invitation lifecycle, signed-control regression, scoped signing tests and 22-test Durable Object suite | PARTIAL | Owner reports six confirmations complete. Deterministic contract ordering reverses the invitation labels, so all six reviewers must sign the exact contract-derived assignment before case preparation. |
| The Bench | Assigned review, human finding, commit and encrypted reveal recovery | Integrated browser workspace plus encrypted package and commitment-vector regressions | PASS | Genuine operator participation remains a separate live requirement |
| Settlement | Inspect receipts and operations, lock UNKNOWN and reconcile a known hash once | Integrated browser and operation recovery regressions | PASS | Live payout remains reviewer and transaction dependent |
| Constellations | Compare eight evidence axes with populated geometry and protected-data denial | Chromium and Firefox responsive matrix with measured polygon and denial states | PASS | Live records remain dependent on a live case |
| Activity | Filter contract events and open linked cases | Integrated browser activity checks | PASS | |
| Settings | Persist theme, renew or revoke a session and disconnect a wallet | Browser and wallet lifecycle regressions | PASS | Account switching requires the normal reconnect and reauthentication flow |
| Shared navigation | Brand returns to Overview and refreshes read-only data, one active route, challenge icon accent, reduced-motion hover and textual collapse | Chromium and Firefox route matrix plus persisted collapse and valid duotone SVG regression | PASS | Verified in the production release follow-up |
| Theme control | Icon-based Light, Dark and System preference with persistence | Browser theme reload matrix at responsive widths | PASS | |
| Wallet selection | Feature-filtered Testnet NEP-413 picker, in-dialog progress and errors, no transaction authority | Wallet discovery unit regression and browser dialog checks | PASS | Meteor has genuine prior Testnet authentication evidence; additional providers remain compatibility-verified only |
| Demo Mode | Explicit simulated-data indicator and isolated read-only workspace presentation | Browser Demo route checks and disabled wallet regression | PASS | Remove public control only after Phase 3 live acceptance |
