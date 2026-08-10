# Learning Helper

This case turns three course sources into a Word handbook. It demonstrates human scope selection, three-way parallel work, a join, coverage review, and conditional rendering.

<div class="hg-diagram">
  <img src="../../../assets/diagrams/learning.en.svg" alt="Learning Helper graph">
</div>

## Step 1, confirm scope

`choose_scope` reads a scope prompt and writes `scope`. All three distillation Rules read that Revision, binding the human decision to an exact course scope.

There is no dynamic subgraph. `knowledge`, `examples`, and `expansion` are ordinary Slots with direct writers.

## Step 2, observe parallel and local invalidation

The three distillation Rules share only `scope` and have no dependency on one another, so they may run in parallel. Changing `Knowledge.md` makes only the knowledge branch and its downstream work stale. The other two branches can reuse their Receipts.

## Step 3, run the case

Run the deterministic path from the repository root.

```bash
scripts/test-real-world-cases.sh learning-helper contract
```

The contract checks cache reuse, final-output propagation, and file-level invalidation.

The live path calls agents, builds a DOCX, renders it, and runs an OCR check.

```bash
scripts/test-real-world-cases.sh learning-helper live
```

It requires the Documents and GLM-OCR environment variables listed in the case `README.md`. Missing dependencies fail closed instead of turning a skipped check into a success.

See the complete graph in `examples/02-learning-helper/harness.yaml`.
