<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/20-cad-release/">English</a></div>

# 20 · CAD Release：G0–G6 可恢复发布

这个 release-grade 案例用真实 KiCad 10、ngspice 46、LibreOffice 和 Luna 运行 G0–G6。它生成版本一致的 PCB 源文件、STEP、PDF 图纸、仿真结果、顶/底 3D 渲染和演示文稿；Visual、Mechanical、CAD 三位 critic 是独立 Rule。案例还注入一次演示文稿失败，证明只修复执行局部，不推翻已经通过的设计证据。

完整资产位于 [CAD Release 目录](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/cad-release)。

## 发布图

```text
G0 requirements → G1 design intent → G2 KiCad source
  → G3 STEP / drawing / render / DRC / simulation
  → G4 visual + mechanical + CAD critics
  → G5 dossier + presentation + frozen skill benchmark
  → G6 Human acceptance → release manifest
```

顶视图与底视图都必须非空；DRC 必须报告零违规；仿真必须通过；三个 critic 必须独立提交通过证据。冻结的评估矩阵比较候选技能，候选没有改善时，promotion 被抑制且 active skill 保持字节不变。

## 运行与故障注入

```bash
scripts/test-real-world-cases.sh cad-release contract
scripts/test-real-world-cases.sh cad-release live
```

运行器先让 presentation 阶段按 fixture 失败，记录 11 个上游 Head；随后只修改故障控制 Artifact 并恢复。第二次运行必须停在 Human 所有的 G6，且前后 11 个 Head 完全一致。提交精确 G6 接受文件后，图才会生成 `cad-release/v1` manifest。

## 内核能力映射

| 发布要求 | HG 机制 |
|---|---|
| 多工具并行 | `--jobs 3` 并发上限与 exclusive 输出 writer 冲突保护 |
| 工具失败不污染历史 | Attempt 原子提交；失败没有 Receipt |
| 局部恢复 | 有效上游 Receipt 和 Revision Head 复用 |
| 独立评审 | 三个 critic 分属不同 Rule/输出 Slot |
| 发布所有权 | G6 Human Rule 与 Activation fencing |
| 技能晋升保护 | 冻结基准 Artifact + 明确 suppress 结果 |

## 当前实测数据

五次成功 live 样本耗时为 28.949、22.429、31.719、18.572、32.619 秒，观测 p95 为 32.619 秒。每次基准路径 18 个 Attempt、未变重跑仍为 18，且都验证局部修复、三个独立 critic、技能抑制和 G6 Human gate。正式预算尚未校准。

## 非常重要的限制

这是对协调流程、工具边界和证据链的 qualification，不是物理设计认证，也不表示 PCB 已具备制造条件。真实发布还需要适用的电气、机械、DFM、法规和人身安全审查。

[返回案例库](index.md) · [查看硬件设计基础案例](14-hardware-project.md)
