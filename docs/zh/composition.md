# 图如何自然派生

HarnessGraph 不要求作者选择串行图、并行图或循环图。协调器从 Slot 的读写关系中得到这些结构。

<div class="hg-diagram">
  <img src="../../assets/diagrams/composition.zh.svg" alt="串行、并行、汇合和循环的派生关系">
</div>

## 串行

Rule B 读取 Rule A 的输出时，B 必须等待 A 提交 Revision。无需额外声明顺序。

## 并行与汇合

两条 Rule 只共享上游输入，又互不读取对方输出时，它们可以同时运行。下游 Rule 同时读取两边的输出，就形成汇合。`--jobs` 只限制并发容量，不定义图的语义。

## 条件

`when` 在当前输入前沿上判断 Rule 是否可运行。条件所依赖的数据应该进入 `in`，这样判断与确切 Revision 绑定。

```yaml
- id: publish
  in: [candidate, approval]
  out: [release]
  when: "test \"$(jq -r '.decision' approval)\" = approve"
  run: "cp in/candidate out/release"
```

## 循环

循环来自 Revision 的反馈。评审 Rule 更新 `critique`，修改 Rule 又读取新的 `critique` 并更新 `candidate`。当评审结果变成 `accept`，修改 Rule 的 `when` 不再成立，图便稳定下来。

这个过程中没有程序计数器，也没有 Loop 节点。每一轮都只是新的输入 Revision 形成新的 Activation。

## 失败与重试

失败的 Attempt 不提交输出。重试仍然针对同一个 Activation，并受 `max_attempts`、超时、退避和取消策略约束。输入改变后形成新的 Activation，与旧失败记录区分开来。

用 [番茄钟](tutorials/pomodoro.md) 查看最小反馈环，用 [图语义实验室](graph-lab.md) 检查并行、条件、反馈与复杂拓扑。
