<div class="language-switch"><a href="../../../zh/examples/09-audit-and-explain/">中文</a> · <strong>English</strong></div>

# 09 · Audit and explanation

This case practices moving from “what is true?” back to “why is it true?”

## Run it

```bash
hg plan answer --project .
hg run answer --project .
hg status --project . --output json
hg explain answer --project . --output json
hg artifact history answer --project . --output json
hg events --project . --output json
hg log --project . --output json
hg logs <ATTEMPT_ID> --project .
```

Together, status, explanation, Events, Artifact history, and Attempt logs form a causal chain: input Revision → Rule contract → Attempt → validation → output Revision → Receipt.

[Back to the case library](index.md) · [Next: Concurrency and leases](10-concurrent-workers-leases.md)
