# 案例路线

这些教程按复杂度递增。每一页先解释图，再带你运行确定性路径，最后指出可以替换为真实 Agent 或外部工具的边界。

| 顺序 | 案例 | 主要结构 | 推荐运行方式 |
| --- | --- | --- | --- |
| 1 | [番茄钟](pomodoro.md) | 最小自改进循环与人工批准 | Rust 合约测试 |
| 2 | [Learning Helper](learning-helper.md) | Human 定界、并行蒸馏、汇合与评审 | contract |
| 3 | [Grill](grill.md) | 多轮人机终端会话 | mock 或 iTerm2 |
| 4 | [Acquired](acquired.md) | 真实资料搜集、并行研究、补充门与脚本汇合 | contract 或 live |
| 5 | [Harness Lifecycle](harness.md) | 完整软件工程生命周期 | contract 或 live |
| 6 | [CAD Release](cad-release.md) | 专业工具链、独立 critic 与人工发布门 | contract 或 live |

所有教程使用主仓库现有案例。`contract` 保留同一张图和同一套提交语义，只在执行器边界换成确定性实现。`live` 会调用真实 Agent、网络、文档工具或 CAD 工具，因此需要对应环境。

如果你只想验证调度器，完成前两个教程后进入 [图语义实验室](../graph-lab.md)。
