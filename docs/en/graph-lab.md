# Graph semantics lab

The case library explains useful workflows. These recipes isolate scheduler semantics with deterministic Shell commands and require no Codex account.

<div class="hg-diagram">
  <img src="../../assets/diagrams/graph-lab.en.svg" alt="Topologies covered by the graph semantics lab">
</div>

## Inspect before execution

```bash
hg check --strict --project <RECIPE>
hg graph --project <RECIPE>
hg plan <TARGET> --project <RECIPE>
```

`check` validates the static definition. `graph` shows relationships derived from Slot reads and writes. `plan` lists the work needed to reconcile a target.

## Run semantic recipes

The repository's [`examples/recipes`](https://github.com/QiuYi111/HG-Rust/tree/main/examples/recipes) cover minimal reconciliation, conditional gates, retry recovery, Human Rules, Effects, and cache invalidation. [`examples/graph-semantics`](https://github.com/QiuYi111/HG-Rust/tree/main/examples/graph-semantics) adds parallel fan-out and join, a figure-eight loop, coupled loops, guarded branch switching, and closure isolation. Each directory can be initialized and run independently.

Rust integration tests hold the larger unusual-graph regressions. The following commands run deterministic scheduler, loop, and case coverage.

```bash
cargo test -p hg-cli --test m15_official_examples
cargo test -p hg-cli --test m18_pomodoro_loop
scripts/test-graph-semantics-examples.sh
scripts/test-real-world-cases.sh learning-helper contract
scripts/test-real-world-cases.sh acquired-podcast contract
```

## What to verify

- Capacity may change how many Rules run together, but not dependency order
- A join waits for matching Revisions on every input
- A false `when` keeps the Rule ineligible and cannot invent downstream output
- A failed Attempt commits no partial output
- The same input frontier can reuse a Receipt
- A new feedback Revision creates another loop round
- A stable graph stops creating useless Attempts

These checks reveal scheduler behavior more reliably than one agent answer that happened to be correct.
