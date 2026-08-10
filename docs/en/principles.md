# Core philosophy

HarnessGraph asks a plain question. Is the target artifact current with respect to its inputs? If it is stale, which Rule can advance it?

## From task flow to state convergence

Conventional workflow systems put control flow into the graph. Loops need Loop nodes, parallel work needs Parallel nodes, and human approval introduces another node type. The closer a workflow gets to real engineering, the more control machinery it collects.

HarnessGraph records a smaller set of facts.

- Which Slots have Revisions
- Which Revisions a Rule read
- Whether an Attempt committed new Revisions
- Whether the current input frontier already has a reusable Receipt

The scheduler examines those facts and runs eligible work that can change the target. A Rule becomes quiet when its output matches the current inputs. A changed input makes downstream outputs stale again.

<div class="hg-diagram">
  <img src="../../assets/diagrams/reconcile.en.svg" alt="The HarnessGraph reconciliation loop">
</div>

## Authors use two primitives

A Slot is a place for an artifact. A Rule is a production relationship between artifacts. Authors do not declare separate loop, parallel, join, or retry nodes.

Multiple inputs on one Rule form a join. Independent Rules can run in parallel. A Rule that writes back into an earlier dependency chain creates another round when the Revision changes. A `when` clause only decides whether a candidate Rule is eligible on the current input frontier.

These shapes are properties of the graph derived from Slot and Rule composition.

## Agents provide semantics; the kernel provides determinism

An agent can interpret an ambiguous request, edit code, gather research, or critique a candidate. Its answer may differ from one run to the next. The kernel does not pretend otherwise.

The kernel mounts inputs read-only, gathers outputs in an isolated directory, commits every declared output together, and records the Attempt and Receipt. A failed run cannot publish half an output set. A successful result can be reused on the same input frontier when policy allows it.

This boundary preserves the agent's expressive work while keeping engineering state inspectable, recoverable, and auditable.

## Human and Effect work use the same graph

A human decision can be a Rule with `using: human`. An external action can be an Effect Rule. Their execution constraints differ, but both read Slots, write Slots, and bind their result to exact input Revisions.

An approval therefore cannot drift onto a later candidate. An external action can retain its own commit and audit record. The kernel adds runtime facts without expanding the author's graph language.

Continue with [Two primitives](model.md), then see common structures in [How graphs emerge](composition.md).
