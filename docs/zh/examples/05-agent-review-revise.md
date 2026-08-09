<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/05-agent-review-revise/">English</a></div>

# 05 · 评审与修订

这个案例展示一个两次 Agent 执行包围确定性评审的流程。最终 Rule 同时产生修订文档和结构化元数据，两个输出在同一份 Receipt 中完成原子提交。

## 配置重点

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

## 运行

```bash
hg put request request.txt --project .
hg run final --project .
hg materialize final --project .
hg materialize revision_meta --project .
hg explain final --project .
hg artifact history final --project .
```

## 观察什么

- `draft` 和 `review` 分别拥有自己的 Revision 与 Receipt。
- `revise` 的两个输出一起通过校验并提交。缺少任一输出时，整个输出集都不会成为新的 Head。
- 只修改评审意见时，仍然有效的 draft 可以复用，修订步骤根据新的输入向量重新协调。
- `revision_meta` 记录修订结果的结构化信息，便于下游 Rule 查询，不需要解析 Agent 日志。

[返回案例库](index.md) · [下一个 · 子图](06-subgraph-project.md)
