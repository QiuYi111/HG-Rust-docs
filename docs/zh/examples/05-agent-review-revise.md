<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/05-agent-review-revise/">English</a></div>

# 05 · 评审与修订

这个案例把 Agent 产出的草稿交给确定性的 Review Rule，再把评审结果提供给修订 Rule，形成可解释的三步链。

## 配置重点

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

## 运行

```bash
hg run final --project .
hg explain final --project .
hg artifact history final --project .
```

## 观察什么

每一步都是独立的 Artifact。只修改评审意见时，可以重新协调修订步骤，而不必丢弃仍然有效的草稿。

[返回案例库](index.md) · [下一个：子图](06-subgraph-project.md)
