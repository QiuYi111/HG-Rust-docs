<div class="language-switch"><strong>中文</strong> · <a href="../../en/executors/">English</a></div>

# 执行器与策略

Rule 负责声明结果关系，Executor 负责完成一次具体转换。执行器写在 Rule 的 `run` 中，每条 Rule 都能清楚表达自己的执行协议。

## 执行器类型

| `using` | 用途 | 适合的工作 |
|---|---|---|
| `shell` | 在隔离工作目录中运行命令 | 确定性转换、校验、组装 |
| `codex` | 调用兼容的 Agent 适配器 | 需要自然语言任务和模型推理的步骤 |
| `prime` | 调用已配置的交互式服务 | 需要外部 Agent 服务的步骤 |
| `human` | 等待人工决定并产生决定 Artifact | 审批、发布确认、风险判断 |
| `subgraph` | 调用另一个 HarnessGraph 图 | 把大型流程拆成有边界的子图 |

## Shell Rule

字符串形式是最短写法，默认使用 `shell`：

```yaml
rules:
  - id: assemble
    in: [draft, review]
    out: [report]
    run: "cat in/draft in/review > out/report"
```

执行目录中提供 `HG_IN`、`HG_OUT` 等环境变量；使用 `in/` 与 `out/` 的相对路径可以让命令与项目路径解耦。

## Agent Rule

需要 Agent 参与时使用映射形式：

```yaml
rules:
  - id: summarize
    in: [source]
    out: [summary]
    run:
      using: codex
      model: your-model-id
      reasoning_effort: balanced
      command: >-
        Read in/source and write a concise Markdown summary to out/summary.
```

`model` 和 `reasoning_effort` 会成为执行合约的一部分。请使用你的发行环境中实际可用的模型标识；不要把访问令牌写进配置文件。

## Human Rule

人工节点是有记录的输入，交互过程也进入内核事实。

```yaml
rules:
  - id: approve
    in: [proposal]
    out: [decision]
    run: { using: human, command: "Approve or reject this proposal" }
```

运行后使用 `hg human pending` 查看待处理决定，使用 `hg human decide` 写入决定。

## Subgraph Rule

父图可以通过 `subgraph` 把一个 Slot 边界交给子图：

```yaml
rules:
  - id: generate_report
    in: [request]
    out: [report]
    run: { using: subgraph, command: "report.yaml" }
```

子图配置路径必须位于项目允许的范围内；父图会记录一次子图运行事件，便于解释跨图结果。

## Session 策略

需要保留或复用会话时，可以声明：

```yaml
session:
  policy: reuse
  scope: graph_run
```

`policy` 支持 `once`、`new`、`reuse`；`scope` 支持 `attempt`、`graph_run`、`project`。是否真正支持 checkpoint 与连续会话取决于所选执行器的能力。

## 执行边界

执行器只应把候选产物写入 `out/`。HG-Rust 会在提交前验证输出、检查写入冲突，并把日志中的已声明秘密替换为脱敏标记。

Shell 与 Codex 子进程的 stdout/stderr 会被并发排空；每个 stream 只保留最新
256 KiB 的脱敏尾部，避免子进程因任一管道塞满而死锁。Unix 取消/超时针对
整个 process group，先请求终止并在宽限期后强制结束仍存活的进程。

Codex 成功步骤必须提供真实 `thread.started` checkpoint；resume 使用当前
`codex exec resume` 参数合约，缺失或无效的 thread 会成为可见失败。

显式 `network` 策略当前由 macOS `sandbox-exec` 强制。allow 模式只暴露本地
精确主机过滤代理，并拒绝直接出口、未允许的重定向和私网解析；其他平台在
无法提供同等强制时会在启动子进程前失败。未声明显式策略的 Rule 不应被理解
为自动获得这层隔离保证。
