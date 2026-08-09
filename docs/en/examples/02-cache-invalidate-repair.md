<div class="language-switch"><a href="../../../zh/examples/02-cache-invalidate-repair/">中文</a> · <strong>English</strong></div>

# 02 · Cache, invalidate, repair

This case shows three different facts: a result can be reused, a materialized file can be repaired, and a Receipt can be deliberately invalidated.

## Configuration focus

```yaml
rules:
  - id: answer
    in: [request]
    out: [answer]
    run: "printf 'An accepted revision is reusable.\\n' > out/answer"
```

## Run it

```bash
hg run answer --project .
hg run answer --project .
rm answer.md
hg drift --project .
hg materialize answer --project .
hg invalidate answer --reason "policy changed" --project .
hg run answer --project .
```

## Inspect

Deleting the path does not delete the Head; `materialize` restores it. `invalidate` preserves history but removes the current Receipt from reuse, so the next run creates a new Attempt.

[Back to the case library](index.md) · [Next: Failure and recovery](03-failure-resume.md)
