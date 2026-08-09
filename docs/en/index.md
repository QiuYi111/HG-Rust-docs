<div class="language-switch"><a href="../zh/">中文</a> · <strong>English</strong></div>

<section class="hero" aria-labelledby="page-title">
  <p class="eyebrow">HARNESSGRAPH KERNEL · 0.1</p>
  <h1 id="page-title">Give automation results you can verify.</h1>
  <p class="lede">Start with four workflows you can run. Learn how HG handles changing inputs, human decisions, Agents, external tools, and final acceptance.</p>
  <div class="action-row">
    <a class="md-button md-button--primary" href="cases/index.md">Start the four tutorials</a>
    <a class="md-button" href="principles/">Read the core philosophy</a>
  </div>
</section>

<div class="release-line" aria-label="Documentation information">
  <span>Configuration version 1</span>
  <span>macOS / Linux</span>
  <span>English · 中文</span>
</div>

## What does HG-Rust solve

Automation results change as requirements, source material, reviews, and external events change. You need to know whether the current result uses the latest inputs, whether older work is still safe to reuse, which work survived a failure, and how to restore a hand-edited file.

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

## Where to start

<div class="diagram">
  <img src="../assets/core-loop.svg" alt="The reconciliation loop from a desired result through verification, versioning, and explanation" />
</div>

1. Read the [four hands-on tutorials](cases/index.md) and choose the closest delivery goal.
2. Copy a case directory and run its contract profile first.
3. Run the live profile when the configuration and inputs make sense.
4. Change one input and watch HG repeat only the affected work.
5. Use the [feature reference](examples/reference.md) when you need one capability.

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
5. [Four hands-on tutorials](cases/index.md)  Learn from a real delivery goal.
6. [Feature reference and small examples](examples/reference.md)  Look up one capability when needed.

!!! tip "A useful test"

    If your problem can be phrased as “when these inputs change, I want a verifiable result,” start with a small Slot → Rule → Slot graph.
