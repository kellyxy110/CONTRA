import { canonical, sha256 } from "../api/store.mjs";

const ACCOUNT = /^(?=.{2,64}$)[a-z0-9]+(?:[._-][a-z0-9]+)*\.testnet$/;
const HASH = /^[a-f0-9]{64}$/;
const CHAIN_HASH = /^[1-9A-HJ-NP-Za-km-z]{32,64}$/;
const YOCTO = 10n ** 24n;

function fail(message) {
  throw Error(message);
}
function account(value, name) {
  if (!ACCOUNT.test(value || "")) fail(`${name} must be a Testnet account`);
  return value;
}
function hash(value, name) {
  if (!HASH.test(value || ""))
    fail(`${name} must be a lowercase SHA-256 digest`);
  return value;
}
function amount(value, name) {
  if (!/^\d+$/.test(value || ""))
    fail(`${name} must be an unsigned yoctoNEAR integer`);
  return BigInt(value);
}

function expectedIntents(input, principal) {
  const primary = input.committees.primary.map((value) => value.reviewer_id),
    fresh = input.committees.fresh.map((value) => value.reviewer_id);
  const intents = [
    { method: "create_case", signer_id: input.creator_id, deposit_yocto: "1" },
    {
      method: "accept_terms",
      signer_id: input.beneficiary_id,
      deposit_yocto: "1",
    },
    {
      method: "fund_case",
      signer_id: input.creator_id,
      deposit_yocto: String(principal),
    },
    {
      method: "submit_evidence",
      signer_id: input.beneficiary_id,
      deposit_yocto: "1",
    },
    ...primary.map((signer_id) => ({
      method: "commit_vote",
      signer_id,
      deposit_yocto: "0",
      round_id: 0,
    })),
    ...primary.map((signer_id) => ({
      method: "reveal_vote",
      signer_id,
      deposit_yocto: "0",
      round_id: 0,
    })),
  ];
  if (input.journey === "challenged")
    intents.push(
      {
        method: "file_challenge",
        signer_id: input.creator_id,
        deposit_yocto: "1",
      },
      ...fresh.map((signer_id) => ({
        method: "commit_vote",
        signer_id,
        deposit_yocto: "0",
        round_id: 1,
      })),
      ...fresh.map((signer_id) => ({
        method: "reveal_vote",
        signer_id,
        deposit_yocto: "0",
        round_id: 1,
      })),
    );
  intents.push({
    method: "finalize_case",
    signer_id: input.creator_id,
    deposit_yocto: "0",
  });
  return intents;
}

export function operationIdentity(packet, step, index) {
  return sha256(
    canonical({
      schema: "CONTRA_TESTNET_OPERATION_ID_V1",
      packet_digest: packet.packet_digest,
      index,
      method: step.method,
      signer_id: step.signer_id,
      receiver_id: packet.contract_account,
      args_digest: sha256(canonical(step.args)),
      deposit_yocto: step.deposit_yocto,
    }),
  );
}

export function buildLiveJourneyPacket(input) {
  if (!["unchallenged", "challenged"].includes(input?.journey))
    fail("Journey must be unchallenged or challenged");
  if (input.network !== "testnet") fail("Live journey network must be testnet");
  const contract = account(input.contract_account, "contract_account"),
    creator = account(input.creator_id, "creator_id"),
    beneficiary = account(input.beneficiary_id, "beneficiary_id");
  if (new Set([contract, creator, beneficiary]).size !== 3)
    fail("Contract, creator and beneficiary must be distinct");
  if (!CHAIN_HASH.test(input.contract_code_hash || ""))
    fail("contract_code_hash must be a NEAR base58 hash");
  hash(input.terms_digest, "terms_digest");
  hash(input.evidence_manifest_digest, "evidence_manifest_digest");
  if (input.journey === "challenged")
    hash(input.counterexample_digest, "counterexample_digest");
  const primary = input.committees?.primary || [],
    fresh = input.committees?.fresh || [],
    reviewers = [...primary, ...fresh];
  if (primary.length !== 3 || fresh.length !== 3)
    fail("Exactly three primary and three fresh reviewers are required");
  const accounts = new Set(),
    operators = new Set();
  for (const [index, reviewer] of reviewers.entries()) {
    account(reviewer.reviewer_id, `reviewer ${index + 1}`);
    hash(reviewer.operator_id, `reviewer ${index + 1} operator_id`);
    hash(reviewer.consent_digest, `reviewer ${index + 1} consent_digest`);
    hash(reviewer.disclosure_digest, `reviewer ${index + 1} disclosure_digest`);
    if (reviewer.control_signature_verified !== true)
      fail(`reviewer ${index + 1} control signature is not verified`);
    if (
      accounts.has(reviewer.reviewer_id) ||
      operators.has(reviewer.operator_id)
    )
      fail(
        "Reviewer account and operator control must be distinct across committees",
      );
    accounts.add(reviewer.reviewer_id);
    operators.add(reviewer.operator_id);
  }
  if (accounts.has(creator) || accounts.has(beneficiary))
    fail("A party cannot serve as a reviewer");
  const deadlines = input.deadlines || {},
    ordered = [
      "fund_by_ns",
      "submit_by_ns",
      "primary_commit_end_ns",
      "primary_reveal_end_ns",
      "challenge_end_ns",
      "fresh_commit_end_ns",
      "fresh_reveal_end_ns",
    ].map((name) => amount(deadlines[name], name));
  for (let index = 1; index < ordered.length; index++)
    if (ordered[index] <= ordered[index - 1])
      fail("Contract deadlines must be strictly increasing");
  const principal = amount(input.amount_yocto, "amount_yocto"),
    perTransaction = amount(
      input.limits?.maximum_attached_deposit_yocto,
      "maximum_attached_deposit_yocto",
    ),
    journeyLimit = amount(
      input.limits?.maximum_journey_expenditure_yocto,
      "maximum_journey_expenditure_yocto",
    );
  if (
    principal <= 0n ||
    principal > perTransaction ||
    perTransaction > YOCTO ||
    journeyLimit > 2n * YOCTO
  )
    fail("Journey financial limits exceed the approved proposal envelope");
  if (
    input.financial_authorisation?.approved !== true ||
    !HASH.test(input.financial_authorisation?.approval_digest || "")
  )
    fail("Digest-bound owner financial authorisation is required");
  const expected = expectedIntents(input, principal),
    steps = input.transaction_intents || [];
  if (steps.length !== expected.length)
    fail("Transaction intent sequence does not match the journey");
  for (const [index, step] of steps.entries()) {
    const required = expected[index];
    account(step.signer_id, `transaction ${index + 1} signer`);
    amount(step.deposit_yocto, `transaction ${index + 1} deposit`);
    if (
      step.method !== required.method ||
      step.signer_id !== required.signer_id ||
      step.deposit_yocto !== required.deposit_yocto
    )
      fail(
        `Transaction ${index + 1} does not match its frozen method, signer and deposit`,
      );
    if (
      required.round_id !== undefined &&
      step.args?.round_id !== required.round_id
    )
      fail(`Transaction ${index + 1} has the wrong review round`);
    if (BigInt(step.deposit_yocto) > perTransaction)
      fail("Transaction deposit exceeds the packet limit");
  }
  const base = {
    schema: "CONTRA_LIVE_CONTESTATION_PACKET_V1",
    journey: input.journey,
    network: "testnet",
    contract_account: contract,
    contract_code_hash: input.contract_code_hash,
    creator_id: creator,
    beneficiary_id: beneficiary,
    committees: { primary, fresh },
    terms_digest: input.terms_digest,
    evidence_manifest_digest: input.evidence_manifest_digest,
    counterexample_digest:
      input.journey === "challenged" ? input.counterexample_digest : null,
    amount_yocto: input.amount_yocto,
    deadlines,
    expected_transitions: input.expected_transitions,
    limits: input.limits,
    recovery: {
      unknown:
        "Reconcile the original transaction hash and contract state. Never redispatch.",
      rollback:
        "Onchain state is immutable. Stop subsequent writes after any UNKNOWN outcome.",
    },
    financial_authorisation: input.financial_authorisation,
    transaction_intents: steps,
  };
  const packet = { ...base, packet_digest: sha256(canonical(base)) };
  packet.transaction_intents = steps.map((step, index) => ({
    ...step,
    operation_id: operationIdentity(packet, step, index),
  }));
  return packet;
}

export function assessLiveJourneyDraft(input) {
  const missing = [];
  if ((input?.committees?.primary || []).length !== 3)
    missing.push("three primary reviewer identities and attestations");
  if ((input?.committees?.fresh || []).length !== 3)
    missing.push("three fresh reviewer identities and attestations");
  if (!HASH.test(input?.evidence_manifest_digest || ""))
    missing.push("immutable evidence manifest digest");
  if (
    input?.journey === "challenged" &&
    !HASH.test(input?.counterexample_digest || "")
  )
    missing.push("immutable counterexample digest");
  if (input?.financial_authorisation?.approved !== true)
    missing.push("digest-bound owner financial authorisation");
  return {
    ready: false,
    executable: false,
    missing,
    notice:
      "This draft is not a transaction authority and cannot be signed or broadcast.",
  };
}
