<div class="language-switch"><a href="../../../zh/examples/">中文</a> · <strong>English</strong></div>

# Case library

The case library starts with a minimal result transformation and adds caching, recovery, human decisions, Agents, subgraphs, budgets, concurrency, secrets, and domain work. Every scenario centers on a verifiable input → result relationship.

<div class="diagram">
  <img src="../../assets/case-library.svg" alt="Cases turn inputs into reports through drafts, reviews, and observations while retaining history" />
</div>

## How to use the cases

Each case page includes:

- the capability to learn;
- a focused `harness.yaml` fragment;
- a recommended command sequence;
- the evidence to inspect after the run.

Copy a case into a fresh project, run `hg check --strict`, and then execute its target. Model identifiers and secret handles are placeholders and contain no credentials.

## All 15 cases

| No. | Case | Focus |
|---:|---|---|
| 01 | [Minimal reconciliation](01-hello-reconciliation.md) | Slot → Rule → Revision → Receipt |
| 02 | [Cache, invalidate, repair](02-cache-invalidate-repair.md) | Receipt reuse, drift, forced recomputation |
| 03 | [Failure and recovery](03-failure-resume.md) | Reusing committed upstream work |
| 04 | [Human approval and effects](04-human-approval-effect.md) | Human, Effect, idempotency, readback |
| 05 | [Review and revision](05-agent-review-revise.md) | Draft → review → revision |
| 06 | [Subgraph](06-subgraph-project.md) | Explicit parent/child graph boundary |
| 07 | [Budgets and cancellation](07-budget-and-cancel.md) | Attempt, time, and cancellation limits |
| 08 | [Conditional guards](08-guards-conditional-flow.md) | TRUE / FALSE / ERROR |
| 09 | [Audit and explanation](09-audit-and-explain.md) | Plan, events, history, and logs |
| 10 | [Concurrency and leases](10-concurrent-workers-leases.md) | Fencing and safe commits |
| 11 | [Daemon and watch](11-daemon-watch.md) | Background execution and events |
| 12 | [Constrained agent task](12-secure-agent-task.md) | Network policy, secret handles, redaction |
| 13 | [Feedback loop](13-feedback-loop.md) | Draft, critique, and revision |
| 14 | [Hardware design](14-hardware-project.md) | Requirement, interface, test plan |
| 15 | [Scientific experiment](15-scientific-experiment.md) | Data, observations, report, limitations |

If you have not run HG-Rust before, complete the [Quick Start](../quick-start.md) first.
