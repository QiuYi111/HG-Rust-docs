<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/13-feedback-loop/">English</a></div>

# 13 · 循环反馈

这个案例展示一个真正的循环图。`draft` 和 `critique` 组成强连通分量，`critique` 给出 `revise` 时重新激活 `draft`，给出 `accept` 时抑制循环并激活 `finalize`。每一轮都保留不可变 Revision 和 Receipt。

## 图结构

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

## 一次性 bootstrap

循环的第一轮需要一个可审计的初始 `critique` Revision。准备一个 `critique.bootstrap.json`。

```json
{
  "decision": "revise",
  "feedback": "create the initial draft",
  "seed_checksum": "bootstrap",
  "draft_checksum": "bootstrap",
  "round": 0
}
```

只在 `critique` 尚无 Head 时导入 bootstrap。

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

建立首个 Head 后，`--bootstrap` 会被拒绝。后续 `critique` 状态只能由声明的 Rule 推进。

## 观察什么

- 首次协调会经历 draft、critique、修订后的 draft、第二次 critique，最后由 `finalize` 产生 report。
- `accept` 只在 seed 和 draft 校验摘要都匹配当前 Head 时生效，旧决定无法批准新输入。
- 未修改输入时，第二次运行复用有效 Receipt，不创建新的 Attempt。
- 修改 seed 会使旧接受结果失去资格，协调器重新穿过循环并保留各轮历史。
- 给 GraphRun 设置较小的 Attempt 预算，会得到 `BUDGET_EXHAUSTED`。已经提交的 draft 和 critique Revision 仍然可查询和恢复。

[返回案例库](index.md) · [下一个 · 硬件设计](14-hardware-project.md)
