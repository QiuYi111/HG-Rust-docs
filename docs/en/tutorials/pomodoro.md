# Pomodoro

This is the smallest complete self-improvement loop. A Coder changes a Pomodoro timer. A Critic checks the result and writes feedback. Once the Critic accepts, a Human Rule may move that exact candidate into `approved`.

<div class="hg-diagram">
  <img src="../../../assets/diagrams/pomodoro.en.svg" alt="Pomodoro self-improvement loop">
</div>

## Read the graph

`coder` reads both `candidate` and `critique`, then writes a new `candidate`. The `critique` Rule reads the new candidate and writes a new review. Revisions in those two Slots change in turn, and every changed frontier forms another Activation.

When the Critic writes `accept`, the `coder` condition is no longer eligible. Only then can `request_approval` run. No Loop node is present.

## Run the deterministic contract

Run this test from the companion examples workspace root.

```bash
cargo test -p hg-cli --test m18_pomodoro_loop -- --nocapture
```

The test verifies the same order at two concurrency capacities.

```text
coder → critique → coder → critique
```

A passing result proves that feedback Revisions create another round, acceptance stops the cycle, and worker capacity does not alter dependency semantics.

## Inspect and run the live graph

Open `examples/01-pomodoro/harness.yaml`. Compare the `in`, `out`, and `when` fields on `coder`, `critique`, and `request_approval`.

The live run needs a working Codex executor, Git, and `jq`. The case directory's `README.md` contains complete initialization commands. When the Human Rule becomes pending, find its Activation and submit the decision.

```bash
hg human pending --project . --output json
hg human decide --activation <CURRENT_KEY> --decision approve --project .
hg run approved --jobs 2 --project .
hg materialize approved --project .
```

The decision is bound to an exact input frontier. If the candidate changes after approval, the old decision cannot silently cover the new candidate.
