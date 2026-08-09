<div class="language-switch"><a href="../../zh/principles/">中文</a> · <strong>English</strong></div>

# Core philosophy

HG-Rust starts with a simple question: automation should not only do work; it should explain why a result is trustworthy. Execution, results, versions, and evidence therefore live in one reconciliation model.

## 1. Results before commands

A Rule is not an isolated script. It declares a transformation from input Slots to output Slots. You describe the result first, and the kernel decides which Rules need to run.

This changes the mental model from “run a sequence of commands” to “reconcile a target to a stable state.” When the target is already satisfied, a run can be a no-op with an explicit `NO_CHANGE` Receipt.

## 2. Immutable versions before “latest files”

A file on disk is a materialization. A Revision is the comparable, traceable state. Each accepted result creates a new Revision while older Revisions remain available for history.

This separates three facts that are often conflated:

- whether a result was ever produced successfully;
- which Revision is the current Head;
- whether the workspace still matches that Head.

## 3. Evidence before existence

An output file existing does not prove that it is still valid. A Receipt records the inputs, Rule contract, checks, and outputs for an Activation. Reuse is safe only while that Receipt still matches the current graph.

## 4. Side effects must be explicit

Generated files are versioned results. Sending a message or changing a remote resource is an Effect. Effects need idempotency keys and can record the state observed through readback.

Human decisions are explicit nodes too. Approval enables an external action; rejection does not leave an ambiguous “perhaps executed” state.

## 5. Explainability is a default capability

| Question | Use |
|---|---|
| Is the target stable? | `hg status` |
| Why is work needed? | `hg plan`, `hg explain` |
| What changed? | `hg events` |
| Where did a result come from? | `hg artifact history` |
| What happened during one attempt? | `hg logs` |

## 6. Reconcile to a fixed point

A run is more than starting one Rule. It advances the target’s input closure until the target is fresh and stable, or reports a clear blocked, failed, cancelled, or budget-exhausted state.

<div class="diagram">
  <img src="../../assets/core-loop.svg" alt="The HG-Rust reconciliation loop" />
</div>

## When should you choose HG-Rust?

HG-Rust fits work where changing inputs should produce a checkable result: documents, reports, datasets, reviews, designs, and controlled Agent tasks. It does not require every step to use the same executor, and it does not make a workflow function in one programming language the only entry point.

If your primary need is scheduled cloud jobs, service deployment, or a code-defined business workflow, read [Comparison](comparison.md) before deciding where HG-Rust belongs in your system.
