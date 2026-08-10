# Harness Lifecycle

This case expresses a spec-governed engineering lifecycle as an HG graph. Product definition, feasibility, approval, spec, plan, tasks, worker report, evaluation, and review all become revisioned artifacts.

<div class="hg-diagram">
  <img src="../../../assets/diagrams/harness.en.svg" alt="Harness lifecycle graph">
</div>

## Read the three boundaries

The first Human Rule answers product-definition questions. After feasibility assigns `core` risk, a second Human Rule approves that core change. The decisions bind to different input frontiers.

A role check deliberately rejects a TDD-RED write to implementation. The Supervisor emits one bounded `next_task`. An OpenCode worker completes one iteration and writes a report. The final Rule commits all evidence as a Git Revision.

## Run the contract path

```bash
scripts/test-real-world-cases.sh harness-lifecycle contract
```

The contract verifies stale human-answer fencing, a second decision for core risk, role-boundary rejection, and a final Git artifact containing spec, eval, and report evidence.

## Run the live boundary

```bash
scripts/test-real-world-cases.sh harness-lifecycle live
```

Live mode consumes existing Codex and OpenCode credential handles. It does not copy credentials into Slots, Receipts, or the final repository. See the complete [`harness.yaml`](https://github.com/QiuYi111/HG-Rust/blob/main/examples/05-harness-lifecycle/harness.yaml).
