<div class="language-switch"><a href="../../../zh/examples/05-agent-review-revise/">中文</a> · <strong>English</strong></div>

# 05 · Agent review and revision

This case places a deterministic review between two Agent executions. The final Rule produces both a revised document and structured metadata, and the two outputs are atomically accepted by one Receipt.

## Configuration focus

```yaml
version: 1

slots:
  request: { kind: file, path: request.txt }
  draft: { kind: file, path: draft.md }
  review: { kind: file, path: review.txt }
  final: { kind: file, path: final.md }
  revision_meta: { kind: file, path: revision-meta.json }

rules:
  - id: draft
    in: [request]
    out: [draft]
    run:
      using: codex
      model: gpt-5.6-luna
      reasoning_effort: none
      command: >-
        Use shell commands only, never apply_patch. You must execute exactly this command and do nothing else:
        printf '%s\n' '- Artifacts are immutable.' '- Receipts are reusable.' > out/draft

  - id: review
    in: [draft]
    out: [review]
    run: "printf 'Keep exactly two bullets and make each concise.' > out/review"

  - id: revise
    in: [draft, review]
    out: [final, revision_meta]
    run:
      using: codex
      model: gpt-5.6-luna
      reasoning_effort: none
      command: >-
        Use shell commands only, never apply_patch. You must execute exactly this command and do nothing else:
        cat in/review >/dev/null; printf '%s\n' '- Immutable artifacts preserve history.' '- Reusable Receipts avoid duplicate work.' > out/final; printf '{"review_applied":true,"bullet_count":2}\n' > out/revision_meta
```

## Run it

```bash
hg put request request.txt --project .
hg run final --project .
hg materialize final --project .
hg materialize revision_meta --project .
hg explain final --project .
hg artifact history final --project .
```

## What to observe

- `draft` and `review` each have their own Revision and Receipt.
- The two `revise` outputs pass validation and commit together. If either output is missing, the output set does not advance its Heads.
- When only the review changes, the still-valid draft can be reused and the revision step reconciles against the new input vector.
- `revision_meta` gives downstream Rules structured revision data without requiring them to parse an Agent log.

[Back to the case library](index.md) · [Next: Subgraph](06-subgraph-project.md)
