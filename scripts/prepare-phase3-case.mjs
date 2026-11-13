import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { KeyPair } from "@near-js/crypto";
import { nep413Bytes } from "../services/api/auth.mjs";

const origin = process.env.CONTRA_PUBLIC_ORIGIN || "https://contra-near.pages.dev";
const account = "contra-creator.testnet";
const publicKey = "ed25519:61VyeNdx9dTGwvQB6QFW8ZjNDejkXwP7qFhqGx6iz1AZ";
const proposal = JSON.parse(
  await readFile(
    new URL(
      "../project/artifacts/phase3/unchallenged-case-preview-2026-11-13.json",
      import.meta.url,
    ),
  ),
);

if (proposal.executable !== false || proposal.financial_authorisation !== null)
  throw Error("The proposal must remain non-executable before preparation");
if (proposal.creator_id !== account)
  throw Error("The proposal creator does not match the approved creator");
if (proposal.preview?.terms_digest !== "996ca53f26baffb90eeb474cef355a41ede1d24ce927248de7c03f30ad278000")
  throw Error("The proposal terms digest changed");

let secret = "";
for await (const chunk of process.stdin) secret += chunk;
secret = secret.trim();
if (secret.startsWith("{")) {
  const parsed = JSON.parse(secret);
  secret = parsed.private_key || parsed.secret_key || parsed.secretKey || parsed.privateKey || "";
}
const keyPair = KeyPair.fromString(secret);
secret = "";
if (keyPair.getPublicKey().toString() !== publicKey)
  throw Error("Creator credential does not match the approved public key");

async function api(path, { token, body } = {}) {
  const response = await fetch(`${origin}/api/${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const value = await response.json();
  if (!response.ok) throw Error(value.error || `HTTP ${response.status}`);
  return value;
}

const challenge = await api("session/challenge", { body: { account } });
const digest = createHash("sha256").update(nep413Bytes(challenge)).digest();
const signature = Buffer.from(keyPair.sign(digest).signature).toString("base64");
const session = await api("session/verify", {
  body: {
    accountId: account,
    publicKey,
    signature,
    challenge_id: challenge.id,
  },
});

try {
  const prepared = await api("wallet/prepare", {
    token: session.token,
    body: {
      operation_id: `phase3-create-${proposal.preview.case_id.slice(0, 16)}`,
      call: {
        method: "create_case",
        receiverId: proposal.contract_account,
        deposit: "1",
        args: {
          request_id: proposal.request_id,
          terms: proposal.terms,
          expected_terms_digest: proposal.preview.terms_digest,
        },
      },
    },
  });
  const operation = prepared.operation;
  process.stdout.write(
    `${JSON.stringify(
      {
        operation_id: operation.operation_id,
        status: operation.status,
        account: operation.account,
        contract_account: operation.contract_account,
        payload_hash: operation.payload_hash,
        handoff_required: prepared.handoff_required,
        live_signing_authorized: prepared.live_signing_authorized,
        signing_request_released: prepared.signing_request !== null,
      },
      null,
      2,
    )}\n`,
  );
} finally {
  await api("session/disconnect", { token: session.token, body: {} }).catch(() => {});
}
