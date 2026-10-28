# Evaluation design

Research goal: test whether adversarial review improves the reliability of disputed judgments under an application-level NEAR adjudication protocol.

## Three controlled baselines

- B1: single primary AI evaluator.
- B2: primary evaluator and independent corroborating reviewer, decision by simple aggregation.
- B3: CONTRA-style evidence-bound proposer, independent review and counterexample search with deterministic challenge policy.

Keep evidence, model versions, prompts, reviewer budgets, deadlines and scoring policy documented. B1 and B2 may reuse the same underlying model in which case describe correlation explicitly. Without comparable live GenLayer execution, do not claim a GenLayer benchmark result.

## Planned 30 scenario distribution

- 10 objective software acceptance cases.
- 8 misleading, forged or incomplete evidence cases.
- 6 prompt injection or compromised retrieval cases.
- 4 ambiguous contractual criteria cases.
- 2 operational faults such as timeout and transfer failure.

## Measures

- Wrong approval rate, based on separately labelled ground truth where possible.
- False rejection rate.
- Counterexample detection precision and recall for labelled attack fixtures.
- Proportion of cases unresolved by the frozen policy.
- Reviewer disagreement and reversal rate.
- Time to provisional decision, time to final decision.
- End-to-end gas paid, inference spend, offchain CPU cost, storage and retry expense.
- Cost per correctly adjudicated case, excluding cases without defensible ground truth or reporting them separately.

## Guardrails

Report denominator, model settings, hardware, tested cases, confidence bounds where meaningful and exact failure examples. Do not collapse genuinely ambiguous cases into binary correct/incorrect. Do not claim independent operation for reviewers controlled by the same test operator.

The file `benchmarks/case-plan.csv` is an experiment plan, not observed data.
