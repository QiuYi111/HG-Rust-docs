# CAD Release

CAD Release 是专业工具链案例。它使用 KiCad、ngspice 与 LibreOffice 生成电路板源文件、STEP、PDF、仿真、渲染和发布演示，并保留独立评审证据。

<div class="hg-diagram">
  <img src="../../../assets/diagrams/cad.zh.svg" alt="CAD 发布图">
</div>

## G0 到 G6

G0 固定设计意图。G1 生成源文件。G2 并行导出机械模型、图纸、渲染、DRC 与仿真。G3 由视觉、机械和 CAD 三条独立 Rule 评审。G4 汇总 dossier 并生成演示。G5 比较技能候选与冻结基准。G6 保留给 Human Rule。

案例会注入一次演示生成失败。修复后只重跑受影响的下游，不会重新制造上游设计证据。技能候选没有提高冻结基准时也不会被提升。

## 运行

```bash
scripts/test-real-world-cases.sh cad-release contract
scripts/test-real-world-cases.sh cad-release live
```

先用 contract 检查图与门。live 需要 KiCad、ngspice 和 LibreOffice。输出只是工作流资格证据，不代表实物设计已经获得制造认证。

依赖与完整规则见案例目录的 `README.md` 和 `harness.yaml`。
