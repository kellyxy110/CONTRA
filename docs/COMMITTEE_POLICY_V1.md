# CONTRA committee and operator policy v1

Freeze: CONTRA-2026-10-28-UX3C. Definitive G02/G06 decision; interfaces in [CONTRACT_ABI_V1.md](CONTRACT_ABI_V1.md), review timing/fallback in [STATE_MACHINE_V1.md](STATE_MACHINE_V1.md).

## Pilot trust model

Permissioned registry, administered by the immutable owner_id set on initialization. No permissionless staking, Sybil-proof identity, randomized jury, slashing or independent blockchain-validator claim. The administrator can admit/remove future reviewers and falsify independence attestations if compromised or dishonest. The contract checks account and operator-ID distinctness, not real-world identity. Administrative attestations and operator disclosures are evidence of declared control, not cryptographic proof of separate humans/entities.

Reviewer principal is an AccountId. Authentication is the immediate predecessor account for commit/reveal, not the model provider, JSON actor field, browser wallet label or signer behind an intermediary. A reviewer may use its own multisig contract; that AccountId is the member. Function-call access keys restricted to voting methods may be used, but are disclosed as account control and are not independent operators. Key rotation within an account does not change membership; changing reviewer AccountId requires a new registry revision and affects only future cases. No account recovery key is held by the evaluator gateway on behalf of all reviewers while claiming independent control.

## Admission and operator disclosure

Owner verifies an offchain disclosure manifest and calls set_reviewer. Manifest bytes hash to disclosure_digest; operator_id is a stable nonzero 32-byte pseudonymous identifier assigned by the administrator to one declared controlling entity. All accounts controlled by that entity MUST share the same operator_id. A change of model, cloud, key, role or account does not create a new operator identity.

The disclosure contains: schema/version; operator_id; reviewer_id; controlling entity/pseudonym; all known common-control/custody/delegation relationships; who can sign/manage keys; model/provider/version or human-review procedure; affiliation/conflicts including creator/beneficiary operators; attested_at; administrative verification method/limitations; source references or privacy-preserving hashes. Do not put personal identity documents, private contacts or secrets onchain. A reviewer acknowledges the same revision/digest by confirm_reviewer from its own account. Until confirmed it is ineligible.

set_reviewer is owner-only and requires one yocto; every effective update increments revision and resets confirmation. Identical repeated update is a no-op with existing revision (do not invalidate confirmation unnecessarily). confirm_reviewer on matching revision is idempotent. Reviewer does not get to pick or mutate its operator_id through confirm_reviewer. Owner deactivation affects new selection/funding but cannot remove votes, alter deadlines or replace a funded snapshot. Registry membership is not a certification of evidence accuracy.

TermsInput creator_operator_id and beneficiary_operator_id are both nonzero and distinct. Creator declares them, beneficiary's accept_terms acknowledges them, and admin reviewer disclosures must identify known conflicts. Contract excludes matching operator IDs and exact party accounts. Parties can lie about indirect common control; this remains an explicit risk. Reject independence claims when disclosure files are absent/unverified; the frontend may show only `declared operator`, not verified independence.

## Deterministic selection and funding freeze

1. Evaluate active AND confirmed registry records in ASCII lexicographic reviewer_id order, bounded to 32 entries.
2. Exclude creator_id, beneficiary_id, contract_account and records whose operator_id equals either declared party operator ID.
3. Keep the first record per distinct eligible operator_id until SIX distinct operators have been selected. Fewer than six -> E_COMMITTEE on preview/create/fund. No partial jury, downgraded quorum or automatic shared-operator substitution.
4. First three selected records are primary round 0; next three are reserve fresh round 1. Each committee size=3, threshold=2 matching valid reveals, at most one vote per reviewer per round. Operator disjointness is required across ALL SIX, stronger than account-only disjointness.
5. Both ordered arrays and their registry revision/disclosure hashes enter terms_digest. preview_case returns them; create_case recomputes current selection and rejects expected digest mismatch. No requester chooses or reorders a subset of the registry, and no outcome-dependent lottery is introduced.
6. Beneficiary accepts exact digest; at fund_case, every selected record must remain active/confirmed and match the snapshot revision/operator/digest. Newly admitted records that sort earlier do not change an existing draft snapshot: fund validates that stored snapshot only. Any selected revision change/deactivation makes that draft unfundable; cancel and re-create/re-accept explicitly.
7. After funding, never refresh eligibility from mutable registry for case votes. Use frozen snapshots, including fresh committee. Later deactivation/conflict disclosure may be displayed, but cannot disenfranchise or replace an existing committee or change the money policy. This avoids admin intervention in a losing round, while leaving compromised-member risk visible.

Selection is predictable and is not advertised as unbiased random sampling. A creator may time creation relative to registry updates; both parties see the exact six and must consent before funding. Cases do not reserve operator availability/capacity. Parallel jobs can exhaust reviewer capacity, which deadlines and fallback bound but do not solve. Six distinct IDs in sandbox controlled by one test operator MUST be labelled controlled fixtures, not independent pilot participants. A live independent-review claim is blocked until six separately controlled eligible operators and both-party disclosures are actually evidenced. If only one operator is available, run a controlled sandbox demonstration rather than secretly relaxing this policy.

## Round execution

Commitment binds chain, contract, case, terms digest, round 0/1, reviewer, round evidence, disposition, finding digest and nonce. See byte vectors. Round 0 round-evidence digest is the submitted manifest digest. Round 1 is the deterministic challenge bundle digest defined in commitment vectors, binding original manifest, counterexample, criterion, case and terms. Findings live offchain; every revealed finding_digest points to an immutable finding that names the same case/round/evidence/criterion citations. Contract authenticates the vote and hash consistency but does not call an oracle or verify semantic correctness/retrievability of those citations.

Each member may submit one commitment, one matching reveal. Identical duplicates return record, conflicting duplicates reject; no commit replacement after viewing another commitment. Count only matching authenticated valid reveals at round close. ACCEPT/REJECT with two valid matching votes is decisive; UNRESOLVED threshold or no decisive threshold is inconclusive under the state machine. No early close, threshold reduction, unregistered rescue reviewer, administrator-supplied AI verdict or client quorum override.

On timely challenge, use only the preselected fresh three. No new reviewer selection operation exists. Unavailable fresh reviewers remain missing votes; fixed fresh deadline and KEEP_PRIMARY_V1 policy apply. Missing primary reviewers -> BASE_REFUND_V1 after maximum unresolved deadline. Fresh inconclusiveness does not reward strategic creator challenges with refunds. A single challenge can still delay payment; absence of token/bond does not claim economic deterrence.

## Required committee tests (not executed)

CM01: Unauthorized set_reviewer/other-account confirmation, old revision, mismatched digest and unconfirmed member all reject (AC04/12/14/29).
CM02: Registry same-update no-op; changed revision resets confirmation; active/confirmed selection is deterministic under insertion order permutations; at most 32 scanned (AC05/14).
CM03: Five eligible distinct operators -> no funding; six accounts with one common operator -> no funding; parties/contract/party operators excluded; six valid -> exactly 3+3, threshold 2 (AC07/14).
CM04: Fresh committee accounts AND operator IDs are disjoint from primary; requester cannot supply or reorder members (AC14/17).
CM05: Deactivation/change before funding rejects stale draft; admission of unrelated reviewer does not mutate its stored snapshot; change after funding cannot alter eligibility or quorum for that case (AC07/14/17).
CM06: Unknown caller cannot vote as a frozen reviewer; signer belonging to reviewer but predecessor different rejects; authenticated intermediary AccountId works only if that ID is frozen member (AC12/13/29).
CM07: No primary quorum and no fresh quorum follow DIFFERENT frozen fallback rules, with no automatic member replacement or extensions (AC13/14/17/18).
CM08: UI shows operator ownership/uncertainty and controlled fixture disclosures; account multiplicity/model diversity never auto-labels independent/decentralized (AC10/14/26).
