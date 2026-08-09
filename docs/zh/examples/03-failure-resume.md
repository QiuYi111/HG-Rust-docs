<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/03-failure-resume/">English</a></div>

# 03 · 失败与恢复

前一个 Rule 先提交草稿，后一个 Rule 受 `gate` 控制。第一次发布失败时，已提交草稿仍然可以在下一次运行中复用。

## 配置重点

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

## 运行

```bash
printf 'block\n' > gate.txt
hg put gate gate.txt --project .
hg run final --project . || true

printf 'allow\n' > gate.txt
hg put gate gate.txt --project .
hg run final --project .
```

## 观察什么

失败的下游 Attempt 不会回滚上游已经提交的 Revision。输入变化后，协调器只重新评估受影响的部分。

[返回案例库](index.md) · [下一个：人工审批与外部效果](04-human-approval-effect.md)
