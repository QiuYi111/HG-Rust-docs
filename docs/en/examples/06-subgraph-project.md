<div class="language-switch"><a href="../../../zh/examples/06-subgraph-project/">中文</a> · <strong>English</strong></div>

# 06 · Static subgraph

When a flow needs an independent boundary, a parent graph can call a fixed child graph through explicit Slot inputs and outputs. The parent records the subgraph event.

## Parent graph

```yaml
rules:
  - id: delegate
    in: [request]
    out: [answer]
    run: { using: subgraph, command: "child.yaml" }
```

## Child graph

```yaml
version: 1
slots:
  request: { kind: file, path: request.txt }
  answer: { kind: file, path: answer.md }
rules:
  - id: answer
    in: [request]
    out: [answer]
    run: "cp in/request out/answer"
```

## Run it

```bash
hg run answer --project . --output json
hg events --project . --output json
```

The parent’s event stream records the child run. Clear input and output boundaries let teams understand and validate each graph independently.

This case keeps the child graph path fixed in the Rule. When a Planner produces a GraphSpec and the generic executor reads its Revision, continue to [Dynamic subgraph](16-dynamic-subgraph.md).

[Back to the case library](index.md) · [Next: Budgets and cancellation](07-budget-and-cancel.md)
