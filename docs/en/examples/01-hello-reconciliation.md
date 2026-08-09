<div class="language-switch"><a href="../../../zh/examples/01-hello-reconciliation/">中文</a> · <strong>English</strong></div>

# 01 · Minimal reconciliation

The smallest useful graph imports a request, produces a greeting file, and then demonstrates Receipt reuse on a second run.

## Configuration focus

```yaml
slots:
  request: { kind: file, path: request.txt }
  greeting: { kind: file, path: greeting.md }
rules:
  - id: greet
    in: [request]
    out: [greeting]
    run: "printf '# Hello\\n' > out/greeting"
```

## Run it

```bash
hg init --project .
hg put request request.txt --project .
hg run greeting --project .
hg materialize greeting --project .
hg run greeting --project .
```

## Inspect

The first run creates a Revision and Receipt. The second run has the same inputs and Rule contract, so it does not need to produce the result again. Use `hg explain greeting` to see the decision.

[Back to the case library](index.md) · [Next: Cache, invalidate, repair](02-cache-invalidate-repair.md)
