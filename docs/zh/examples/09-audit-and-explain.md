<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/09-audit-and-explain/">English</a></div>

# 09 · 审计与解释

这个案例专门练习如何从“结果是什么”追溯到“为什么得到这个结果”。

## 运行

```bash
hg plan answer --project .
hg run answer --project .
hg status --project . --output json
hg explain answer --project . --output json
hg artifact history answer --project . --output json
hg events --project . --output json
hg log --project . --output json
hg logs <ATTEMPT_ID> --project .
```

## 观察什么

把 `status`、`explain`、事件、Artifact 历史和 Attempt 日志放在一起，可以建立完整因果链：输入 Revision → Rule 合约 → Attempt → 验证 → 输出 Revision → Receipt。

这个顺序也适合生成交接记录或自动化诊断报告。

[返回案例库](index.md) · [下一个：并发与租约](10-concurrent-workers-leases.md)
