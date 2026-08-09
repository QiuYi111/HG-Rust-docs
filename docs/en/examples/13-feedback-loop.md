<div class="language-switch"><a href="../../../zh/examples/13-feedback-loop/">中文</a> · <strong>English</strong></div>

# 13 · Cyclic feedback

This case is a real cyclic graph. `draft` and `critique` form a strongly connected component. A `revise` decision reactivates `draft`; an `accept` decision suppresses the cycle and activates `finalize`. Every round retains immutable Revisions and Receipts.

## Graph structure

```yaml
version: 1

slots:
  seed: { kind: file, path: seed.md }
  draft: { kind: file, path: draft.md }
  critique: { kind: file, path: critique.json }
  report: { kind: file, path: report.md }

rules:
  - id: draft
    in: [seed, critique]
    out: [draft]
    when: >-
      test "$(jq -r '.decision' "$HG_IN/critique")" = revise ||
      test "$(jq -r '.seed_checksum' "$HG_IN/critique")" != "$(cksum "$HG_IN/seed" | cut -d' ' -f1)"
    run:
      using: codex
      model: gpt-5.6-luna
      reasoning_effort: none
      command: >-
        Use shell commands only, never apply_patch. You must execute exactly this command and do nothing else:
        seed_checksum=$(cksum in/seed | cut -d' ' -f1); reviewed_seed=$(jq -r '.seed_checksum' in/critique); if test "$reviewed_seed" != "$seed_checksum"; then printf '%s\n' '- Immutable revisions preserve every accepted state.' '- Receipts make accepted work resumable.' "<!-- seed:$seed_checksum stage:initial -->" > out/draft; else printf '%s\n' '- Immutable revisions preserve every accepted state.' '- Receipts make work resumable, while audit events preserve provenance.' "<!-- seed:$seed_checksum stage:revised -->" > out/draft; fi

  - id: critique
    in: [seed, draft, critique]
    out: [critique]
    when: >-
      test "$(jq -r '.seed_checksum' "$HG_IN/critique")" != "$(cksum "$HG_IN/seed" | cut -d' ' -f1)" ||
      test "$(jq -r '.draft_checksum' "$HG_IN/critique")" != "$(cksum "$HG_IN/draft" | cut -d' ' -f1)"
    run:
      using: codex
      model: gpt-5.6-luna
      reasoning_effort: none
      command: >-
        Use shell commands only, never apply_patch. You must execute exactly this command and do nothing else:
        seed_checksum=$(cksum in/seed | cut -d' ' -f1); draft_checksum=$(cksum in/draft | cut -d' ' -f1); round=$(( $(jq -r '.round // 0' in/critique) + 1 )); if grep -q 'audit events preserve provenance' in/draft; then decision=accept; feedback='accepted: provenance is explicit'; else decision=revise; feedback='add audit-event provenance'; fi; printf '{"decision":"%s","feedback":"%s","seed_checksum":"%s","draft_checksum":"%s","round":%s}\n' "$decision" "$feedback" "$seed_checksum" "$draft_checksum" "$round" > out/critique

  - id: finalize
    in: [seed, draft, critique]
    out: [report]
    when: >-
      test "$(jq -r '.decision' "$HG_IN/critique")" = accept &&
      test "$(jq -r '.seed_checksum' "$HG_IN/critique")" = "$(cksum "$HG_IN/seed" | cut -d' ' -f1)" &&
      test "$(jq -r '.draft_checksum' "$HG_IN/critique")" = "$(cksum "$HG_IN/draft" | cut -d' ' -f1)"
    run: "cp $HG_IN/draft $HG_OUT/report"
```

## One-shot bootstrap

The first round needs an auditable initial `critique` Revision. Create `critique.bootstrap.json`.

```json
{
  "decision": "revise",
  "feedback": "create the initial draft",
  "seed_checksum": "bootstrap",
  "draft_checksum": "bootstrap",
  "round": 0
}
```

Import the bootstrap only while `critique` has no Head.

```bash
hg init --project .
hg put seed seed.md --project .
hg put critique critique.bootstrap.json --bootstrap --project .
hg run report --project .
hg materialize draft --project .
hg materialize critique --project .
hg materialize report --project .
hg run report --project .
hg artifact history report --project .
```

After the first Head exists, `--bootstrap` is rejected. Later `critique` states can advance only through the declared Rule.

## What to observe

- The first reconciliation runs draft, critique, a revised draft, a second critique, and finally `finalize` to produce report.
- `accept` is eligible only when the seed and draft checksums match the current Heads. An old decision cannot approve new inputs.
- An unchanged second run reuses valid Receipts and creates no new Attempts.
- Changing seed invalidates the old acceptance, traverses the cycle again, and keeps every round in history.
- A small Attempt budget ends the GraphRun with `BUDGET_EXHAUSTED`. Already committed draft and critique Revisions remain queryable and recoverable.

[Back to the case library](index.md) · [Next: Hardware design](14-hardware-project.md)
