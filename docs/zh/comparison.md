<div class="language-switch"><strong>中文</strong> · <a href="../../en/comparison/">English</a></div>

# 与现有产品的对比

HG-Rust 与构建工具、CI 平台、数据编排器和持久化工作流系统有交集，但关注点不同。下面的比较描述“核心抽象”，不是功能优劣排名。

| 产品类别 | 核心抽象 | 更适合解决 | HG-Rust 的区别 |
|---|---|---|---|
| Make / Just | 目标、依赖与命令 | 本地构建和文件变更触发 | 将结果版本、Receipt、恢复和解释提升为运行时事实，而不是主要依靠路径与时间戳判断 |
| GitHub Actions | 事件、Workflow、Job、Runner | 代码托管平台上的 CI/CD | 更关注项目产物的当前状态与因果历史；触发器和托管 Runner 不是核心模型 |
| Apache Airflow | DAG、Task、调度与数据区间 | 批处理和周期性数据工作流 | Rule 的输出是带版本的 Artifact，复用依据是输入 Revision 与 Receipt，而不是一次 DAG Run 的状态 |
| Temporal | Workflow、Activity、持久化执行 | 需要跨故障持续推进的业务事务 | Temporal 以代码定义的流程推进为中心；HG-Rust 以“目标产物是否达到稳定状态”为中心 |
| Dagster | Asset、依赖、数据血缘与可观测性 | 数据资产编排与治理 | HG-Rust 把相似的产物依赖扩展到文档、评审、Agent 和外部效果，并使用统一的 Attempt/Receipt 证据 |

## 一个直观的选择方法

- 你需要的是“把文件编出来”：先看 Make / Just。
- 你需要的是“代码提交后触发测试与部署”：先看 GitHub Actions。
- 你需要的是“按日期和任务调度批处理”：先看 Airflow。
- 你需要的是“业务流程跨网络故障继续”：先看 Temporal。
- 你需要的是“数据资产、血缘与可观测性”：先看 Dagster。
- 你需要的是“输入变化后，持续把一个可验证产物协调到稳定状态”：HG-Rust 是更直接的抽象。

## HG-Rust 的独特组合

它把下面四件事放在同一条链上：

1. 声明式结果模型：Slot + Rule。
2. 内容与历史模型：immutable Revision。
3. 执行证据模型：Attempt + Receipt + Session。
4. 受控变化模型：Human + Effect + Event。

## 进一步阅读

以下链接指向各项目的官方概念文档：

- [GNU Make · How Make Works](https://www.gnu.org/software/make/manual/html_node/How-Make-Works.html)
- [GitHub Actions · Concepts](https://docs.github.com/en/actions/concepts)
- [Apache Airflow · Dags](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dags.html)
- [Temporal · Documentation](https://docs.temporal.io/)
- [Dagster · Documentation](https://docs.dagster.io/)
