# Frontend integration contract

This document freezes the implemented integration surface for the later owner-provided frontend. It describes the current operational client and API without prescribing visual design. The machine-readable companion is [frontend-interface.json](frontend-interface.json).

## Trust boundary

The frontend is never an authority for contract state, reviewer eligibility, transaction finality or settlement. It may prepare an intent and display a signing request only after the server authorises the handoff. It must treat AI results as evidence-bound proposals. Only authenticated reviewer transactions can produce commitments or reveals, and only the contract can apply quorum, challenge and settlement rules.

The browser must preserve four distinct records:

1. Local interface state, including the selected view, case and unsent form input.
2. Durable service state, including sessions, immutable artifacts, evaluation jobs and transaction operations.
3. Observed NEAR state, including the network, contract, finality and block identity.
4. Contract authority, including case phase, committee, verdict, payout intent and callback result.

No local or service state may be presented as a confirmed onchain transition.

## Browser routes and accessible navigation

The operational client uses `#view=<view>&case=<case-id>`. Supported views are Overview, Cases, Challenges, Evidence, Reviewers, Settlement, Lab, Activity and Settings. An unknown view resolves to Overview. Case selection is retained when the view changes.

Opening a detail dialog adds browser history. Back closes the dialog before changing the selected workspace. After a dialog closes, focus returns to its invoking control. Workspace navigation moves focus to the new `h2`. Loading, unavailable, inaccessible, stale, pending, failed, unknown and confirmed states require text labels and may not rely on colour alone.

The future frontend may use a different client router, but it must preserve stable deep links to the selected view and case, browser Back behaviour, focus restoration, keyboard operation and the state distinctions in this contract.

## Authentication and account changes

NEP-413 authentication begins with `POST /api/session/challenge` and ends with `POST /api/session/verify`. The signed message binds the account, recipient, nonce and expiry. A session is account-scoped, expires durably and may be renewed or revoked.

On reload, call `GET /api/session` before enabling protected actions. On account switch, revoke or discard the prior browser session and reload protected case data for the new account. A `401` means reauthentication is required. A `403` means the authenticated account is not authorised for the requested resource or action. Neither response permits a fallback to another account's cached protected data.

## Contract reads and provenance

Use `POST /api/view` with `envelope: true` for public allowlisted contract reads. The returned `source` identifies the network, finality, block height, block hash, block timestamp and observation time. The interface must retain this envelope with the displayed value.

A stale or regressed observation cannot enable a write or confirm an operation. RPC unavailability must remain unavailable. Local Sandbox state, deterministic provider fixtures and testnet RPC results require explicit source labels. Fixture data must never appear as live provider or testnet evidence.

## External-wallet lifecycle

The stable browser progression is:

```text
PREPARED -> SIGNING -> PENDING -> CONFIRMED
                             -> FAILED
                 -> UNKNOWN
```

`POST /api/wallet/prepare` persists the exact signer, network, contract, method, arguments and deposit before any signing request exists. `POST /api/wallet/handoff` is disabled unless the server has separately authorised live signing. The client must persist the operation ID and account before invoking a wallet.

After a wallet returns a transaction hash, persist it through `POST /api/wallet/broadcast`, then use `POST /api/wallet/reconcile`. Reload recovery begins with `GET /api/operation`. A recovered hash may be attached to the original SIGNING or UNKNOWN operation. It must never create another intent or trigger redispatch.

CONFIRMED requires a matching, explicitly successful finalised receipt. FAILED requires an explicit final failure or a verifiable rejection before handoff. UNKNOWN means broadcast cannot be ruled out. UNKNOWN remains locked, is retained across reload and may be resolved only by recovering and reconciling the original transaction identity.

## Evidence, reviewers and providers

Evidence, findings, counterexamples, disclosures and recovery packages are immutable digest-addressed artifacts. Protected reads require case participation or the narrower reviewer role stated in the machine contract. The browser must not retain protected artifact bodies when the account changes.

`GET /api/availability` returns retrievability only for ordinary case evidence links. It excludes raw provider responses, provider proposals and Modal verification artifacts from the general digest map. Its `criterion_evaluations` are derived only from provider proposals owned by the authenticated account and mark `verified` only when that same account owns a valid Modal record bound to the proposal digest. Provider bodies remain available only through the narrower job-result route and its exact account and case checks.

An AI proposal displays provider, model, role, case, round, evidence digest, citations, limitations and proposal digest. Modal verification also displays the original proposal digest. Proposal and verification artifacts never create a reviewer commitment, reveal, verdict or settlement action.

Reviewer controls must show the appointed account, committee round, control disclosure and current contract phase. `/api/reviewer/workspace` rejects non-appointed case participants and returns only the caller's durable records for the selected round. A prepared recovery package is private to that reviewer account. The browser encrypts reveal material with a reviewer-held passphrase before persistence. The reveal nonce must not enter local storage, general logs, activity feeds or analytics.

## Error and recovery presentation

| Condition | Required interface response |
| --- | --- |
| Service is live but not ready | Keep the interface read-only and show the failing chain or storage dependency. |
| Session expired | Preserve non-sensitive local input, reauthenticate and refetch protected data. |
| RPC unavailable or stale | Show unavailable or stale. Do not infer the last displayed state is current. |
| Wallet rejected before handoff | Show failed and permit a new operation with a new operation ID. |
| Wallet interrupted after handoff | Show UNKNOWN and offer receipt recovery only. |
| Receipt pending | Show PENDING and poll observation without redispatch. |
| Receipt identity mismatch | Show UNKNOWN and block financial continuation. |
| Provider timeout after dispatch | Show charge unreconciled and do not issue a second paid request. |
| Artifact inaccessible | Distinguish access denial from missing or corrupt content. |
| Challenge open | Block ordinary settlement actions regardless of any AI proposal. |
| Payout callback unresolved | Show SettlementPending or UNKNOWN. Never show paid or refunded. |

All retry controls must name whether they repeat an observation, create a new intent or redispatch an external request. Observation retries are safe. Financial redispatch is forbidden while an outcome is unknown.

## Compatibility and change control

The route inventory is verified against literal API routes in `services/api/server.mjs`. Adding or removing an endpoint requires updating the machine contract and this document where behaviour changes. Existing onchain method names, commitment preimages, stored transaction identities and SQLite migration history are outside the frontend version and remain governed by the protocol compatibility documents.

This contract does not authorise deployment, live signing, funded transactions, paid inference or production secrets.
