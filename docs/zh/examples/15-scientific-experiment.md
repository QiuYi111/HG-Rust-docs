<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/15-scientific-experiment/">English</a></div>

# 15 · 科学实验

从 CSV 数据生成 observations，再生成带局限说明的报告。这个案例强调：产物可追溯不等于结论自动成立。

## 图结构

```text
data.csv ──> observations ──> report
       \────────────────────> report
```

## 配置重点

```yaml
rules:
  - id: observe
    in: [data]
    out: [observations]
    run: { using: codex, model: your-model-id, command: "Read in/data and write observations to out/observations." }
  - id: report
    in: [data, observations]
    out: [report]
    run: "cat in/observations > out/report"
```

## 运行

```bash
hg put data data.csv --project .
hg run report --project .
hg materialize observations --project .
hg materialize report --project .
hg artifact history report --project .
```

## 观察什么

数据、观察和报告各自拥有 Revision。重新导入数据会触发新的观察和报告；报告应明确记录样本量、假设和不能由当前数据支持的结论。

[返回案例库](index.md) · [返回案例总览](index.md)
