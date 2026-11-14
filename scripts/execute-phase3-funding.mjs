import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { Account } from "@near-js/accounts";
import { KeyPair } from "@near-js/crypto";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { nep413Bytes } from "../services/api/auth.mjs";

const origin = process.env.CONTRA_PUBLIC_ORIGIN || "https://contra-near.pages.dev";
const authority = JSON.parse(await readFile(new URL("../project/artifacts/phase3/fund-case-authority-request-2026-11-14.json", import.meta.url)));
const approved = "6f9df04b47fd48c0a9e00e042219b171d9d82b10cbacf29f74e2e25c33d70358";
const publicKey = "ed25519:61VyeNdx9dTGwvQB6QFW8ZjNDejkXwP7qFhqGx6iz1AZ";
if (authority.authority_digest !== approved || !authority.owner_approval) throw Error("Funding authority is not approved");
if (Date.now() >= Date.parse(authority.expires_at)) throw Error("Funding authority expired");
if (authority.method !== "fund_case" || authority.attached_deposit_yocto !== "100000000000000000000000") throw Error("Authority is not the exact 0.1 Testnet NEAR funding operation");

let secret = "";
for await (const chunk of process.stdin) secret += chunk;
secret = secret.trim();
if (secret.startsWith("{")) {
  const parsed = JSON.parse(secret);
  secret = parsed.private_key || parsed.secret_key || parsed.secretKey || parsed.privateKey || "";
}
const keyPair = KeyPair.fromString(secret);
secret = "";
if (keyPair.getPublicKey().toString() !== publicKey) throw Error("Creator credential does not match the authorised public key");

async function api(path, { token, body } = {}) {
  const response = await fetch(`${origin}/api/${path}`, {
    method: body ? "POST" : "GET",
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const value = await response.json();
  if (!response.ok) throw Error(value.error || `HTTP ${response.status}`);
  return value;
}

const challenge = await api("session/challenge", { body: { account: authority.signer_id } });
const authDigest = createHash("sha256").update(nep413Bytes(challenge)).digest();
const signature = Buffer.from(keyPair.sign(authDigest).signature).toString("base64");
const session = await api("session/verify", { body: { accountId: authority.signer_id, publicKey, signature, challenge_id: challenge.id } });

try {
  const before = await api("view", { token: session.token, body: { method: "get_case", args: { case_id: authority.case_id } } });
  if (before?.state !== "Draft" || before?.beneficiary_accepted !== true || before?.funded_principal_yocto !== "0") throw Error("Final preflight found the case is not an accepted, unfunded draft");
  const handoff = await api("wallet/handoff", { token: session.token, body: { operation_id: authority.operation_id } });
  const request = handoff.signing_request;
  const transaction = request?.transaction;
  const action = transaction?.actions?.[0]?.params;
  if (!request || request.operation_id !== authority.operation_id || transaction?.signerId !== authority.signer_id || transaction?.receiverId !== authority.receiver_id || transaction?.actions?.length !== 1 || action?.methodName !== "fund_case" || action?.deposit !== authority.attached_deposit_yocto || action?.args?.case_id !== authority.case_id || action?.args?.terms_digest !== authority.terms_digest) throw Error("Released signing request does not match the approved funding operation");

  const provider = new JsonRpcProvider({ url: "https://test.rpc.fastnear.com" });
  const account = new Account(authority.signer_id, provider, new KeyPairSigner(keyPair));
  let outcome;
  try {
    outcome = await account.callFunctionRaw({ contractId: authority.receiver_id, methodName: action.methodName, args: action.args, gas: BigInt(action.gas), deposit: BigInt(action.deposit), waitUntil: "FINAL" });
  } catch (error) {
    await api("wallet/interrupt", { token: session.token, body: { operation_id: authority.operation_id, reason: "Signing or broadcast outcome is uncertain" } }).catch(() => {});
    throw Error(`UNKNOWN after signing handoff. Do not redispatch. ${error?.message || error}`);
  }
  const txHash = outcome?.transaction?.hash;
  if (!txHash) throw Error("Final response omitted the transaction hash");
  await api("wallet/broadcast", { token: session.token, body: { operation_id: authority.operation_id, tx_hash: txHash } });
  const reconciled = await api("wallet/reconcile", { token: session.token, body: { operation_id: authority.operation_id } });
  const after = await provider.callFunction(authority.receiver_id, "get_case", { case_id: authority.case_id }, { finality: "final" });
  if (reconciled.status !== "CONFIRMED" || after?.state !== "Funded" || after?.funded_principal_yocto !== authority.attached_deposit_yocto || after?.beneficiary_accepted !== true) throw Error("Final Worker or contract state does not match the approved funding operation");
  process.stdout.write(`${JSON.stringify({ authority_digest: approved, operation_id: authority.operation_id, payload_hash: authority.payload_hash, transaction_hash: txHash, status: reconciled.status, case_id: after.case_id, state: after.state, funded_principal_yocto: after.funded_principal_yocto, revision: after.revision, transaction_block_hash: outcome?.transaction_outcome?.block_hash, tokens_burnt_yocto: outcome?.transaction_outcome?.outcome?.tokens_burnt }, null, 2)}\n`);
} finally {
  await api("session/disconnect", { token: session.token, body: {} }).catch(() => {});
}
