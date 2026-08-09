<div class="language-switch"><a href="../zh/">中文</a> · <strong>English</strong></div>

<section class="hero" aria-labelledby="page-title">
  <p class="eyebrow">HARNESSGRAPH KERNEL · 0.1</p>
  <h1 id="page-title">Give automation results you can verify.</h1>
  <p class="lede">HarnessGraph Kernel (HG-Rust) is an artifact-native reconciliation kernel. Use Slots for stable artifact names, Rules for transformations, and immutable Revisions, Receipts, and Events for every verifiable change.</p>
  <div class="action-row">
    <a class="md-button md-button--primary" href="quick-start/">Start the Quick Start</a>
    <a class="md-button" href="principles/">Read the core philosophy</a>
  </div>
</section>

<div class="release-line" aria-label="Documentation information">
  <span>Configuration version 1</span>
  <span>macOS / Linux</span>
  <span>English · 中文</span>
</div>

## What does HG-Rust solve

Automation results change as requirements, source code, tests, reviews, Prompts, and external events change. After each run, a project still needs to know whether the result matches the latest facts, whether an old result is safe to reuse, which outputs were committed after a failure, and how to repair a hand-edited path.

HG-Rust starts from the target Slot’s input closure and derives the Activations that need work. A result becomes a new Head only after validation, content-addressed storage, and fenced atomic commit. The kernel continues reconciling until the target reaches a fixed point or reports a clear terminal state.

<div class="feature-grid" markdown>

<article class="feature-card" markdown>

### A small author model

Slots name stable Artifacts. Rules describe input-to-output transformations. Authors do not maintain workflow cursors, retry tables, or hidden edges by hand.

</article>

<article class="feature-card" markdown>

### Recoverable authority

Revisions hold immutable content, Heads identify the accepted version, and Materializations project it into files or workspaces. A damaged path does not erase history.

</article>

<article class="feature-card" markdown>

### Explainable execution evidence

Activation, Attempt, Receipt, Session, and Event each have a precise role. `status` shows current facts; `explain` shows the causal reason.

</article>

</div>

## How one reconciliation completes

<div class="diagram">
  <img src="../assets/core-loop.svg" alt="The reconciliation loop from a desired result through verification, versioning, and explanation" />
</div>

1. Declare Slots and Rules in `harness.yaml`.
2. Import inputs as Source Revisions with `hg put`.
3. Inspect the target closure and pending Activations with `hg plan`.
4. Reconcile to a stable terminal state with `hg run`.
5. Inspect results and causality with `hg status`, `hg explain`, and `hg events`.

## Two layers

| Author declares | Kernel maintains |
|---|---|
| Slot names, Artifact kinds, inputs, and outputs | GraphRevision, Slot Heads, Revisions, and Materializations |
| Rules, Guards, Executors, and policies | Activations, Attempts, Receipts, Sessions, Leases, and Events |
| Target Slots | backward closure, freshness, fixed points, and terminal states |

This division keeps complexity in one place where it can be verified. Scripts, Agents, people, and external systems connect through Rules; execution can vary while result semantics remain consistent.

## Who is it for

- Teams that continuously produce reports, documents, datasets, or build artifacts.
- Processes that need an explicit human decision while preserving its context.
- Projects where Agents, scripts, and people work together while every result remains explainable.
- Tasks that must continue after failure, cancellation, retry, or concurrent execution and recover from durable facts.

## Where should you start

If HG-Rust is new to you, follow this order.

1. [Quick Start](quick-start.md)  Create a first project and generate a file.
2. [Core philosophy](principles.md)  Understand Slots, Revisions, Receipts, and fixed points.
3. [Object model](model.md)  Learn Activations, Attempts, Sessions, and Events.
4. [Configuration overview](configuration.md)  Express the model in `harness.yaml`.
5. [Case library](examples/index.md)  Study all 20 scenarios.

!!! tip "A useful test"

    If your problem can be phrased as “when these inputs change, I want a verifiable result,” start with a small Slot → Rule → Slot graph.
