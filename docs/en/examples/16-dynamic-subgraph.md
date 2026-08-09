<div class="language-switch"><a href="../../../zh/examples/16-dynamic-subgraph/">中文</a> · <strong>English</strong></div>

# 16 · Dynamic subgraph

This case covers the `GraphSpec Slot` form of dynamic subgraph composition. A Planner Rule first creates a complete child graph definition and commits it as an immutable `generated_graph` Revision. The generic `subgraph` Executor then consumes that Revision, runs the child graph in an isolated project, and returns only the declared `answer` Slot.

The difference from the [static subgraph](06-subgraph-project.md) case is that the parent graph does not reference a fixed child file. The graph definition itself is an input Artifact, so a changed definition creates a new input vector and new subgraph evidence.

## Parent graph configuration

The following is the complete structure to adapt in a project. The example uses the `gpt-5.6-luna` model identifier used by the repository’s official case; replace it with a model available in your distribution. The configuration contains no credentials.

```yaml
version: 1
project:
  name: dynamic-subgraph
  default_targets: [answer]

slots:
  request: { kind: file, path: request.txt }
  generated_graph: { kind: file, path: generated-child.yaml }
  answer: { kind: file, path: answer.md }

rules:
  - id: plan_child_graph
    in: [request]
    out: [generated_graph]
    run:
      using: codex
      model: gpt-5.6-luna
      reasoning_effort: none
      command: >-
        Read request, create a complete child GraphSpec, and write it to
        out/generated_graph. The child must declare request and answer Slots
        plus one Rule that produces answer.

  - id: run_generated_graph
    in: [request, generated_graph]
    out: [answer]
    run: { using: subgraph, command: "slot:generated_graph" }
```

The generated definition must itself satisfy the configuration contract. For example, the Planner can produce this GraphSpec.

```yaml
version: 1
slots:
  request: { kind: file, path: request.txt }
  answer: { kind: file, path: answer.md }
rules:
  - id: generated_answer
    in: [request]
    out: [answer]
    run:
      using: codex
      model: gpt-5.6-luna
      reasoning_effort: none
      command: "Read request and write an answer with a provenance marker to out/answer."
```

`generated_graph` is a declared input of `run_generated_graph`. The Runtime parses it from the Attempt’s read-only input snapshot. The control Slot defines the child graph and is not passed into the child as business content. The child receives the parent Rule’s declared business inputs and can return only its declared outputs.

## Prepare the input and run

```text
Build and execute a child graph that returns a provenance marker.
```

```bash
hg init --project .
hg put request request.txt --project .
hg run answer --project . --output json
hg materialize generated_graph --project .
hg materialize answer --project .
hg events --project . --output json
```

## What to observe

- The first Activation runs `plan_child_graph` and commits a `generated_graph` Revision.
- The second Activation consumes that exact Revision through `command: "slot:generated_graph"`.
- The `SubgraphRun` Event records `graph_spec_slot: generated_graph`, so an audit reader can locate the Artifact that defined the child graph.
- The child runs in an isolated project. The parent receives only `answer` and cannot observe undeclared child state.
- Changing request regenerates the GraphSpec and binds the next child execution to new input Revisions.
- A missing or invalid GraphSpec fails the parent Attempt; an arbitrary workspace file never becomes an implicit graph definition.

Dynamic GraphSpec Slots compose a child graph. A project-level `graph_patch` apply barrier changes the parent graph itself; the two mechanisms have different scopes.

[Back to the case library](index.md) · [Back to the product overview](../index.md)
