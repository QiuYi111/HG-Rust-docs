<div class="language-switch"><strong>中文</strong> · <a href="../en/">English</a></div>

<section class="hero" aria-labelledby="page-title">
  <p class="eyebrow">HARNESSGRAPH KERNEL · 0.1</p>
  <h1 id="page-title">让自动化工作，拥有可验证的结果。</h1>
  <p class="lede">HarnessGraph Kernel（HG-Rust）是一套以产物为中心的协调内核：用 Slot 描述结果，用 Rule 描述转换，用不可变 Revision、Receipt 和 Event 记录每一次变化。</p>
  <div class="action-row">
    <a class="md-button md-button--primary" href="quick-start/">开始 Quick Start</a>
    <a class="md-button" href="principles/">先理解核心理念</a>
  </div>
</section>

<div class="release-line" aria-label="文档信息">
  <span>配置版本 1</span>
  <span>macOS / Linux</span>
  <span>中文 · English</span>
</div>

## HG-Rust 解决什么问题？

传统自动化通常围绕“执行一次命令”组织。命令结束后，用户还需要回答：结果是否对应当前输入？能否安全复用？失败后哪些工作已经提交？文件被手动修改后，系统是否能发现并修复？

HG-Rust 将这些问题提升为模型的一部分。你声明需要什么结果，内核根据依赖关系协调执行，并把验证、版本、复用、恢复和解释记录为可查询事实。

<div class="feature-grid" markdown>

<article class="feature-card" markdown>

### 产物优先

Slot 表达“需要什么”，Rule 表达“如何产生”。文件路径只是结果的一种物化方式，不是结果本身。

</article>

<article class="feature-card" markdown>

### 证据驱动复用

只有输入 Revision、Rule 合约和执行状态都匹配时，Receipt 才能证明一次结果可以复用。文件存在不等于缓存命中。

</article>

<article class="feature-card" markdown>

### 过程可解释

Attempt、Receipt、Session 和 Event 保留因果链。`status` 告诉你现在是什么，`explain` 告诉你为什么是这样。

</article>

</div>

## 一次协调如何完成？

<div class="diagram">
  <img src="../assets/core-loop.svg" alt="从期望结果到验证、版本、Receipt 和解释的协调循环" />
</div>

1. 用 `harness.yaml` 声明 Slot 与 Rule。
2. 用 `hg put` 将输入导入为 Revision。
3. 用 `hg plan` 查看需要执行的工作。
4. 用 `hg run` 协调到稳定状态。
5. 用 `hg status`、`hg explain`、`hg events` 检查结果与因果链。

## 适合哪些工作？

- 需要持续生成报告、文档、数据集或构建产物的自动化流程。
- 需要把人工判断放在明确节点，并保留决定依据的流程。
- 需要让 Agent、脚本和人工操作共同参与，但仍能解释每个结果来源的项目。
- 需要在失败、取消、重试或并发运行后继续工作，而不是从头猜测状态的任务。

## 从哪里开始？

如果你第一次接触 HG-Rust，请按这个顺序阅读：

1. [Quick Start](quick-start.md)：创建第一个项目并生成文件。
2. [核心哲学](principles.md)：理解 HG-Rust 为什么以 Revision 和 Receipt 为中心。
3. [对象模型](model.md)：掌握 Slot、Rule、Activation、Attempt 和 Event。
4. [配置总览](configuration.md)：把模型写进 `harness.yaml`。
5. [案例库](examples/index.md)：按场景阅读 15 个完整案例。

!!! tip "一个简单判断"

    如果你的问题可以表达为“当这些输入发生变化时，我希望得到一个可验证的结果”，那么它通常适合从一个 Slot → Rule → Slot 图开始。
