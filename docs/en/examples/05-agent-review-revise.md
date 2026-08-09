<div class="language-switch"><a href="../../../zh/examples/05-agent-review-revise/">中文</a> · <strong>English</strong></div>

# 05 · Review and revision

An Agent produces a draft, a deterministic Review Rule evaluates it, and a revision Rule receives both artifacts. The three-step chain remains explainable.

## Configuration focus

```yaml
rules:
  - id: draft
    in: [request]
    out: [draft]
    run: { using: codex, model: your-model-id, command: "Write draft to out/draft." }
  - id: review
    in: [draft]
    out: [review]
    run: "test -s in/draft && printf 'Make the draft concise.\\n' > out/review"
  - id: revise
    in: [draft, review]
    out: [final]
    run: { using: codex, model: your-model-id, command: "Revise in/draft using in/review." }
```

## Run it

```bash
hg run final --project .
hg explain final --project .
hg artifact history final --project .
```

Each stage is an Artifact. If only the review changes, the revision step can be reconciled without discarding a still-valid draft.

[Back to the case library](index.md) · [Next: Subgraph](06-subgraph-project.md)
