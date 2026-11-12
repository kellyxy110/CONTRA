# CONTRA status checkpoint

## Current checkpoint | CONTRA-2026-11-12-PROVIDER-WALLET-ACTIVATED

Meta account authentication and `muse-spark-1.3` access are verified. One ledger-bound live smoke used 33 prompt and 16 completion tokens, recorded response digest `1b46fbeda2e729be9d1c0d6663763f9869fa37aeeef83a729d70e702fc544ad0` and reconciled 110 microUSD. Modal Proxy Auth returned a valid zero-token deterministic verification with response digest `82bd618c07f911ba6e781b7258ee95f64d9312cd8daf569c133d0db426c0ee6e`. Meta and Modal are now the only active providers. Baseten was retired and its Worker secret removed on 12 November 2026, while its historical authenticated probe remains preserved. Creator and beneficiary both repeated genuine keychain-backed NEP-413 signing, recovery, renewal, replay rejection and disconnect with zero broadcasts. AC31 and AC32 remain DEFERRED for six independent reviewers and their genuine consent.

## Current checkpoint | CONTRA-2026-11-12-ACTIVATION-IN-PROGRESS

The owner authorised bounded provider testing at USD 3 Meta, USD 3 Baseten and USD 5 Modal, and bounded NEAR Testnet execution at 1 NEAR per transaction and 2 NEAR total across both acceptance journeys. These approvals are active and must not be requested again. Meta and Baseten credentials are installed in the Cloudflare Worker. A dedicated Modal Proxy Auth credential is now installed separately from deployment credentials, and the workspace has a USD 5 spend limit. Authenticated model, account, pricing and residual billing checks are in progress before paid calls. Six independent reviewer operators remain the sole planned external validation phase, so reviewer-dependent funded journeys remain deferred.

## Current checkpoint | CONTRA-FINAL-IMPLEMENTATION-RELEASE

The owner-supplied frontend is implemented in PR 73 across Overview, Cases, Case Details, Evidence, Challenges, Reviewers, Settlement, Lab, Activity and Settings. Chromium and Firefox pass every route at 320, 390, 768, 1024 and 1440 pixel widths with no page error or horizontal overflow. Cloudflare wallet preparation now normalises Durable Object records for browser recovery, and the signing handoff remains protected by an explicit server gate that is disabled by default. Modal verifier source and deployment evidence reached `main` through PR 75 at `99599120614165bce80bdac86e9a04de4fa6e3af`.

Provider credentials remain server-only. Meta and Baseten secrets exist, but their model, credit and billing gates are not all verified. The protected Modal verifier is deployed, but its separate Proxy Auth credential is absent. No paid inference has run. The Testnet contract and eligible creator remain unchanged. Funded live journeys remain deferred because genuine independent reviewer consent is unavailable; fixture reviewers are not production authority. Acceptance is 23 PASS, 8 PARTIAL and 2 DEFERRED.

## Current checkpoint | CONTRA-M10.4-MODAL-VERIFIER-DEPLOYED

The exact repository-owned Modal verifier at source commit `1a1e06ea91c79641b87dfc8a182c39dd7f49cb8a` is deployed as app `ap-2wMup9xpnApV3ehbwwjKrK`. Its protected endpoint is `https://boredom407--contra-verifier-verify.us-east.modal.run`. An unauthenticated POST returned HTTP 401, proving that `requires_proxy_auth=True` is enforced. The current Modal billing summary reports USD 0.00 billed cost.

The endpoint has not completed an authenticated verification because Modal Proxy Auth credentials are not installed locally or in Cloudflare. The existing `ak-` and `as-` deployment credentials remain confined to the trusted local Modal profile and must not be reused as Worker proxy credentials. Live provider execution remains disabled. Meta and Baseten credentials are present in the Worker secret store, but their independent model and financial gates remain closed. No AI inference, reviewer vote, transaction or settlement occurred.

## Previous checkpoint | CONTRA-M10.4-MODAL-VERIFIER-IMPLEMENTED

The repository-owned Modal verifier is implemented locally and remains undeployed. Its endpoint is explicitly protected with `requires_proxy_auth=True`. The pure deterministic core accepts only the frozen verification request, enforces a 64 KiB bound, recomputes the immutable proposal digest, binds case, terms and round identity, checks all nested citations against the supplied evidence set and returns a non-binding result with zero model tokens. It cannot vote, transact or settle.

Repository tests pass 156 of 156, including five Python verification cases and two Node integration checks. Cloudflare tests pass 14 of 14; Worker dry run, documentation links and Security policy pass. No Modal function was deployed, no Proxy Token was installed in Cloudflare, no inference occurred and spending remains USD 0. Deployment remains gated on review, the verified USD 5 Workspace budget and spend limit, and a bounded external execution approval.

## Previous checkpoint | CONTRA-M10.4-PROVIDER-CREDENTIAL-READY

Cloudflare provider credential installation is now fail closed and independently observable. The production Worker target remains `contra-testnet` in Cloudflare account `0a8fd0acd086e68c9b558159fac0d7a8`. Its public configuration reports only redacted credential-presence and external readiness gates. A secret alone cannot enable inference: exact endpoint, model, account, credit, pricing, hard billing control, bounded owner spending authority and live enablement must all pass for that provider.

No provider secret is currently installed. Meta Standard `muse-spark-1.3` and `https://api.meta.ai/v1/chat/completions` are the verified selection, but Meta's missing verified hard spend cap keeps it gated. Baseten's OpenAI-compatible endpoint is verified, while the exact restricted model remains pending authenticated catalogue access. Modal requires a protected `.modal.run` verification function and scoped Proxy Token; deployment-tool credentials are explicitly excluded from the Worker. Repository tests pass 154 of 154 and Cloudflare tests pass 14 of 14. No live inference, secret change or spending occurred.

## Current checkpoint | CONTRA-M10.3-LIVE-VALIDATION

Credential-independent M10.3 engineering is complete on `feat/m10-live-validation`. Canonical live journey packet validation now requires six distinct signed human controls, disjoint three-member committees, exact evidence and terms digests, ordered deadlines, bounded deposits, an exact transaction sequence, stable operation identifiers and digest-bound financial authority. The checked-in journey files remain explicitly non-executable because those external inputs do not exist.

Official provider requirements were revalidated on 11 November 2026. Meta Standard `muse-spark-1.3` is compatible and priced, but Meta documents only a spend alert rather than a hard cap, so it remains disabled. Baseten still lacks an authenticated exact model and verified hard billing control. Modal supports Workspace budgets and spend limits but lacks a deployed protected verification function. All credentials remain pending, no live inference occurred and verified independent reviewers remain 0 of 6. GitHub action pins were upgraded to supported Node 24 based v6 releases without weakening checks. AC31 and AC32 remain BLOCKED.

## Current checkpoint | CONTRA-M10.2-RUNTIME-READY

The active UX3A dashboard, radar, navigation, styling, avatars, icons, font and visual regression suite are removed. The immutable owner-supplied reference JPEG remains unchanged. The public build now contains only a neutral operational interface for liveness, readiness, Meteor wallet authentication, session recovery and disconnect.

Cloudflare SQLite Durable Object schema 3 adds atomic provider budget reservations, idempotent provider jobs, retained UNKNOWN reservations, immutable proposal digests, usage accounting and audit events under the fixed Meta $3, Baseten $3 and Modal $5 ceilings. Live provider execution and fixtures remain disabled in production. Reviewer persistence now provides six unique primary/fresh slots, distinct account and operator enforcement, invitation digest checks, account-scoped NEP-413 consent, pre-freeze withdrawal and immutable audit history. These controls do not prove real-world independence; verified operators remain 0 of 6.

## 2026-11-11 | Cloudflare deployment administration restored

Wrangler OAuth now authenticates `judithorluchee@gmail.com` against Cloudflare account `0a8fd0acd086e68c9b558159fac0d7a8`. Read-only administration checks listed the existing `contra-testnet` Worker deployments and the `contra-near` Pages production deployment, confirming that the local deployment identity matches the configured account and resources. No Worker, Pages, Durable Object, secret or route was changed. The USD 0 hosting ceiling remains in force.

## Current checkpoint | CONTRA-M10.1-ACCELERATED-LIVE-CONTESTATION

M10.1 credential-independent readiness is implemented on `feat/m10-live-contestation-readiness`. Runtime and provider configuration now use independent fail-closed provider states, exact HTTPS endpoint allowlists, bounded timeouts, programme ceilings and provider-specific Modal proxy authentication. Local, Testnet, provider and Wrangler placeholder examples are separated and ignored correctly. Real credentials remain absent and all three providers report `CREDENTIALS_PENDING`.

Reviewer invitations now verify their immutable digest, exact six-slot identity, Testnet account syntax, operator and disclosure digests, explicit consent and verified control-signature status. Duplicate, forged, unknown and unsigned responses fail closed. The existing contract and Node reviewer safeguards remain unchanged. Genuine independent operators remain 0 of 6, and public Cloudflare reviewer lifecycle parity remains incomplete.

No live provider call, funded transaction, contract upgrade, new secret or paid service was used. AC31 and AC32 remain BLOCKED. The public application remains read-only ready with transaction signing disabled.

## Current checkpoint | CONTRA-M09.7-BROWSER-WALLET-VERIFIED

Genuine browser-wallet NEP-413 authentication completed on the public Cloudflare preview using Meteor Wallet 0.8.12 and the disposable identity `easyjacket3318.testnet`. The server returned an account-bound session and preserved it across page reload. Transaction signing remained disabled and no contract call, transfer or access-key addition occurred. The connector now uses pinned Near Connect 0.12.0 and a checksum-verified, same-origin Meteor executor. AC31 and AC32 remain BLOCKED because no funded journey was authorised or executed.

MyNearWallet remains an unavailable external path in this environment. The Meteor path required explicit Testnet sign-in and compatibility with Meteor's keyless or structured account-discovery response. NEP-413 remains the authority proof: the server verifies the signed public key, nonce, origin and account rather than trusting discovery metadata.

## Current checkpoint | CONTRA-M09.6-PUBLIC-URL-READY

The operational frontend is publicly available at `https://contra-near.pages.dev`. Its same-origin `/api` proxy preserves the existing `contra-testnet` Worker and `ContraState` Durable Object while keeping the legacy personal Worker hostname out of browser requests. Public readiness, SQLite schema 2, fresh final NEAR testnet reads, Chromium and Firefox desktop/mobile rendering, responsive overflow and accessible control-name checks pass. Live transaction signing remains disabled.

Genuine MyNearWallet authentication is not yet verified. The current `@near-wallet-selector/my-near-wallet` testnet flow stalls before redirect in isolated Chromium, and the configured testnet wallet hostname is intermittently unavailable through the local system resolver despite resolving through public DNS. No disposable browser wallet was created, no custody key was imported, no signature was requested and no transaction was broadcast. The M09.6 wallet checkpoint therefore remains blocked rather than being represented by fixture or keychain evidence.

## Current checkpoint | CONTRA-2026-11-10-M09.4-BROWSER-HOSTING-READY

The `contra-testnet` Worker is publicly deployed in the verified owner Cloudflare account. SQLite Durable Object schema 2 and fresh final NEAR testnet observations are required for readiness. Live signing remains disabled and the hosting ceiling remains USD 0. Chromium and Firefox desktop and mobile verification passed without console errors, page errors, horizontal overflow or unnamed controls. A missing wallet bundle and a Cloudflare configuration crash were found and corrected. Browser-wallet key import and genuine wallet signatures remained blocked at this checkpoint. Six real independent reviewers remain unavailable; a fail-closed invitation and consent procedure is now technically ready without claiming independence.

## Current checkpoint | CONTRA-2026-11-10-M09.3-LIVE-WALLET-READY

`contra-beneficiary.testnet` now exists as a distinct faucet-funded testnet identity under a separate Windows Credential Manager key. Official final RPC verified its FullAccess public key, 10 testnet NEAR balance and creation transaction. Both creator and beneficiary completed real keychain-backed NEP-413 verification, session recovery, renewal, replay rejection and disconnect without broadcasting a transaction. The operational client now binds external authentication to the selected wallet account and keeps real transaction signing server-disabled. Browser-wallet UI proof, independent participant consent, six eligible reviewers and final spending authority remain unresolved, so no case or funded transaction was attempted and AC31 and AC32 remain BLOCKED.

PR 47 merged the verified implementation into `implementation/oct28` as `9b758902e46a915c9f97bffd925101ce6bc95e75`. PR 48 promoted the identical tree to `main` as `5feceb78df588edd4c22c2c821f03a51ba747b0d`. Core run `42806652196`, Security run `42806652041` and comprehensive Integration run `42806652381` passed on the feature head. Promotion runs `42807839846`, `42807839570` and `42807839793` also passed, followed by post-merge main Security run `42809125141`.

## Current checkpoint | CONTRA-2026-11-10-M09.2-WALLET-READY

PR 43 was merged into `implementation/oct28` after its exact tested tree and five required workflows were verified. The repaired testnet contract remains at code hash `EtUc3f99vfTwVoRJfS9MNCirxpQ5KpNFNen7XZUD7LA2` with creator allowlist `contra-creator.testnet`. Wallet authority now fails closed against code drift, non-distinct identities, absent custody, expired approval and expenditure-limit errors. Read-only testnet verification is ready. Financial execution is not ready because no distinct beneficiary account or custody exists, the browser signing path has not been exercised with a real wallet and owner authority remains null. AC31 and AC32 remain BLOCKED.

## Previous checkpoint | CONTRA-2026-11-10-M09.1-REMEDIATION-DECISION-READY

The creator defect remediation is implemented for review only. The recommended option is UPGRADE EXISTING CONTRACT using an owner-only, exact-state, one-time allowlist repair that adds no state field. Future initialisation and deployment preflight reject the contract account in the creator allowlist. Official RPC confirmed the contract key remains FullAccess. Following explicit owner authorisation, `contra-creator.testnet` was created with a separate Windows keychain key and 10 testnet NEAR from the faucet. No owner funds were used. No contract upgrade, repair call or merge occurred. AC31 and AC32 remain BLOCKED.

## Current checkpoint | CONTRA-2026-11-10-M09.1-CREATOR-REMEDIATED

The owner approved proposal digest `fa488567ef9f9fc9727dab78d1dc16d27b20479dba41725e7027099c6875bbb3`. Fresh preflight verified the exact account, keys, M08 code, zero cases and zero financial liabilities. Deployment transaction `4AbVrJHeJTJHoA95c5owniYaXLJmEBkETsWrQxuGzvXz` installed the exact Linux artifact, and repair transaction `2qQYh7sdkyLKN9uuDUHJ8pSYcwyviZgtNQJykWmaKKTj` replaced the defective allowlist with `contra-creator.testnet`. Both reached final explicit success. Combined balance consumption was 0.0048511016886709 testnet NEAR, below the 0.1 ceiling. AC31 and AC32 remain BLOCKED pending complete live journeys.

## Current checkpoint | CONTRA-2026-11-10-M09-PREDEPLOY-READY

M09 predeployment implementation is complete locally and remains undeployed. A P0 creator-eligibility audit proved that the deployed allowlist contains only the contract account while `create_case` rejects that identity, leaving no eligible creator. Live signing is disabled and AC31 and AC32 remain BLOCKED. The Cloudflare Worker now implements durable NEP-413 challenges and sessions, testnet reads, immutable digest-addressed records, reviewer and case access boundaries, wallet preparation and conservative UNKNOWN recovery, final receipt reconciliation, honest chain-and-storage readiness and complete operator-only backup export. Server-side dispatch, wallet handoff and paid providers remain disabled. Cloudflare and wallet authority packets remain non-executable pending exact owner inputs and creator remediation.

## Current checkpoint | CONTRA-2026-11-10-M08-TESTNET-DEPLOYED

The Contestation contract is deployed and initialised on `contra-contestation.testnet`. Transaction `BjVBFX1Fe1YsMejSs6B5mMKjfqKFvR9J7YV3dU8EqUfr` reached final `SuccessValue` and contains exactly the approved `DeployContract` and `FunctionCall:new` actions. Onchain code hash is `5y8hJtxVHWvAnGRVGJRirPA14nduonJKFMehCGnbCKjU`; downloaded bytes match approved SHA-256 `49cff947a68ae2fddbc5843c22fad1d655162e50b1e81957443584ca90377a5f`. Owner, chain and creator allowlist match the plan. Actual cost was `0.0047541719036778 NEAR`, below the 5 NEAR ceiling. Complete live journeys remain blocked on M09 wallet authority and M10 independent reviewer and provider evidence.

## Previous checkpoint | CONTRA-2026-11-10-M08-KEYCHAIN-ACCOUNT

`contra-contestation.testnet` now exists under explicitly approved Windows OS-keychain custody. Faucet transaction `4dZ1NxvX35Hq4JDnEREik6Mtc1A2C6nKrCjTDePyUH5D` created the account with full-access key `ed25519:Ecmz6dGRxCXaLqJSjqbQf5XkjoCjF158ovj7XZ2upX2y`. Official NEAR RPC and FastNEAR observed 10 NEAR, empty code and the exact key at final blocks `276992312` and `276992319`. Packet digest `37c36d7d7af72254d62c01fb478fa8789f0634645c261a722b0a051a21b4785b` and deployment intent `18793ae8cc5d246c606f3557983f622a7b2624bff2ddf2ccb83c9d965cfd2df5` remain non-executable pending separate deployment approval.

## Current checkpoint | CONTRA-2026-11-09-M10-EXTERNAL-READINESS

M10 now has machine-checked fail-closed readiness gates for independently controlled reviewers and live providers. Six distinct operators, disjoint three-member committees, signed disclosures, conflicts and availability are required. Meta, Baseten and Modal are evaluated independently for account, exact model, non-billable smoke, credits, pricing, billing controls, server-side secret custody and bounded owner approval. Current fixtures do not satisfy those live gates. No provider call, reviewer signature, transaction or spending occurred.

## Current checkpoint | CONTRA-2026-11-09-M08-INDEPENDENT-READINESS

M08 now has an independently evaluated readiness state. Its production WASM was built on Ubuntu 24.04 in run `42700073759` with SHA-256 `49cff947a68ae2fddbc5843c22fad1d655162e50b1e81957443584ca90377a5f`. The proposed account returned `UNKNOWN_ACCOUNT` through the official and fallback RPCs, so ownership, balance, current code and signer key are not verified. The current packet digest is `06c2e0389a56354e2a6c5e731d084450831fbfe6a104171c7a24a66794657d7f`; deployment intent is `559c3063282ee90ffb1e0c0318611c4ceb30920129ca28e6fe124aca7ef9be8b`. Both remain non-executable. No transaction, deployment, signing or spending occurred.

## Current checkpoint | CONTRA-2026-11-09-M09-CLOUDFLARE-FREE-FOUNDATION

The Cloudflare Free migration foundation is active on `feat/m09-cloudflare-free`. Workers Static Assets and a SQLite-backed `ContraState` Durable Object preserve serial financial operation identity, wallet UNKNOWN locks, unique transaction hashes, account-scoped sessions, immutable evidence digests and non-regressed chain observations. Unmigrated API routes fail closed with 503. Six Cloudflare regressions, the Wrangler dry-run, 118 repository tests and the wallet bundle pass locally. No Cloudflare account, public endpoint, deployment credential or external action is claimed. The hosting ceiling is USD 0.

## Current checkpoint | CONTRA-2026-11-09-M11-RELEASE-AUDIT-AND-EXTERNAL-PREP

The accepted judge route is already promoted to `main` at `024eef7ec9e684eaab53e2a834c458f9ed5fc302`. The remaining release audit is active on `audit/m11-release-candidate`. Licence, immutable design reference, Git object integrity, documentation links, source policies and the 15-low dependency baseline are verified. No high or critical dependency finding remains. Historical evidence and large receipt artifacts remain preserved.

M08 now has one concrete draft authorisation packet proposing `contra-contestation.testnet`, owner-controlled Ledger custody, a 5 NEAR total testnet ceiling and 8 NEAR minimum balance. Its draft packet SHA-256 is `bdd7df5bcb8c4b028e47cdaa8646e9cfc9189da5a9eab38be0fc9174a97fab0f`; its draft deployment-intent SHA-256 is `c8de2e2dc97172c1a181d726693c8b1f4b119d554d7e011345b39963e71ed630`. The draft is deliberately non-executable until the public key, artifact hash and expiring owner approval bind the final digest.

The approved M09 architecture target is Cloudflare Workers Free with Static Assets and SQLite-backed Durable Objects, under a hard USD 0 ceiling and with no automatic paid upgrade. The migration remains local and no public endpoint is claimed. M10 provider documentation is current for Meta Model API, Baseten Model APIs and Modal compute, but no account, catalogue, endpoint response, credit or billing control is claimed. Independent reviewer onboarding requires six distinct operators. No external transaction, deployment, provider call, secret change or spending occurred. Acceptance remains 23 PASS, 8 PARTIAL and 2 BLOCKED.

## Current checkpoint | CONTRA-2026-11-09-M11-JUDGE-QUICKSTART

The M11 acceptance review is merged and promoted. PR 28 tested head `84ae0180c75049c01f42bad2a3cca8ba51a85a6c` and merged it into `implementation/oct28` as `29206ecf4295181a84466319edd87f5c075671b9`. Core `42626681412`, Security `42626681362` and comprehensive Integration `42626681341` passed. Promotion PR 29 merged the accepted tree into `main` as `9a17ac082e3e92b70449f71e4080048a7fd7ebd1` after Core `42628250853`, Security `42628250899` and comprehensive Integration `42628250807` passed. The protected branches share tree `112562cca368e6bcbd54cfd7cbfd8ea02fcd9226`; implementation is an ancestor of main.

The credential-free judge quick-start is merged. PR 30 tested head `45c80a424e0e77cb00a192094c54c01174467c22` and merged it into `implementation/oct28` as `2e52098130f62922a3a49ec1121c66a5a9bf3301`. Core `42635548335`, Security `42635548331` and comprehensive Integration `42635548332` passed. The clean Ubuntu judge command passed in 5m42s with 116 repository tests, 28 Rust tests, both WASM builds, ABI and commitment checks, wallet build, 46 genuine local Sandbox receipts, exact challenged settlement, BASE_REFUND timeout, zero redispatch and zero AI-created commitments. No external transaction, deployment, live provider call, secret change or spending occurred. Promotion to `main` is the active release action.

## Current checkpoint | CONTRA-2026-11-09-M11-ACCEPTANCE-REVIEW

M09 frontend integration is merged. PR 26 tested head `ffc5ddb66775d34e251af5bdfa3d71c9512506c3` and merged it into `implementation/oct28` as `59de0f9b57b5245aaae1bb6d90d0df7c7f17b5bd`. Core `42623963739`, Security `42623963706` and risk-selected Integration `42623963635` passed. Promotion PR 27 merged the accepted tree into `main` as `a74445527dd66f2ff0c684887849346f7951416e` after Core `42624205902`, Security `42624205805` and comprehensive Integration `42624205937` passed. The protected branches have identical tree `6528bccef703008371d076475c7b4da55115b2f4`; implementation is an ancestor of main.

The M11 acceptance review is active on `docs/m11-acceptance-review`. AC01 through AC33 have been reevaluated individually against current source, local Sandbox, wallet simulation, provider fixtures, browser evidence and external blockers. AC06 and AC24 now have sufficient controlled evidence to move from PARTIAL to PASS. The result is 23 PASS, 8 PARTIAL and 2 BLOCKED. Live provider, independently controlled reviewer, deployed testnet, public API and manual final-frontend evidence remain explicitly incomplete.

## Current checkpoint | CONTRA-2026-11-09-M09-FRONTEND-INTERFACE

M09 service readiness is merged and promoted. PR 24 tested head `e7d009faa2d4c787d132362f35e8352058aa3402` and merged it into `implementation/oct28` as `6a327e68a95d409f9dcc914fb02b3b88e05d7db9`. Core `42619092396`, Security `42619092408` and comprehensive Integration `42619092337` passed. Promotion PR 25 merged the accepted tree into `main` as `737e034e41b2fa24a8db9651f9173fac7c9d1a77` after Core `42620546576`, Security `42620546479` and comprehensive Integration `42620546482` passed. The protected branches have identical tree `6f088ea2add6c81ccb3ab22857728d2f517ea377`; implementation is an ancestor of main.

The frontend-interface unit is active on `docs/m09-frontend-interface`. It adds a versioned, machine-readable inventory of all 35 implemented API routes, the operational hash routes, authentication classes, provenance fields and wallet recovery states. The companion integration guide freezes trust, accessibility, account-switching, UNKNOWN-operation and error-presentation requirements for the later owner-provided interface without changing visual design. The new route-drift regression passes within 32/32 service tests. No runtime, contract, financial, deployment, signing, provider or secret behaviour changed.

## Current checkpoint | CONTRA-2026-11-09-M09-SERVICE-READINESS

M09 verified backup and restore is merged. PR 22 tested head `cbc5bc8e12d8e375c31484765fcd5d34abfbbd59` and merged it into `implementation/oct28` as `803f26e32cd650ac097325786bb951c3f23a0f05`. Core `42596444044`, Security `42596444011` and comprehensive Integration `42596444025` passed. Promotion PR 23 merged the accepted tree into `main` as `ab0b0b97a2a62951ad51528f56851f5bde576ace` after Core `42613304075`, Security `42613304248` and comprehensive Integration `42613304123` passed. The protected branches have identical tree `17f14b5dbdd8fbd1a12da662d89bbd025e73a68d`; implementation is an ancestor of main.

The service-readiness unit is active on `feat/m09-service-readiness`. `/api/live` now reports only process liveness. `/api/ready` requires intact SQLite and immutable objects plus an explicitly ready chain, and returns 503 for unavailable or stale chain state. The provider-neutral service contract fixes one replica, one persistent single-writer volume, separate probes, HTTPS ingress and a 60-second termination grace period without authorising deployment. Four focused tests pass. No host was selected and no external service, secret, signing or transaction action occurred.

## Current checkpoint | CONTRA-2026-11-09-M09-BACKUP-RESTORE

M09 runtime ownership is merged. PR 20 tested head `3a84c4bfbab957676c98ecfbf446a7af66639e23` and merged it into `implementation/oct28` as `d083c9a2602205e56219d0d8d204d2ab1b0dc228`. Core `42588657676`, Security `42588657855` and comprehensive Integration `42588657590` passed. Promotion PR 21 merged the accepted tree into `main` as `f76f2765ce29c076e512d799531271210df882f8` after Core `42592062881`, Security `42592062883` and comprehensive Integration `42592062838` passed. The protected branches have identical tree `d2d89acb061e7e40405c12f136ec5a0efa8fd873`; implementation is an ancestor of main.

The next focused M09 unit adds offline backup and restore packaging. A `CONTRA_BACKUP_V1` manifest binds the complete SQLite and content-addressed storage unit with per-file sizes and SHA-256 values. Creation holds the exclusive data lease, checkpoints and audits SQLite, and refuses live ownership, nested paths, symbolic links and non-empty destinations. Restore verification rejects changed, missing and extra files before auditing SQLite and objects. Local verification passes 108/108 repository tests, including 4/4 focused backup tests, plus wallet and policy checks. No network, contract, financial, signing or provider behaviour changed.

## Current checkpoint | CONTRA-2026-11-09-M09-RUNTIME-OPERATIONS

M08 deployment preparation is merged. PR 18 tested head `bdd3cd5b40808147b0d929261a8e935a2c2ab29a` and merged it into `implementation/oct28` as `38470d1e26d0714b99dbda979eb6e7d285db940f`. Core `42583280382`, Security `42583280234` and comprehensive Integration `42583280329` passed. Promotion PR 19 merged the accepted tree into `main` as `5041df54f3700a6594469faf8972b370cb14800f` after Core `42585793787`, Security `42585793850` and comprehensive Integration `42585793906` passed. The protected branches have identical tree `abd4b777f0bb125f4a543d99a8e65f57733e22a6`; implementation is an ancestor of main.

M09 runtime operations are active on `feat/m09-runtime-operations`. The runtime now acquires an exclusive durable-data lease before opening SQLite, rejects live concurrent ownership, reclaims a terminated same-host process lease, releases failed-start leases and drains accepted HTTP work before closing storage and chain resources. Local verification passes 102/102 repository tests, including 4/4 focused lease and restart tests, wallet bundling, both source policies and documentation checks. No chain method, financial invariant, transaction, signing, deployment, secret or provider path changed. B-M08-01 and B-M09-01 remain external blockers. Acceptance remains 21 PASS, 10 PARTIAL and 2 BLOCKED.

## Completed checkpoint | CONTRA-2026-11-09-M08-DEPLOYMENT-PREFLIGHT

M07 is complete. PR 16 tested source head `c9b00547be0deaa801a7ffbf5181114036acfbac` and merged it into `implementation/oct28` as `6cc9416119e773e022c0bbcc9c5646544ba25e5b`. Promotion PR 17 merged the identical accepted tree into `main` as `4d284ae51a89eeefa17b871636152cb9989de94d`. Core, Security, Contract, the nine-test Sandbox baseline, both complete Contestation journeys, the controlled M06 workflow and F01 through F18 passed. The GitHub Linux production and fault WASM checksums are `49cff947a68ae2fddbc5843c22fad1d655162e50b1e81957443584ca90377a5f` and `d3b8d3f452c6e07916e7c693615657bd657a2ad3281a0f5783462546b36ce00e`.

M08 preparation is accepted and merged. The offline validator binds the exact testnet network, RPC, account, full-access public key, custody classification, release artifact, current code hash, funding limits and initial contract state to an expiring owner-authorisation digest. It rejects embedded secret fields, mainnet, mismatched artifacts, changed plans, stale final blocks, insufficient account funding and incompatible keys. It can perform read-only RPC verification but never signs or broadcasts. A public read-only RPC observation at `2026-11-09T07:11:56.254Z` confirmed synced NEAR testnet block `276888350` with hash `AdHYRrsF2skUdSJqHMknCCBjemudFtukU2JQyU5UBYRR`. No account query, transaction, signing, deployment, secret change, provider call or spending occurred. B-M08-01 remains BLOCKED pending the consolidated owner inputs.

## Current checkpoint | CONTRA-2026-11-09-M07-CONTESTATION-RC

M07 repository professionalisation is active on `refactor/contestation-terminology` from verified `main` commit `7b44e2c795a01eb1064c8b47ef381f1294eca6ad`. Current source, paths, CI and product documentation use Contestation terminology. The Rust source moved unchanged to `contracts/contestation/`; the crate and generated artifact are now `contra-contestation` and `contra_contestation.wasm`. Public methods, state layout, serialization, commitment domains, transaction identities, settlement rules and financial invariants remain unchanged. Historical machine evidence retains original bytes and terminology.

Local verification currently passes 92/92 repository tests, 28/28 Rust tests, strict Clippy, Rust formatting, wallet production bundling, Core and Security source policy, documentation links, ABI export separation and frozen commitment vectors. The production Contestation WASM checksum is `117ab8b854fad4d13d31e4e930b85f88c365c7d285273c66a361c1f46cfaa196`. The inherited critical and two high npm findings are remediated by retaining compatible `near-sandbox@0.1.5` and overriding its parser to `tar@7.5.22`; 15 low findings remain documented. Linux Sandbox, journey, controlled-workflow and F01 through F18 evidence remain the merge gate. No live transaction, deployment, provider call, secret change or spending occurred. Acceptance remains 21 PASS, 10 PARTIAL and 2 BLOCKED.

## Current checkpoint | CONTRA-2026-11-08-M06-CONTROLLED-WORKFLOW-COMPLETE

The M06 controlled workflow gate is complete. PR 11 tested head `184768e0d36a5be6bb2dd2ffc587e22f5c2d86fb` and merged it into `implementation/oct28` as `721964b2f4fb5c6b69767e864bb717e8b32c9afb`. Protected-branch ancestry sync PR 13 merged as `1844eb9017bbda265a029d2d6bbc533ad69db951`. Promotion PR 12 then merged the synchronized implementation into `main` as `b32cd8868470b5b2ad41a5ee5503752f95c54d17`.

Local verification passed 89/89 repository tests, the wallet production bundle, Core policy, Security policy and 8/8 integration-routing tests. PR 11 passed Core `42471496896`, Security `42471496910` and full Integration `42471496909`. Its controlled Linux Sandbox job passed in 5m18s and archived 46 genuine Sandbox receipts, 47 persisted operations, four mocked provider calls, four reviewer audit events and two explicit failure responses. It proved zero wallet redispatch after restart, zero AI-created commitments, a digest-bound Modal proposal check, a fresh-review reversal and an exact `1000000000000000000000000` yoctoNEAR creator refund. PR 13 passed full run `42472276558`; final main promotion passed Core `42472865448`, Security `42472865451` and full Integration `42472865460`.

External wallet activity and provider transports remained simulated. All six reviewer accounts remained one-process fixtures. No testnet or mainnet signing, funded transaction, deployment, live provider request, secret change or spending occurred. The inherited dependency baseline remains 17 findings: 14 low, two high and one critical. No dependency changed. F01 through F18 were not rerun because no contract, escrow, payout or financial invariant changed; the complete existing nine-test Sandbox baseline and both journeys passed repeatedly. Acceptance remains 21 PASS, 10 PARTIAL and 2 BLOCKED until an individual M07 reevaluation supports changes.

## Current checkpoint | CONTRA-2026-11-08-M06-CONTROLLED-WORKFLOW

The complete controlled M06 workflow is under verification on `test/m06-controlled-workflow`, based on implementation commit `46ba7521ef96c58060f7b21b821a553f076382d8`. The connected runner combines durable external-wallet handoff and restart recovery, reviewer disclosure and committee checks, immutable evidence, Meta and Baseten fixture proposals, Modal digest-bound verification, human fixture commit and reveal, quorum timeout, challenge reversal and exact Sandbox settlement. External wallet signing and provider HTTP calls remain simulated. Contract-sensitive execution is assigned to an isolated Linux NEAR Sandbox CI job that preserves receipts, operation identities, reviewer audit events and failure evidence.

Local non-Sandbox verification passes 89/89 repository tests, the wallet production bundle, Core policy and Security policy. No contract, payout or financial invariant changed, so F01 through F18 are preserved and are not rerun for this test-only integration unit. Promotion PR 10 passed Core `42466893121`, Security `42466893179` and full Integration `42466893124`, then merged accepted provider and record commits into `main` as `c3fcdf3a5dea8a5a34673d4e1f6b27c4b95f157c`. No live signing, provider request, testnet or mainnet transaction, deployment, secret change or spending occurred. Acceptance remains 21 PASS, 10 PARTIAL and 2 BLOCKED pending complete CI evidence and separately authorised live interoperability.

## Current checkpoint | CONTRA-2026-11-08-M06-P1-P3-MERGED

M06 wallet, reviewer control and non-billable provider interoperability are merged into `implementation/oct28`. PR 4 merged wallet head `3ef42d08ef29897e9d48c599dd311ce8d5dd9d6f` as `4bd6bc163cd3c6a1b4097eb2f01a749f54e97e03`. PR 5 merged CI optimisation as `963e27edb4a7cbf8570d652b4a2b3fa6fe2b806a`; its full gate reduced wall time from 70m51s to 8m02s without removing coverage. PR 7 merged the reviewer risk-map correction as `4f5c03234c3b2b01aa2e8765e64da465f0b02eaa`. PR 6 merged reviewer head `867c0678733571f9b3fbab8a662d177c52302f38` as `b4c86ec0d8bd2ab18c1f02534ce0eb2ce9d88fdc`. PR 8 merged provider head `e0437e9794c7b6c9ac630580edc1e2e910cdda66` as `6900a94ae40a88c06cb03365cdd806cb9ecdb0e7`.

PR 3 integrated accumulated implementation head `b4c86ec0d8bd2ab18c1f02534ce0eb2ce9d88fdc` into `main` as `278efcffaca499f22ae775999c0ef2879f32920d`. Core, Security, Contract, the nine-test Sandbox baseline, both complete contestation journeys and the aggregate Integration gate passed on that exact head in run `42422676322` and companion runs. Main post-merge Security run `42423325559` passed. Provider PR 8 passed Core `42423468952`, Security `42423468917` and focused Integration `42423469021`; the focused route completed in 4m57s. Acceptance remains 21 PASS, 10 PARTIAL and 2 BLOCKED pending authorised live interoperability evidence. No live signing, provider request, deployment, secret change, mainnet activity or spending occurred.

## Current checkpoint | CONTRA-2026-11-08-IMPL-M06-P3-PROVIDERS

M06 provider interoperability is implemented on `feat/m06-provider-interoperability` with mocked transports only. Meta primary and fresh review, Baseten adversarial review and Modal proposal verification now use distinct strict request envelopes. Meta Muse Spark 1.3 is recorded as the proposed primary model and Muse Wonder 1.0 as optional escalation metadata, with access explicitly unverified. Every live provider remains disabled unless owner authorisation, credits, pricing, model interface, endpoint, key and request cap gates are all satisfied.

Provider findings cover every frozen criterion, cite only case-bound evidence and fail closed on extra fields, missing criteria, contradictory disposition or invalid citations. Contradictory and insufficient evidence must remain unresolved. Bounded raw responses are stored immutably before validation. Modal verification binds an existing AI proposal digest and remains an `AI verification proposed` artifact. No provider output can create a reviewer vote, judgment, transaction or settlement. Started ambiguous calls retain their reservation and cannot be blindly repeated. The $3 Meta, $3 Baseten and $5 Modal caps are unchanged. No live provider call, secret change, transaction, deployment or spending occurred. Acceptance remains 21 PASS, 10 PARTIAL and 2 BLOCKED pending authorised live interoperability evidence.

## Current checkpoint | CONTRA-2026-11-07-IMPL-M06-P2-REVIEWER-CONTROL

M06 Phase 2 reviewer control is complete at the local engineering gate on `feat/m06-reviewer-control`, based on the PR 4 merge commit `4bd6bc163cd3c6a1b4097eb2f01a749f54e97e03`. The preserved stash was inspected without applying it wholesale. Only its reviewer-control concepts were recovered; wallet and provider stash content remains preserved.

Reviewer operations now verify six frozen account and operator identities, exact disclosure digests and revisions, active confirmation, and primary/fresh disjointness without claiming real-world independence. Reviewer confirmation preparation binds the signer to the active registry revision and disclosure. Commit and reveal preparation checks the frozen round, appointed slot, phase, evidence identity, and duplicate or conflicting onchain records. A reviewer workspace reports missing participation, quorum feasibility and deadline recovery as advisory state only; the contract remains the only verdict and settlement authority.

SQLite schema version 5 adds account-scoped encrypted reveal recovery packages, finalised registry observations and append-only reviewer audit history. Recovery metadata is idempotent, conflict-safe and durable across restart. Finding identity must match case, terms, round, evidence, reviewer and disposition before package storage. Dedicated reviewer tests pass 7/7, the combined reviewer, wallet and CI-policy tests pass 24/24, and the updated complete repository suite passes 83/83 after merging the CI optimisation target. Wallet bundle, syntax, diff, Core policy, Security policy and dependency checks pass locally. The accepted 17 inherited dependency findings remain unchanged. No contract or financial invariant changed, so full financial P0 is not required. PR 6 focused GitHub checks remain the external gate. Acceptance remains 21 PASS, 10 PARTIAL and 2 BLOCKED. No signing, transaction, deployment, provider call, secret change or spending occurred.

## Current checkpoint | CONTRA-2026-11-07-CI-REVIEWER-RISK-MAP

PR 5 merged the verified CI optimisation into `implementation/oct28` at `963e27edb4a7cbf8570d652b4a2b3fa6fe2b806a`. The focused reviewer mapping now explicitly covers `tests/m06-reviewer*.test.mjs` together with reviewer source changes. A regression proves this combined diff selects focused committee, reversal and timeout Sandbox coverage. The correction itself remains full-classified because it changes the governing risk map.

## Current checkpoint | CONTRA-2026-11-07-CI-SANDBOX-OPT

Owner standing approval merged PR 4 after exact head `3ef42d08ef29897e9d48c599dd311ce8d5dd9d6f` passed Core `42408934722`, Security `42408934686` and Integration `42408934712`. GitHub created merge commit `4bd6bc163cd3c6a1b4097eb2f01a749f54e97e03` on `implementation/oct28` at `2026-11-07T21:48:15Z`.

CI optimisation merged through PR 5 as `963e27edb4a7cbf8570d652b4a2b3fa6fe2b806a`. A versioned mapping selects fast, focused or full integration coverage from the complete pull request diff. Unknown paths default to full. The aggregate gate distinguishes a policy-only fast decision from executed Sandbox tests. Full baseline and journey verification use isolated parallel jobs, while F01 through F18 remain separate and unchanged. Adaptive Sandbox block advancement uses observed finalised block intervals without shortening contract deadlines. Run `42418916525` passed policy, the nine-test baseline, both complete journeys and the aggregate gate. The parallel full wall time was about eight minutes.

## Current checkpoint | CONTRA-2026-11-07-IMPL-M06-P1-WALLET-FINAL

M06 Phase 1 final wallet hardening is complete locally on `feat/m06-wallet-lifecycle` and remains within PR 4. Finalised RPC proof now requires an independently supplied, valid NEAR transaction hash that exactly matches the persisted hash. The adapter also verifies signer, configured contract, explicit final execution status and final block identity. The lifecycle layer independently rechecks the inner transaction hash, signer, receiver, single FunctionCall action, method, canonical arguments, gas and deposit. Missing, malformed, contradictory, stale or regressed proof cannot become CONFIRMED. Integrity failures lock the durable operation as UNKNOWN instead of leaving a potentially broadcast operation reusable.

The complete cross-layer audit preserved PREPARED, SIGNING, PENDING, CONFIRMED, FAILED and UNKNOWN safety. It additionally found and corrected browser loss of a wallet-returned hash when the server callback was unavailable. The hash is now retained in account-scoped local recovery state and attached through the existing idempotent callback after reload for receipt-only reconciliation. No transaction is redispatched. Existing restart, handoff, rejection, concurrency, unique-hash, terminal-state, session, account-isolation and migration safeguards remain intact.

Pre-fix regression evidence reproduced the missing-hash acceptance and the two audit findings for stale RPC confirmation and lost browser hash recovery. Final focused wallet, RPC and browser tests pass 34/34. The complete repository suite passes 69/69, the wallet production bundle passes, JavaScript syntax and diff checks pass, Core and Security policy checks pass, and the dependency audit retains the accepted 17 inherited findings with zero new baseline failures. Fresh GitHub Core, Security and Integration evidence is required on the final PR head before owner merge approval. Contract CI and full financial P0 are not required because contract, escrow, payout, settlement and financial invariants did not change. Acceptance remains 21 PASS, 10 PARTIAL and 2 BLOCKED. No signing, transaction, deployment, provider call, secret change or spending occurred.

## Current checkpoint | CONTRA-2026-11-07-IMPL-M06-P1-WALLET-SAFETY

PR 4 wallet safety corrections are implemented locally on `feat/m06-wallet-lifecycle`. External operations now separate durable `PREPARED` intent from persisted `SIGNING` handoff. Restart preserves pre-handoff preparation but locks a handed-off request without a hash as `UNKNOWN`; that operation cannot expose another signing request. A delayed callback can attach only the original recovered hash and resume receipt-only reconciliation. Transaction hashes are unique across operations and conflicting callbacks, payloads and terminal-state changes fail closed.

The RPC path confirms only finalised responses with a recognized NEAR `SuccessValue` or `SuccessReceiptId` result. Explicit `Failure` remains failed, while missing, malformed or unrecognized execution status remains unconfirmed. Receipt reconciliation verifies hash, network, signer, contract, method, arguments, deposit, final block identity and non-stale observation before completion. Post-handoff browser cancellation is never authoritative: it becomes `UNKNOWN`; only a rejection recorded before server handoff becomes `FAILED`. Browser recovery retains unresolved account-scoped operation IDs and known hashes across reloads. Live handoff remains disabled by default and requires a server-only authorisation gate used solely by controlled tests.

The focused M05, wallet and browser run passes 31/31. The repository suite passes 66/66, M05 runtime passes 18/18, wallet bundling passes, Core and Security policy checks pass, and the dependency audit reports the unchanged accepted baseline of 17 inherited findings with no new failures. Local Sandbox integration was attempted but blocked before launch because this process is Windows; fresh GitHub Linux Integration evidence remains required on the corrective head. No contract or frozen financial protocol code changed, so Contract CI and full P0 are not required. Acceptance remains 21 PASS, 10 PARTIAL and 2 BLOCKED. No signing, transaction, deployment, provider call, secret change or spending occurred. PR 4 and PR 3 remain unmerged.

## Current checkpoint | CONTRA-2026-11-07-IMPL-M06-P1-WALLET

M06 Phase 1 wallet lifecycle has reached its local engineering gate on `feat/m06-wallet-lifecycle`. The backend now persists a server-validated external-wallet intent before signing, enforces exact testnet contract, signer, method, argument and deposit policy, retains one stable operation identity, and reconciles only a matching finalised receipt. Sessions support reload inspection, renewal and revocation. Wallet rejection is final before broadcast; an interrupted or missing redirect becomes UNKNOWN and cannot be blindly redispatched. A delayed callback may attach the original transaction hash and resume receipt-only reconciliation.

SQLite schema version 3 stores external-wallet payloads, operation kind and highest observed block height. Restart recovery preserves unsigned requests and returns known hashes to PENDING reconciliation while retaining conservative UNKNOWN locking for existing Sandbox operations. Duplicate prepare, conflicting payload reuse, repeated callbacks, delayed receipts, RPC failure, regressed observations, mismatched receipts, reload, restart, session expiry and account isolation are covered by controlled simulations. `npm test` passes 60/60, the wallet-focused M05/service subset passes 51/51 and the wallet bundle builds. No contract or financial protocol source changed, so full P0 was not rerun. The acceptance baseline remains 21 PASS, 10 PARTIAL and 2 BLOCKED until external authorised signing evidence exists.

Wallet code commit `379ff4e0111336da33579357a08c341ce6273dcb` is published in PR 4 against `implementation/oct28`. Genuine Core run `42373449517`, Security run `42373449483` and Integration run `42373449454` passed on that exact code commit. Integration completed the corrected nine-test Sandbox baseline, both full journeys, fresh receipt and balance validation and artifact upload. PR 3's previously pending Integration run `42370843796` also passed; PR 3 remains open and unmerged under the owner-controlled boundary. No live signing, testnet transaction, deployment, provider request, production-secret change, mainnet action or spending occurred.

## Current checkpoint | CONTRA-2026-11-07-IMPL-M05.1-CI

M05.1 CI recovery is COMPLETE. Five GitHub Actions workflows now cover core, contract, security, Sandbox integration and risk-based full financial P0 verification. Supporting checks enforce clean dependency installation, JavaScript syntax, the no-em-dash policy, immutable reference integrity, restricted credentials, dependency-audit deltas, exact contract exports, production/fault separation, frozen commitment vectors and truthful historical evidence boundaries.

Local verification passes 52/52 repository tests, 28/28 Rust contract tests, rustfmt, strict Clippy, the wallet build with pinned Playwright 1.65.0, 29 production plus four fault-only ABI exports, exact commitment vectors and the retrospective M03 through M05 evidence review. The contract was rustfmt-normalized and received two semantics-preserving Clippy rewrites. The historical M05 Wasm hash and rebuilt CI-formatted Wasm hash are both recorded without representing the latter as the original artifact.

The dependency baseline openly reports 17 inherited findings: 14 low, two high and one critical. The direct Playwright advisory was removed by the pinned 1.65.0 update. No vulnerability is hidden or treated as fixed without evidence. PR 1 merged the verified CI setup into `implementation/oct28` as `a1eedc929758d3e9f16dffb78fee64da5820817e`. Genuine Core, Security, Contract and Integration jobs passed. Integration completed the nine-test baseline and both journeys in 70m52s. Branch protection now requires pull requests plus fresh Core and Security checks on `main` and `implementation/oct28`, includes administrators and blocks force pushes and deletion. `main` remains unchanged. AC01 through AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED. No deployment, signing, external transaction, provider call, production secret, mainnet action or spending occurred.

## Current checkpoint | CONTRA-2026-11-07-IMPL-M05-R03

M05 R03 is COMPLETE. The compatible `Ubuntu` WSL distribution passed the strengthened native-Linux, `ps`, executable and file-limit preflight, then completed the full P0 financial regression and both API-backed local Sandbox journeys. P0 passed all 28 Rust tests, 19 service/report tests, nine corrected baseline Sandbox tests and all 18 financial categories. It preserved 454 transactions, 753 receipt outcomes, 46 balance and storage snapshots, maximum transaction gas `35926618795729`, maximum callback gas `17002377317045`, maximum storage 17,470,225 bytes and zero gas-budget violations.

The original P0 parent exited 2 because the repository's Windows-installed esbuild dependency was not executable in WSL. Financial execution itself passed. A clean Linux-native `npm ci` under `/tmp`, without shared Windows `node_modules`, rebuilt esbuild 0.28.2 and reproduced the wallet bundle twice at SHA-256 `b2dae16e02c234a8ac162ae25e923831ffc9095cc98f9fe4a3a629d414d61143`. The unchanged strict `p0Complete` predicate then reconciled to exit 0. The runner now uses this isolated Linux build helper on future Linux executions and retains the original failure transcript.

The journey run recorded 44 CONFIRMED operations, 44 unique operation transaction hashes and 44 matching successful receipts. The unchallenged case reached PRIMARY ACCEPT and paid the beneficiary exactly `1000000000000000000000000` yoctoNEAR. The challenged case reversed PRIMARY ACCEPT to FRESH REJECT and refunded the creator exactly `1000000000000000000000000` yoctoNEAR. Both payout intents finished `SUCCESS_VERIFIED` after authenticated callbacks.

The generated journey report is timestamped `2026-11-07T03:48:16.497Z`. All six Sandbox reviewer accounts remain controlled by one local process, so this run does not establish independent contestation. No paid provider, external wallet, testnet transaction, deployment, production secret or mainnet action occurred. The earlier Windows `ps` and Ubuntu-22.04 GLIBC failures remain recorded as pre-launch diagnostics; neither executed a transaction.

`npm test` passes 52/52, both native and isolated Linux wallet builds pass, and the M05 runtime/backend changes have no observed P0 or two-journey Sandbox regression. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED because external wallet signing, independently controlled reviewers, live authorised providers, a configured testnet contract and manual screen-reader evidence remain incomplete. Spending remains $0.

## Current checkpoint | CONTRA-2026-11-07-IMPL-M05-R02

M05 R02 is COMPLETE. Backend authentication challenges, signature verification, artifact writes, evaluation requests and transaction dispatch now have bounded per-address or per-account limits with `Retry-After` responses. When a public origin is configured, it is authoritative and a forged Host header cannot make an attacker origin appear same-origin. A new case-isolation test proves that a participant in two cases cannot retrieve case A evidence through case B.

Durable storage is now documented and tested as one volume containing SQLite and content-addressed objects. Offline backup preparation performs object and database integrity checks plus a WAL truncate checkpoint. A copied volume was reopened successfully with its blob and case link intact. Missing object bytes fail the audit closed. Session and challenge expiry pruning is available. Every style, icon, font, texture, script and image retained for the minimal operational frontend was fetched successfully through the application after visual cleanup.

Abrupt child-process exit after an immutable object write, provider reservation and BROADCAST transaction state preserves the object and reservation, then recovers the interrupted operation only as UNKNOWN with its hash intact. Expired challenge and session pruning preserves active records. Concurrent limiter calls admit only the configured bound. An aborted partial JSON request writes no challenge and leaves the service healthy. `npm test` passes 52/52. R01 live public testnet RPC connectivity remains the only external chain observation in M05. No Sandbox journey, testnet contract read, transaction, signing, deployment, provider request or production secret occurred. Spending remains $0. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED pending fresh individual evaluation. The immutable screenshot checksum remains `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`.

The R03 journey regression was attempted but did not execute. Windows failed before Sandbox launch because Unix `ps` was absent. WSL then failed before launch because the pinned binary requires GLIBC 2.38 and 2.39, which that distribution lacks. The preflight now detects native Linux, `ps`, binary presence and binary executability, preventing another false readiness result. Accepted M03 and M04 Sandbox evidence remains unchanged.

AC01 through AC33 were reviewed individually in `docs/M05_AC_REVIEW.md`. No requirement was weakened and no incomplete criterion was upgraded. Totals remain 21 PASS, 10 PARTIAL and 2 BLOCKED.

## Current checkpoint | CONTRA-2026-11-07-IMPL-M05-R01

M05 runtime and backend checkpoint R01 is COMPLETE. Application startup now has explicit unavailable, Sandbox and testnet modes. Testnet mode wires the existing RPC adapter into startup and fails closed unless the endpoint identifies as testnet, is synchronized, the configured account is valid and contains contract code, and finalised blocks are available. Contract reads carry finalised block height, hash, timestamp, age, stale state and block-regression detection. Authenticated receipt inspection distinguishes pending, failed and confirmed outcomes without promoting unknown results.

Persistence now uses two explicit SQLite schema migrations with WAL, FULL synchronous mode, startup integrity checks and content-addressed file audits. Restart recovery converts interrupted PREPARING, AWAITING_SIGNATURE, BROADCAST and PENDING operations to UNKNOWN, preserving any transaction hash and prohibiting duplicate dispatch. Atomic provider reservations remain idempotent across two database connections. API responses expose genuine chain identity and persistence health; writes require JSON and same-origin or configured-origin validation.

`npm test` passes 44/44. A live read-only request to `https://rpc.testnet.near.org` returned `chain_id=testnet` with `syncing=false`; this proves public RPC connectivity only. No CONTRA testnet contract exists or was configured, so configured-contract reads remain BLOCKED and no testnet transaction or deployment is claimed. A local unavailable-mode process returned explicit unavailable chain health plus SQLite schema version 2 and integrity `ok`. No Sandbox journey was rerun, no provider was called and spending remains $0. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED pending a fresh individual evaluation after further M05 evidence. M03 and M04 financial evidence is unchanged.

The product-first directive supersedes active visual-review tasks. Live hackathon instructions were fetched again on 2026-11-07. Current Q-001 accepts code since the October 19 announcement; CONTRA's actual implementation start remains recorded as October 28. Primary track is `security`, with `open` additionally applicable. Obsolete visual-only tooling was removed after active dependency mapping; imported UX3A assets, immutable references and historical Git evidence remain.

## Current checkpoint | CONTRA-2026-11-07-DOC-HACKATHON-01

The live NEAR HACKATHON agent instructions were fetched from `https://nearhackathon.com/HACKATHON.md` and stored at repository root as `HACKATHON.md`. The fetched response SHA-256 was `903794f4b656b456eaee087941517d024a33633641d167b90c3f060d381d9aed`. Seven upstream em dash characters were normalized to ASCII punctuation to satisfy the repository rule, with no rule content removed; the local SHA-256 is `81022d6f7c4d3033d581a1cdd90d50f60d5eb382722cd9034b2aa404cd64a8af`. No source code, contract, test, transaction, deployment, provider usage, secret or repository setting changed. The current implementation checkpoint remains M04.3 Phase 3. The live rules must be read again before submission because the source states that dates and rules may change.

## Current checkpoint | CONTRA-2026-11-04-IMPL-M04.3-P3

M04.3 Phase 3 browser verification is COMPLETE at the authorised local scope. Windows Chrome, Playwright Chromium and Firefox each pass 105 checks across 1536 x 676, 1366 x 768, 1200 x 900, 1440 x 900, 1920 x 1080, 768 x 1024, 390 x 844 and 320 x 844, for 315/315 total checks. The matrix verifies visible viewport boundaries, complete radar placement, direct values, label overlap, console output, keyboard workspace navigation, browser Back, Escape focus restoration and reduced motion. Actual screenshots were inspected after the numerical gate.

Fresh connected Sandbox captures cover all target sizes. Both local settlement journeys were reexecuted with 44 confirmed operations and 44 receipts. The unchallenged PRIMARY ACCEPT paid exactly 1 NEAR to the beneficiary, and the challenged case reversed PRIMARY ACCEPT to FRESH REJECT and paid exactly 1 NEAR to the creator. Both callbacks recorded SUCCESS. Repository tests pass 35/35, the radar gate passes 17/17, the desktop viewport gate passes, the wallet bundle builds and the reference hash remains exact. Manual screen-reader testing was not run and is not claimed. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-04-IMPL-M04.3-P2

M04.3 Phase 2 radar correction is COMPLETE. The chart displays a direct value beside every sector label and distinguishes measured 0%, partial progress, full progress, N/A, protected evidence marked Locked, unavailable retrieval and missing records. Every metric preserves numerator, denominator, source, status and observation time. Retrieval and authorisation errors no longer become false zero coverage.

The three tabs now have documented scopes. Criteria includes Evidence, Provenance, Keyboard and Criteria. Evidence includes Evidence, Provenance, Review and Quorum. Overall includes all eight lifecycle measurements and is the default. Excluded sectors are visibly N/A for that lens while retaining their underlying records in the metric data.

Deterministic tests cover no case, created/unfunded, funded/no evidence, evidence/incomplete review, provisional, active challenge, incomplete fresh review, settled unchallenged, settled challenged, inaccessible, unavailable, missing and not-applicable states. Results: 35/35 repository tests and 17/17 rendered radar checks pass. Genuine case switching refreshes all eight measurements. Side-by-side zero, partial and complete fixture screenshots plus genuine Sandbox screenshots are under `project/artifacts/m043/phase2/`. Phase 3 browser verification is next. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-04-IMPL-M04.3-P1

M04.3 Phase 1 desktop workspace correction is COMPLETE. Owner visual acceptance of M04.2 was rejected. The root cause was the combined desktop `min-height:810px`, `min-height:756px` and cumulative fixed section minimums, which produced an 842px shell and 206px of document overflow at 1536 x 676. The corrected short-desktop shell is 652px tall at y=12, with a 597px main workspace and no document or column scrollbar.

The Overview now reserves visible space for case summary, progress, the complete radar and all three primary action cards. It shows two reviewer summaries, one recent activity and a compact materials count, with full reviewer, evidence and activity records available through their stable workspaces. The three-column identity remains intact. A second defect found by the new test, 31px of concealed middle-column overflow at 1200 x 900, was corrected with explicit flexible desktop grid rows and true viewport centreing.

The Phase 1 browser gate passes across 1536 x 676, 1366 x 768, 1200 x 900, 1440 x 900, 1920 x 1080, 768 x 1024, 390 x 844 and 320 x 844. Screenshots and measurements are under `project/artifacts/m043/phase1/`. Phase 2 radar data and presentation correction is next. Owner visual acceptance remains rejected and pending a new review.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04.2-P3

M04.2 Phase 3 and the three-phase correction are COMPLETE at the authorised local scope. Major workflows now use stable hash-routed views for Overview, Cases, Evidence, Challenges, Reviewers, Settlement, Lab, Settings and Activity. Browser Back, direct routes and selected-case context are preserved. Focused dialogs remain only for focused actions.

The final end-to-end suite passes 54/54 checks. Empty and genuine populated responsive matrices each pass 46/46 checks across eight viewports. The operational radar suite passes 13/13 browser checks and 3/3 deterministic coverage subtests. Windows Google Chrome, Playwright Chromium and Firefox each pass 4/4 browser-matrix checks. Linux Chromium is BLOCKED because the WSL browser download could not resolve its alternate host after the primary host timed out. Manual screen-reader verification remains PARTIAL.

Both local Sandbox journeys were executed again with 44 persisted operations and receipts. The unchallenged case and challenged fresh-review reversal each settled exactly 1 NEAR through callback-confirmed payout. No contract source or P0 safeguard changed. AC01-AC33 remain 21 PASS, 10 PARTIAL and 2 BLOCKED. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04.2-P2

M04.2 Phase 2 operational radar correction is COMPLETE. All eight sectors now derive from actual evidence retrieval, provenance, selected-round reveals, settlement milestones, confirmed challenge lifecycle, matching quorum, verified keyboard evaluation records and independent criterion evidence/evaluation records. Configuration fields no longer count as completion. Denominator zero remains N/A. The canvas uses 25, 50, 75 and 100 percent rings and independent radial sector depths.

Deterministic tests cover eight progressive states and exact numerator, denominator, source and render depth behaviour. Results: 3/3 coverage subtests, 13/13 browser information checks, 46/46 empty responsive checks and 46/46 genuine populated responsive checks. The challenged genuine case is visibly partial at Review 2/3, Keyboard 0/1 and Criteria 1/2 while preserving its actual completed challenge, finality and quorum records. Zero, genuine partial and deterministic full screenshots are under `project/artifacts/m042/phase2/`. Phase 3 navigation and full UX verification is active. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04.2-P1

M04.2 Phase 1 responsive shell correction is COMPLETE. Desktop columns no longer own independent scroll regions or reserve scrollbar gutters. Short screens at 1536 x 676 and 1366 x 768 now use one coherent document scrollbar, while 1200 x 900 retains the approved shell origin, width, column hierarchy and visual system. The minimum reading scale is raised, the empty heading no longer truncates, and the radar label and legend spacing is corrected.

Empty and genuine populated states each pass 46/46 Chromium checks across eight viewports: 1200 x 900, 1366 x 768, 1536 x 676, 1440 x 900, 1920 x 1080, 768 x 1024, 390 x 844 and 320 x 844. The checks cover page overflow, clipped sections, independent column scrolling, text below 10px, heading truncation, short-screen document ownership and console errors. Before and after screenshots and measurement reports are under `project/artifacts/m042/phase1/`. The reference SHA-256 remains exact. Phase 2 radar measurement semantics is now active. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04.1-P3

M04.1 Phase 3 and the three-phase frontend implementation are COMPLETE at the authorised local scope. Playwright is a pinned repository dependency, browser installation and test commands are portable, and no test contains a user-specific module or Chromium path. The final browser run passes 58/58 assertions covering connect/disconnect, two genuine case records, all navigation entries and tabs, search, activity pagination, Back, Escape, focus restoration, reload reconciliation, stale data, service failure, permission denial, reduced motion, semantics, contrast, 125 percent and 200 percent effective zoom, 320px width and final screenshots. The legacy populated browser regression passes 16/16.

Final regression also passes 29/29 service tests and the wallet bundle build. Phase 1 and Phase 2 results remain 26/26 empty responsive, 29/29 populated responsive and 15/15 interface checks. The current task executed both local Sandbox journeys again with 44 confirmed operations and receipts, retaining exact 1 NEAR callback-confirmed settlements and the challenged ACCEPT to REJECT reversal. AC01-AC33 now stand at 21 PASS, 10 PARTIAL and 2 BLOCKED. Owner visual acceptance remains pending.

A fresh Rust rerun did not execute: Windows DNS failed for `index.crates.io`, offline cache lacked `near-primitives`, and the WSL runtime has no Cargo installation. No Rust source changed, and accepted M03 evidence remains 28/28 Rust tests with complete P0 proof. Windows frontend-only `npm ci --ignore-scripts` passes; plain Windows `npm ci` is not supported by the pinned `near-sandbox` installer. The dependency audit findings and exact remaining gates are recorded in `docs/M041_ACCEPTANCE.md`. No deployment, paid inference, production secret, testnet or mainnet operation occurred.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04.1-P2

M04.1 Phase 2 radar and interface refinement is COMPLETE. The radar now renders eight separately bounded sectors with low-opacity genuine-data fills, high-contrast concentric rings and spokes, responsive geometry and a device-pixel-ratio-aware canvas buffer. Zero coverage remains N/A with denominator zero. The retained challenged case proves partial Overall coverage at Review 2/3 and Challenge 6/8, while the Criteria view proves full coverage without hiding the grid. Zero, partial, full and 320px close-ups are in `project/artifacts/m041/phase2/`.

The Bench now displays 1 NEAR while retaining the exact `1000000000000000000000000 yoctoNEAR` in element details, uses a meaningful short case identifier with the full digest available, translates technical state and payout codes, closes completed review windows using the callback completion time, and improves materials, reviewer-control and event-history labels. The approved 1200 shell and hierarchy remain unchanged. A direct UX3A comparison is saved as `ux3a-refined-comparison.png`.

Verification passes 15/15 interface checks, 26/26 empty responsive checks, 29/29 populated responsive checks and 29/29 service tests, with zero console error. The reference hash remains exact. No protocol, contract, Sandbox invariant, deployment, paid provider, secret, testnet or mainnet change occurred. Phase 3 end-to-end UX and accessibility testing is next. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04.1-P1

M04.1 Phase 1 responsive layout engineering is COMPLETE. The approved 1200 x 900 shell remains exactly 1080 x 810 at x 60, y 45. Wider desktops use proportional three-column growth, short desktop screens use intentional per-column scrolling, tablets use an ordered full-width content flow with the sidebar preserved, and 390px plus 320px phones use a full-width flow with a horizontally scrollable navigation strip. Fixed content heights no longer clip populated reviewers, materials, tasks or activity cards. Coarse-pointer navigation, tabs, disclosure links and pagers meet a measured 44px minimum target.

Empty and genuine populated states passed the seven-viewport Chromium matrix at 1200 x 900, 1366 x 768, 1440 x 900, 1920 x 1080, 768 x 1024, 390 x 844 and 320 x 844. Final results: 26/26 empty-state checks and 29/29 populated-state checks, with no page horizontal overflow, viewport-clipped section or browser console error. A real accessibility failure in the first populated run exposed undersized disclosure, radar-tab, pager and brand targets; the controls were corrected and the full matrix reran cleanly. Screenshots and measurements are in `project/artifacts/m041/phase1/`.

The retained local Sandbox run also reconfirmed both M04 journeys with 44 confirmed operations and receipts. No protocol, Rust contract, financial safeguard, testnet state, paid provider, production secret or mainnet operation changed. The immutable reference SHA-256 remains `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`. Phase 2 radar and information refinement is next. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04

M04 Priority 2 local product integration is COMPLETE. Structured per-criterion evidence, append-only corrections, provenance and participant access controls are connected to The Bench. Local transaction lifecycle, receipt linkage, reload recovery and final-block freshness are durable. Reviewer control disclosures join exact onchain registry digests and explicitly state that all local signers share one process. Meta primary/fresh, Baseten adversarial and Modal verifier adapters pass non-billable schema, citation, injection, idempotency and budget tests. Human finding and counterexample artifacts are immutable and case-bound.

`npm run test:m04:journeys` passed two real API-backed local Sandbox workflows. The unchallenged case settled ACCEPT to the beneficiary. The challenged case recorded a criterion-bound counterexample, changed primary ACCEPT to fresh REJECT and settled to the creator. Both callback-confirmed payouts changed the intended receiver balance by exactly 1 NEAR. The successful retained run recorded 44 confirmed operations, 44 unique transaction hashes, 44 successful receipts, two onchain-linked manifests and maximum observed transaction gas 35,954,802,810,711. Every persisted lifecycle was PREPARING, AWAITING_SIGNATURE, BROADCAST, PENDING, CONFIRMED.

Populated Chromium captures at 1200 x 900, 768 x 1024 and 390 x 844 pass 16 browser checks with no console error, horizontal overflow or clipped tablet radar. Final verification passes 29/29 service tests, 28/28 Rust tests and the wallet bundle build. The immutable JPEG SHA-256 remains `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`. AC01-AC33 evaluation is 20 PASS, 11 PARTIAL and 2 BLOCKED in `docs/M04_ACCEPTANCE.md`. AC31 and AC32 remain blocked at their exact frozen scope because authorised testnet and actual provider records do not exist. No testnet deployment, paid call, production secret or mainnet action occurred. GitHub visibility was verified as PUBLIC and README now says so. Owner visual acceptance remains pending.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04-R01

Priority 2 reviewer disclosure and evaluator fixture integration is complete. Reviewer operators can store canonical control disclosures covering common control, key custody, signer control, provider/model or human procedure, conflicts, limitations, verification sources and attestation time. The disclosure digest and stable operator identifier are ready for the existing owner registration and reviewer confirmation transactions. Registry inspection joins only exact onchain disclosure digests. Local Sandbox screens explicitly state that all fixture signers are controlled by one process and are not proof of independent operators.

Meta primary/fresh, Baseten adversarial and Modal verifier request and response adapters now have distinct normalized fixture paths. Evaluations bind trusted case, round, terms, role and prompt version; accept only allowed requirement, manifest, source and counterexample citations; quote source content as untrusted data; reject invalid responses; preserve idempotency; retain ambiguous cost reservations and enforce the existing $3/$3/$5 caps. `npm test` passes 28/28 with no live or paid provider call. Syntax, whitespace and em dash checks pass. No transaction or deployment occurred. Next: execute both populated local Sandbox journeys through the integrated API, capture screenshots, and finish UI accessibility plus AC01-AC33 evidence.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04-W01

Priority 2 wallet persistence and freshness integration is complete at service level. Local Sandbox operations now persist PREPARING, AWAITING_SIGNATURE, BROADCAST, PENDING and terminal CONFIRMED, FAILED or UNKNOWN transitions with an ordered audit history, transaction hash, receipt, observation error and timestamps. Duplicate operation IDs cannot dispatch twice. Reload recovery reconciles the saved operation from the server ledger. Final chain reads include network, finality, block height, block hash, block timestamp where available and fetch time; The Bench exposes the final block and stale state. External testnet signing remains gated.

`npm test` passes 24/24. Tests verify lifecycle history, hash persistence, duplicate blocking, UNKNOWN locking and final-block read envelopes. Syntax, whitespace and repository-wide em dash checks pass. This milestone did not execute a new Sandbox transaction; the complete M04 local journeys remain pending and must exercise this path before M04 acceptance. No deployment, paid call, production secret, testnet or mainnet action occurred. Next: reviewer disclosures and non-billable evaluator fixtures.

## Current checkpoint | CONTRA-2026-11-03-IMPL-M04-E01

Priority 2 evidence integration is complete and verified. The API now accepts canonical `CONTRA_EVIDENCE_V1` manifests that cover every frozen criterion exactly once, bind uploaded source bytes to SHA-256 digests, record bounded provenance and enforce participant-only retrieval. Corrections are append-only records that reference an earlier same-case manifest and preserve the original bytes. The Bench lists stored manifests, distinguishes the exact onchain-selected digest from offchain records, displays per-criterion source coverage, and derives the Evidence and Provenance radar sectors from the selected manifest rather than inferred verdict state.

`npm test` passes 22/22 tests, including structured validation, forged digest rejection, cross-case correction rejection, immutable history, access control and exact onchain linkage. Syntax checks and the repository-wide em dash scan pass. No Sandbox transaction, deployment, paid provider call, production secret or mainnet operation occurred in this milestone. P0 evidence and the Rust contract are unchanged. AC01-AC33 remain individually unaccepted pending the full M04 matrix and both local journeys. Next: durable wallet transaction states, receipt reconciliation, reload recovery and stale-read envelopes.

## Current checkpoint | CONTRA-2026-10-29-IMPL-M03

P0 financial verification is COMPLETE on the compatible WSL Ubuntu x86_64 host. The clean `npm run test:p0` gate exited 0 after the nine-test baseline passed 9/9 and financial categories F01-F18 passed 18/18. The run recorded 454 transactions, 753 receipt outcomes and 46 balance/storage snapshots. Maximum observed transaction gas was 35,923,793,821,747; maximum callback gas was 17,000,817,633,275; no configured gas-budget violation occurred. Maximum observed contract storage was 17,470,225 bytes. Independent snapshot review found no reserve-coverage violation.

Production Wasm SHA-256 is `c607adf597dfbf898d8e442fd71b3b75e7032ad47fd808fb50e89e0573fd3ef8`, size 631,042 bytes, with no fault-only export. Exact native receiver balance changes, callback outcomes, UNKNOWN locks, failure/retry behaviour, concurrent finalisation, reserve isolation, deadline boundaries and bounded overflow/capacity behaviour are covered by the passing matrix. Machine evidence is under `project/artifacts/m03/p0-run/` and mirrored by `project/artifacts/implementation/verification.json`.

AC01-AC33 remain separate and unaccepted. Priority 2 is now active: structured evidence manifests, wallet reconciliation, independently controlled reviewer operations, provider integration within approved credits, and two complete case-to-settlement journeys. Testnet deployment, paid calls, production secrets and mainnet remain unauthorised. The October 28 implementation baseline is pre-event work. The F17 harness timeout correction and final P0 execution completed November 3 during the official competition window. UX3A geometry, The Bench naming, neutral avatars and the immutable reference remain preserved.

All older status sections below are preserved historical checkpoints; their global M02 blocker and active-next-task language are superseded by this notice.

## Current implementation checkpoint | CONTRA-2026-10-29-IMPL-M03-IN-PROGRESS

Real NEAR Sandbox execution is unblocked in WSL Ubuntu x86_64 with glibc 2.39 and hard open-file limit 1048576. Rust 1.98.0, the checksum-pinned NEAR Sandbox 2.13.4 binary, production Wasm and fault Wasm are verified. The 20 Rust SDK tests pass. Live Sandbox receipts now prove creation, consent, cancellation, exact funding, immutable terms, evidence-bound primary commit/reveal, callback-confirmed native payout with a beneficiary balance increase of exactly 1 NEAR, challenge blocking, and a decisive fresh review that reverses ACCEPT to REJECT and settles to the creator. A targeted fresh-review timeout test also passes and settles the original ACCEPT verdict to the beneficiary with `KEEP_PRIMARY`.

The first live run exposed a harness defect: block fast-forward was interpreted as seconds and overshot contractual deadlines. A second run exposed expired transaction hashes after very large block jumps. The corrected harness advances conservatively in bounded chunks and uses valid 610-second protocol intervals. Failure and passing logs are preserved under `project/artifacts/implementation/`. This checkpoint is not P0 completion: all 18 requested financial categories, multi-case conservation, callback split failures, concurrency, overflow, storage and gas measurements still require live coverage. AC01-AC33 remain unaccepted. No testnet deployment, paid provider use or secrets occurred.

## Current implementation checkpoint | CONTRA-2026-10-28-IMPL-M02

Actual implementation start: October 28, 2026 UTC, pre-event, explicitly owner-authorised. Branch implementation/oct28. M01 source saved at 5401cbfd4e0309cf9f15cd70ff246aaa419f75e8; final M02 commit is reported in the delivery. Historical date gates below no longer prevent development. UX3A reference is unchanged by this implementation branch; The Bench is the active name.

Implemented Rust escrow, registry, consent, evidence-bound commit/reveal, challenge/fresh-review and callback-safe intent/retry logic; API/evidence/authentication/cost ledger; approved-layout frontend workflows and gated wallet/provider adapters. Verification: 20 Rust SDK mocked-environment tests, 16 service/encoding tests, production/fault Wasm export separation and wallet bundle build. Fifteen measured 1200x900 rectangles equal the approved reference. Screenshots show truthful chain-unavailable mode, not a fabricated successful journey. See docs/IMPLEMENTATION_OCT28.md and project/artifacts/implementation/verification.json.

Financial milestone remains BLOCKED: stock NEAR Sandbox requires 65535 file descriptors; host hard limit is 16384. Authored Sandbox scenarios have not run. No real transfer, live independent AI contestation or external wallet journey is verified. AC01-AC33 are not fully accepted; I1-I10 have partial unit evidence only. No testnet deployment, paid calls, production secrets or mainnet actions. UNKNOWN payouts remain locked without retry; Meta $3/Baseten $3/Modal $5 caps unchanged. Owner acceptance remains pending. First next action is real Sandbox financial proof on a compatible host.

## Current implementation checkpoint | CONTRA-2026-10-28-IMPL-M01

Owner authorised implementation beginning October 28 UTC, superseding the earlier November 1 gate. Work branch: implementation/oct28, based on UX3C e57cc94 plus preserved naming commit e875a58. This is pre-event code and must not be claimed as competition-window implementation. UX3A remains frozen; active product name is The Bench.

Escrow/reviewer Rust source and production Wasm build exist. Fourteen Rust SDK mocked-environment tests pass; real Sandbox tests are BLOCKED by host hard file-descriptor limit 16384 versus Sandbox requirement 65535. No real transfer or callback recovery is verified. Unknown payout outcomes remain locked with no retry. See docs/IMPLEMENTATION_OCT28.md for limits and remaining acceptance work. Backend/frontend integration is in progress. Paid inference, testnet deployment and production secrets remain separately gated; budgets unchanged.

Earlier checkpoint sections below are historical and superseded where inconsistent with this authorisation.

## Current authoritative checkpoint | CONTRA-2026-10-28-UX3C

Date: 2026-10-28. Starting baseline plan/ux3b at af0dd97558f134ac9269c7fb58cc7613df6b8202. Current work branch: plan/ux3c. This notice supersedes earlier active NEXT and gap-status text, which remains historical below.

Completed: six authoritative v1 documents (ABI, state machine, committee policy, settlement recovery, commitments, threat model); exact public/private interfaces, JSON/Borsh types, deposits/gas assumptions, deterministic idempotency/events, six-operator 3+3 committee, creator-only unfunded cancel and beneficiary consent, normalized refund/payout lifecycle, single immutable payout intent and callback guards. G01-G07 RESOLVED at specification level with corresponding future acceptance tests. UX3A design and references remain frozen at bee5a74.

Substantive freeze decisions: original undecided review still uses creator-refund fallback; an inconclusive challenged fresh review retains the original decisive verdict to avoid profitable timeout challenges. The losing party may challenge once, within immutable deadlines. Permissioned creator allowlist limits sponsor-storage spam. Unknown payout outcome, including successful transfer with failed callback, stays locked pending with NO MVP recovery or retry. I7/I10 liveness is qualified accordingly; no second transfer is permitted while prior outcome is unknown.

Verification: AC01-AC33/I1-I10 traceability reviewed, method/type/state/deposit consistency and local document-link checks; 12 vote + challenge bundle + case/terms/payout fixtures (16 total) independently byte/hash checked with Node, Python and OpenSSL. These are documentation/serialization checks, NOT Rust, sandbox, browser-integration or smart-contract tests. All future acceptance tests remain NOT RUN.

Remaining execution gates: exact dependency/ABI compilation, worst-case storage/gas measurement, sandbox financial/race/callback-fault tests, separately controlled reviewer evidence, budget/credit verification and deployment/key-control authorisation. Known residual risks are in THREAT_MODEL_V1. No unresolved G01-G07 specification alternative remains; callback-unknown liveness is an explicit limitation, not a promised future fix.

Next: on/after November 1 UTC, author fresh contracts/contestation source and sandbox tests for create/accept/cancel/fund, accounting, payout intent, private callback and verified-failure retry. Prove I1/I2/I3/I10, including SR05 successful transfer + callback failure, before reviewer/service/frontend integration. No deployment, model calls, secrets, mainnet, actual transactions or spending. Meta $3/Baseten $3/Modal $5 caps unchanged.

## Preserved earlier checkpoints (superseded where inconsistent)


## Current authoritative checkpoint | UX3B

The owner approved and froze UX3A at bee5a7481d56c86d4c9860280b8367f82af0cb5a on 2026-10-28. Earlier pending/rejected visual statements below are historical, not the current owner verdict. UX3B delivers protocol workflow mapping and engineering acceptance criteria only. No UX3A source or visual asset was changed.

Deliverables: docs/UX3B_FUNCTIONAL_INTEGRATION_MAP.md and docs/UX3B_ENGINEERING_ACCEPTANCE.md. These map all dashboard controls and actions A01-A23 to conceptual contract methods, proposed APIs, roles, transaction states and failure recovery. AC01-AC33 specify future verification and are NOT RUN. G01-G07 record unresolved ABI/state/committee/recovery decisions explicitly.

Next: resolve and pin G01-G07, then begin fresh eligible-window engineering on or after November 1, 2026 UTC. Do not expand implementation at this checkpoint. Keep approved design/ux3a reference-only and separate from future apps/web and contracts/contestation source. No deployment, transactions, live service integration or provider spending occurred. Branch: plan/ux3b.

## Preserved prior checkpoint record



UX3A final correction: replaced sidebar library approximations with source-derived glyph assets and preserved the full spatial margin texture in a recoloured derivative. Recaptured and reviewed the final combined comparison. Internal visual QA passed after corrections; font rasterization remains an explicit P3 limitation. Owner acceptance remains pending.
Checkpoint ID: CONTRA-2026-10-28-UX3B
Date: 2026-10-28
Phase: Pre-hackathon functional integration specification
Owner acceptance: UX3A approved and frozen at bee5a7481d56c86d4c9860280b8367f82af0cb5a; UX3B planning delivered
Repository: Private `kellyxy110/CONTRA`, created and synchronized on `main`
Deployment: None
Onchain code: None
AI provider spend: None incurred by this package

## Repository baseline | 2026-10-28

- Remote: `https://github.com/kellyxy110/CONTRA`
- Visibility: Private
- Default branch: `main`
- Initial baseline commit: `351e90d73c93577f8798e45c2e8bb45bff3e082a`
- Deployment and repository secrets: None

## Visual direction update (v1.1)

- Owner approved specific dark cinematic graph-first source image as the exact target composition (D-015).
- NEAR mint, coral and amber will replace source status colours while respecting information hierarchy.
- Detailed mapping written in `docs/VISUAL_DIRECTION.md`; input screenshot embedded under `design/reference/`.
- Previous v1.0 screenshot/sidebar design is superseded for composition, without changing protocol logic.

## Completed in the previous blueprint checkpoint

- Product thesis and MVP boundaries documented.
- Single-contract, NEAR-testnet-first architecture specified.
- Case and settlement states, challenge path, and transfer recovery rules specified.
- Primary journey, navigation and responsive screen architecture specified.
- NEAR-aligned colour tokens written.
- Browser-only design reference built with simulated cases and clear disclaimers. This is not hackathon competition implementation and must not be represented as such.
- Benchmark scenario plan and measurement principles documented.
- Cost control policy and service responsibilities documented.
- Handoff, decision ledger and change log created.

## Quality checks

- Chromium and Playwright rendered the application at 1200 x 900, 768 x 1024 and 390 x 844.
- Desktop reference comparison and all three viewport screenshots are stored in `project/artifacts/ux2b/`.
- Node selection, inspector updates, search, evidence filtering, graph/list modes, zoom, fit, arrow-key list navigation, challenge-path selection and reduced-motion behaviour passed.
- No horizontal document overflow occurred at the tested widths. Inspector actions and the local case-question input remained reachable on tablet and mobile.
- Browser console and page error capture returned zero errors after adding an inline favicon.
- Playwright found one overlapping-control defect at desktop size. Bottom clearance was added between the inspector and assistant dock, then the complete suite passed.
- UX2C reran the same 22-check Playwright baseline after the visual recovery. All checks passed with zero console or page errors.

## Not completed

- No actual NEAR contract was implemented or tested.
- No AI provider integration or API calls were made.
- No independent security audit or external reviewers were engaged.
- No deployment, CI workflow, live demo or formal hackathon submission.
- No GenLayer head-to-head benchmark results.

## Risks

1. An onchain reviewer registry does not establish real operator independence.
2. Contestation depends on signed offchain AI findings and evidence integrity.
3. Transfer promises on NEAR need callback-aware failure recovery.
4. Token budgets and application-level cutoffs do not guarantee a provider-side hard billing cap.
5. Multiple simultaneous hackathon projects compete for the same engineering attention.

## Next checkpoint

Owner visual decision on CONTRA-2026-10-28-UX2C. If accepted, freeze the pre-event screen map and wait until November 1 UTC before beginning contract implementation.

## Resume rule

When resuming, read STATUS.md, DECISIONS.md, CHANGELOG.md, NEXT.md, then the relevant specification. Append changes to the log. Do not restart branding, naming, palette, architecture or cost allocation unless a new finding requires a documented decision revision.

## Latest handoff checkpoint | CONTRA-2026-10-27-VH1

- Versioned agent handoff package v1.2 prepared with all prior blueprint specifications.
- The original 1200 x 900 reference is present and checksum matches upload: `ab63545c28f2fa2644ed3fa7b06925260d7b83fe30125daf40b7db66446fe55a`.
- Source screenshot remains unmodified. It is a design reference, not a live screen.
- `HANDOFF_TO_CODING_AGENT.md` is the next agent entrypoint; `docs/VISUAL_INTEGRATION_SPEC.md` and `docs/DESIGN_REFERENCE_INTEGRITY.md` define new constraints.
- No visual rebuild, UI screenshot acceptance, code implementation, NEAR deployment, model usage or actual benchmark results claimed.
- Next checkpoint: CONTRA-2026-10-29-UX2 following interactive visual design review.

## Latest implementation checkpoint | CONTRA-2026-10-29-UX2A

- Replaced the legacy sidebar prototype with a graph-first Judgment Room using NEAR colours and local fixtures.
- Added selectable typed nodes, dynamic inspector data, graph and list modes, search, evidence filtering, zoom, fit, keyboard list navigation, reduced-motion handling and responsive layouts.
- Added truthful README badges for stage, network, blueprint, GitHub owner and deployment state.
- JavaScript syntax, reference checksum, em dash and generic-copy scans passed.
- Browser surfaces were unavailable, so rendered visual comparison, responsive screenshots and interaction acceptance remain unverified.
- No remote, commit, push, deployment, transaction, model call or provider spend occurred.

Repository safeguard: GitHub owner is `kellyxy110`. Remote name and URL remain unassigned. Do not create a remote, push, set secrets or deploy until repository details and timing are approved.

## Latest visual verification checkpoint | CONTRA-2026-10-28-UX2B

- Actual Chromium screenshots and a side-by-side desktop comparison were produced.
- The implementation preserves the reference anatomy: compact floating controls, left-root graph, curved links, highlighted evidence node, 66/34 graph-to-inspector balance, dark contextual rail and separate assistant dock.
- Honest divergence: the CONTRA graph has fewer leaf nodes and lower visual density than the source because it represents one evidence fixture without decorative records. Typography is larger for readability, and mobile uses a compact graph plus list fallback instead of shrinking the full desktop graph.
- Explicit owner acceptance has not been recorded.

## Latest visual recovery checkpoint | CONTRA-2026-10-28-UX2C

- Owner rejected UX2B for visual fidelity despite its passing functional checks.
- Rebuilt the desktop composition around the immutable reference geometry without changing the reference asset or using it as a page background.
- Root orb is anchored near x=120 and y=470. Semantic group centres sit near x=355. A compact property and evidence leaf column fans out near x=620 to x=640.
- Restored delicate luminous cubic branches, compact controls, restrained case metadata, cinematic negative space, a bounded analytics-style inspector and an independent assistant dock.
- Added only truthful subnodes derived from existing criteria, digests, validation limits, viewport fixture, review basis and settlement guard data.
- Fresh Chromium screenshots are stored in `project/artifacts/ux2c/`. Owner acceptance remains pending.


## Latest checkpoint | CONTRA-2026-10-28-UX3A

- Implemented separate HTML/CSS/JavaScript dashboard study at design/ux3a/index.html on branch design/ux3a.
- Source is the newly supplied 1200 x 900 dashboard, SHA-256 1d4b982d638e86829387c87bef61d7b121f59b1e87913d4606b73142e0e15480. It is distinct from the earlier graph image.
- Browser measured shell x=60, y=45, width=1080, height=810; sidebar=53; columns=255/472/299. Captured at a 1200 x 900 iframe viewport.
- Retained eight-sector radar, source avatar assets, four reviewer cards, three material cards, three task cards and three activity cards.
- Browser-verified search, chart/material tabs, pagination, challenge details and session-only counterexample note. No application console errors; browser extension metadata errors excluded explicitly.
- Fixed asset base paths, one radar radius, compact-card overflow, filtering pagination bounds and typography loading.
- Exact pixel identity is not claimed: icon glyphs and microtypographic rasterization remain approximations. Owner acceptance remains PENDING.
- Existing graph study and protocol files are preserved on the base branch. No deployment, NEAR transaction, smart contract or paid API work occurred. Spend $0.
- Next: owner reviews UX3A comparison and identifies any remaining fidelity corrections. Do not freeze acceptance on the owner's behalf.

# Checkpoint CONTRA-2026-11-12-FINAL-ENGINEERING-RELEASE

The accepted frontend, Cloudflare runtime, wallet preparation and release records reached `main` at `7b03ffbaff4abc424c9ddd4791415b8922acc7bb`. Worker version `8268ed63-d9bd-42f0-8ae0-236cbfda8e56` and Pages deployment `6d9e9ee5-84a1-4ac0-b133-e4073629c020` are live at `https://contra-near.pages.dev`. Same-origin API routing, Durable Object storage and fresh finalised NEAR Testnet observations passed public smoke tests. Financial signing and provider live execution remain disabled. AC31 and AC32 are DEFERRED pending six independent reviewers and genuine funded Testnet journeys.

