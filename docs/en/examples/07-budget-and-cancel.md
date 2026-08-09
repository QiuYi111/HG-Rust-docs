<div class="language-switch"><a href="../../../zh/examples/07-budget-and-cancel/">中文</a> · <strong>English</strong></div>

# 07 · Budgets and cancellation

Budgets put a boundary around repeated work. This case demonstrates time, attempt-count, and cancellation limits.

## Configuration focus

```yaml
rules:
  - id: report
    in: [request]
    out: [report]
    limits:
      timeout: 120
      max_attempts: 1
    run: "cp in/request out/report"
```

## Run it

```bash
hg run report --budget-duration 0 --project . || true
hg run report --budget-duration 120 --project .
hg run report --detach --project .
hg runs --project . --output json
hg cancel <RUN_ID> --project .
```

Budget exhaustion is an explicit terminal outcome, not a successful result. Cancellation stops the current run while preserving already committed upstream facts.

[Back to the case library](index.md) · [Next: Conditional guards](08-guards-conditional-flow.md)
