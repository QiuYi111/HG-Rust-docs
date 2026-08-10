# CAD Release

CAD Release 使用 KiCad、ngspice 与 LibreOffice 生成电路板源文件、STEP、PDF、仿真、渲染和发布演示，并保留三份独立评审证据。

真实路径需要安装 KiCad、ngspice 和 LibreOffice。输出证明工作流跑过资格检查，不代表实物设计已经获得制造认证。

<div class="hg-diagram">
  <img src="../../../assets/diagrams/cad.zh.svg" alt="CAD 发布图">
</div>

## 完整图定义

实际配置从 G0 一直走到 G6，包含并行导出、独立评审、故障恢复、技能基准和人工接收。你也可以[下载原始 YAML](../../includes/cad-release.yaml)。

<div class="hg-yaml" markdown>

```yaml
--8<-- "includes/cad-release.yaml"
```

</div>

## Slot 怎样分工

| Slot | 阶段 | 在图里的作用 |
|---|---|---|
| `requirements` | 输入 | 电路板尺寸与交付要求。 |
| `board_seed` | 输入 | 作为生成起点的 KiCad PCB 文件。 |
| `eval_matrix` | 输入 | 当前技能和候选技能的冻结评分基准。 |
| `tool_failure` | 输入 | 控制演示生成故障注入。 |
| `active_skill_seed` | 输入 | 当前正在使用的 CAD skill。 |
| `design_intent` | G0 | 要求 checksum、板框尺寸和证据级别。 |
| `source` | G1 | 进入发布流程的 PCB 源文件。 |
| `step` | G2 | KiCad 导出的机械 STEP。 |
| `drawing` | G2 | 丝印与板框 PDF。 |
| `render` | G2 | 顶面和底面渲染目录。 |
| `drc` | G2 | KiCad 原生 DRC 结果。 |
| `simulation` | G2 | ngspice 仿真证据。 |
| `visual_critique` | G3 | 渲染和图纸的独立视觉检查。 |
| `mechanical_critique` | G3 | STEP 格式与机械输出检查。 |
| `cad_critique` | G3 | 源文件、DRC 与仿真的 CAD 检查。 |
| `dossier` | G4 | 设计意图和三份评审的证据包。 |
| `presentation` | G4 | LibreOffice 生成的发布 PDF。 |
| `skill_candidate` | G5 | 从本轮证据提炼的 CAD skill 候选。 |
| `skill_benchmark` | G5 | 候选与冻结基准的比较结果。 |
| `active_skill` | G5 | 基准判断后保留或替换的 active skill。 |
| `g6_acceptance` | G6 | 用户对确切发布证据的决定。 |
| `release_manifest` | 输出 | 汇总校验和、评审、仿真与技能决定的最终清单。 |


## Rule 逐条看

| Rule | 读取 | 写入 | 作用 |
|---|---|---|---|
| `g0_capture_requirements` | requirements | design_intent | 固定要求 checksum 与资格证据级别。 |
| `g1_generate_source` | design_intent、board_seed | source | 生成进入发布流程的 PCB 源。 |
| `g2_export_step` | source | step | 用 KiCad 导出机械模型。 |
| `g2_export_drawing` | source | drawing | 导出丝印与板框 PDF。 |
| `g2_render_board` | source | render | 并行路径中生成顶面与底面 PNG。 |
| `g2_native_drc` | source | drc | 运行 KiCad 原生 DRC。 |
| `g2_simulate` | design_intent | simulation | 运行 ngspice 并记录 5V 分压为 2.5V。 |
| `g3_visual_critic` | requirements、render、drawing | visual_critique | 检查渲染与图纸并记录 checksum。 |
| `g3_mechanical_critic` | requirements、step | mechanical_critique | 检查 STEP 头和 checksum。 |
| `g3_cad_critic` | requirements、source、drc、simulation | cad_critique | 检查零 DRC 违规和仿真状态。 |
| `g4_assemble_dossier` | design_intent、三份 critique | dossier | 汇总 G4 证据包。 |
| `g4_render_presentation` | dossier、tool_failure | presentation | 可注入一次失败，成功时生成发布 PDF。 |
| `g5_derive_skill_candidate` | dossier | skill_candidate | 从本轮证据写出 skill 候选。 |
| `g5_benchmark_skill` | skill_candidate、eval_matrix | skill_benchmark | 与冻结分数比较，未提高时写 suppress。 |
| `g5_select_active_skill` | active_skill_seed、skill_candidate、skill_benchmark | active_skill | promotion 为 suppress 时保留原 skill。 |
| `g6_human_acceptance` | dossier、presentation、skill_benchmark、active_skill | g6_acceptance | 让用户接收或拒绝确切 G6 证据。 |
| `finalize_release` | 全部发布工件与 g6_acceptance | release_manifest | accept 后记录所有 checksum 和最终判断。 |


G2 的 STEP、drawing、render 和 DRC 都只读取 `source`，仿真只读取 `design_intent`，这些工作可以并行。G3 三个 Critic 读取不同证据，也可以并行。

演示生成故障只改变 `presentation` 这一路。恢复后，上游设计、导出与评审 Receipt 仍然可用。Skill 候选没有超过冻结基准时，图会把原有 `active_skill_seed` 继续写入 `active_skill`。

## 运行并观察

```bash
scripts/test-real-world-cases.sh cad-release contract
scripts/test-real-world-cases.sh cad-release live
```

先用 contract 检查图、门和故障恢复。live 完成后查看 `release/manifest.json`，再对照 `visual-critique.json`、`mechanical-critique.json` 与 `cad-critique.json` 中的校验和。
