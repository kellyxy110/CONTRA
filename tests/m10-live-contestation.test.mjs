import test from "node:test";
import assert from "node:assert/strict";
import {
  buildLiveJourneyPacket,
  assessLiveJourneyDraft,
} from "../services/operations/live-contestation.mjs";
import { sha256 } from "../services/api/store.mjs";

const h = (value) => sha256(value),
  accounts = ["one", "two", "three", "four", "five", "six"].map(
    (value) => `${value}.testnet`,
  );
const committee = (offset, kind) =>
  accounts
    .slice(offset, offset + 3)
    .map((reviewer_id, index) => ({
      reviewer_id,
      operator_id: h(`${kind}-operator-${index}`),
      consent_digest: h(`${kind}-consent-${index}`),
      disclosure_digest: h(`${kind}-disclosure-${index}`),
      control_signature_verified: true,
    }));
const deadlines = Object.fromEntries(
  [
    "fund_by_ns",
    "submit_by_ns",
    "primary_commit_end_ns",
    "primary_reveal_end_ns",
    "challenge_end_ns",
    "fresh_commit_end_ns",
    "fresh_reveal_end_ns",
  ].map((name, index) => [
    name,
    String(1800000000000000000n + BigInt(index) * 1000000000n),
  ]),
);
function intents(journey) {
  const primary = accounts.slice(0, 3),
    fresh = accounts.slice(3);
  const values = [
    {
      method: "create_case",
      signer_id: "contra-creator.testnet",
      deposit_yocto: "1",
    },
    {
      method: "accept_terms",
      signer_id: "contra-beneficiary.testnet",
      deposit_yocto: "1",
    },
    {
      method: "fund_case",
      signer_id: "contra-creator.testnet",
      deposit_yocto: "100000000000000000000000",
    },
    {
      method: "submit_evidence",
      signer_id: "contra-beneficiary.testnet",
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
  if (journey === "challenged")
    values.push(
      {
        method: "file_challenge",
        signer_id: "contra-creator.testnet",
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
  values.push({
    method: "finalize_case",
    signer_id: "contra-creator.testnet",
    deposit_yocto: "0",
  });
  return values.map((value, index) => ({
    ...value,
    args: {
      sequence: index,
      ...(value.round_id === undefined ? {} : { round_id: value.round_id }),
    },
  }));
}
function packet(journey = "unchallenged") {
  const input = {
    journey,
    network: "testnet",
    contract_account: "contra-contestation.testnet",
    contract_code_hash: "EtUc3f99vfTwVoRJfS9MNCirxpQ5KpNFNen7XZUD7LA2",
    creator_id: "contra-creator.testnet",
    beneficiary_id: "contra-beneficiary.testnet",
    committees: {
      primary: committee(0, "primary"),
      fresh: committee(3, "fresh"),
    },
    terms_digest: h(`${journey}-terms`),
    evidence_manifest_digest: h(`${journey}-evidence`),
    counterexample_digest:
      journey === "challenged" ? h("counterexample") : null,
    amount_yocto: "100000000000000000000000",
    deadlines,
    expected_transitions: [],
    limits: {
      maximum_attached_deposit_yocto: "1000000000000000000000000",
      maximum_journey_expenditure_yocto: "2000000000000000000000000",
    },
    financial_authorisation: {
      approved: true,
      approval_digest: h("owner approval"),
    },
    transaction_intents: intents(journey),
  };
  return input;
}

test("live packets freeze six distinct operators, exact limits and stable operation identities", () => {
  for (const journey of ["unchallenged", "challenged"]) {
    const built = buildLiveJourneyPacket(packet(journey)),
      again = buildLiveJourneyPacket(packet(journey));
    assert.match(built.packet_digest, /^[a-f0-9]{64}$/);
    assert.deepEqual(built, again);
    assert.equal(
      new Set(built.transaction_intents.map((value) => value.operation_id))
        .size,
      built.transaction_intents.length,
    );
    assert.match(built.recovery.unknown, /Never redispatch/);
  }
});
test("live packet rejects reused operators, excessive deposits and absent authority", () => {
  const reused = packet();
  reused.committees.fresh[0].operator_id =
    reused.committees.primary[0].operator_id;
  assert.throws(() => buildLiveJourneyPacket(reused), /distinct/);
  const excessive = packet();
  excessive.amount_yocto = "1000000000000000000000001";
  assert.throws(() => buildLiveJourneyPacket(excessive), /limits/);
  const unauthorized = packet();
  unauthorized.financial_authorisation.approved = false;
  assert.throws(() => buildLiveJourneyPacket(unauthorized), /authorisation/);
});
test("live packet rejects a party signing for a reviewer and any changed financial attachment", () => {
  const wrongSigner = packet();
  wrongSigner.transaction_intents[4].signer_id = "contra-creator.testnet";
  assert.throws(
    () => buildLiveJourneyPacket(wrongSigner),
    /frozen method, signer and deposit/,
  );
  const changedDeposit = packet();
  changedDeposit.transaction_intents[0].deposit_yocto = "0";
  assert.throws(
    () => buildLiveJourneyPacket(changedDeposit),
    /frozen method, signer and deposit/,
  );
  const wrongRound = packet("challenged");
  wrongRound.transaction_intents[11].args.round_id = 0;
  assert.throws(() => buildLiveJourneyPacket(wrongRound), /wrong review round/);
});
test("incomplete external inputs remain an explicit non-executable draft", () => {
  const status = assessLiveJourneyDraft({
    journey: "challenged",
    committees: { primary: [], fresh: [] },
    financial_authorisation: { approved: false },
  });
  assert.equal(status.ready, false);
  assert.equal(status.executable, false);
  assert.equal(status.missing.length, 5);
});
