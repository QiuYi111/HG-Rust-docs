<div class="hg-hero">
  <img src="assets/banner.jpg" alt="HarnessGraph, build an agent graph with 2 primitives">
</div>

<p class="hg-kicker">Artifact-native reconciliation</p>

# Build an agent graph with 2 primitives

<p class="hg-lede">HarnessGraph lets you describe the artifacts you want and the rules that can produce them. The kernel keeps reconciling those facts until the requested output is current.</p>

<div class="hg-actions">
  <a class="hg-button hg-button--primary" href="zh/quick-start/">中文 Quick Start</a>
  <a class="hg-button" href="en/quick-start/">English Quick Start</a>
  <a class="hg-button" href="zh/principles/">阅读核心哲学</a>
</div>

<div class="hg-grid">
  <div class="hg-card">
    <h3>Slot</h3>
    <p>A named place for an artifact. Each committed change becomes an immutable Revision.</p>
  </div>
  <div class="hg-card">
    <h3>Rule</h3>
    <p>A declaration that reads Slots and writes Slots. Dependencies come from these reads and writes.</p>
  </div>
  <div class="hg-card">
    <h3>Reconcile</h3>
    <p>The kernel finds stale outputs, runs the eligible Rules, and records what happened.</p>
  </div>
  <div class="hg-card">
    <h3>Derived graph</h3>
    <p>Branches, joins, retries, and loops follow from data dependencies. They are not separate node types.</p>
  </div>
</div>

The documentation is maintained in Chinese and English with the same page structure. Choose a language above, then follow the Quick Start to run a deterministic graph without an agent account.
