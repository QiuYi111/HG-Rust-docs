# Harness Lifecycle

这张图把一轮受规格约束的软件工程工作放进 HG。产品定义、风险判断、批准、spec、plan、tasks、worker 报告、评估与评审都成为带 Revision 的工件。

真实路径会使用现有 Codex 与 OpenCode 凭据句柄。凭据不会进入 Slot、Receipt 或最终 Git 工件。

<div class="hg-diagram">
  <img src="../../../assets/diagrams/harness.zh.svg" alt="Harness 生命周期图">
</div>

## 完整图定义

下面的配置完整展示了两个 Human Rule、一次角色越界拒绝、一轮 Supervisor 与 worker 协作，以及最终 Git 提交。你也可以[下载原始 YAML](../../includes/harness-lifecycle.yaml)。

<div class="hg-yaml" markdown>

```yaml
--8<-- "includes/harness-lifecycle.yaml"
```

</div>

## Slot 怎样分工

| Slot | 阶段 | 在图里的作用 |
|---|---|---|
| `project_fixture` | 输入 | worker 最终要修改的固定项目目录。 |
| `human_responses` | 输入 | 测试中使用的人工答案与角色越界样本。 |
| `product_brief` | 输入 | 最初的产品要求。 |
| `questions` | 产品 | Grill 生成的澄清问题。 |
| `product_definition` | 产品 | 用户确认后的确切 MVP 定义。 |
| `feasibility` | 风险 | 可行性、风险级别与原因。 |
| `core_approval` | 风险 | 对 core 风险变更的独立人工决定。 |
| `spec` | 规格 | 获批后生成的行为规格。 |
| `plan` | 规格 | RED、GREEN、评估、报告和评审计划。 |
| `tasks` | 规格 | worker 可以执行的任务清单。 |
| `role_check` | 治理 | 对角色越界的结构化拒绝证据。 |
| `next_task` | 调度 | Supervisor 交给 worker 的单个有边界任务。 |
| `worker_report` | 实现 | worker 记录的改动、命令、测试和验收结果。 |
| `evaluation` | 验收 | 对行为和 worker 证据的评估。 |
| `report` | 验收 | 本轮实现报告。 |
| `review` | 验收 | 最终 acceptance review。 |
| `final_repo` | 输出 | 汇总代码与全部过程证据的 Git 工件。 |


## Rule 逐条看

| Rule | 读取 | 写入 | 作用 |
|---|---|---|---|
| `grill_product` | project_fixture、product_brief | questions | 生成两个最小产品问题。 |
| `define_product` | questions、human_responses | product_definition | Human Rule 提交确切产品定义。 |
| `assess_feasibility` | project_fixture、product_definition | feasibility | 写出 core 风险判断。 |
| `approve_core` | feasibility、human_responses | core_approval | 第二个 Human Rule 单独批准核心风险。 |
| `write_spec` | product_definition、core_approval | spec | approve 后写入行为规格。 |
| `write_plan` | feasibility、core_approval | plan | approve 后写入实现计划。 |
| `write_tasks` | product_definition、feasibility、core_approval | tasks | approve 后写入任务清单。 |
| `enforce_role_boundary` | human_responses、core_approval | role_check | 捕获 TDD-RED 写实现文件的越界，并写出 reject。 |
| `supervisor_iteration` | spec、plan、tasks、role_check | next_task | 越界被拒绝后生成一个受限 GREEN 任务。 |
| `opencode_worker` | project_fixture、next_task、role_check | worker_report | 调用 OpenCode 完成一次实现并记录报告。 |
| `evaluate_iteration` | spec、worker_report | evaluation | 检查测试证据并写评估。 |
| `report_iteration` | plan、tasks、worker_report、evaluation | report | 汇总本轮实现情况。 |
| `review_iteration` | spec、role_check、worker_report、evaluation、report | review | 检查越界拒绝、验收项和报告完整性。 |
| `commit_lifecycle` | 项目与全部生命周期证据 | final_repo | 初始化 Git 仓库，复制代码和证据并创建提交。 |


产品定义与核心风险批准是两个不同决定，各自绑定到自己的输入前沿。角色检查写出 reject 后，reject 本身成为下游的输入事实。Supervisor 和 worker 因此无需隐藏的控制状态。

## 运行并观察

```bash
scripts/test-real-world-cases.sh harness-lifecycle contract
```

合约路径检查过期人工回答隔离、第二次风险决定、角色越界拒绝，以及最终 Git 工件中的 spec、eval 与 report。

准备好 Codex 和 OpenCode 后运行真实边界。

```bash
scripts/test-real-world-cases.sh harness-lifecycle live
```

完成后检查 `lifecycle-repo/.pm/runtime` 与 `specs/001-counter`。这些文件来自声明 Slot，可以追溯到本轮输入和 Receipt。
