<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/02-cache-invalidate-repair/">English</a></div>

# 02 · 缓存、失效与修复

这个案例展示三种不同状态：结果可以复用，物化文件可以修复，Receipt 也可以被明确失效。

## 配置重点

```yaml
rules:
  - id: answer
    in: [request]
    out: [answer]
    run: "printf 'An accepted revision is reusable.\\n' > out/answer"
```

## 运行

```bash
hg run answer --project .
hg run answer --project .
rm answer.md
hg drift --project .
hg materialize answer --project .
hg invalidate answer --reason "policy changed" --project .
hg run answer --project .
```

## 观察什么

删除路径上的文件不会删除 Head；`materialize` 可以恢复它。`invalidate` 不删除历史，而是让当前 Receipt 不再作为复用依据，下一次运行会产生新的 Attempt。

[返回案例库](index.md) · [下一个：失败与恢复](03-failure-resume.md)
