<div class="language-switch"><a href="../zh/">中文</a> · <strong>English</strong></div>

<section class="hero" aria-labelledby="page-title">
  <p class="eyebrow">HARNESSGRAPH KERNEL · 0.1</p>
  <h1 id="page-title">Give automation results you can verify.</h1>
  <p class="lede">HarnessGraph Kernel (HG-Rust) is an artifact-native reconciliation kernel: describe results with Slots, describe transformations with Rules, and keep every accepted change explainable through immutable Revisions, Receipts, and Events.</p>
  <div class="action-row">
    <a class="md-button md-button--primary" href="quick-start/">Start the Quick Start</a>
    <a class="md-button" href="principles/">Learn the principles</a>
  </div>
</section>

<div class="release-line" aria-label="Documentation information">
  <span>Configuration version 1</span>
  <span>macOS / Linux</span>
  <span>English · 中文</span>
</div>

## What does HG-Rust solve?

Traditional automation is often organized around running a command once. After it finishes, you still need to answer: does the result match the current inputs? Can it be reused safely? Which work was already committed after a failure? Can a manually changed file be detected and repaired?

HG-Rust makes those questions part of the model. You declare the result you want, the kernel coordinates the dependency graph, and validation, versioning, reuse, recovery, and explanation become queryable facts.

<div class="feature-grid" markdown>

<article class="feature-card" markdown>

### Results first

Slots say what should exist. Rules say how it is produced. A file path is one materialization of a result, not the result itself.

</article>

<article class="feature-card" markdown>

### Evidence-based reuse

A Receipt proves reuse only when the input Revisions, Rule contract, and execution state still match. File existence alone is not a cache hit.

</article>

<article class="feature-card" markdown>

### Explainable execution

Attempts, Receipts, Sessions, and Events preserve the causal chain. `status` tells you what is true; `explain` tells you why.

</article>

</div>

## How does one reconciliation complete?

<div class="diagram">
  <img src="../assets/core-loop.svg" alt="The reconciliation loop from a desired result through verification, versioning, reuse, and explanation" />
</div>

1. Declare Slots and Rules in `harness.yaml`.
2. Import inputs as Revisions with `hg put`.
3. Inspect the work with `hg plan`.
4. Reconcile to a stable state with `hg run`.
5. Inspect results and causality with `hg status`, `hg explain`, and `hg events`.

## Who is it for?

- Teams that continuously produce reports, documents, datasets, or build artifacts.
- Processes that need an explicit human decision while preserving the decision context.
- Projects where Agents, scripts, and people must work together without losing provenance.
- Tasks that must continue after failure, cancellation, retry, or concurrent execution.

## Where should you start?

If HG-Rust is new to you, follow this order:

1. [Quick Start](quick-start.md): create a first project and generate a file.
2. [Core philosophy](principles.md): understand why Revisions and Receipts matter.
3. [Object model](model.md): learn Slots, Rules, Activations, Attempts, and Events.
4. [Configuration overview](configuration.md): express the model in `harness.yaml`.
5. [Case library](examples/index.md): study all 15 scenarios.

!!! tip "A useful test"

    If your problem can be phrased as “when these inputs change, I want a verifiable result,” start with a small Slot → Rule → Slot graph.
