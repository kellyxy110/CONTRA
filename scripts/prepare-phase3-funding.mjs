import { createHash } from "node:crypto";
import { KeyPair } from "@near-js/crypto";
import { nep413Bytes } from "../services/api/auth.mjs";

const origin = process.env.CONTRA_PUBLIC_ORIGIN || "https://contra-near.pages.dev";
const account = "contra-creator.testnet";
const publicKey = "ed25519:61VyeNdx9dTGwvQB6QFW8ZjNDejkXwP7qFhqGx6iz1AZ";
const operationId = "contra-fund_case-e6bb304c52aeb9b0251b052c";
const call = {
  method: "fund_case",
  receiverId: "contra-contestation.testnet",
  deposit: "100000000000000000000000",
  args: {
    case_id: "e6bb304c52aeb9b0251b052c05c8796913e7246280a3300dd7b8badc6ada7278",
    terms_digest: "996ca53f26baffb90eeb474cef355a41ede1d24ce927248de7c03f30ad278000",
  },
};

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
  body: { accountId: account, publicKey, signature, challenge_id: challenge.id },
});
try {
  const caseRecord = await api("view", {
    token: session.token,
    body: { method: "get_case", args: { case_id: call.args.case_id } },
  });
  if (caseRecord?.state !== "Draft" || caseRecord?.beneficiary_accepted !== true || caseRecord?.funded_principal_yocto !== "0")
    throw Error("Case is not an accepted, unfunded draft");
  const prepared = await api("wallet/prepare", {
    token: session.token,
    body: { operation_id: operationId, call },
  });
  process.stdout.write(`${JSON.stringify({
    operation_id: prepared.operation.operation_id,
    status: prepared.operation.status,
    payload_hash: prepared.operation.payload_hash,
    account: prepared.operation.account,
    live_signing_authorized: prepared.live_signing_authorized,
    signing_request_released: prepared.signing_request !== null,
  }, null, 2)}\n`);
} finally {
  await api("session/disconnect", { token: session.token, body: {} }).catch(() => {});
}
