<div class="hg-hero">
  <img src="../assets/banner.jpg" alt="HarnessGraph，使用两个原语构建 Agent Graph">
</div>

<p class="hg-kicker">Artifact-native reconciliation</p>

# 让图从事实中长出来

<p class="hg-lede">HarnessGraph 用 Slot 表示工件的位置，用 Rule 表示工件之间的生成关系。你声明想得到什么，内核负责让当前状态向目标状态收敛。</p>

<div class="hg-actions">
  <a class="hg-button hg-button--primary" href="quick-start/">十分钟跑通</a>
  <a class="hg-button" href="principles/">先读核心哲学</a>
  <a class="hg-button" href="tutorials/pomodoro/">看番茄钟循环</a>
</div>

## 为什么会有 HarnessGraph

许多 Agent 工作流从步骤开始设计。先做 A，再做 B，失败就跳回 C。随着分支、人工确认、重试和缓存增多，流程控制很快挤满业务定义。

HarnessGraph 换了一个起点。项目中的计划、代码、评审、批准和发布包都看作工件。每个工件进入一个 Slot，每条 Rule 只说明它读取哪些 Slot，又写入哪些 Slot。依赖关系由读写关系确定，调度器只处理事实是否已经更新。

这个模型只有两个作者需要直接使用的原语。

<div class="hg-grid">
  <div class="hg-card">
    <h3>Slot</h3>
    <p>一个有名字的工件位置。文件、目录和 Git 仓库都可以成为 Slot。</p>
  </div>
  <div class="hg-card">
    <h3>Rule</h3>
    <p>一条从输入 Slot 生成输出 Slot 的声明。Shell、Agent 和 Human 都沿用同一种形状。</p>
  </div>
</div>

## 从哪里开始

第一次使用时，先完成 [Quick Start](quick-start.md)。它不调用 Agent，只用一条确定性的 Shell Rule 演示 Revision、执行和复用。

接着阅读 [核心哲学](principles.md) 和 [两个原语](model.md)。如果你更关心循环，直接进入 [番茄钟教程](tutorials/pomodoro.md)。并行、条件、汇合与更奇怪的拓扑集中在 [图语义实验室](graph-lab.md)。

当前内核与案例源码位于 [QiuYi111/HG-Rust](https://github.com/QiuYi111/HG-Rust)。文档中的命令和 Slot、Rule 名称均以该仓库为准。
