<div class="language-switch"><strong>中文</strong> · <a href="../../en/glossary/">English</a></div>

# 术语表

| 术语 | 定义 |
|---|---|
| Artifact | 可以被读取、验证和版本化的结果，例如文件、目录、Git 树、流或不透明数据 |
| Slot | Artifact 在图中的稳定名称与期望位置 |
| Rule | 从输入 Slot 产生输出 Slot 的声明式转换 |
| Revision | Artifact 的不可变状态 |
| Head | Slot 当前指向的 Revision |
| Activation | 一个 Rule、一个精确输入向量和一个执行合约形成的协调单元 |
| Attempt | 对 Activation 的一次实际执行尝试 |
| Receipt | 证明 Activation 已成功或确认无需变化的终态记录 |
| Session | 可关联多个步骤的执行会话 |
| Guard | 在 Rule 前判断是否允许继续的谓词 |
| Effect | 需要改变外部系统的动作 |
| Materialization | 将 Head 的内容恢复到声明路径 |
| Drift | 物化文件与 Head 不一致 |
| Lease | 短期的执行所有权，用于保护并发提交 |
| Event | 描述状态变化的追加记录 |
| Fixed point | 目标及其输入闭包均满足新鲜条件的稳定状态 |

## 状态词

- **Fresh**：当前 Slot 的 Head 与有效 Receipt 一致。
- **Stale**：结果存在，但当前输入或规则要求重新评估。
- **Blocked**：缺少必要输入，无法安全执行。
- **Suppressed**：Guard 返回 FALSE，当前执行被抑制。
- **Failed**：最近一次尝试失败，需要检查原因。
- **NO_CHANGE**：执行确认不需要新的结果，但留下了明确 Receipt。
