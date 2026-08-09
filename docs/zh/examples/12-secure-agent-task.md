<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/12-secure-agent-task/">English</a></div>

# 12 · 受限的代理任务

这个案例展示如何让执行器只获得声明过的秘密句柄，并把结果限制为“是否存在”。秘密不会写入 Artifact 或日志。

## 配置重点

```yaml
rules:
  - id: inspect_token
    in: [request]
    out: [token_status]
    permissions:
      network: none
      secrets: [APP_TOKEN]
    run:
      using: codex
      model: your-model-id
      command: >-
        if test -n "$HG_SECRET_APP_TOKEN";
        then printf PRESENT > out/token_status;
        else printf MISSING > out/token_status; fi
```

## 运行

```bash
export HG_SECRET_APP_TOKEN='synthetic-test-value'
hg run token_status --project .
hg materialize token_status --project .
hg logs <ATTEMPT_ID> --project .
```

## 观察什么

配置中只出现句柄名 `APP_TOKEN`；实际值来自运行环境。输出只表示存在性，日志中的秘密值会被脱敏。示例使用合成值，真实凭证应由你的密钥管理系统提供。

[返回案例库](index.md) · [下一个：反馈循环](13-feedback-loop.md)
