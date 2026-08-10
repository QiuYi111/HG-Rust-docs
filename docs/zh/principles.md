# 核心哲学

HarnessGraph 关心的基本问题很朴素。目标工件是否已经与它的输入一致。如果还没有，哪条 Rule 可以推进它。

## 从任务流转向状态收敛

传统工作流把控制流写进图里。循环要有 Loop 节点，并行要有 Parallel 节点，人工确认还会再引入一种节点。图越接近真实工程，控制节点越多。

HarnessGraph 记录另一组事实。

- 哪些 Slot 已经拥有 Revision
- 哪条 Rule 读取了哪些 Revision
- 一次 Attempt 是否成功提交了新的 Revision
- 当前输入前沿是否已有可复用的 Receipt

调度器反复查看这些事实，选择可以运行且确实需要运行的 Rule。输出一旦与当前输入一致，该 Rule 就安静下来。输入发生变化时，下游自然重新变旧。

<div class="hg-diagram">
  <img src="../../assets/diagrams/reconcile.zh.svg" alt="HarnessGraph 的状态收敛循环">
</div>

## 作者只写两个原语

Slot 是工件的位置。Rule 是工件之间的生成关系。作者无需再声明循环、并行、汇合或重试节点。

一条 Rule 的多个输入形成汇合。多条互不依赖的 Rule 可以并行。Rule 把结果写回先前依赖链中的 Slot 时，Revision 的变化会触发下一轮。`when` 只决定某个候选 Rule 在当前输入前沿是否成立。

这些结构都由 Slot 与 Rule 的组合得到。它们是图的性质，不会增加作者原语。

## Agent 负责语义，内核负责确定性

Agent 可以阅读模糊需求、修改代码、检索资料或给出批评。它的输出可能每次不同。内核不需要假装这些行为可预测。

内核把输入挂载为只读，把输出收集到隔离目录，在成功后一次提交全部 Revision，并留下 Attempt 与 Receipt。失败不会提交半成品，同一输入前沿也可以按策略复用既有结果。

这个边界让 Agent 保持表达能力，也让工程状态可检查、可恢复、可审计。

## Human 与 Effect 沿用同一种图

人工判断可以写成 `using: human` 的 Rule。外部动作可以写成 Effect Rule。它们有不同的执行约束，却仍然读取 Slot、写入 Slot，并绑定到确切的输入 Revision。

因此，一个批准不会漂移到后来修改过的候选物上。一次外部动作也能拥有独立的提交和审计记录。内核增加的是运行时事实，不会增加作者需要背诵的新图语言。

下一步可以阅读 [两个原语](model.md)，再到 [图如何自然派生](composition.md) 查看常见结构。
