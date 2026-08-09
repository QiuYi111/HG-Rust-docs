<div class="language-switch"><strong>中文</strong> · <a href="../en/">English</a></div>

<section class="hero" aria-labelledby="page-title">
  <p class="eyebrow">HARNESSGRAPH KERNEL · 0.1</p>
  <h1 id="page-title">让自动化交付可验证的结果。</h1>
  <p class="lede">HarnessGraph Kernel（HG-Rust）是一套 Artifact 原生的协调内核。用 Slot 表达稳定的产物名称，用 Rule 表达转换，用不可变 Revision、Receipt 和 Event 保存每一次可验证变化。</p>
  <div class="action-row">
    <a class="md-button md-button--primary" href="quick-start/">开始 Quick Start</a>
    <a class="md-button" href="principles/">阅读核心哲学</a>
  </div>
</section>

<div class="release-line" aria-label="文档信息">
  <span>配置版本 1</span>
  <span>macOS / Linux</span>
  <span>中文 · English</span>
</div>

## HG-Rust 解决什么问题

自动化结果会随着需求、代码、测试、评审意见、Prompt 和外部事件变化。每次运行结束后，项目仍然需要知道当前结果是否对应这些最新事实，旧结果能否复用，失败后哪些输出已经提交，路径被手动修改后如何恢复。

HG-Rust 从目标 Slot 的输入闭包出发，派生当前需要处理的 Activation。只有通过验证、内容寻址存储和带 fencing 的原子提交，结果才会成为新的 Head。内核持续协调，直到目标达到固定点，或给出明确终态。

<div class="feature-grid" markdown>

<article class="feature-card" markdown>

### 作者模型足够小

Slot 表达稳定的 Artifact 名称，Rule 表达输入到输出的转换。作者无需手工维护流程游标、重试表或隐藏边。

</article>

<article class="feature-card" markdown>

### 权威事实可恢复

Revision 保存不可变内容，Head 保存当前认可版本，Materialization 提供文件或工作区投影。路径损坏不会抹掉历史。

</article>

<article class="feature-card" markdown>

### 执行证据可解释

Activation、Attempt、Receipt、Session 和 Event 各自承担明确职责。`status` 展示当前事实，`explain` 说明因果理由。

</article>

</div>

## 一次协调如何完成

<div class="diagram">
  <img src="../assets/core-loop.svg" alt="从期望结果到验证、版本、Receipt 和解释的协调循环" />
</div>

1. 在 `harness.yaml` 中声明 Slot 与 Rule。
2. 用 `hg put` 把输入导入为 Source Revision。
3. 用 `hg plan` 查看目标闭包和待处理 Activation。
4. 用 `hg run` 协调到稳定终态。
5. 用 `hg status`、`hg explain` 和 `hg events` 查看结果与因果链。

## 两层模型

| 作者声明 | 内核维护 |
|---|---|
| Slot 名称、Artifact kind、输入与输出 | GraphRevision、Slot Head、Revision、Materialization |
| Rule、Guard、Executor 与策略 | Activation、Attempt、Receipt、Session、Lease、Event |
| 目标 Slot | backward closure、freshness、固定点与终态 |

这套分工把复杂度放在可以集中验证的位置。脚本、Agent、人工操作和外部系统都通过 Rule 接入，运行方式可以变化，结果语义保持一致。

## 适合哪些工作

- 持续生成报告、文档、数据集或构建产物的自动化流程。
- 需要把人工判断放在明确节点，并保留决定依据的流程。
- Agent、脚本和人工操作共同参与，同时要求每个结果都能解释来源的项目。
- 需要在失败、取消、重试或并发运行后继续工作，并且能从持久事实恢复状态的任务。

## 从哪里开始

如果你第一次接触 HG-Rust，请按这个顺序阅读。

1. [Quick Start](quick-start.md)  创建第一个项目并生成文件。
2. [核心哲学](principles.md)  理解 Slot、Revision、Receipt 和固定点。
3. [对象模型](model.md)  掌握 Activation、Attempt、Session 与 Event。
4. [配置总览](configuration.md)  把模型写进 `harness.yaml`。
5. [案例库](examples/index.md)  按场景阅读 15 个完整案例。

!!! tip "一个简单判断"

    如果你的问题可以表达为“当这些输入发生变化时，我希望得到一个可验证的结果”，那么它通常适合从一个 Slot → Rule → Slot 图开始。
