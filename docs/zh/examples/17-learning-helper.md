<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/17-learning-helper/">English</a></div>

# 17 · Learning Helper：可追踪的课程手册

这个真实案例把三份课程资料变成一份带公式的 Word 学习手册。它不是一次性“把文件交给模型”，而是把人工范围确认、逐来源提炼、并行综合、覆盖率评审、修订和文档验收分别建模，因此能回答：哪份输入导致了哪段输出，以及只改一份资料时究竟重算了什么。

完整资产位于 [HG-Rust 的 Learning Helper 目录](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/learning-helper)。

## 工作流

```text
三份独立资料 ──┐
Human 范围决定 ─┼→ Luna 生成 GraphSpec → 3 个独立提炼子图
                └→ 概念综合 + 示例综合 → 覆盖率评审/修订 → DOCX → 渲染/OCR
```

关键设计是把动态 `GraphSpec` 本身提交为 Revision，并让 Knowledge、Examples、Expansion 分别穿过独立的 Subgraph Rule。这样修改 Expansion 不会让另外两份提炼结果失效。

## 运行方式

案例提供同构的 contract 与 live profile。contract 在进程边界替换外部工具，适合稳定回归；live 使用真实 Luna、Documents 工具链、LibreOffice 和 GLM-OCR。

```bash
scripts/test-real-world-cases.sh learning-helper contract

HG_DOCUMENTS_SKILL_DIR=/path/to/documents \
HG_DOCUMENTS_PYTHON=/path/to/python \
HG_GLMOCR_SKILL_DIR=/path/to/glmocr \
HG_GLMOCR_PYTHON=/path/to/python \
scripts/test-real-world-cases.sh learning-helper live
```

依赖版本、模型、输入和待校准预算记录在 [`case.lock.yaml`](https://github.com/QiuYi111/HG-Rust/blob/main/examples/real-world/learning-helper/case.lock.yaml)。凭证只通过现有句柄使用，不进入 Artifact。

## 已验证的行为

| 场景 | 可观察结果 |
|---|---|
| 首次运行 | Human Rule 阻塞，提交精确的 `scope.md` Revision 后继续 |
| 未变重跑 | Attempt 数保持 10 → 10，证明 Receipt 复用 |
| 只改 Expansion | 总 Attempt 数变为 15；Knowledge 与 Examples 的提炼 Head 字节不变 |
| 最终文档 | DOCX ZIP 结构有效，包含 OMML 公式，LibreOffice 可渲染 |
| 视觉回读 | GLM-OCR 能识别标题、正文和公式内容 |

本案例还发现并推动修复了一个调度器固定点问题：并行批次的输出未变化时，延后的后继 Activation 曾被跳过，但 GraphRun 错误报告 `STABLE_SUCCESS`。现在每个并行批次后都会重建 desired view，并区分 Receipt 进展与 Slot 前沿进展。

## 当前实测数据

2026-08-09 的五次成功 live 样本耗时为 33.910、44.003、34.081、46.635、37.284 秒；五点样本的观测 p95 为 46.635 秒。每次基准路径为 10 个 Attempt、未变重跑仍为 10。正式时长、Token 和成本预算尚未校准；provider 报告的 cost 为 0 只作为原始遥测，不代表真实经济成本为零。

## 适用边界

这个案例证明 Artifact 级因果关系、选择性失效和文档验收路径，不证明生成内容天然正确。正式课程发布仍应保留领域专家审批、可访问性检查和内容安全审查。

[返回案例库](index.md) · [查看动态子图基础案例](16-dynamic-subgraph.md)
