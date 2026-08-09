<section class="public-hero" aria-labelledby="page-title">
  <p class="eyebrow">PUBLIC DOCUMENTATION</p>
  <h1 id="page-title">HarnessGraph Kernel</h1>
  <p class="lede">A calm, artifact-native way to describe desired results, reconcile dependencies, and keep execution explainable.</p>
  <div class="actions">
    <a class="md-button md-button--primary" href="quick-start/">Read the quick start</a>
    <a class="md-button" href="concepts/">Explore concepts</a>
  </div>
</section>

<div class="public-status" role="status"><span aria-hidden="true">●</span> Public documentation surface · code-free by design</div>

## Start with the model

<div class="card-grid" markdown>

<article class="card" markdown>

### Slot

A named place for a desired artifact. A Slot describes what should exist without prescribing an entire application workflow.

</article>

<article class="card" markdown>

### Rule

A declared transformation from input Slots to output Slots. Rules make dependencies visible and give reconciliation a stable shape.

</article>

<article class="card" markdown>

### Revision

An immutable description of an artifact state. Revisions make change, history, and explanation explicit instead of relying on a file's current appearance.

</article>

</div>

## What this public site covers

- The public vocabulary: Slot, Rule, Revision, Receipt, Session, and Event.
- A small workflow orientation for people evaluating the model.
- A command vocabulary overview without exposing implementation files.
- Reading guidance for a public, code-free documentation experience.

## Public-surface boundary

This repository is deliberately narrow. It does **not** publish source code,
private engineering specifications, internal audit or roadmap documents,
example repositories, CI configuration, credentials, or links to private
implementation content.

The boundary is part of the product: public readers get the concepts and
workflow shape; internal implementation details remain outside this repository.

!!! note "Project maturity"

    Treat this as an orientation surface for an evolving kernel model. Verify
    any operational or compatibility claim against the version of the product
    you are evaluating.
