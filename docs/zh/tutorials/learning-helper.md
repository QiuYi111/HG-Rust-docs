# Learning Helper

这个案例把三份课程材料整理成一份 Word 手册。它展示 Human 定界、三路并行处理、汇合、覆盖检查和条件渲染。

<div class="hg-diagram">
  <img src="../../../assets/diagrams/learning.zh.svg" alt="Learning Helper 图">
</div>

## 第一步，确认范围

`choose_scope` 读取范围提示并写入 `scope`。后续三条蒸馏 Rule 都读取这个 Revision，因此人工确认与确切课程范围绑定。

这里没有动态子图。`knowledge`、`examples` 与 `expansion` 是普通 Slot，它们各自拥有直接 writer。

## 第二步，观察并行与局部失效

三个蒸馏 Rule 只共享 `scope`，彼此没有数据依赖，因此可以并行。改变 `Knowledge.md` 后，只会使知识蒸馏及其下游变旧，另外两路可以继续复用 Receipt。

## 第三步，运行案例

在仓库根目录执行确定性路径。

```bash
scripts/test-real-world-cases.sh learning-helper contract
```

成功后应看到案例合约通过，其中包括缓存复用、最终输出传播和单文件失效检查。

真实路径会调用 Agent，生成 DOCX，再做渲染和 OCR 检查。

```bash
scripts/test-real-world-cases.sh learning-helper live
```

它需要案例 [`README`](https://github.com/QiuYi111/HG-Rust/tree/main/examples/02-learning-helper) 中列出的 Documents 与 GLM-OCR 环境变量。依赖缺失时，脚本会明确失败，不会把跳过检查当作成功。

完整图见 [`harness.yaml`](https://github.com/QiuYi111/HG-Rust/blob/main/examples/02-learning-helper/harness.yaml)。
