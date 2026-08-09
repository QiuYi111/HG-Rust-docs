<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/13-feedback-loop/">English</a></div>

# 13 · 反馈循环

反馈循环把一次复杂产出拆为 draft → critique → revise。每个阶段都是独立的 Artifact，重新运行时可以沿已有历史继续。

## 图结构

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

## 运行

```bash
hg put seed seed.md --project .
hg run report --project .
hg materialize draft --project .
hg materialize critique --project .
hg materialize report --project .
hg artifact history report --project .
```

## 观察什么

修改 seed 会建立新的输入 Revision，沿依赖图产生新的草稿、批评和报告；不受影响的历史仍然可解释、可比较。

[返回案例库](index.md) · [下一个：硬件设计](14-hardware-project.md)
