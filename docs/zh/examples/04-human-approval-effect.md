<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/04-human-approval-effect/">English</a></div>

# 04 · 人工审批与外部效果

这个案例把“提出建议”和“改变外部系统”分开：先产生 proposal，再等待 Human 决定，批准后才执行 Effect。

## 配置重点

```yaml
rules:
  - id: propose
    in: [request]
    out: [proposal]
    run:
      using: codex
      model: your-model-id
      command: "Write a proposal to out/proposal."
  - id: approve
    in: [proposal]
    out: [decision]
    run: { using: human, command: "Approve this proposal" }
  - id: publish
    in: [proposal, decision]
    out: [published]
    run: "cp in/proposal out/published"
    effect:
      idempotency: "publish-proposal-v1"
      readback: "verify published state"
```

## 运行

```bash
hg run published --project .
hg human pending --project . --output json
hg human decide --activation <ACTIVATION_KEY> --decision approve --project .
hg run published --project .
hg effect verify <EFFECT_KEY> --project .
```

## 观察什么

未完成审批时，发布 Rule 不应越过 Human 节点。批准后，Effect Receipt 记录幂等键与回读状态，便于判断外部动作是否已经完成。

[返回案例库](index.md) · [下一个：评审与修订](05-agent-review-revise.md)
