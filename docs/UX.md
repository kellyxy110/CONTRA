# CONTRA UX architecture and Judgment Room

Status: Initial design, pending owner acceptance

## Information architecture

- Overview: active and completed cases, risk at a glance, quick creation.
- Cases: searchable cases; case creation and funding wizard.
- Judgment Room: evidence-bound decision inspection and event timeline.
- Challenge Arena: counterexample creation, dispute review and response.
- CONTRA Lab: methodology, baseline comparisons, measured trials and failures.

## Creation flow

Start > Connect NEAR testnet wallet > Name agreement > Define claimant and payout account > Add binary acceptance requirements > Choose evidence manifest format > Choose review duration and escalation windows > Show unresolved refund default > Review and freeze > Fund escrow > Confirmation with actual transaction receipt.

Every money-moving action shows receiver, amount, network, escrow terms and fees before signature. Errors return the user to a safe editable step before funding, never to an ambiguous success state.

## Judgment Room screen anatomy

Desktop:

```text
+---------------------------------------------------------------------------------------+
| Sidebar        | Case breadcrumb / Testnet / wallet                                   |
|                +---------------------------------------------------------------------+
| Overview       | CASE 0042  Accessible web delivery      [PROVISIONAL]    5.00 NEAR  |
| Cases          | Required checks / immutable rules / review deadline                  |
| Judgment Room  +----------------------------------------------+----------------------+
| Challenge      | Primary findings                              | Settlement control   |
| Lab            |-----------------------------------------------|----------------------|
|                | Reviewers: proposer, independent, challenger | Locked escrow        |
|                | Evidence and counterexample card             | Timeline and actions |
|                | Tabs: Evidence / Review history / Events     | Transaction links    |
+---------------------------------------------------------------------------------------+
```

Mobile: sidebar becomes top navigation; status and escrow amount remain visible above findings. Evidence, reviews and timeline become horizontally scrollable tabs with keyboard focus support.

## Core interactions

- Select Evidence / Reviewers / Timeline tab to inspect a distinct source of information.
- Expand evidence detail to see source URI, digest, method and limitations.
- Click 'Raise challenge' to see required counterexample fields and the resulting procedural lock.
- Simulate an expired review to see the unresolved fallback.
- Inspect payout destination, promise status and final receipt in working product.
- No claim of onchain verification is shown without a real transaction.

## Status language

- Draft: no deposited funds.
- Funded: funds locked, evidence pending.
- Reviewing: quorum or reveal window not closed.
- Provisional: candidate finding with live challenge window.
- Challenged: adjudication paused for counterexample review.
- Unresolved: insufficient reliable decision; predetermined policy applies.
- Settlement pending: contract issued payout, callback not yet verified.
- Settled: chain confirms payout callback succeeded.
- Transfer failed: payout remains recoverable; no success claim.

## Color semantics

- Mint #00EC97: main interaction, completed settlement or reviewer verified by deterministic checks.
- Obsidian #0B1110: principal background.
- Slate #16221D: surfaces and panel sections.
- White #F5F7F5: text.
- Coral #FF8678: contested evidence and challenges.
- Amber #F4BD68: pending or unresolved.
- Blue: in-progress review only; never used to imply trust.

No meaning by color alone. Icons and text labels required. Keyboard visible focus, minimum text contrast, reduced motion mode and responsive layout required.

## Data contract for frontend

- `case`: id, title, status, chain id, owner, beneficiary, escrow in yoctoNEAR, requirements hash, evidence digest, dates.
- `rounds`: id, appointed reviewers, commitments, revealed dispositions, evidence references, deadline and result.
- `challenge`: challenger, counterexample digest, challenged criterion, date, review result.
- `payout`: intent, receiver, amount, promise status, attempt number and receipts.
- `events`: timestamp, actor, event type, source transaction hash, integrity state.

## UI edge states

Wallet disconnected, wrong chain, funding pending, funding failed, evidence unavailable, missing hash, evaluator offline, reveal expired, quorum failed, challenge deadline reached, duplicate challenge, unauthorized challenge, unresolved by rule, settlement callback delayed, transfer failed, offline data refresh, partial page load.

## Prototype scope

`design/judgment-room.html` is an interactive design study powered by local illustrative fixtures. It is NOT competition implementation. Rebuild product code after November 1. It simulates challenge, review and final settlement states without ever calling a blockchain or inference API. Static checks passed, but browser interaction verification remains pending due to environment policy.

## Visual direction supersession, v1.1

The owner selected a user-provided dark graph-first interface as the **exact composition reference**. The previous boxed/sidebar wireframe above is historical v1.0 context, not the target visual. Implement the map in `docs/VISUAL_DIRECTION.md`. The protocol semantics and edge cases in this document remain authoritative.
