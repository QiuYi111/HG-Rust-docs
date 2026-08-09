<div class="language-switch"><strong>中文</strong> · <a href="../../en/cases/cad-release/">English</a></div>

# CAD Release，把设计、检查和发布放进同一条流程

你要交付一块小型 PCB。这个示范使用一份固定的 PCB 起始设计，不让模型临时设计电路；它专门演示如何把三维模型、图纸、仿真结果、正反面渲染、检查记录和最终发布记录串起来。中间某个展示文件失败时，你希望只修那个文件，已经通过的设计和仿真不要全部重来。最后的发布确认必须由人完成。

完整案例在 [HG-Rust 的 CAD Release 目录](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/cad-release)。

<div class="diagram">
  <img src="../../assets/case-cad.svg" alt="设计要求经过 PCB、模型、图纸、仿真、三类检查和局部修复后等待人工发布确认" />
</div>

## 第一步，先固定设计要求

G0 读取要求文件并产生设计意图。要求文件的版本会跟着后面的所有结果走。

```yaml
slots:
  requirements: { kind: file, path: fixtures/requirements.md }
  design_intent: { kind: file, path: release/design-intent.json }
  source: { kind: file, path: release/board.kicad_pcb }

rules:
  - id: g0_capture_requirements
    in: [requirements]
    out: [design_intent]
    run: "record the requirements checksum and design intent"

  - id: g1_generate_source
    in: [design_intent, board_seed]
    out: [source]
    run: "write the versioned PCB source"
```

这样做以后，修改要求会让设计意图和后续交付物重新检查，而不是继续沿用旧要求下的板文件。

## 第二步，让真实工具各做一件事

KiCad 负责导出 STEP、图纸、正反面渲染和 DRC。ngspice 负责仿真。每项输出都有自己的文件位置。

```yaml
rules:
  - id: g2_export_step
    in: [source]
    out: [step]
    run: "kicad-cli pcb export step ..."

  - id: g2_native_drc
    in: [source]
    out: [drc]
    run: "kicad-cli pcb drc ..."

  - id: g2_simulate
    in: [design_intent]
    out: [simulation]
    run: "ngspice -b ..."
```

这就是为什么案例比一个“跑 KiCad 命令”的脚本复杂。工具各自有输入格式和失败方式，HG 把它们的结果分别保存，后面的检查可以准确指出哪一项出了问题。

## 第三步，做三类范围清楚的独立检查

这里的三类检查都有明确边界。视觉检查确认渲染图和图纸存在并记录校验值；机械检查确认 STEP 文件带有正确的格式标识；CAD 检查读取 DRC 和仿真状态。它们不会共享一个“总的通过字符串”，也不能替代工程师对布局、结构、电气安全或制造条件的审查。

```yaml
rules:
  - id: g3_visual_critic
    in: [requirements, render, drawing]
    out: [visual_critique]
    run: "check both renders and the drawing"

  - id: g3_mechanical_critic
    in: [requirements, step]
    out: [mechanical_critique]
    run: "check the STEP evidence"
```

HG 在提交结果时保护共享输出。独立检查可以并行，但两个步骤不能同时覆盖同一个受保护的结果。

## 第四步，故意让展示文件失败一次

案例先打开 presentation 的故障开关。第一次运行失败后，记录已经完成的上游结果。接着只关闭故障开关，再运行一次。

```bash
scripts/test-real-world-cases.sh cad-release contract
scripts/test-real-world-cases.sh cad-release live
```

修复后，11 个上游结果保持不变，展示文件重新生成。这个行为说明 HG 保存的是每一步的结果，而不是一次运行的临时目录。

## 第五步，最后的发布确认由人完成

G6 读取全部证据，等待一份明确的 JSON 决定。没有这份决定，流程不会生成最终发布记录。

```yaml
rules:
  - id: g6_human_acceptance
    in: [dossier, presentation, skill_benchmark, active_skill]
    out: [g6_acceptance]
    run: { using: human, command: "Accept or reject G6 release evidence from an exact JSON file" }

  - id: finalize_release
    in: [source, step, drawing, render, drc, simulation,
         visual_critique, mechanical_critique, cad_critique,
         dossier, presentation, skill_benchmark, active_skill, g6_acceptance]
    out: [release_manifest]
    when: "test \"$(jq -r '.decision' g6_acceptance)\" = accept"
    run: "write the final release manifest"
```

案例还会比较候选技能和固定的评估矩阵。本次候选结果标记为“没有改善”，所以 HG 保留当前技能；这验证的是“不满足条件就不替换”的流程，不是一次真实技能评测。

## 这一步为什么复杂

这里同时有 CAD 文件、模型导出、图纸、渲染、DRC、仿真、三类有限范围检查、失败修复、技能比较和人工发布。每项输出都可能有自己的失败，发布又不能只看最后一个文件。HG 用独立结果和最后一道人工门把这些风险分开。

## 我们实际跑过什么

2026-08-09 的五次成功 live 运行都完成了 KiCad、ngspice、LibreOffice、Luna、三类有限范围检查、局部故障修复和 G6 响应门。运行器自动提交固定的 JSON 响应来验证这道门；这不是工程师实际审签。耗时为 28.949、22.429、31.719、18.572、32.619 秒。每次都验证了 11 个上游结果在展示文件修复前后保持一致。

这是工作流资格验证，不是制造许可，也不是电气、机械或安全认证。正式时间和成本预算还没有锁定。

## 你可以从哪里改起

先修改 `fixtures/tool-failure.json`，重新运行一次，看看局部失败如何被修复。再修改 `fixtures/eval-matrix.json`，观察一个没有改善的候选技能为什么不会取代当前技能。
