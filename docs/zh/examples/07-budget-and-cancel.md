<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/07-budget-and-cancel/">English</a></div>

# 07 · 预算与取消

预算让“持续尝试”变成有边界的行为。这个案例分别演示时间预算、尝试次数预算和运行取消。

## 配置重点

```yaml
rules:
  - id: report
    in: [request]
    out: [report]
    limits:
      timeout: 120
      max_attempts: 1
    run: "cp in/request out/report"
```

## 运行

```bash
hg run report --budget-duration 0 --project . || true
hg run report --budget-duration 120 --project .
hg run report --detach --project .
hg runs --project . --output json
hg cancel <RUN_ID> --project .
```

## 观察什么

预算耗尽会产生明确的终态，不会把未完成的结果当作成功。取消会停止当前运行，同时保留已经提交的上游事实。

[返回案例库](index.md) · [下一个：条件守卫](08-guards-conditional-flow.md)
