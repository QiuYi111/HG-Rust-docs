<div class="language-switch"><strong>中文</strong> · <a href="../../en/comparison/">English</a></div>

# 与现有产品的对比

HG-Rust 与构建工具、CI 平台、数据编排器和持久化工作流系统都有交集。它们的首要问题、当前事实和完成条件各有侧重。

## 先看语义中心

| 系统 | 主要组织对象 | 通常要回答的问题 | 完成的中心语义 |
|---|---|---|---|
| Make / Just | Target、依赖、Recipe | 这个目标文件需要重建吗？ | 目标已由 Recipe 生成且不再过期 |
| GitHub Actions | Event、Workflow、Job、Runner | 这次仓库事件触发的工作是否完成？ | Workflow Run / Job 达到终态 |
| Apache Airflow | DAG、Task、Schedule、Data Interval | 这个时间区间的批处理是否完成？ | DAG Run 的任务依赖完成 |
| Temporal | Workflow、Activity、持久化执行历史 | 这个业务流程如何跨故障继续？ | Workflow 达到业务定义的状态 |
| Dagster | Software-defined Asset、依赖、Lineage | 数据资产如何生成、观察和治理？ | Asset Materialization / Run 达到预期状态 |
| **HG-Rust** | **Slot、Rule、Revision、Receipt** | **当前目标能否由最新事实证明为新鲜？** | **目标输入闭包达到 Fixed Point** |

这些系统可以组合使用。Make 可以作为 HG-Rust 的 Rule Executor；GitHub Actions 可以触发 `hg run`；Airflow 或 Temporal 可以把 HG-Rust 当作一个受治理的步骤；Dagster 可以负责数据资产视图。选择重点在于哪一层拥有“完成”的语义。

## Make / Just · 重建文件与维护工程事实

Make 和 Just 擅长把目标、依赖和命令组织成快速的本地构建。它们的核心问题是目标是否需要根据依赖和 Recipe 重建。

HG-Rust 的差异集中在以下几点。

- Target 被建模为 Slot，权威值是不可变 Revision。路径上的文件只是 Materialization；
- 一个结果是否可复用由精确输入 Revision 向量、Rule contract 和有效 Receipt 决定；
- 多输出提交、失败恢复、Lease fencing、人工决定和外部 Effect 进入统一内核事实；
- 删除或损坏 Materialization 可以修复，而不必重新执行 Rule。

如果目标只是编译源码、生成本地文件，Make / Just 往往更直接。也可以把它们作为某个 Rule 的执行命令，让 HG-Rust 管理更上层的产物因果和验收。

## GitHub Actions · 事件驱动 CI/CD 与产物协调

GitHub Actions 围绕仓库事件、Workflow、Job 和 Runner 组织 CI/CD。它很适合表达“提交、Pull Request、定时器或外部事件发生后，运行这组检查和部署步骤”。

HG-Rust 的边界有几项明确区别。

- 事件可以作为 Source Slot 的输入。事件本身不提供目标产物的完整因果证明；
- Workflow Run 成功不自动等于某个项目 Slot 对当前输入闭包 fresh；
- HG-Rust 为每次 Activation 记录输入 Revision、Attempt、Receipt 和 Event，并以目标固定点判断 GraphRun 终态；
- Agent、脚本、人工和外部系统可以在同一种 Rule 契约下协作，Runner 只是执行环境的一种实现。

典型组合由 GitHub Actions 负责仓库事件和托管环境，HG-Rust 负责需要持续协调的文档、评审、修复或发布产物。

## Apache Airflow · 时间区间批处理与当前事实闭包

Airflow 的 DAG 把任务、依赖、调度和数据区间组织成周期性或批处理工作流。它的时间语义对于按日期运行的 ETL、报表和数据管道非常重要。

HG-Rust 以当前 Source Slot Revision 作为主要触发单位。

- 当前输入是 Source Slot 的 Revision，变化会使相关结果重新获得 Activation；
- 目标从输入闭包计算。一次 DAG Run 只是其中一种外部运行边界；
- `NO_CHANGE`、缺少 Source、Guard 为 false、失败、写冲突和振荡都有不同含义；
- 流式轨迹、文件、目录、Git、外部事件和人工决定可以共享同一 Artifact 语义。

如果“每小时为一个数据区间运行一次”是核心需求，Airflow 更自然；如果“只要最新事实变化，就把当前目标重新协调到可验证稳定状态”是核心需求，HG-Rust 更直接。时间调度也可以作为外部事件导入 Source Slot。

## Temporal · 持久业务过程与目标产物状态

Temporal 以 Workflow、Activity 和持久化执行历史为中心，适合必须跨进程、网络和基础设施故障继续推进的业务流程，例如订单、审批和长事务。

HG-Rust 的中心问题落在目标产物状态。

- Temporal 的基本对象是一个持续推进的 Workflow Execution；HG-Rust 的基本问题是目标 Slot 是否已经被当前输入事实证明为 fresh；
- Temporal 通常由 Workflow 代码决定下一步；HG-Rust 由当前 Head、Guard 和有效 Receipt 派生 desired Activation；
- HG-Rust 不把 Session 或进程游标当作正式状态，候选输出只有通过验证和 fenced atomic commit 才能推进 Head；
- 一个 Temporal Activity 可以运行 `hg run`，一个 HG-Rust Rule 也可以调用持久化外部服务，二者可以组合。

需要维护“业务流程走到哪一步”时，Temporal 是合适的中心；需要维护“当前工程产物是否仍由最新事实证明”时，HG-Rust 是合适的中心。

## Dagster · 数据资产治理与通用 Artifact 协调

Dagster 是与 HG-Rust 最接近的一类系统。它把数据资产、依赖、血缘、可观测性和物化放在中心位置。

HG-Rust 的侧重点进一步延伸到自治工程。

- Artifact 不限于数据资产，也可以是需求、代码、目录、Git Revision、测试报告、Prompt、Memory、Skill、轨迹或外部 Receipt；
- 每个 Rule 的真实执行拆分为 Activation、Attempt 和可选 Session，以记录非确定性执行与会话复用；
- Receipt 记录输入 Revision、输出 Revision、校验和原子提交，并承担接受证明；
- Human、Effect 和 Agent 与确定性脚本共享同一种 Rule 语义；
- 反馈环通过新 Revision 自然推进，不需要把 refinement 写进内核的特殊节点类型。

如果主要问题是数据资产的分区、物化、血缘和观测，Dagster 可能更贴合；如果同一套结果语义要覆盖文档、软件、评审、Agent、实验和外部动作，HG-Rust 提供更一般的协调内核。

## HG-Rust 的差异来自完成定义

HG-Rust 将下面这条链作为一条正式语义。

```text
Slot Head
   ↓  当前输入 Revision 向量
Activation
   ↓  一次或多次真实执行
Attempt
   ↓  校验 + CAS + fenced atomic commit
Receipt
   ↓  事件驱动派生下游
Target backward closure reaches a fixed point
```

这条链带来几项具体判断。

- 成功要求有效 Receipt 与当前输入闭包一致；
- 提交要求验证、CAS 和 fenced atomic commit；
- 稳定要求目标闭包完成协调；
- 权威状态来自 Slot Head 与 Revision；
- 旧审批遇到新输入时需要重新决定；
- 远端副作用通过幂等键和 Readback 处理不确定窗口。

## 如何选择或组合

- 主要是本地构建和文件重建  选择 Make / Just
- 主要是代码仓库事件、CI 和部署  选择 GitHub Actions
- 主要是按时间区间运行的数据批处理  选择 Airflow
- 主要是跨故障推进的业务流程  选择 Temporal
- 主要是数据资产、血缘和可观测性  选择 Dagster
- 主要是“输入变化后，持续把一个可验证工程结果协调到稳定状态”  选择 HG-Rust
- 已有上述平台但希望引入 Revision、Receipt、Human/Agent 协作  把它们作为外层触发器、Rule Executor 或运行环境，与 HG-Rust 组合

## 官方概念文档

以下链接指向各项目的官方概念文档。

- [GNU Make · How Make Works](https://www.gnu.org/software/make/manual/html_node/How-Make-Works.html)
- [GitHub Actions · Concepts](https://docs.github.com/en/actions/concepts)
- [Apache Airflow · Dags](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dags.html)
- [Temporal · Documentation](https://docs.temporal.io/)
- [Dagster · Documentation](https://docs.dagster.io/)
