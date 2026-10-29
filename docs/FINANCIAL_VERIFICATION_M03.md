# M03 financial verification handoff

Checkpoint: CONTRA-2026-10-29-IMPL-M03. Resume baseline: c0800c816e55ffa61a03b1f1876de3a82fde960f, implementation/oct28. Actual implementation began October 28; these changes are also pre-event work. Governing financial behavior remains the frozen UX3C ABI/state/recovery specifications. No production financial method or recovery policy was changed.

## Current evidence and host distinction

The successful compatible WSL runs recorded at c0800c8 supersede the old M02 claim that real Sandbox execution is globally blocked. Preserve those logs. This session is a different Linux host with glibc 2.39 but a hard open-file limit of 16384. Stock NEAR Sandbox requires 65535. The full corrected suite rerun was attempted and stopped at preflight; no new Sandbox transaction was executed in this session. No measured gas, storage growth or account balance delta is invented.

Current results: 28 default Rust SDK tests pass; the same 28 pass with sandbox-faults enabled. Nineteen service/report tests pass. Production and fault Wasm compile with Rust 1.98.0; default exports exclude all four fault hooks. The wallet bundle builds without network/provider usage. These are build/unit results, not financial Sandbox passes. Machine report: project/artifacts/implementation/verification.json, with run-specific files under project/artifacts/m03/p0-run. p0_complete=false; all eighteen current-run categories are BLOCKED. AC01-AC33 acceptance remains separate and unaccepted.

## Reproducible execution

On the existing compatible WSL Ubuntu x86_64 host with the pinned Sandbox binary installed:

```sh
npm ci
npm run test:p0
```

The runner performs SDK/service checks, compiles both Wasm artifacts, checks export isolation, builds the wallet, reruns all nine corrected baseline tests, then runs eighteen isolated financial categories. It records raw execution outcomes and receipt links, gas burnt per root/callback, immutable payout state, actual account views, storage bytes and aggregate reserve observations. It exits nonzero unless the full baseline, all eighteen categories, required SDK boundary/overflow/unknown-payload proofs and gas checks pass. Missing, duplicated, failed or blocked categories, missing receipts/balances and unmeasured callback gas cannot satisfy the gate. Report-gate fixture tests never constitute financial evidence.

The runner journals receipts as each call completes, saves snapshots before/after each category and retains failure messages/stacks on failure. Previous matrix output is timestamp-archived before a fresh matrix run. Full suite receipts include helper-created vote/creation transactions. Setup state is captured in the initial account snapshot; account-deletion auxiliary outcomes are labelled disposable Sandbox fixtures. No production keys are written to artifacts. Gas observations are finite bounded-case measurements, not a formal universal gas proof; review budget headroom and any failed view/runtime operation before financial acceptance.

| ID | Required category | Main obligations |
| --- | --- | --- |
| F01 | Unique creation, immutable terms, beneficiary consent | I3, replay/conflict and wrong-actor checks |
| F02 | Exact and duplicate funding | I1/I3, no extra principal |
| F03 | Cancellation | Creator-only unfunded cancellation |
| F04 | ACCEPT payout | Exactly one NEAR to beneficiary and authentic callback |
| F05 | REJECT refund | Exactly one NEAR to creator |
| F06 | Base unresolved refunds | Missing submission and no quorum |
| F07 | Fresh reversal | Six disjoint declared operators, challenge lock, reversal |
| F08 | KEEP_PRIMARY timeout | Losing challenger cannot profit from timeout |
| F09 | Concurrent finalize | Different signer accounts, one payout only |
| F10 | Verified failure/retry | SR04, native failed receiver, same immutable intent, concurrent retry |
| F11 | Transfer succeeds/callback fails | SR05/SR08, exact recipient delta, UNKNOWN rejects all retries |
| F12 | Transfer fails/callback fails | SR06, returned funds never authorize UNKNOWN retry |
| F13 | Callback/reconciliation safety | SR01/02/07/09/10/12: forged, missing/multiple results, wrong/stale identity, no recovery override, healthy redeploy cannot unlock UNKNOWN |
| F14 | Multiple cases | SR13, one payout cannot consume another held claim |
| F15 | Sponsor/donation isolation | SR13, gifts/top-ups do not become escrow |
| F16 | Gas/liquidity rejection | SR11, failed dispatch leaves state and recipient unchanged |
| F17 | Deadlines | Runtime before/after transitions plus exact-nanosecond SDK funding/submission/commit/reveal/challenge boundaries |
| F18 | Overflow and maximum bounded state | u32/u64/u128 rejection; 16 criteria, 64-byte participant IDs, full 64-event ring, 128-case/32-registry capacities |

SR07's unexpected nonempty promise-result branch is tested precisely in the SDK. Production calls native Transfer, which returns no arbitrary callee data. The real fault probe deliberately cannot supply a single matching fabricated result to an active payout. SR09 includes rejected client-claimed failure data; RPC observations cannot import a result or unlock UNKNOWN. These distinctions must remain explicit in acceptance review.

## Fault artifact boundary

Only the sandbox-faults build exports set_callback_fault, sandbox_set_counters, sandbox_probe_callback and sandbox_probe_value. Counter seeding rejects SettlementPending/Settled; changing an attempt requires TransferFailed with authentic stored FAILED. The callback probe only uses stale/wrong identities or multiple results, and cannot synthesize a matching single authoritative result. Production exports none of these hooks. Default business logic and receiver/amount/intent remain unchanged.

F16 deliberately uses a disposable contract's full-access test key to create an insolvent account fixture, then restores it. This is not a production withdrawal API or a claim that ordinary callers can drain escrow. F18 seeds maximum counters only in the fault artifact; overflow rollback must still be demonstrated in real Wasm before P0 completion. Worst-case stress intentionally may reveal gas/view/storage failures; no passing result is promised before execution.

## Product controls and next task

All active frontend photograph references were replaced by one neutral palette-matched SVG. All fifteen measured desktop rectangles remain equal to UX3A; original photographs, JPEG and frozen design assets are unchanged. This explicitly requested photo cleanup does not advance the gated wallet/provider/manifests milestone. Priority 2 remains pending financial verification.

Exact next task: run npm run test:p0 on the compatible WSL host, inspect every failed category and gas/storage/balance record, fix confirmed failures, then rerun the full required matrix. Only after the gate passes continue structured manifests, reviewer operations, wallet reconciliation and real challenged/unchallenged product journeys. Testnet deployment, paid provider usage and production secrets still require separate authorization. Meta $3, Baseten $3 and Modal $5 limits remain unchanged; no new spend occurred.
