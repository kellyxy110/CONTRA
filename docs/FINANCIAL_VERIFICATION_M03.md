# M03 financial verification handoff

Checkpoint: CONTRA-2026-10-29-IMPL-M03. Authorized baseline: a98216cda22501ee112c68a7d336952f8b7967ff, implementation/oct28. Actual implementation began October 28 as pre-event work. The F17 timeout correction and final verification completed November 3 during the official competition window. Governing financial behavior remains the frozen UX3C ABI/state/recovery specifications. No production financial method or recovery policy was changed.

## Verified result

The clean compatible-host `npm run test:p0` run exited 0 and set `p0_complete=true`. The nine-test corrected baseline passed 9/9. Financial categories F01-F18 passed 18/18. The run captured 454 transaction records, 753 receipt outcomes and 46 balance/storage snapshots. Independent review of all snapshots found no instance where contract balance was below storage reserve plus held and inflight or unknown principal.

Observed maximum transaction gas was 35,923,793,821,747. Maximum callback gas was 17,000,817,633,275. The report recorded zero gas-budget violations. Maximum observed contract storage was 17,470,225 bytes in the bounded F18 stress case. These are measured finite bounds, not a universal formal proof.

Production Wasm is 631,042 bytes with SHA-256 `c607adf597dfbf898d8e442fd71b3b75e7032ad47fd808fb50e89e0573fd3ef8`. It exports none of `set_callback_fault`, `sandbox_set_counters`, `sandbox_probe_callback` or `sandbox_probe_value`. Fault Wasm remains separate. Exact native receiver balance changes and callback outcomes are asserted by the passing financial tests. Machine report: `project/artifacts/implementation/verification.json`. Complete raw evidence: `project/artifacts/m03/p0-run/`.

AC01-AC33 acceptance remains separate and unaccepted. This gate does not prove independent operator control, live provider readiness, external-wallet settlement or authorized testnet deployment.

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

F16 deliberately uses a disposable contract's full-access test key to create an insolvent account fixture, then restores it. This is not a production withdrawal API or a claim that ordinary callers can drain escrow. F18 seeds maximum counters only in the fault artifact and passed its real Wasm overflow rollback, 16-criterion, 64-byte identifier, event-ring, 128-case and 32-reviewer capacity checks. Production still exposes no counter-seeding method.

## Product controls and next task

All active frontend photograph references use one neutral palette-matched SVG. All fifteen measured desktop rectangles remain equal to UX3A; original photographs, JPEG and frozen design assets are unchanged. The empty-state text is shortened to `No records` without geometry changes.

Exact next task: continue Priority 2 with structured evidence manifests, wallet reconciliation, independently controlled reviewer operations, provider integration within approved credits, and two complete local case-to-settlement journeys, including a challenged case with a different final verdict. Testnet deployment, paid provider usage and production secrets still require separate authorization. Meta $3, Baseten $3 and Modal $5 limits remain unchanged; no spend occurred.
