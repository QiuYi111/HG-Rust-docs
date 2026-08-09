<div class="language-switch"><strong>中文</strong> · <a href="../../en/principles/">English</a></div>

# 核心哲学

HG-Rust 用版本化 Artifact 和可验证提交来协调自动化结果。它要回答一个严格的问题。

> **当前哪些 Artifact 已经无法由最新事实证明？**

需求、代码、测试报告、评审决定、Prompt、Memory、Skill、轨迹和外部事件都可以是 Artifact。HG-Rust 让这些事实进入同一个版本化模型，再由内核持续协调目标，直到结果达到固定点，或者明确说明为什么不能达到。

## 作者模型只有 Slot + Rule

作者声明两件事。

- **Slot**  一个稳定的 Artifact 名称
- **Rule**  消费一组 Slot、调用一个执行器、产生一组 Slot 的转换契约

`Revision`、`Activation`、`Attempt`、`Receipt`、`Session`、`Lease` 和 `Event` 是内核为正确性、恢复、并发和审计维护的事实。作者无需手工维护这些对象组成的第二套图语言。

```text
Slot + Rule
    │
    ├── 输入/输出关系投影依赖图
    ├── 新 Revision 触发下一轮协调
    └── 验证、提交、恢复与解释由内核负责
```

Rule 的 `in` / `out` 已经定义了因果关系，因此不需要再维护一份可能冲突的显式 Edge。分支、汇合、反馈环、人工决定和外部效果，都通过 Slot + Rule 的组合表达。

## 1. Slot 与路径分离

Slot 是稳定名字。它的当前正式值是 **Head**，Head 指向不可变的 **Artifact Revision**。

```text
Slot ──head──> immutable Revision
  │
  └──materialization──> file / directory / Git worktree / external projection
```

路径是 Materialization（物化）。这带来几条直接结果。

- 删除路径上的文件，不会删除历史 Revision；
- Materialization 损坏时，可以从 CAS 或 Git 恢复，而不必重新运行 Agent；
- 历史 Revision 不会因为路径被覆盖而消失；
- 工作区被手动修改时，系统报告 drift。外部修改不会变成 Derived Slot 的新事实。

这一区分把“曾经产生过什么”“当前 Head 是什么”“路径上现在有什么”从根本上分开。

## 2. Reconcile 面向目标事实

传统工作流常问“下一步执行哪个节点”。HG-Rust 先检查目标 Slot 的输入闭包，找出仍缺少当前事实证明的结果。

一次 `hg run` 会依次完成以下工作。

1. 从目标向上游计算 backward closure；
2. 根据当前 Slot Head 向量派生精确的 Activation；
3. 验证 Guard、Receipt、写入冲突和运行预算；
4. 执行尚未被有效证明的 Activation；
5. 提交新的 Revision，并由事件驱动下一轮派生；
6. 直到目标达到固定点，或进入可解释的终态。

成功还需要目标 Head、有效 Receipt 和完整的输入闭包。缺少 Source、Guard 错误、失败、写冲突、Materialization 退化、预算耗尽和振荡，都必须以不同的状态报告。

反馈环也不需要专用的 Loop 节点。一次成功提交产生新的 Revision，依赖它的 Rule 自然获得新的 Activation。SCC 只用于预算、公平调度、Session 生命周期和振荡诊断，不偷偷规定执行顺序。

## 3. 因果必须显式，不能藏在路径或记忆里

任何会影响下游结果的持久状态，都要进入以下位置之一。

- Rule 的显式输入 Slot；或
- 会进入规范化 Rule contract digest 的执行配置。

这会带来几条约束。

- Prompt、Memory、Skill、模型配置和 provider options 不能只存在于进程上下文；
- Transcript 如果要影响下游，必须作为声明的输出 Slot；
- 动态改图必须输出 `graph_patch` Artifact，经校验后在 reconcile barrier 切换 GraphRevision；
- Session 的旧记忆不能成为当前事实的隐藏输入。

显式因果闭包让系统能够回答“这个 Revision 基于哪些输入产生”，也让输入变化可以可靠地使旧 Receipt 失效。

## 4. Activation、Attempt、Session 各自只有一种含义

这是 HG-Rust 处理 Agent 非确定性、失败和长生命周期执行的关键拆分。

| 对象 | 它表示什么 | 它不表示什么 |
|---|---|---|
| `Activation` | 某条 Rule 对一组精确输入 Revision 的逻辑需求 | 进程与聊天会话之外的逻辑对象 |
| `Attempt` | 该 Activation 的一次真实执行 | 尚未被接受为项目结果的执行记录 |
| `Session` | 可跨多个 Attempt 复用的执行器上下文 | 执行缓存 |
| `Receipt` | 已验证并接受的 Attempt 终态证明 | 具有提交语义的事实记录 |

Activation Key 由 GraphRevision、Rule contract 和有序输入 Revision 向量共同决定。

```text
activation_key = H(
  graph_revision,
  rule_contract,
  [(slot_id, head_revision_id)]
)
```

同一个 Activation 可以有多次 Attempt，因为 Agent 可能失败、重试或在 Session 恢复后继续。每次执行仍必须接收当前完整契约；Session 只能减少冷启动和重复上下文，丢失 Session 只能降低效率，不能破坏正式状态的恢复。

## 5. Receipt 负责提交证明

一个成功结果必须同时满足以下条件。

1. Attempt 已到达持久终态；
2. 所有声明输出通过 kind、结构和路径边界校验；
3. 候选 Revision 已写入内容寻址存储；
4. Receipt 与 Slot Head 在同一数据库事务中提交；
5. 提交时 Lease fencing token 仍然有效。

只有 `SUCCEEDED` 或 `NO_CHANGE` 且仍满足当前输入、输出和校验条件的 Receipt，才可以处理当前 Activation。文件存在、进程成功退出或旧日志存在，都不足以构成缓存命中。

逻辑提交先于物化。路径更新失败时，内核保留已经提交的 Revision，并把问题标记为可修复的 Materialization 退化。系统无需重新执行昂贵的 Agent。

## 6. 失败、冲突和副作用都是正式事实

异常会进入可查询的 Attempt、Activation 和 GraphRun 状态。暂时没有执行也会保留原因。典型 GraphRun 终态包括。

- `STABLE_SUCCESS`  目标闭包达到固定点
- `STABLE_NO_TARGET_CHANGE`  没有目标变化，但结果稳定
- `BLOCKED_MISSING_SOURCE`  缺少必要的 Source Revision
- `FAILED`  执行、Guard 或业务校验失败
- `WRITE_CONFLICT`  多个写入者同时成立且没有裁决
- `BUDGET_EXHAUSTED` / `OSCILLATION_DETECTED`  治理限制阻止继续推进
- `CANCELLED` / `DEGRADED_MATERIALIZATION`  取消或物化需要处理

默认单写。多 writer 必须显式声明 arbitration policy；不能依靠 YAML 顺序、字典序或“最后写入者获胜”隐藏解决冲突。

外部发布、发送消息、部署或采购仍然是普通 Rule，但必须声明 Effect policy。它们通过幂等键、Readback 和结构化 Effect Receipt 处理“远端已经成功、本地提交前崩溃”的不确定窗口。Human Rule 同样必须绑定精确的 Activation Key 和输入 Revision，旧批准不能自动覆盖新事实。

## 7. 内核提供通用机制，不拥有领域认知政策

`refine_gate`、repair、promotion、rollback、Human、Effect、Memory 和 Skill 都使用普通 Rule。对 Runtime 来说，以下图具有同一种语义。

```text
test_report  -> repair_gate  -> repair
CAD_review   -> redesign_gate -> redesign
trajectory   -> refine_gate  -> refine
```

它们都只是消费 Revision、经过 Guard、产生 Revision、写入 Receipt 的普通 Rule。领域判断进入可版本化的 Policy、Validator、Skill、Adapter 或图模板；内核只保证输入隔离、调度、提交、恢复、权限和审计。

这让同一套内核可以承载软件开发、文档生产、科研实验、硬件设计和 Agent 协作，而不必为每种领域不断增加新的节点语义。

## 形式模型

```text
State       = Slot Heads over immutable Artifact Revisions
Transition  = Rule
Trigger     = unhandled current input Revision vector
Acceptance  = validation + fenced atomic commit
History     = Attempt + Receipt + Event
Caching     = valid committed Receipt
Concurrency = Lease + writer arbitration
Continuity  = optional Executor Session
```

## 四个容易混淆的场景

| 场景 | HG-Rust 的判断 |
|---|---|
| 输入需求更新 | 新需求 Revision 改变输入向量，旧 Receipt 不再证明当前结果，相关 Activation 重新派生 |
| 输出文件被删除 | Head 和 Receipt 仍然有效；`materialize` 恢复路径，不重跑 Rule |
| Agent 在提交前崩溃 | Attempt 留下失败或丢失终态；没有 Receipt 就没有正式输出，后续可安全重试 |
| 外部发布结果未知 | 先用 Effect key 和 Readback 确认远端状态，再决定是否重试 |

这就是“Artifact 原生、状态化、反应式、可恢复且受治理”的含义。作者语言保持极小，正确性复杂度由内核集中承担。
