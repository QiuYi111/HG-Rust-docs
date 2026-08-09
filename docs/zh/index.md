<div class="language-switch"><strong>中文</strong> · <a href="../en/">English</a></div>

<section class="hero" aria-labelledby="page-title">
  <p class="eyebrow">HARNESSGRAPH KERNEL · 0.1</p>
  <h1 id="page-title">让自动化交付可验证的结果。</h1>
  <p class="lede">先从四个可以动手运行的综合案例开始。你会看到 HG 如何处理变化的输入、人工决定、Agent、外部工具和最终验收。</p>
  <div class="action-row">
    <a class="md-button md-button--primary" href="cases/index.md">开始四个实操教程</a>
    <a class="md-button" href="principles/">阅读核心哲学</a>
  </div>
</section>

<div class="release-line" aria-label="文档信息">
  <span>配置版本 1</span>
  <span>macOS / Linux</span>
  <span>中文 · English</span>
</div>

## HG-Rust 解决什么问题

自动化结果会随着需求、资料、评审意见和外部事件变化。你需要知道当前结果是不是基于最新输入，旧结果还能不能用，失败后哪些工作已经完成，文件被手动修改后如何恢复。

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

## 从哪里开始

<div class="diagram">
  <img src="../assets/core-loop.svg" alt="从期望结果到验证、版本、Receipt 和解释的协调循环" />
</div>

1. 先读[四个实操教程](cases/index.md)，选择一个与你的工作最接近的案例。
2. 复制案例目录，先运行 contract profile，确认配置和输入关系。
3. 再运行 live profile，接入真实工具。
4. 修改一份输入，观察 HG 如何只重做受影响的步骤。
5. 最后查看[功能参考与小例子](examples/reference.md)。

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
5. [四个实操教程](cases/index.md)  从真实交付目标开始学习。
6. [功能参考与小例子](examples/reference.md)  需要查单个能力时再来这里。

!!! tip "一个简单判断"

    如果你的问题可以表达为“当这些输入发生变化时，我希望得到一个可验证的结果”，那么它通常适合从一个 Slot → Rule → Slot 图开始。
