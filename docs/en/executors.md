<div class="language-switch"><a href="../../zh/executors/">中文</a> · <strong>English</strong></div>

# Executors and policies

Rules declare result relationships; Executors perform one concrete transformation. The executor is explicit in the Rule’s `run` field.

## Executor kinds

| `using` | Purpose | Good for |
|---|---|---|
| `shell` | Run a command in an isolated workspace | Deterministic transforms, checks, assembly |
| `codex` | Call a compatible Agent adapter | Natural-language tasks and model reasoning |
| `prime` | Call a configured interactive service | Steps backed by an external Agent service |
| `human` | Wait for a recorded human decision | Approval, release confirmation, risk judgment |
| `subgraph` | Call another HarnessGraph graph | Decomposing a large flow into bounded graphs |

## Shell Rules

The string form is the shortest form and defaults to `shell`:

```yaml
rules:
  - id: assemble
    in: [draft, review]
    out: [report]
    run: "cat in/draft in/review > out/report"
```

The execution directory provides `HG_IN`, `HG_OUT`, and related environment variables. Relative `in/` and `out/` paths keep a command independent of the project’s absolute location.

## Agent Rules

Use the mapping form when an Agent participates:

```yaml
rules:
  - id: summarize
    in: [source]
    out: [summary]
    run:
      using: codex
      model: your-model-id
      reasoning_effort: balanced
      command: >-
        Read in/source and write a concise Markdown summary to out/summary.
```

`model` and `reasoning_effort` become part of the execution contract. Use a model identifier available in your distribution and never place access tokens in YAML.

## Human Rules

A human node is recorded input, not a hidden step outside the graph:

```yaml
rules:
  - id: approve
    in: [proposal]
    out: [decision]
    run: { using: human, command: "Approve or reject this proposal" }
```

Use `hg human pending` to list decisions and `hg human decide` to record one.

## Subgraph Rules

A parent graph can pass a Slot boundary to a child graph:

```yaml
rules:
  - id: generate_report
    in: [request]
    out: [report]
    run: { using: subgraph, command: "report.yaml" }
```

The child configuration must be within the project’s allowed path. The parent records a subgraph run event so the cross-graph result remains explainable.

## Session policies

Declare session reuse when a step needs a durable or reusable execution identity:

```yaml
session:
  policy: reuse
  scope: graph_run
```

`policy` supports `once`, `new`, and `reuse`. `scope` supports `attempt`, `graph_run`, and `project`. Checkpoint and continuity support depend on the selected executor.

## Execution boundaries

Executors should write candidate artifacts only into `out/`. HG-Rust validates outputs, checks write conflicts, and replaces declared secret values with redaction markers in logs.
