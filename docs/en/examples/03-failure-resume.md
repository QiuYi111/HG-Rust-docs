<div class="language-switch"><a href="../../../zh/examples/03-failure-resume/">中文</a> · <strong>English</strong></div>

# 03 · Failure and recovery

One Rule commits a draft first; a downstream Rule is controlled by a `gate`. When publication fails on the first run, the committed draft remains reusable on the next run.

## Configuration focus

```yaml
rules:
  - id: draft
    in: [request]
    out: [draft]
    run: "printf 'Committed draft.\\n' > out/draft"
  - id: publish
    in: [draft, gate]
    out: [final]
    run: "test \"$(cat in/gate)\" = allow && cp in/draft out/final"
```

## Run it

```bash
printf 'block\n' > gate.txt
hg put gate gate.txt --project .
hg run final --project . || true

printf 'allow\n' > gate.txt
hg put gate gate.txt --project .
hg run final --project .
```

## Inspect

A failed downstream Attempt does not roll back an upstream Revision that was already committed. When the input changes, the coordinator reassesses only the affected part of the graph.

[Back to the case library](index.md) · [Next: Human approval and effects](04-human-approval-effect.md)
