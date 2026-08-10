<div class="hg-hero">
  <img src="../assets/banner.jpg" alt="HarnessGraph, build an agent graph with 2 primitives">
</div>

<p class="hg-kicker">Artifact-native reconciliation</p>

# Let the graph emerge from facts

<p class="hg-lede">HarnessGraph uses Slots for artifact locations and Rules for the relationships that produce them. You declare the artifact you want. The kernel reconciles current state toward that target.</p>

<div class="hg-actions">
  <a class="hg-button hg-button--primary" href="quick-start/">Run the Quick Start</a>
  <a class="hg-button" href="principles/">Read the philosophy</a>
  <a class="hg-button" href="tutorials/pomodoro/">See a real loop</a>
</div>

## Why HarnessGraph exists

Many agent workflows begin with steps. Do A, then B, and jump back to C after a failure. Branches, human decisions, retries, and caches soon fill the graph with control machinery.

HarnessGraph starts with artifacts. A plan, repository, review, approval, or release package occupies a Slot. A Rule says which Slots it reads and which Slots it writes. Those reads and writes determine the dependency graph. The scheduler only needs to decide which facts are current.

Authors work with two primitives.

<div class="hg-grid">
  <div class="hg-card">
    <h3>Slot</h3>
    <p>A named place for an artifact. Files, directories, and Git repositories can all occupy Slots.</p>
  </div>
  <div class="hg-card">
    <h3>Rule</h3>
    <p>A declaration that produces output Slots from input Slots. Shell, Agent, and Human execution share this shape.</p>
  </div>
</div>

## Where to begin

Start with the [Quick Start](quick-start.md). It uses one deterministic Shell Rule to demonstrate Revisions, execution, and Receipt reuse without an agent account.

Then read [Core philosophy](principles.md) and [Two primitives](model.md). If loops are your immediate concern, go directly to the [Pomodoro tutorial](tutorials/pomodoro.md). Parallelism, conditions, joins, and unusual topologies live in the [Graph semantics lab](graph-lab.md).

The installation page provides the public distribution. Tutorial commands, Slots, and Rule identifiers track the current release.
