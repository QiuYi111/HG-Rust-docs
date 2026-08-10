# 图语义实验室

案例库说明真实用途，这一组配方专门验证调度语义。它们使用确定性 Shell，不需要 Codex。

<div class="hg-diagram">
  <img src="../../assets/diagrams/graph-lab.zh.svg" alt="图语义实验室覆盖的拓扑">
</div>

## 先看图

```bash
hg check --strict --project <RECIPE>
hg graph --project <RECIPE>
hg plan <TARGET> --project <RECIPE>
```

`check` 验证静态定义，`graph` 显示由 Slot 读写派生的关系，`plan` 列出收敛目标需要的工作。

## 再跑语义配方

仓库中的 [`examples/recipes`](https://github.com/QiuYi111/HG-Rust/tree/main/examples/recipes) 覆盖最小收敛、条件门、重试恢复、Human Rule、Effect 与缓存失效。[`examples/graph-semantics`](https://github.com/QiuYi111/HG-Rust/tree/main/examples/graph-semantics) 另有并行扇出汇合、8 字循环、耦合循环、分支切换与闭包隔离。每个目录都可以独立初始化和运行。

完整的怪图回归集中在 Rust 集成测试中。下面的命令运行调度、循环与真实案例的确定性部分。

```bash
cargo test -p hg-cli --test m15_official_examples
cargo test -p hg-cli --test m18_pomodoro_loop
scripts/test-graph-semantics-examples.sh
scripts/test-real-world-cases.sh learning-helper contract
scripts/test-real-world-cases.sh acquired-podcast contract
```

## 判断结果时看什么

- 并行容量只能改变同时运行的数量，不能改变依赖顺序
- 汇合 Rule 必须等所有输入拥有匹配 Revision
- `when` 为假时，Rule 保持不可运行，下游不能凭空得到输出
- 失败 Attempt 不提交部分输出
- 相同输入前沿可以复用 Receipt
- 反馈 Slot 产生新 Revision 时，循环得到下一轮
- 达到稳定条件后，不再创建无意义 Attempt

这些检查比“某次 Agent 恰好答对了”更能说明调度器是否正常。
