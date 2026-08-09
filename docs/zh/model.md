<div class="language-switch"><strong>中文</strong> · <a href="../../en/model/">English</a></div>

# 对象模型

作者只需要从 Slot 和 Rule 开始；其余对象由内核为执行、提交、恢复与解释提供证据。

<div class="diagram">
  <img src="../../assets/model.svg" alt="Project、Slot、Rule、Revision、Activation、Attempt、Receipt 和 Event 的关系" />
</div>

## 作者模型：Slot + Rule

### Slot

Slot 是一个有稳定名称的期望产物。它有明确的 `kind`，可以选择一个物化路径，并可以声明写入策略。

```yaml
slots:
  request: { kind: file, path: request.txt }
  report: { kind: file, path: report.md }
```

Slot 的名称参与依赖关系；路径只是让人和外部工具可以读取结果。

### Rule

Rule 描述输入 Slot 如何产生输出 Slot：

```yaml
rules:
  - id: make_report
    in: [request]
    out: [report]
    run: "cp in/request out/report"
```

一个 Rule 可以有多个输入和多个输出。内核根据输入 Head、Rule 合约和历史 Receipt 判断它是否需要 Activation。

## 内核记录

| 对象 | 含义 | 你会在哪里看到 |
|---|---|---|
| Revision | 一个不可变的 Artifact 状态 | `artifact history`、`inspect` |
| Activation | 某个 Rule 对一组精确输入的执行契约 | `plan`、`events` |
| Attempt | 对该契约的一次实际尝试 | `log`、`logs` |
| Receipt | 已验证结果或 `NO_CHANGE` 的终态证明 | `status`、缓存判断 |
| Session | 可持续、可恢复或可复用的执行会话 | `session` 命令族 |
| Event | 状态变化的追加记录 | `events`、`watch` |
| Effect | 需要与外部系统交互的动作 | `effect verify` |

## Revision、Head 与物化

- **Revision** 是历史中的不可变状态。
- **Head** 是某个 Slot 当前认可的 Revision。
- **Materialization** 是把 Head 恢复到配置中声明的路径。

删除 `report.md` 不会删除 `report` 的 Head。运行 `hg materialize report` 可以从 Head 恢复文件；如果文件被手动改过，`hg drift report` 会把这个差异报告出来。

## Receipt 如何判断缓存

有效 Receipt 至少需要与以下内容匹配：

- 输入 Slot 的 Revision 向量；
- Rule 的规范化执行合约；
- 执行器适配器指纹；
- Guard、写入冲突和验证结果。

因此，修改输入、Rule、执行器或策略，都会让下一次协调重新评估结果。

## 固定点

当目标及其输入闭包都满足新鲜条件时，GraphRun 达到稳定成功。存在一个旧文件并不足以形成固定点；系统还要确认当前输入和 Receipt 仍然一致。
