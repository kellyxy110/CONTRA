# Decision ledger

## D-115 | Use independently controlled beneficiary | 2026-11-13

Use `contra-beneficiary2.testnet` for the genuine Testnet journey. Do not use the environment-custodied `contra-beneficiary.testnet` as evidence of independent participant control. Treat NEP-413 authentication and the general participation declaration as readiness evidence only. Require the beneficiary's onchain `accept_terms` transaction for the exact immutable terms digest.

## D-114 | Committee role follows the contract registry | 2026-11-13

Reviewer invitation labels do not override the deployed contract's deterministic ASCII account ordering. When that ordering conflicts with an earlier invitation label, preserve the signed invitation and require a separate NEP-413 acknowledgement of the exact contract-derived role. Never silently relabel consent and never prepare a case until all six reviewers acknowledge the actual primary or fresh assignment.

## D-113 | Reviewer confirmation is a self-authorised scoped wallet action | 2026-11-13

ACCEPTED. A consented reviewer may personally sign only the exact `confirm_reviewer` call matching their authenticated account, active onchain revision and disclosure digest. The Worker rechecks durable signed consent and contract state before handoff. This capability is independent of and cannot bypass the exact operation-specific creator signing gate. A connected wallet remains free to reject the request.

## D-112 | Approved Overview references govern the active frontend | 2026-11-13

ACCEPTED. `design/approved/overview-dark.jpeg` and `design/approved/overview-light.jpeg` are the only active desktop Overview design references. Dark remains the default. The sidebar uses a textual Collapse control at the bottom in place of the former icon-only top control and the former Contestation on NEAR footer. Deterministic visual fixtures remain local, explicitly simulated and unable to gain protocol or financial authority.

## D-110 | Browser reviewer recovery is encrypted and local-secret free | 2026-11-13

Reviewer commit and reveal recovery uses PBKDF2-SHA-256 with 210,000 iterations and AES-GCM. The browser persists and uploads only the encrypted package, never the reviewer nonce or plaintext reveal. Recovery revalidates the durable package identity and frozen commitment before reveal. This preserves the existing commitment encoding and contract ABI.

## D-111 | Protected evaluation data stays caller scoped | 2026-11-13

General artifact availability cannot expose provider responses, proposals or Modal verification records. Constellation criterion evaluations are derived only from the authenticated account's proposal and its matching immutable verification. AI records remain non-binding.

## D-109 | Case-bound production execution remains fail closed | 2026-11-12

ACCEPTED. Provider readiness may release a call only after authentication, case participation, exact case and round reads, immutable evidence binding, a durable reservation and every provider-specific financial gate pass. Reviewer consent requires an independently signed NEP-413 control statement bound to an immutable disclosure revision. Technical verification cannot establish six-human independence. Browser transaction authority remains scoped to an exact persisted operation and cannot be inferred from a FullAccess key held outside the browser.

## D-108 | Live activation remains non-binding | 2026-11-12

ACCEPTED. A successful provider call proves only authenticated interface availability and immutable provenance. Meta and Modal outputs remain non-binding, cannot create reviewer commitments or votes and cannot authorise transactions or settlement. The short-lived activation credential is deleted after each bounded operation. Baseten was removed from the active credential and execution set by owner decision on 12 November 2026. Any future OpenRouter or other provider requires a separate explicit integration decision.

## D-107 | Final release authority boundary | 2026-11-12

The owner-supplied frontend is the release interface. Financial signing may be enabled only by the Cloudflare server gate and an exact bounded execution authority, never by a browser flag. Provider credentials stay server-side and each provider remains independently gated by model access, credits, pricing, billing controls and the authorised programme ceiling. Development reviewer fixtures can verify engineering but cannot become production reviewer authority or justify funded settlement. AC31 and AC32 are DEFERRED until genuine independent reviewers complete the required live actions.

## D-106 | Live provider credentials do not imply spending readiness | 2026-11-11

ACCEPTED. Each provider remains disabled until its exact model or function, credential, pricing, credits, provider-side billing control and bounded owner authority are independently verified. Meta Standard `muse-spark-1.3` is technically compatible, but Meta currently offers an alert rather than a hard spend cap, so a key alone cannot make it ready. Baseten requires a model-scoped expiring team key and an exact selected model. Modal requires a protected function, scoped Proxy Token, Workspace budget and spend limit. No shared switch can bypass these gates.

## D-107 | Live Testnet packets are canonical and non-executable until fully bound | 2026-11-11

ACCEPTED. An executable journey packet must bind the current contract code hash, distinct creator and beneficiary, six distinct signed operators, exact terms and evidence, ordered deadlines, per-transaction and combined deposit limits, transaction intents and owner authority that names the exact authority-intent digest. Operation identifiers derive from the authorised packet and exact call payload. Incomplete checked-in drafts have no executable digest and grant no signing or spending authority.

## D-104 | Remove all prior product UI while retaining operational verification | 2026-11-11

ACCEPTED. Remove UX3A and earlier active dashboard assets, navigation, radar, styling and visual-only tests. Preserve immutable source references and historical Git evidence. Ship only a neutral operational surface for health, readiness and NEP-413 authentication until a new design direction is explicitly authorised. Functional wallet, API, persistence, provider, reviewer and contract capabilities remain independent of the presentation layer.

## D-105 | Cloudflare provider and reviewer coordination uses SQLite Durable Object state | 2026-11-11

ACCEPTED. Provider reservations, job identity, UNKNOWN locks, usage and provenance share the existing serial SQLite Durable Object boundary. Reviewer invitations enforce unique primary and fresh slots, wallet accounts and operator digests. Authentication proves account control only, not independent human control. Production provider fixtures and live execution remain disabled by configuration.

## D-103 | Verified Cloudflare deployment identity | 2026-11-11

ACCEPTED. Cloudflare deployment administration uses the OAuth identity `judithorluchee@gmail.com` for account `0a8fd0acd086e68c9b558159fac0d7a8`. This identity can enumerate the configured `contra-testnet` Worker and `contra-near` Pages project. OAuth credentials remain in Wrangler's encrypted local profile backed by Windows Credential Manager and must never be committed. The USD 0 ceiling and separate authority for public mutations remain unchanged.

## D-102 | Independent provider activation and reviewer evidence boundary | 2026-11-11

- Every provider has an independent disabled, misconfigured or ready state. Missing Meta access cannot disable Baseten or Modal, and no common environment switch can bypass account, model, pricing, billing and owner-authorisation gates.
- Pin Meta and Baseten to exact approved HTTPS paths. Keep the Baseten model unset until the authenticated catalogue is verified. Treat Modal as a protected function with separate deployment and proxy credentials, not as a pre-existing model.
- Provider ceilings of USD 3 Meta, USD 3 Baseten and USD 5 Modal are maximum programme boundaries, not spending authority.
- Reviewer invitation validation establishes technical consistency only. Independence requires six separately controlled humans and signed account-control evidence. After funding freezes committees, replacement is forbidden and nonparticipation follows contract fallback.

## D-101 | Meteor browser authentication boundary | 2026-11-11

- Use pinned Near Connect 0.12.0 with Meteor Wallet as the verified browser Testnet connector while MyNearWallet remains unavailable.
- Serve the pinned Meteor executor from the same public origin only after verifying SHA-256 `96210256a89cb382bb7fe95f29d6a2489319da87472fe77018b4cdcbf1672b50`.
- Account discovery establishes only a candidate `.testnet` account identifier. The server-issued NEP-413 challenge and signature establish control and validate the actual public key.
- Browser authentication grants no transaction authority. Existing creator and beneficiary keys remain in Windows Credential Manager and are not imported into browser storage.

## D-100 | Public Pages origin and browser custody boundary | 2026-11-10

- Use `https://contra-near.pages.dev` as the canonical public frontend.
- Keep the existing Worker and `ContraState` Durable Object unchanged behind a same-origin Pages proxy and private `BACKEND` service binding.
- Do not import the creator or beneficiary Windows keychain credentials into browser storage. Browser proof must use disposable testnet identities in isolated profiles.
- Do not claim genuine MyNearWallet authentication until the selector completes a real redirect, signature, verification and recovery flow. A stalled connector or simulated signature is not evidence.

## D-099 | Public Cloudflare boundary and reviewer invitations | 2026-11-10

- Deploy `contra-testnet` only to the verified owner Cloudflare account under a USD 0 ceiling.
- Require SQLite integrity and a fresh final testnet observation before public readiness reports success.
- Keep live transaction signing disabled. Public rendering and authentication entry points do not authorise importing custody keys into a browser wallet.
- Reviewer invitations require explicit consent, custody and conflict disclosures, distinct accounts and distinct declared operators. Automated checks do not prove real-world independence.

## D-098 | Separate beneficiary and authentication do not imply spending authority | 2026-11-10

ACCEPTED. `contra-beneficiary.testnet` is the sole new beneficiary account, has a separate Windows Credential Manager key and is distinct from the creator and contract. Real NEP-413 verification may prove key control without broadcasting a transaction. It does not prove browser-wallet behaviour, independent participant consent, reviewer readiness or authority to spend. Keep transaction signing disabled until the final immutable packet satisfies every gate.

## D-097 | Live wallet authority requires a distinct beneficiary | 2026-11-10

ACCEPTED. Reuse `contra-creator.testnet` and its Windows Credential Manager key for the creator. Do not reuse either the creator or contract account as beneficiary. Keep live signing disabled until an exact beneficiary, custody proof, immutable packet digest, expenditure limits, expiry and owner approval are all verified. Read-only RPC evidence is not signing evidence.

## 2026-11-10 | Recommend a tightly bounded existing-contract upgrade

PROPOSED, NOT AUTHORISED. Prefer upgrading `contra-contestation.testnet` over deploying a replacement. The candidate repair is owner-only, requires 1 yoctoNEAR, is permitted only for the exact defective singleton allowlist and cannot run again after success. It preserves the Borsh layout, account identity and Windows keychain custody. A replacement remains contingency only if the upgrade artifact or compatibility proof fails.

The exact proposed execution authority is file digest `fa488567ef9f9fc9727dab78d1dc16d27b20479dba41725e7027099c6875bbb3`. Its owner-authorisation field remains null, so no contract action is authorised.

EXECUTED AFTER OWNER APPROVAL. The bounded existing-contract upgrade and one-time repair both reached final explicit success. Preserve `contra-creator.testnet` as the sole creator allowlist entry. No general allowlist administration was introduced, and the repair method is now locked by its exact-state guard.

## D-095 | Creator eligibility blocks all deployed case creation | 2026-11-10

ACCEPTED. The M08 state allowlists only `contra-contestation.testnet`, while contract preparation requires the creator to differ from the contract account. The eligible creator set is empty. Preserve that safety inequality and keep live signing disabled. Any replacement deployment, upgrade or state migration requires a separately approved immutable plan and complete contract and financial verification.

## D-096 | Cloudflare readiness requires storage and fresh chain evidence | 2026-11-10

ACCEPTED. Worker liveness is independent from readiness. The M09 Worker is ready only when its complete SQLite schema is intact and NEAR RPC supplies a fresh, non-stale final observation for the exact testnet contract. Paid providers and server-side signing remain disabled. Durable backup exports are not public routes, and data rollback never authorises transaction redispatch.

## D-094 | The exact authorised testnet artifact is deployed once | 2026-11-10

ACCEPTED. Deployment intent `18793ae8cc5d246c606f3557983f622a7b2624bff2ddf2ccb83c9d965cfd2df5` authorised one atomic deploy and `new` call. Transaction `BjVBFX1Fe1YsMejSs6B5mMKjfqKFvR9J7YV3dU8EqUfr` reached final success. Downloaded deployed bytes match the approved SHA-256. No redeployment is authorised. Complete AC31 and AC32 journeys remain blocked on live wallet, independent reviewer and provider evidence.

## D-093 | M08 testnet custody uses the Windows OS keychain | 2026-11-10

ACCEPTED. The owner explicitly replaced unavailable Ledger custody with Windows OS-keychain custody for `contra-contestation.testnet` and authorised faucet creation. The private key remains in Windows Credential Manager. The faucet supplied 10 NEAR, so owner-funded account-opening expenditure was zero. This decision does not authorise contract deployment or funded acceptance transactions.

## D-092 | M10 external readiness is evidence-bound and separately authorised | 2026-11-09

ACCEPTED. Reviewer independence requires six distinct signed operators across disjoint primary and fresh committees. Provider readiness requires exact account, model, smoke, credit, pricing, billing, secret-custody and owner-authorisation evidence for each provider. No M10 field can authorise M08 deployment, and no fixture can satisfy a live external requirement.

## D-091 | External milestone readiness is independent | 2026-11-09

ACCEPTED. M08 deployment readiness depends only on an existing authorised contract account, its public Ledger signer key, the Linux artifact identity and owner approval bound to the final deployment digest. M09 Cloudflare authority and M10 provider spending are separate gates and cannot block or authorise M08. The 8 NEAR opening balance is separately authorised pre-existing funding outside the 5 NEAR execution ceiling, for a maximum combined exposure of 13 NEAR.

## D-090 | Cloudflare Free is the M09 persistence target | 2026-11-09

ACCEPTED. The public backend target is Cloudflare Workers Free with Static Assets and SQLite-backed Durable Objects under a hard USD 0 ceiling. Durable Object SQLite is the authoritative serial state boundary for financial operation identity, sessions, immutable evidence and chain observations. D1 is not authoritative financial state. R2 is omitted until a verified Free allocation and fail-closed zero-cost need exists. Unmigrated routes return 503 and no public deployment is claimed without separate account authority.

## D-089 | External authority is one digest-bound packet | 2026-11-09

ACCEPTED. M08 execution uses one bounded packet that identifies the contract and signer account, public key, Ledger custody, exact artifact, expected code state, initial state, 5 NEAR total ceiling, 8 NEAR minimum balance, permitted actions and expiry. The current draft digest is not executable because the public key, artifact hash and owner approval are absent. M09 uses one Machine and one volume because current SQLite is single-writer. M10 requires six distinct reviewer operators and separate provider spending approval. Any material packet change invalidates prior approval.

## D-088 | The judge quick-start validates retained evidence, not command success alone | 2026-11-09

ACCEPTED. The credential-free Ubuntu route must run from a clean dependency installation and independently validate the controlled workflow report before returning success. Genuine local Sandbox identity, explicit simulated wallet and mocked provider boundaries, exact challenged settlement, deterministic timeout fallback, positive receipt and operation counts, zero wallet redispatch and zero AI-created commitments are mandatory. Missing or contradictory evidence fails the command even when an upstream process exits successfully. PR 30 proved this gate on head `45c80a424e0e77cb00a192094c54c01174467c22` in Integration run `42635548332`.

## D-087 | Acceptance status follows the required evidence class | 2026-11-09

ACCEPTED. AC06 and AC24 move to PASS because current Sandbox and controlled external-wallet evidence covers confirmed creation, stable request identity, rejection, interrupted handoff, browser reload, account switching, restart, hash recovery, explicit receipt states and zero redispatch. Fixture evidence cannot upgrade criteria that explicitly require live providers, independent operators, a deployed testnet contract or manual final-frontend assistive-technology review. The current result is 23 PASS, 8 PARTIAL and 2 BLOCKED.

## D-086 | The frontend consumes a versioned non-authoritative interface | 2026-11-09

ACCEPTED. The implemented API route inventory, browser views, authentication classes, provenance fields and recovery states are frozen in `CONTRA_FRONTEND_INTERFACE_V1`. Frontend state is never authority for reviewer eligibility, transaction finality, verdict or settlement. UNKNOWN operations remain locked, provider artifacts remain proposals and protected case data must be discarded on account change. A route-drift test requires every literal API route to remain represented in the machine contract. Visual implementation remains owner-controlled.

## D-085 | Liveness never implies operational readiness | 2026-11-09

ACCEPTED. `/api/live` reports only that the HTTP process responds and must not query or claim chain and storage health. `/api/ready` requires a ready configured chain plus a successful database and immutable-object audit. Unavailable, stale or corrupt dependencies return 503 while the process may remain live. The deployment contract is single-replica and single-writer until a separately verified storage architecture replaces SQLite.

## D-084 | Backups are immutable complete storage packages | 2026-11-09

ACCEPTED. A backup must acquire the runtime's exclusive data lease, checkpoint and audit SQLite, copy the database and content-addressed objects as one unit, and record every file size and SHA-256 in a `CONTRA_BACKUP_V1` manifest. Restore verification rejects changed, missing, additional and symbolic-link entries before opening SQLite. Partial packages and ad hoc single-file copies are not valid backups.

## D-083 | One process owns a durable CONTRA data directory | 2026-11-09

ACCEPTED. The operational runtime must acquire a persisted exclusive lease before SQLite opens. A live lease blocks concurrent runtime or backup ownership. A terminated process on the same host may be reclaimed only after its process identifier is confirmed absent; unreadable and different-host leases fail closed. Graceful termination drains accepted requests, closes SQLite and the chain adapter, then releases the verified lease. This does not make a shared SQLite volume safe for multiple replicas.

## D-082 | M07 Contestation migration is accepted without protocol change | 2026-11-09

ACCEPTED. The protected branches contain the identical accepted M07 tree. Contract source is a byte-for-byte move, public exports match the frozen baseline, production excludes fault hooks and F01 through F18 pass on the renamed build path. Current active source and documentation contain no obsolete protocol terminology. Historical machine evidence retains its original bytes. The dependency graph now has 15 low findings and no moderate, high or critical finding; residual NEAR JavaScript risks remain disclosed.

## D-081 | Testnet authority binds an immutable public deployment plan | 2026-11-09

ACCEPTED. Deployment preparation may store only public identities, public keys, custody classification, artifact and code hashes, funding limits, initial state and expiring owner-authorisation metadata. The authorisation digest binds the complete intent. Private keys, seed phrases and credentials are forbidden in the plan. Read-only target verification may confirm testnet identity, final block freshness, account state, balance and exact full-access key. The tool may print a complete `near` command but must never invoke, sign or broadcast it. External deployment remains blocked until B-M08-01 is explicitly satisfied.

## D-080 | Contestation is the canonical protocol identity | 2026-11-09

ACCEPTED. Current product, source, build and documentation language uses Contestation. The active Rust package is `contra-contestation` in `contracts/contestation/`, and the production artifact is `contra_contestation.wasm`. Reviewers remain Reviewers; AI components are evaluators and never resolution authorities. The migration does not change contract methods, state layout, serialized data, commitment domains, transaction identities, deadlines, settlement or payout rules. Machine-generated historical evidence retains its original bytes and names. Active-tree CI rejects the obsolete term outside that evidence boundary.

## D-079 | Remediate the Sandbox archive chain with tested transitive overrides | 2026-11-09

ACCEPTED. Retain the `near-workspaces` compatible `near-sandbox@0.1.5` interface and override its transitive archive parser to `tar@7.5.22`. Replacing the Sandbox package broke its required legacy install subpath during a clean Linux install. The prior tar path contained one critical and two high findings and was reachable during installation. The patched path must pass complete Linux Sandbox, journey and financial verification before M07 completion. Fifteen low findings remain in the NEAR JavaScript cryptography and wallet graph and stay disclosed.

## D-078 | M06 controlled integration is accepted without live-integration claims | 2026-11-08

ACCEPTED. The green connected gate establishes that the durable wallet simulation, reviewer-control services, provider fixtures, persistence and real local NEAR Sandbox contract can operate together through challenge, timeout and settlement. It does not establish live wallet signing, external provider interoperability, independent reviewer operators, testnet deployment or production readiness. Preserve the archived environment boundary and keep the acceptance baseline unchanged until AC01 through AC33 are individually reevaluated. Full Financial P0 is unnecessary for this gate because it changed no contract or financial invariant; the passing nine-test Sandbox baseline and prior F01 through F18 evidence remain intact.

## D-077 | The controlled workflow preserves explicit execution boundaries | 2026-11-08

ACCEPTED. The M06 connected gate must use actual local NEAR Sandbox transactions for contract-sensitive creation, funding, reviewer commit and reveal, challenge, finalisation and payout assertions. External-wallet handoff and callback behaviour remains a simulation with zero signing or broadcast. Meta, Baseten and Modal remain deterministic mocked transports with zero endpoint access or billing. AI artifacts are immutable proposals only and must not create commitments, reveals, transactions, verdicts or settlement. The complete runner records receipts, durable operations, reviewer audit history, failure paths and exact balance changes as CI artifacts. Changes to this runner and its routing default to the full Integration gate.

## D-076 | Green protected engineering units merge without a repeated approval cycle | 2026-11-08

ACCEPTED. Core, Security and the risk-classified Integration gate must be current and green, the pull request must be clean and mergeable, and blocking review or safety findings must be resolved. Under those conditions normal source, CI, documentation and feature units merge under the standing owner policy. Deployment, live signing, paid inference, spending, weakened financial guarantees or bypassing checks remain separately restricted.

## D-075 | Provider output is strict, evidence-bound and non-binding | 2026-11-08

ACCEPTED. Meta and Baseten may create only immutable AI proposal artifacts that cover every frozen criterion and cite allowed case evidence. Modal may create only an immutable verification proposal bound to an existing AI proposal digest. Missing, contradictory or insufficient evidence stays unresolved. Provider-supplied authority, identity, state and settlement fields are rejected. Raw bounded responses remain auditable. A started call with an ambiguous billing outcome keeps its reservation and is not automatically repeated.

## D-074 | Reviewer continuity is account-scoped, encrypted and subordinate to frozen contract state | 2026-11-07

ACCEPTED. Reviewer onboarding and participation records must retain exact account, declared operator, disclosure digest and registry revision. Primary and fresh committees require six distinct accounts and six distinct declared operator IDs. This is an operational control check, not proof of independent real-world control. Reveal recovery may store only reviewer-supplied ciphertext plus immutable identity metadata. It must be account-scoped, durable, idempotent and conflict-safe. Service workspace, quorum and timeout outputs are advisory; only confirmed contract state can accept commitments, reveals, verdicts or settlement.

## D-073 | Reviewer regression paths are focused integration inputs | 2026-11-07

Reviewer source and `tests/m06-reviewer*.test.mjs` changes select the maintained focused committee coverage. This prevents a new reviewer test file from being treated as ambiguous comprehensive risk while preserving full verification for risk-map changes and unknown paths.

## D-072 | Integration CI uses explicit fail-safe risk routing | 2026-11-07

Every pull request receives a recorded integration classification from a maintained path mapping. Fast means no Sandbox execution was required and does not claim a Sandbox pass. Focused runs named onchain scenarios. Full runs the nine-test baseline and both complete journeys on isolated parallel runners. Unknown paths, integration into `main`, release candidates and scheduled verification default to full. F01 through F18 remain a separate financial gate. The 90-minute Sandbox timeout remains until measured evidence supports a change.

## D-071 | Finalised transaction identity must come from independent RPC proof | 2026-11-07

ACCEPTED: never infer a transaction hash from the hash used to make the RPC request. A finalised result must contain its own valid NEAR transaction hash and that hash must exactly equal the persisted operation hash. Before confirmation, independently verify network, final execution status, signer, contract receiver, exactly one expected FunctionCall action, method, canonical arguments, gas, deposit, final block identity and non-stale observation. Missing or contradictory integrity proof locks the operation UNKNOWN. A wallet-returned hash that has not reached the server is recovery evidence only: retain it by account and attach it through the idempotent callback after reload, without signing or broadcasting again.

## D-070 | Wallet handoff and receipt success require durable server evidence | 2026-11-07

ACCEPTED: a prepared external-wallet intent is not signable. Persist a one-way `PREPARED` to `SIGNING` handoff before invoking the wallet, and release a signing request only when an explicit server authorisation gate is enabled. After handoff, browser rejection, closure, timeout and missing redirect are not proof that broadcast did not occur and must lock `UNKNOWN` until the original hash is recovered. A transaction becomes `CONFIRMED` only when a matching finalised RPC response explicitly contains a supported NEAR success result and a current final block identity. Preserve unresolved browser recovery identifiers by account. Keep live signing disabled in normal runtime configuration.

This decision corrects D-069's overly broad rejection wording. Terminal `FAILED` rejection is permitted only before signing handoff. After handoff, conservative `UNKNOWN` handling is mandatory.

## D-069 | Interrupted wallet authorisation locks until evidence arrives | 2026-11-07

ACCEPTED: persist and validate an external-wallet intent before invoking signing. Treat explicit rejection as FAILED only when no transaction hash exists. Treat a wallet timeout, closed redirect or other missing completion as UNKNOWN because broadcast cannot be disproved. Never redispatch that UNKNOWN operation. Permit only a delayed callback carrying the first valid transaction hash to move it into receipt reconciliation. Confirm only after finalised RPC evidence matches network, hash, signer, contract, single function-call method, arguments and deposit. Reject lower block observations and conflicting operation payloads or hashes. Preserve existing Sandbox UNKNOWN recovery unchanged.

VERIFIED: PR 4 Core `42373449517`, Security `42373449483` and Integration `42373449454` passed on code commit `379ff4e0111336da33579357a08c341ce6273dcb`. Keep the PR unmerged until explicit owner approval.

## D-068 | CI checks are clean, risk-based and historically explicit | 2026-11-07

ACCEPTED: use GitHub-hosted Ubuntu 24.04, exact Node 26.13.0, lockfiles and action commit pins. Cache package downloads only, never installed platform binaries. Require core and security checks for every integration pull request; additionally require contract, Sandbox integration and full P0 according to affected paths and financial risk. Keep the complete F01 through F18 gate off documentation-only and unrelated changes. Treat retrospective evidence review as a current integrity check against exact historical product SHAs, never as proof that Actions ran during M03, M04 or M05. Preserve both the historical M05 Wasm hash and the rustfmt-normalized CI build hash while enforcing exact production and fault-only exports. Do not merge `main`, enable automatic merge or weaken a failed assertion without owner authority.

## D-067 | Linux P0 wallet builds use isolated native dependencies | 2026-11-07

ACCEPTED: when the P0 runner executes on Linux, install wallet build dependencies in a temporary Linux-native directory and never reuse the Windows `node_modules` tree. Preserve the original cross-platform failure transcript and require the same strict P0 predicate after reconciliation. A platform repair cannot override a failed financial category, missing receipt, missing balance observation, gas violation or failed Sandbox process.

## D-066 | Compatible Ubuntu is the verified local Sandbox host | 2026-11-07

ACCEPTED: use the installed `Ubuntu` WSL distribution for reproducible local Sandbox execution because it satisfies the pinned binary's GLIBC and process requirements. Keep the Windows and Ubuntu-22.04 pre-launch failures as diagnostic evidence. A successful local journey run does not imply testnet readiness, external signer control or reviewer independence.

## D-065 | Rate controls and backup boundaries are explicit | 2026-11-07

ACCEPTED: bound authentication challenges, signature verification, artifact writes, evaluator requests and transaction dispatch by remote address or authenticated account. A configured public origin overrides Host-based same-origin inference. Treat SQLite plus the content-addressed `objects` directory as one durable volume. Backups are offline, checkpointed, integrity-checked copies of the complete directory. Backup or restart never authorizes retry of an UNKNOWN operation.

## D-064 | Remove visual-only tooling only after dependency mapping | 2026-11-07

ACCEPTED: remove superseded standalone studies, capture wrappers and visual-only browser matrices from the active tree while preserving Git history, immutable references, financial evidence and functional browser coverage. Keep the UX3A styles, icons, font, texture and logo assets currently imported by the operational client. Do not turn design cleanup into a frontend rewrite during M05.

## D-063 | Live hackathon rules govern eligibility and tracks | 2026-11-07

ACCEPTED: treat the live `nearhackathon.com/HACKATHON.md` as the governing eligibility and submission source. Current Q-001 makes code since the 2026-10-19 announcement eligible. Preserve the factual 2026-10-28 CONTRA implementation start without relabelling history. Prioritise track `security` and include `open` as an additional applicable track. Recheck the live rules before submission, display the complete payload for owner approval and submit only once.

## D-062 | Runtime selection and persistence fail closed | 2026-11-07

ACCEPTED: application startup must explicitly select `unavailable`, `sandbox` or `testnet`. Testnet startup validates URL, network identity, node synchronization, contract account, deployed code and finalised block access before serving. Durable state uses versioned SQLite plus content-addressed files with integrity checks. Any interrupted nonterminal operation becomes `UNKNOWN` on restart and cannot be presented as confirmed or blindly retried.

## D-061 | M05 through M07 product completion supersedes active visual gates | 2026-11-07

ACCEPTED: suspend UI polish, radar refinement, screenshot comparison and demo production. Preserve completed M03 and M04 evidence and the minimal operational frontend. Complete runtime, persistence, authentication, wallet, reviewer, provider and full agreement-to-settlement verification first. Owner visual acceptance is deferred and is no longer the active next task. Testnet deployment, signing, paid provider usage and production-secret changes remain separately gated.

## D-060 | M04.3 local browser gate complete with owner acceptance separate | 2026-11-04

ACCEPTED: complete the M04.3 local engineering gate because all three phases pass sequentially, actual rendered screenshots were inspected, three browser engines pass the full viewport matrix, and both real local Sandbox journeys still settle correctly. Keep owner visual acceptance and manual screen-reader review as separate open gates. Keep AC31 and AC32 blocked until their frozen testnet and live-provider requirements are separately authorised and proven. A local controlled six-account run is not reviewer independence evidence.

## D-059 | Radar status and lens semantics are explicit | 2026-11-04

ACCEPTED: measured zero is a valid `0%` with a nonzero denominator. `N/A` means the measurement does not apply, `Locked` means protected records require participant authorisation, `Unavailable` means retrieval failed, and `Missing` means an expected record was not returned. None of these non-measured states may render as measured zero. Criteria, Evidence and Overall are scoped lenses, not cosmetic tabs: Criteria covers acceptance records, Evidence covers contestation readiness and Overall covers all eight lifecycle sectors. Each rendered metric retains exact numerator, denominator, source, status and observation time. Coverage remains separate from model confidence, evidence truthfulness and settlement authority.

## D-058 | Primary desktop workspace must fit the visible short viewport | 2026-11-04

ACCEPTED: the Overview at 1536 x 676 must fit case summary, progress, complete radar, primary actions and navigation inside the visible viewport without document or independent column scrolling. Extended reviewer lists, evidence records and event history belong in their stable workspaces; Overview may show compact sourced summaries and direct links. Use flexible desktop grid rows rather than cumulative fixed minimum heights. Preserve the three-column identity and 1200 x 900 visual system, but viewport usability takes precedence over the historical 810px minimum-height dependency. This supersedes the M04.2 short-desktop document-scroll approach in D-055 while retaining its prohibition on three independent scrollbars.

## D-057 | Stable routed workspaces complete the M04.2 local frontend gate | 2026-11-03

ACCEPTED: major workflows use stable navigable views with direct hash routes and selected-case context. Dialogs remain for focused actions only. Complete the M04.2 local frontend gate because the sequential responsive, operational radar and end-to-end verification gates pass without changing UX3C protocol or P0 financial safeguards. Keep owner visual acceptance, manual assistive-technology review, external wallet behaviour, authorised testnet execution, paid providers and genuinely independent reviewer operators as separate gates. Record Linux Chromium as blocked when its browser binary cannot be downloaded; do not infer a pass from Windows Chromium.

## D-056 | Radar progress requires operational records | 2026-11-03

ACCEPTED: configuration presence never counts as radar completion. Evidence requires retrievable source linkage per frozen criterion. Provenance requires retrievable source bytes plus origin, capture time and submitter. Review and quorum use the selected round's actual reveals. Finality uses completed decision, payout intent, callback observation and settlement milestones. Challenge is N/A without a confirmed challenge and otherwise tracks its fresh-review lifecycle. Keyboard fulfillment requires an independently recorded and verified FULFILLED evaluation. Criteria completion requires separate evidence and evaluation records. The three visual tabs may change lens labeling but cannot change operational truth. This supersedes the configuration-derived portions of D-053 while preserving its N/A, segmentation and non-authority rules.

## D-055 | One document scroll supersedes bounded desktop column scrolling | 2026-11-03

ACCEPTED: the owner rejected the three independently scrolling desktop columns introduced by D-052. Preserve the responsive column hierarchy but let the shell grow with content and assign short-screen vertical scrolling to the document. Do not set desktop `.left`, `.middle` or `.right` to `overflow-y:auto`, and do not reserve three scrollbar gutters. Retain intentional bounded scrolling only inside focused components such as dialogs or horizontal tab rails. Raise ordinary dashboard copy to a readable scale and verify both empty and genuine populated states at the owner-reported 1536 x 676 size. This decision supersedes only the bounded desktop column-scroll portion of D-052.

## D-054 | M04.1 local frontend gate complete with external acceptance separate | 2026-11-03

ACCEPTED: complete M04.1 at the local frontend scope because all three sequential gates pass against empty and genuine populated states, browser tooling is portable, the approved 1200 geometry is exact, responsive and radar acceptance matrices pass, and the complete local journeys remain valid. Keep owner visual acceptance, manual assistive-technology review, external wallet behaviour, testnet cases, paid providers and independent reviewer operators separate. Do not convert the failed Cargo dependency-fetch attempt into a contract test result; preserve the accepted M03 evidence because no contract source changed. Record unresolved upstream NEAR Sandbox dependency audit findings without applying breaking downgrades that weaken the verified environment.

## D-053 | Radar coverage remains a sourced segmented measurement | 2026-11-03

ACCEPTED: render each radar sector from the existing numerator and denominator definitions, with separate low-opacity fills and persistent rings, spokes and boundaries. Denominator zero remains N/A and is never painted as measured zero. Full coverage may fill every sector only when the genuine case metrics are complete, but the chart grid must remain visually dominant enough to preserve segmentation. Canvas pixels follow the rendered size and device pixel ratio. Coverage remains descriptive UI state and never authorizes judgment or settlement.

## D-052 | Preserve 1200 geometry and adapt outside it | 2026-11-03

ACCEPTED: keep the approved 1200 x 900 UX3A shell geometry exact while allowing proportional desktop growth, bounded column scrolling on short screens, an ordered tablet flow and a full-width phone flow. On phones, preserve all navigation by placing the existing controls in a horizontally scrollable top rail instead of compressing content beside a 53px sidebar. Responsive acceptance requires both empty and genuine populated state checks, no page horizontal overflow or clipped sections, and 44px coarse-pointer targets. This is an implementation adaptation outside the frozen reference viewport, not a visual redesign.

## D-051 | M04 local integration complete, external acceptance gates remain | 2026-11-03

ACCEPTED: complete M04 Priority 2 at the authorised local scope because both required Sandbox journeys pass through the integrated API with structured evidence, authenticated reviewer operations, persisted transaction histories, exact balance deltas and callback-confirmed settlement. The challenged journey produces a different final verdict. Keep AC01-AC33 statuses separate: 20 PASS, 11 PARTIAL and 2 BLOCKED. Do not mark AC31 or AC32 passed because their frozen text requires authorised testnet and actual provider records. Do not claim the six local reviewer accounts are independent. Repository visibility is a verified public fact, not a setting changed by this milestone. Owner visual acceptance remains separate.

## D-050 | Reviewer control is disclosed separately from account count | 2026-11-03

ACCEPTED: reviewer registry records are joined to canonical disclosure artifacts only by their exact onchain digest. Stable operator identifiers derive from the declared controlling operator label, while each attestation binds account control, custody, procedure, conflicts, sources and limitations. Account count or distinct fixture operator values are not evidence of independent control. Local Sandbox signers remain explicitly disclosed as one-process fixtures. Provider outputs remain proposed findings and cannot register reviewers, sign votes, determine contract finality or authorize settlement.

## D-049 | Persist transaction lifecycle and final-read provenance | 2026-11-03

ACCEPTED: every local signed operation records an ordered lifecycle from preparation through a terminal or unknown state. Operation ID and payload hash enforce idempotency; transaction hash and receipt remain linked to the initiating account. Reload reconciliation reads the durable server record. UNKNOWN remains locked and is never translated into failure or retry permission. Contract views used by The Bench carry finality, block identity and observation time so stale data can be disclosed. External testnet signing remains disabled without separate authorisation.

## D-048 | Structured evidence manifests are append-only case records | 2026-11-03

ACCEPTED: `CONTRA_EVIDENCE_V1` is the Priority 2 evidence envelope. Every manifest covers each frozen criterion exactly once and cites one or more immutable source objects. Source bytes, media type, size, origin, capture time and submitting participant are digest-bound in canonical JSON. Access is limited to authenticated case participants. A correction creates a new digest and references an earlier manifest for the same case with a reason; it never replaces prior bytes. The Bench must distinguish stored records from the exact digest selected onchain. This evidence coverage is observable state, not a judgment or payout authority.

## D-047 | P0 financial gate complete, AC acceptance remains separate | 2026-11-03

The clean compatible-host `npm run test:p0` execution exited 0 with the nine-test baseline at 9/9 and F01-F18 at 18/18. Accept this as completion of the M03 P0 financial verification gate, supported by raw receipts, account snapshots, gas and storage measurements. Do not treat it as automatic AC01-AC33 acceptance, testnet authorisation, independent reviewer proof or provider readiness. Preserve UNKNOWN payout locks and production/fault export separation. Priority 2 may begin under existing wallet, reviewer, provider, secret and spending restrictions. October 28 implementation remains pre-event; the F17 timeout correction and final verification are November 3 competition-window work.

## D-045 | M03 financial gate and execution evidence | 2026-10-29

The WSL Sandbox runs at c0800c8 supersede the old global M02 blocker; distinguish this session's local descriptor limit from project-wide capability. P0 completion requires the full corrected baseline, all eighteen named categories, actual receipts/balance observations, SDK exact-boundary/overflow proofs, measured callback gas and zero budget violations. Blocked, missing, duplicated or unexecuted tests cannot pass the gate. Fault-only probes are absent from production; no matching fabricated single payout result or UNKNOWN counter mutation is allowed. Do not advance Priority 2 integration or AC acceptance from unit/build success alone. Existing pre-event disclosure and financial/spending safeguards remain unchanged.

## D-046 | Neutral active avatars | 2026-10-29

Owner explicitly requested removal of hardcoded human photographs from active frontend. Use a neutral SVG with the approved NEAR palette and existing image dimensions. Preserve UX3A geometry, The Bench naming, original JPEG and frozen reference photographs unchanged. No design cycle or new product feature is introduced.

## D-043 - Preserve financial execution gate and truthful integration states

Accepted 2026-10-28: continue owner-authorised source implementation while Sandbox is blocked by the host hard descriptor limit. SDK tests, Wasm builds and browser geometry do not authorize financial acceptance. No alternate runtime result, fixture receipt or blind UNKNOWN payout retry may substitute for real Sandbox proof. Frontend source reuses frozen UX3A geometry/assets with disclosed October 28 pre-event provenance; reference files remain unchanged. Missing chain/service/per-criterion evidence is unavailable/N/A. External wallets and paid providers remain gated and unverified, with initial credit ceilings unchanged.

## D-042 - Owner authorizes October 28 implementation

Accepted 2026-10-28: remove the internal November 1 implementation restriction. Start actual engineering now against frozen UX3C and approved UX3A, retaining The Bench naming and historical records. All October 28 implementation is pre-event work. Sandbox only; testnet deployment, paid inference and production secrets still require separate authorisation. Credit ceilings remain Meta $3, Baseten $3, Modal $5. SDK tests do not establish Sandbox financial correctness; UNKNOWN payouts remain non-retryable.

Use ACCEPTED, PROPOSED or BLOCKED as the status. Do not silently change an accepted decision. Supersede it by appending a new decision entry.

| ID    | Status   | Decision                                                                                   | Reason                                                         | Date       |
| ----- | -------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | ---------- |
| D-001 | ACCEPTED | Project name: CONTRA                                                                       | Short, adversarial, protocol-ready                             | 2026-10-27 |
| D-002 | ACCEPTED | Core thesis: contestation via conventional NEAR contracts and offchain AI                  | Challenge architectural necessity of specialized AI blockchain | 2026-10-27 |
| D-003 | ACCEPTED | NEAR testnet first                                                                         | Safe, demonstrable transactions                                | 2026-10-27 |
| D-004 | ACCEPTED | Dark-first palette: #00EC97, #0B1110, #16221D, #F5F7F5, #FF8678, #F4BD68                   | Recognizable NEAR mint plus CONTRA challenge identity          | 2026-10-27 |
| D-005 | ACCEPTED | Meta $10 credits; Baseten $10 credits; Modal $30 monthly                                   | User-reported resource pools                                   | 2026-10-27 |
| D-006 | ACCEPTED | Start with credit allocations $3 Meta, $3 Baseten, $5 Modal; no unauthorised cash spending | Conservative budget and headroom                               | 2026-10-27 |
| D-007 | ACCEPTED | Versioned logs and checkpoints required for every milestone                                | Prevent repeated decisions and context loss                    | 2026-10-27 |
| D-008 | ACCEPTED | Official submission deadline November 14, 2026 at 23:59 UTC, target November 13            | Leave margin for failed deploys and submission issues          | 2026-10-27 |
| D-009 | PROPOSED | Single Rust escrow and contestation contract for MVP                                       | Reduce integration risk                                        | 2026-10-27 |
| D-010 | PROPOSED | Permissioned three-reviewer pilot with quorum and one challenge review                     | Honest scoped security model                                   | 2026-10-27 |
| D-011 | PROPOSED | One native NEAR escrow use case with no token issuance                                     | Complete vertical slice                                        | 2026-10-27 |
| D-012 | PROPOSED | Browser-first Judgment Room as signature screen                                            | Makes evidence, disagreement and enforcement visible           | 2026-10-27 |
| D-013 | PROPOSED | One challenge review round as the MVP appeal mechanism; further appeal tiers deferred      | Maintain deadline realism                                      | 2026-10-27 |
| D-014 | PROPOSED | Static recorded demo fixtures with a bounded live inference option                         | Demonstrate reliably at low cost                               | 2026-10-27 |

## Unresolved project governance

- GitHub owner identity is assigned to `kellyxy110`; remote repository name, URL and deployment identity remain unassigned.
- The hackathon accepts one submission per team. Confirm participation arrangements if multiple projects enter.
- Verify live credits, expiration dates, provider billing, and provider-side limits before making charged requests.

## New design reference decision | 2026-10-27

| ID    | Status   | Decision                                                                                                                                                                                                                                                                                                                                                                            | Reason                                                                                   | Date       |
| ----- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------- |
| D-015 | ACCEPTED | User-supplied `design/reference/control-ai-policy-dashboard.jpeg` is the exact visual composition reference for CONTRA. Use cinematic dark graph-first canvas; spatial root-to-leaf relations; low-glow curved links; compact top control bar; contextual right inspection rail; bottom-right assistant input. Recolour with approved NEAR mint, dark teal, coral and amber tokens. | Specific user-selected target supersedes generic dashboard wireframe                     | 2026-10-27 |
| D-016 | PROPOSED | Desktop case view uses a 66/34 graph-and-context split with responsive inspector drawer on mobile. The graph remains a real navigation and evidence inspection system, with text/list accessibility fallback.                                                                                                                                                                       | Preserve the reference while preventing decorative, unreadable, or inaccessible workflow | 2026-10-27 |

The visual reference supersedes the layout guidance in `docs/UX.md` and the previous `design/judgment-room.html` **for aesthetic and layout direction only**. The original contract/escrow safety logic, states, palette, cost budget and hackathon schedule remain in force. No claim of visual fidelity or browser verification has been established for the legacy prototype.

## Reference asset preservation and agent handoff | 2026-10-27

| ID    | Status   | Decision                                                                                                                             | Reason                                                          | Date       |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ---------- |
| D-017 | ACCEPTED | Preserve exact user-uploaded reference image byte-for-byte; no crop, recolour, resize, re-encode, annotations or replacements        | Owner explicitly forbade altering the image                     | 2026-10-27 |
| D-018 | ACCEPTED | Recreate the image's composition as actual interactive CONTRA UI with approved NEAR palette, never use static source as faux product | Respect visual fidelity and functional integrity simultaneously | 2026-10-27 |

D-017 clarifies D-015. Palette adaptations apply to the newly coded UI ONLY, not the original asset.

## Repository identity assignment | 2026-10-27

| ID    | Status   | Decision                                                                                 | Reason                                                             | Date       |
| ----- | -------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------- |
| D-019 | ACCEPTED | GitHub owner identity is `kellyxy110`. Remote repository name and URL remain unassigned. | Owner supplied the account during checkpoint CONTRA-2026-10-29-UX2 | 2026-10-27 |

## Visual verification record | 2026-10-28

| ID    | Status   | Decision                                                                                                                                                | Reason                                                                  | Date       |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------- |
| D-020 | ACCEPTED | UX2B browser artifacts and Playwright results are the verification record for the current design study. They do not constitute owner visual acceptance. | Separates measured browser behaviour from the owner's approval decision | 2026-10-28 |

## UX2B owner verdict and UX2C recovery | 2026-10-28

| ID    | Status   | Decision                                                                                                                                    | Reason                                                                                                                                      | Date       |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| D-021 | ACCEPTED | UX2B is rejected for visual fidelity. Its 22 passing browser checks remain useful regression evidence only.                                 | The sparse flowchart, oversized inspector, altered relationship rhythm and missing compact fan-out did not reproduce the approved reference | 2026-10-28 |
| D-022 | PROPOSED | UX2C is the corrected visual candidate for owner review. Do not treat it as accepted until the owner explicitly approves its fresh renders. | Visual acceptance is an owner gate, separate from functional verification                                                                   | 2026-10-28 |

## Repository creation authorisation | 2026-10-28

| ID    | Status   | Decision                                                                                                                 | Reason                                                                              | Date       |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ---------- |
| D-023 | ACCEPTED | Create private GitHub repository `kellyxy110/CONTRA`, initialize the current workspace and push the redesign baseline.   | Owner explicitly authorised repository creation                                     | 2026-10-28 |
| D-024 | ACCEPTED | Product redesign will follow repository creation. UX2C remains historical visual evidence, not an accepted final design. | Owner rejected the current implementation and stated the product will be redesigned | 2026-10-28 |

## UX3A exact dashboard reference | 2026-10-28

| ID    | Status   | Decision                                                                                                                                                                                 | Reason                                                                            | Date       |
| ----- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------- |
| D-025 | ACCEPTED | Owner's new attached dashboard is the definitive UX3A composition. Preserve sidebar, three columns, sector radar, panels and cards. Only approved palette and CONTRA content may change. | Explicit UX3A owner instruction supersedes graph-first composition for this study | 2026-10-28 |
| D-026 | ACCEPTED | Preserve earlier references, functional blueprint and logs. New source lives at design/reference/IMG_7409.jpeg without replacing the graph reference.                                    | Historical integrity                                                              | 2026-10-28 |
| D-027 | ACCEPTED | Owner approval is mandatory. Browser QA does not imply owner acceptance.                                                                                                                 | Explicit owner acceptance requirement                                             | 2026-10-28 |

## UX3B owner approval and integration mapping | 2026-10-28

| ID    | Status   | Decision                                                                                                                                                                                                                                 | Reason                                                                                    | Date       |
| ----- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------- |
| D-028 | ACCEPTED | UX3A visual design is owner-approved and frozen at bee5a7481d56c86d4c9860280b8367f82af0cb5a. Preserve its sidebar, three-column layout, radar, cards, typography and NEAR colours.                                                       | Explicit owner statement in UX3B request supersedes pending approval records              | 2026-10-28 |
| D-029 | ACCEPTED | UX3B first delivers functional integration map and engineering acceptance criteria before implementation expands. Complete case-to-settlement journey takes priority; navigation, drawers and workflow screens use frozen visual system. | Explicit owner scope                                                                      | 2026-10-28 |
| D-030 | ACCEPTED | Protocol UI must distinguish local/service work, AI proposed findings, contract provisional/challenged states and callback-confirmed settlement. Replace fixtures only as verified live sources become available.                        | Truthful state requirement                                                                | 2026-10-28 |
| D-031 | PROPOSED | Resolve G01-G07 in the UX3B map: cancellation ABI, committee assignment, refund-state normalization, creation idempotency/events, serialization/deposits, operator independence and callback reconciliation.                             | Exposes blueprint gaps before dependent implementation without silently changing protocol | 2026-10-28 |

Pre-event design remains separate from eligible-window implementation. No new spending, deployment, secrets or mainnet authorisation. API routes and ABI refinements in UX3B are proposals, not deployed interfaces.

## UX3C definitive protocol freeze | 2026-10-28

Status ACCEPTED below records engineering decisions finalised under the owner's explicit UX3C instruction, not a claim of deployed/tested code or a new independent security approval. D-031's alternatives are resolved/superseded by this freeze.

| ID    | Status   | Definitive decision                                                                                                                                                                                                                                  | Engineering test obligation          |
| ----- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| D-032 | ACCEPTED | G01: creator-only cancel_case in Draft, rejects after funding; beneficiary must accept immutable terms digest before exact funding                                                                                                                   | ST01/ST08, AC07/23                   |
| D-033 | ACCEPTED | G02: owner-attested and reviewer-confirmed registry; deterministic six eligible distinct declared operators, fixed 3+3, 2-of-3, no funded replacements; insufficient six rejects funding                                                             | CM01-CM07, AC12-14/17/18             |
| D-034 | ACCEPTED | G03: one canonical payout pipeline, no RefundPending; original unresolved -> base creator refund; fresh inconclusive retains primary decisive verdict; decisive fresh result can overturn                                                            | ST02-ST08, AC13/16-19                |
| D-035 | ACCEPTED | G04: creator/request identity persists; immutable Borsh terms digest; exact payload idempotency and successful finalised-receipt typed event streams; immutable creator allowlist for sponsor-funded pilot admission                                 | ID01-ID05/ABI01, AC04-07/24/25/28    |
| D-036 | ACCEPTED | G05: ABI v1 public/private method/type/deposit/serialization/gas policy and domain-separated SHA-256 with shared vote, bundle, creation, terms and intent vectors frozen in six v1 documents                                                         | ABI01-ABI04/CV01-CV08, AC05/12/13/33 |
| D-037 | ACCEPTED | G06: declared operator identities/control disclosures, account confirmations and operator-disjoint fresh review; permissioned pilot is not Sybil-proof or independently decentralized by account count                                               | CM01-CM08, AC10/14/26/29             |
| D-038 | ACCEPTED | G07: unique immutable intent/recipient/amount, directly linked self-only native-transfer callback, retry only authentic Failed result; no unknown-outcome recovery or unsafe retry in MVP                                                            | SR01-SR13, AC19-22/24                |
| D-039 | ACCEPTED | Challenge abuse: only losing party, one criterion-bound challenge, fixed preselected fresh jury/deadline and KEEP_PRIMARY_V1 on inconclusive fresh review; no new token/bond. Explicitly supersedes fresh-unresolved automatic refund interpretation | ST05/ST06, AC16-18/32                |
| D-040 | ACCEPTED | I7 bounds contestation, not payment under callback uncertainty; I10 recovery is verified-failure only. Callback-unknown may strand payment state/funds indefinitely; I2 never bypassed by admin/manual retry                                         | SR05/SR06/SR08, AC22                 |

All tests above are specifications and NOT RUN in contract. State/method authority is docs/CONTRACT_ABI_V1.md and its linked v1 companions. Credit limits, separate pre-event design and November 1 source-eligibility boundary remain unchanged. No owner-facing visual redesign or new spending/deployment authorisation.

## Product naming update | 2026-10-28

| ID    | Status   | Decision                                                                                                                                                                                                                                                                                                 | Reason                            | Date       |
| ----- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------- |
| D-041 | ACCEPTED | Rename the active product surface from Judgment Room to The Bench in frontend title/header, active navigation references and product documentation. The name-only substitution is explicitly authorised within the UX3A freeze; all layout, typography, colours, components and assets remain unchanged. | Explicit owner naming instruction | 2026-10-28 |

Historical log entries, archived design prototype paths and protocol method names remain unchanged. Earlier product-name references in historical logs describe their original checkpoints. UX3C remains the active protocol checkpoint; G01-G07 decisions, first November 1 Rust/sandbox milestone, credit limits and execution boundaries are unchanged. No redesign or additional feature is authorised by this naming update.

## IMPL-M03 Sandbox execution | 2026-10-29

| ID    | Status   | Decision                                                                                          | Reason                                                                                                                                                                                        | Date       |
| ----- | -------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| D-043 | ACCEPTED | Pin the implementation toolchain to Rust 1.98.0.                                                  | The prior 1.99.1 channel did not provide Cargo in the execution environment, while current NEAR dependencies require Rust 1.95 or newer. Rust 1.98.0 builds and passes all 20 contract tests. | 2026-10-29 |
| D-044 | ACCEPTED | Sandbox deadline tests use 610-second intervals and bounded, timestamp-checked block advancement. | Protocol validation requires at least 600 seconds. Directly converting seconds to block counts caused deadline overshoot, and large single jumps caused expired transaction hashes.           | 2026-10-29 |
# 2026-11-11 | Provider secrets cannot grant execution authority

Cloudflare secret presence is now only one provider-specific readiness gate. CONTRA will not infer model access, billing safety, spending authority or live enablement from an installed credential. Public configuration may disclose redacted gate booleans but never secret values. Modal deployment credentials remain outside the Worker; only a scoped protected-function Proxy Token may be installed. Provider jobs remain non-binding AI proposals and cannot create reviewer actions or settlement authority.
# 2026-11-11 | Modal verification is deterministic and non-binding

The initial Modal function performs deterministic verification rather than model inference. It proves exact proposal digest, case, terms, round and evidence-citation binding at a protected external execution boundary. A successful result remains an AI verification proposal and has no reviewer, transaction, verdict or settlement authority. This avoids unnecessary provider cost and keeps any later model-backed expansion subject to a separate reviewed interface and spending gate.
# 2026-11-12 | D-108 final engineering release boundary

The owner-supplied frontend and the verified runtime are accepted for deployment from `main` commit `7b03ffbaff4abc424c9ddd4791415b8922acc7bb`. Public deployment does not authorise financial signing, substitute fixture reviewers for independent operators or bypass provider billing gates. AC31 and AC32 use DEFERRED until their live participant and funded-settlement evidence exists.
# Current execution decision, 14 November 2026

ACCEPTED AND EXECUTED. The beneficiary personally signed the exact operation covered by authority digest `55b5e03aef1e0eee32b02f1ab8cf0613c57a53abb1e1df96624150aae82a1334`. Final transaction `3RCimJuPMpv5Yw2ftFeXRw7vQNcabFJzHnqZzu3CHTTt` proves acceptance only. It grants no authority to fund, submit evidence, review, challenge or settle. Funding remains a separate unapproved operation-specific boundary.
