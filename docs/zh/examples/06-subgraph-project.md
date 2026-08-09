<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/06-subgraph-project/">English</a></div>

# 06 · 子图

当一个流程需要独立维护时，可以让父图通过一个明确的 Slot 边界调用子图。父图只关心输入、输出和子图事件。

## 父图

```yaml
rules:
  - id: delegate
    in: [request]
    out: [answer]
    run: { using: subgraph, command: "child.yaml" }
```

## 子图

```yaml
version: 1
slots:
  request: { kind: file, path: request.txt }
  answer: { kind: file, path: answer.md }
rules:
  - id: answer
    in: [request]
    out: [answer]
    run: "cp in/request out/answer"
```

## 运行

```bash
hg run answer --project . --output json
hg events --project . --output json
```

## 观察什么

父图的事件流会记录子图运行。输入输出边界清晰时，团队可以分别理解和验证每个图。

[返回案例库](index.md) · [下一个：预算与取消](07-budget-and-cancel.md)
