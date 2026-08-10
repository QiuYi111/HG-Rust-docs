# Learning Helper

这张图把三份课程材料整理成一份 Word 手册。完成本页后，你会看懂人工定界、三路并行处理、汇合、覆盖检查和条件渲染如何由普通 Slot 与 Rule 组成。

真实路径需要可用的 Codex 执行器、文档生成工具和案例声明的 OCR 环境。

<div class="hg-diagram">
  <img src="../../../assets/diagrams/learning.zh.svg" alt="Learning Helper 图">
</div>

## 完整图定义

页面内嵌的是案例实际使用的配置。你也可以[下载原始 YAML](../../includes/learning-helper.yaml)。

<div class="hg-yaml" markdown>

```yaml
--8<-- "includes/learning-helper.yaml"
```

</div>

## Slot 怎样分工

| Slot | 类型 | 在图里的作用 |
|---|---|---|
| `knowledge` | file | 定义与公式等知识材料。 |
| `examples` | file | 课程中的步骤、例题与答案。 |
| `expansion` | file | 延伸材料、限制和知识连接。 |
| `scope_prompt` | file | 交给用户确认的课程范围提示。 |
| `docx_builder` | file | 把 Markdown 草稿转换成 DOCX 的脚本。 |
| `scope` | file | Human Rule 确认后的范围，三条蒸馏 Rule 都读取它。 |
| `knowledge_distillation` | file | 知识材料的教学化整理。 |
| `examples_distillation` | file | 例题材料的教学化整理。 |
| `expansion_distillation` | file | 延伸材料的教学化整理。 |
| `template` | file | 手册的标题与固定开头。 |
| `conclusion` | file | 手册的固定结尾。 |
| `draft` | file | 五路内容汇合后的 Markdown 草稿。 |
| `coverage` | file | 草稿覆盖检查的决定与 checksum。 |
| `handbook` | file | 最终生成的 Word 文档。 |


三份源材料各有自己的 Slot 和直接 writer。图的形状在启动前已经确定，运行时无需创建动态子图。

## Rule 逐条看

| Rule | 读取 | 写入 | 作用 |
|---|---|---|---|
| `choose_scope` | scope_prompt | scope | 让用户确认课程范围，后续工作绑定到这个 Revision。 |
| `distill_knowledge` | scope、knowledge | knowledge_distillation | 保留定义与公式，说明每个概念为何有用。 |
| `distill_examples` | scope、examples | examples_distillation | 保留具体步骤与答案，整理成例题章节。 |
| `distill_expansion` | scope、expansion | expansion_distillation | 从给定材料提取延伸、限制和连接。 |
| `build_template` | scope | template | 生成固定标题，并记录范围已绑定 Revision。 |
| `build_conclusion` | scope | conclusion | 生成固定结尾。 |
| `assemble_draft` | template、conclusion、三份 distillation | draft | 汇合全部内容并写入覆盖标记与公式。 |
| `review_coverage` | draft、coverage | coverage | draft checksum 改变时重新检查，写出 accept 或 revise。 |
| `render_docx` | draft、coverage、scope、docx_builder | handbook | coverage 为 accept 时才生成 DOCX。 |


三条蒸馏 Rule 只共享 `scope`，彼此没有数据依赖，因此调度器可以并行运行它们。修改 `Knowledge.md` 后，知识蒸馏及其下游会变旧，另外两路仍可复用原有 Receipt。

## 运行并观察

先跑不调用 Agent 的合约路径。

```bash
scripts/test-real-world-cases.sh learning-helper contract
```

它检查缓存复用、最终输出传播，以及只修改一份源材料时的局部失效。

准备好 Agent、文档工具和 OCR 环境后，再跑真实路径。

```bash
scripts/test-real-world-cases.sh learning-helper live
```

成功后检查 `handbook.docx`。随后只修改 `inputs/Knowledge.md` 并再次运行，观察 Examples 与 Expansion 两路的 Receipt 被复用。
