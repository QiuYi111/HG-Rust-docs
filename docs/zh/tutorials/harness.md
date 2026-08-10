# Harness Lifecycle

这个案例把一段受规格约束的软件工程生命周期放进 HG。产品定义、可行性、批准、spec、plan、tasks、worker 报告、评估与评审都成为有 Revision 的工件。

<div class="hg-diagram">
  <img src="../../../assets/diagrams/harness.zh.svg" alt="Harness 生命周期图">
</div>

## 看懂三个边界

第一处 Human Rule 回答产品定义问题。风险评估得到 `core` 后，第二处 Human Rule 单独批准核心变更。两个决定绑定到不同输入前沿。

角色检查会故意拒绝 TDD-RED 对实现文件的写入。Supervisor 只生成一个有边界的 `next_task`，OpenCode worker 完成一次迭代并写回报告。最后的 Rule 把所有证据提交为 Git Revision。

## 运行合约路径

```bash
scripts/test-real-world-cases.sh harness-lifecycle contract
```

完成后应验证过期人工回答被隔离、核心风险需要第二次决定、角色越界被拒绝，以及最终 Git 工件包含 spec、eval 与 report。

## 运行真实边界

```bash
scripts/test-real-world-cases.sh harness-lifecycle live
```

live 使用现有 Codex 与 OpenCode 凭据句柄。凭据不会复制进 Slot、Receipt 或最终仓库。完整规则见 `examples/05-harness-lifecycle/harness.yaml`。
