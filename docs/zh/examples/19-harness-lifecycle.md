<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/19-harness-lifecycle/">English</a></div>

# 19 · Harness Lifecycle：把工程治理变成图

这个案例把一次完整的 spec-governed 工程生命周期作为 HG 图运行：先质询产品定义，隔离过期的人工回答；对 `core` 风险要求第二次人工决定；生成 spec、plan 和 tasks；拒绝 TDD-RED 角色越权；由 Luna Supervisor 只发出一个有界任务，交给真实 OpenCode worker；最后评估、审查并把结果提交为可持久化的 Git Revision。

完整案例在 [Harness Lifecycle 目录](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/harness-lifecycle)。

## 生命周期图

```text
product brief → Luna grill → Human clarification ─┐
                                                  ├→ risk classify → Human core approval
stale response fencing ───────────────────────────┘
   ↓
spec → plan → tasks → role-boundary check → Luna Supervisor → OpenCode worker
   ↓
eval → review → durable Git Revision + lifecycle manifest
```

两个 Human gate 都绑定具体 Activation。输入变化后，旧响应即使格式正确也不能解锁新的工作，这避免“批准了旧问题，却释放了新执行”。角色检查则证明 TDD-RED 不能写实现文件。

## 运行

```bash
scripts/test-real-world-cases.sh harness-lifecycle contract
scripts/test-real-world-cases.sh harness-lifecycle live
```

live profile 使用现有 Codex/OpenCode 凭证句柄，但不会把凭证复制到 Slot、Receipt 或最终 Git 仓库。成功报告应包含：

- `stale_answer_rejected: true`；
- `core_suppressed: true`，直到第二次 Human 决定；
- `role_violation_rejected: true`；
- `opencode_worker: true`；
- 一个最终 Git commit；
- `harness-lifecycle/v1` manifest。

## 对内核的意义

该案例直接验证 Codex checkpoint 的产生、精确 Human 文件 Revision、stale
fencing，以及 Git Artifact 输出；Codex resume 合约由独立的内核回归验证，
不是本案例单独得出的结论。Git 输出只接受干净且存在 HEAD 的工作树；内核先
镜像 commit，再提交 locator，因此后续可以物化并缓存该结果，而不依赖原始临时目录。

Supervisor/worker 的边界也刻意保持窄：一个迭代、明确允许/禁止文件、明确验收和报告路径。HG 记录协调证据，但不把 Agent 的文字承诺当作已验证结果。

## 当前实测数据

五次成功 live 样本耗时为 75.849、62.541、88.272、55.498、58.801 秒；观测 p95 为 88.272 秒。每次基准路径 14 个 Attempt、未变重跑仍为 14，并产生一个最终 Git commit。正式时长、Token 和成本预算延期校准。

## 适用边界

这个案例证明治理规则可以被执行、拒绝和审计，但不替代组织授权。`core`/`infra` 决策、发布权限和最终合并仍由人类所有者负责。

[返回案例库](index.md) · [查看反馈循环基础案例](13-feedback-loop.md)
