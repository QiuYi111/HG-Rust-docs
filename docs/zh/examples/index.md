<div class="language-switch"><strong>中文</strong> · <a href="../../en/examples/">English</a></div>

# 案例库

案例库从一个最小的结果转换开始，逐步加入缓存、恢复、人工决定、Agent、子图、预算、并发、秘密和领域工作。每个案例都围绕一个可以验证的输入 → 结果关系展开。

<div class="diagram">
  <img src="../../assets/case-library.svg" alt="案例从输入经过草稿、评审和观察生成报告，并保留历史解释" />
</div>

## 如何使用

每个案例页都包含：

- 要理解的能力；
- 关键 `harness.yaml` 片段；
- 推荐命令顺序；
- 运行后应该观察到的证据。

把案例复制到一个新的项目目录中，先运行 `hg check --strict`，再执行目标。示例中的模型标识和秘密句柄都是占位符，不包含任何访问凭证。

## 20 个案例

| 编号 | 案例 | 重点 |
|---:|---|---|
| 01 | [最小协调](01-hello-reconciliation.md) | Slot → Rule → Revision → Receipt |
| 02 | [缓存、失效与修复](02-cache-invalidate-repair.md) | Receipt 复用、漂移和强制重算 |
| 03 | [失败与恢复](03-failure-resume.md) | 上游已提交结果的继续使用 |
| 04 | [人工审批与外部效果](04-human-approval-effect.md) | Human、Effect、幂等与回读 |
| 05 | [评审与修订](05-agent-review-revise.md) | 草稿 → 评审 → 修订 |
| 06 | [子图](06-subgraph-project.md) | 父图与子图的明确边界 |
| 07 | [预算与取消](07-budget-and-cancel.md) | 尝试次数、时间预算和取消 |
| 08 | [条件守卫](08-guards-conditional-flow.md) | TRUE / FALSE / ERROR |
| 09 | [审计与解释](09-audit-and-explain.md) | 计划、事件、历史与日志 |
| 10 | [并发与租约](10-concurrent-workers-leases.md) | fencing 与安全提交 |
| 11 | [守护进程与观察](11-daemon-watch.md) | 后台运行和事件投影 |
| 12 | [受限的代理任务](12-secure-agent-task.md) | 网络策略、秘密句柄和脱敏 |
| 13 | [反馈循环](13-feedback-loop.md) | 循环协调、固定点和旧决定隔离 |
| 14 | [硬件设计](14-hardware-project.md) | 需求、接口和测试计划 |
| 15 | [科学实验](15-scientific-experiment.md) | 数据、观察、报告和局限 |
| 16 | [动态子图](16-dynamic-subgraph.md) | GraphSpec Revision 和隔离子图 |
| 17 | [Learning Helper](17-learning-helper.md) | 动态子图、选择性失效、DOCX 与 OCR 验收 |
| 18 | [Acquired Podcast](18-acquired-podcast.md) | 受限网络研究、并发、取消与恢复 |
| 19 | [Harness Lifecycle](19-harness-lifecycle.md) | Human fencing、角色边界、Supervisor/worker 与 Git Revision |
| 20 | [CAD Release](20-cad-release.md) | 真实 CAD 工具、独立评审、局部修复与 G6 发布门 |

17–20 是仓库随实现运行的真实案例：每个案例同时提供确定性的
contract twin 和未 mock 外部边界的 live profile，并输出统一的
`hg.real-world-report/v1` 报告。页面中的五次 live 数据是当前观测证据，
正式预算校准仍待后续完成。

如果还没有运行过 HG-Rust，请先完成 [Quick Start](../quick-start.md)。
