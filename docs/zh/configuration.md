# 配置与执行器

先写最小的 Slot 与 Rule，只有遇到真实约束时再加入策略。这样更容易看清图的依赖，也更接近 HarnessGraph 的作者模型。

## 最小配置

```yaml
version: 1
project:
  name: hello-reconciliation
  default_targets: [greeting]
slots:
  request: { kind: file, path: request.txt }
  greeting: { kind: file, path: greeting.md }
rules:
  - id: greet
    in: [request]
    out: [greeting]
    run: "{ printf '# Hello\\n\\n'; cat in/request; } > out/greeting"
```

## Slot 类型

单个文件使用 `file`，目录树使用 `dir`。需要提交身份和历史时，选择 `git`。`path` 是物化路径，不是运行时工作目录。

## Rule 策略

`permissions` 声明网络与 secret 边界。`limits` 控制超时和最大尝试次数。`session` 决定 Agent 会话是否复用。`when` 表达当前输入上的资格判断。

```yaml
permissions: { network: none, secrets: [] }
limits: { timeout: 900, max_attempts: 2 }
session: { policy: reuse, scope: project }
```

这些字段约束执行，不改变 Slot 与 Rule 之间的依赖。

## Executor ABI

执行器看到统一的会话目录。输入挂载在 `in/`，Rule 只能把声明过的结果写到 `out/`。内核检查输出后再提交 Revision。

Shell 最适合确定性工具。Codex 等 Agent 执行器适合开放式语义任务。Human 执行器适合需要人承担责任的决定。选择执行器时先看任务性质，再看是否需要网络、凭据、长会话或外部副作用。

完整命令见 [CLI 与运行](reference.md)。真实配置可以直接查看 [案例路线](tutorials/index.md) 中链接的 `harness.yaml`。
