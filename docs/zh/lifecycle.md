<div class="language-switch"><strong>中文</strong> · <a href="../../en/lifecycle/">English</a></div>

# 执行生命周期

HG-Rust 将“计划、执行、提交、复用和恢复”分成可以观察的阶段。状态名称会出现在结构化输出和事件中。

<div class="diagram">
  <img src="../../assets/lifecycle.svg" alt="Activation 与 Attempt 的主要生命周期状态" />
</div>

## 从目标到结果

1. **Desired**：目标的当前输入没有有效 Receipt，需要一次新的 Activation。
2. **Suppressed**：Guard 返回 FALSE，Rule 在当前输入下被有意抑制。
3. **Blocked**：缺少必要输入，系统无法安全推进。
4. **Running**：Attempt 已开始，执行器正在产生候选输出。
5. **Committing**：候选输出正在验证并提交；这是需要原子性保护的短窗口。
6. **Succeeded**：输出已形成新的 Revision，并写入 Receipt。
7. **Cached**：当前输入契约已经有可复用 Receipt。

失败、取消或预算耗尽不会被伪装成成功。用户可以查看原因后使用 `resume`、`retry` 或修改输入继续工作。

## Attempt 与 Receipt

Attempt 表示一次实际尝试，可能处于 `RUNNING`、`COMMITTING`、`SUCCEEDED`、`FAILED`、`CANCELLED` 或 `LOST`。Receipt 是 Attempt 的不可变终态记录，状态为 `SUCCEEDED` 或 `NO_CHANGE` 时可以作为复用依据。

## 并发与租约

多个 Worker 可以同时发现同一个目标，但只有持有当前租约并通过 fencing 检查的 Worker 才能提交 Head。这样可以避免旧 Worker 在新结果之后覆盖状态。

<div class="diagram">
  <img src="../../assets/lease.svg" alt="两个 Worker 竞争租约，只有持有租约的 Worker 提交结果" />
</div>

## Guard 的三态

`when` 是只读谓词：

| 结果 | 含义 | 影响 |
|---|---|---|
| TRUE | 条件满足 | Rule 可以进入 Activation |
| FALSE | 条件不满足 | Rule 被抑制，等待输入变化 |
| ERROR | 谓词无法可靠判断 | 运行报告错误，不把它当作 FALSE |

把 ERROR 与 FALSE 分开，可以避免“检查命令拼错”被误解为“业务条件不满足”。

## 稳定成功与可恢复性

`hg run` 会继续协调目标输入闭包，直到：

- 所有目标都新鲜，返回稳定成功；
- 目标没有变化但存在明确阻塞或失败状态；
- 缺少源输入，报告需要补充的 Slot；
- 达到尝试次数、成本或时间预算；
- 用户取消了当前 GraphRun。

用 `hg explain` 阅读原因，再决定是补输入、修复物化文件、使 Receipt 失效，还是恢复一个可继续的运行。
