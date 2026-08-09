<div class="language-switch"><a href="../../zh/examples/reference/">中文</a> · <strong>English</strong></div>

# Feature reference and small examples

This is the lookup section. If HG is new to you, start with the [four hands-on case studies](../cases/index.md).

The earlier small-example topics are grouped here by the problem they illustrate.

## Producing a first result

- **Minimal reconciliation**  Turn one input file into one result file.
- **Cache, invalidate, repair**  Reuse a result when inputs stay the same and restore a damaged materialized file.
- **Failure and recovery**  Continue downstream work when an upstream result is already complete.

## Keeping people in the loop

- **Human approval and effects**  Put approval and an external action into one inspectable flow.
- **Review and revision**  Give a draft, review, and revision an explicit relationship.
- **Feedback loop**  Handle work that needs several revisions before it settles.

## Splitting work and running it together

- **Subgraph**  Hand one bounded part of a job to a child flow.
- **Concurrency and leases**  Prevent an older worker from overwriting a newer result.
- **Dynamic subgraph**  Let an upstream result define the next flow.

## Longer runs and tighter limits

- **Budgets and cancellation**  Set attempt, time, and cancellation behavior.
- **Daemon and watch**  Run in the background and follow events.
- **Constrained agent task**  Control network access, secrets, and redacted output.
- **Audit and explanation**  Inspect why a run reached its current result.

## Domain examples

- **Hardware design**  Connect requirements, interfaces, and a test plan.
- **Scientific experiment**  Keep data, observations, reports, and limitations together.

These pages help with syntax and one capability at a time. The four case studies show how the capabilities work together.
