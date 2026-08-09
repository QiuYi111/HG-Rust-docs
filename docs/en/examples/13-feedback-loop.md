<div class="language-switch"><a href="../../../zh/examples/13-feedback-loop/">中文</a> · <strong>English</strong></div>

# 13 · Feedback loop

Split a complex result into draft → critique → revise. Each stage is an Artifact, and later runs can continue along its existing history.

## Graph structure

```yaml
rules:
  - id: draft
    in: [seed]
    out: [draft]
    run: { using: codex, model: your-model-id, command: "Write a draft to out/draft." }
  - id: critique
    in: [seed, draft]
    out: [critique]
    run: { using: codex, model: your-model-id, command: "Review in/draft and write out/critique." }
  - id: revise
    in: [seed, draft, critique]
    out: [report]
    run: { using: codex, model: your-model-id, command: "Write the revised result to out/report." }
```

## Run it

```bash
hg put seed seed.md --project .
hg run report --project .
hg materialize draft --project .
hg materialize critique --project .
hg materialize report --project .
hg artifact history report --project .
```

Changing the seed creates a new input Revision and new downstream artifacts. Unaffected history remains available for comparison and explanation.

[Back to the case library](index.md) · [Next: Hardware design](14-hardware-project.md)
