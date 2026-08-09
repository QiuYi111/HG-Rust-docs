<div class="language-switch"><strong>中文</strong> · <a href="../../en/model/">English</a></div>

# 对象模型

作者从 Slot 和 Rule 开始。其余对象由内核维护，用来保证版本、执行、提交、恢复、并发和解释具有同一份权威事实。

<div class="diagram">
  <img src="../../assets/model.svg" alt="Project、Slot、Rule、Revision、Activation、Attempt、Receipt 和 Event 的关系" />
</div>

## 作者模型 · Slot + Rule

### Slot · 稳定的 Artifact 名称

Slot 是图中的稳定名称，不等于文件路径。它有显式的 `kind`，可以选择物化路径，并可以声明写入策略。

```yaml
slots:
  request: { kind: file, path: request.txt }
  report: { kind: file, path: report.md }
```

Slot 的当前正式值是 **Head**，Head 指向不可变的 **Revision**。如果 Slot 没有 writer Rule，它通常是由 `hg put`、watcher、Webhook 或人工导入的 Source Slot；有 writer Rule 的 Slot 是 Derived Slot，外部不能直接把物化路径当成新 Head。

### Rule · 唯一的状态转换节点

Rule 声明输入 Slot、输出 Slot、执行器以及可选 Guard、Session、权限、预算和 Effect policy。

```yaml
rules:
  - id: make_report
    in: [request]
    out: [report]
    run:
      using: shell
      command: "cp $HG_IN/request $HG_OUT/report"
```

`in` / `out` 关系已经定义了依赖，不需要额外维护 Edge。分支、汇合和反馈环都由 Slot + Rule 组合产生；`refine_gate`、Human 和 Effect 也没有特殊节点语义。

## 内核对象

| 对象 | 精确定义 | 你会在哪里看到 |
|---|---|---|
| `GraphRevision` | 不可变的规范化图定义，包含 SlotSpec、RuleSpec 和目标索引 | `check`、`graph`、`inspect` |
| `Revision` | 可寻址、不可变的 Artifact 事实 | `artifact history`、`inspect` |
| `Head` | Slot 当前认可的 Revision 引用 | `status`、`explain` |
| `Materialization` | Revision 在文件、目录、Git 或外部系统中的投影 | `materialize`、`drift` |
| `Activation` | Rule 对精确输入 Revision 向量的逻辑需求 | `plan`、`events` |
| `Attempt` | 一次真实执行，可能是失败、重试或恢复 | `log`、`logs` |
| `Receipt` | 已验证并接受的 Attempt 终态证明 | `status`、缓存判断 |
| `Session` | 可跨多次 Attempt 复用的 Executor 上下文 | `session` 命令族 |
| `Lease` | 执行和提交的并发占用证明 | `inspect`、`events` |
| `Event` | 追加式事实流，用于观察、恢复和 UI 投影 | `events`、`watch` |
| `Effect` | 需要与外部系统交互的 Rule policy 和 Receipt | `effect verify` |

## Revision、Head 与 Materialization

```text
Slot ──head──> Revision ──materialize──> path / worktree / external system
```

- **Revision** 是历史中的不可变状态，内容通过 Digest 标识。
- **Head** 是某个 Slot 当前正式认可的 Revision。
- **Materialization** 是 Head 的可访问投影，可以缺失、损坏或漂移，但不能改写 Revision 历史。

删除 `report.md` 不会删除 `report` 的 Head。`hg materialize report` 可以从现有 Revision 恢复文件。手动修改文件后，`hg drift report` 会报告差异，外部内容也不会变成 Derived Slot 的新版本。

## Activation 如何由当前事实派生

给定 GraphRevision、Rule contract 和输入 Slot 的 Head，Activation Key 按以下方式计算。

```text
activation_key = H(
  graph_revision_id,
  contract_digest(rule),
  ordered[(slot_id, head_revision_id)]
)
```

Activation 表示一次逻辑需求。必需输入存在、Guard 为 `TRUE`、当前没有有效 Receipt、没有写冲突且预算允许时，它进入 desired/ready。

同一个 Activation 可以有多个 Attempt。Agent 的非确定性不会被假装成纯函数；系统记录每次 Attempt 的精确输入、执行器、Session checkpoint、候选输出和 checks，但最多接受一个 Receipt 处理当前 Activation。

## Receipt 如何判断缓存

有效 Receipt 至少需要满足以下条件。

- 状态为 `SUCCEEDED` 或 `NO_CHANGE`；
- 绑定相同 Activation Key；
- 所有输出 Revision 仍存在；
- 输出与当前 writer policy 和 Slot Head 关系一致；
- 结构校验规则仍属于当前 contract digest；
- Effect Rule 的 Readback 仍有效，或其 policy 明确允许只验证一次。

修改输入、Rule contract、执行器适配器、输出校验或 Effect policy，都会让下一次协调重新评估结果。文件存在本身不构成缓存命中。

## Attempt、Receipt 与 Session 的边界

```text
Activation  ──may have──> Attempt 1 ──may use──> Session A
     │                     Attempt 2 ──may use──> Session A or B
     │
     └────────────── accepted Attempt ──> Receipt ──> Slot Head update
```

- `Activation` 表示“需要处理当前输入向量”；
- `Attempt` 表示“实际执行了一次”；
- `Session` 只是可复用的执行缓存；
- `Receipt` 才是结果被验证并接受的证明。

每次 Session step 都必须接收当前完整契约和变化提示。Session 丢失只能影响效率，不能成为恢复正式状态的必要条件。

## 固定点与 GraphRun 终态

Runtime 从目标 Slot 计算 backward closure。只有在闭包内不存在待处理 Activation、运行中 Attempt、失败、阻塞、写冲突或 Materialization 错误，并且每个目标 Slot 都有有效 Head 时，GraphRun 才能达到 `STABLE_SUCCESS`。

这会带来几项结论。

- “没有可运行 Rule”不等于成功；
- 旧文件存在不等于目标 fresh；
- 反馈环通过新 Revision 触发下一轮，不需要 Loop 节点；
- 振荡、预算耗尽、缺少 Source 和 Guard 错误都必须保留各自的终态。
