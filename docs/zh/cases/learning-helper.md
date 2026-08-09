<div class="language-switch"><strong>中文</strong> · <a href="../../en/cases/learning-helper/">English</a></div>

# Learning Helper，把三份资料做成一份可追踪的 Word 手册

你手里有一门课的三份资料。你想把它们放进一份有来源、有公式、能渲染的 Word 文件里。这个案例验证文件结构、公式对象、渲染和输入变化后的重新计算。它不评价手册内容是否适合真实教学。

完整案例在 [HG-Rust 的 Learning Helper 目录](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/learning-helper)。下面的步骤可以直接对应目录里的 `harness.yaml` 和输入文件。

<div class="diagram">
  <img src="../../assets/case-learning.svg" alt="课程资料经过范围确认、分别整理、合并检查后生成 Word 手册" />
</div>

## 第一步，先把交付物说清楚

先不要让模型写摘要。先写出最后要交付的文件，以及什么叫“可以交付”。在这个案例里，交付物是 `handbook.docx`，它要满足三件事。

- 三份资料都能在手册中找到对应内容。
- 公式要保存成 Word 可以识别的公式对象，不能只放一串普通字符。
- 打开和渲染后，标题、正文和公式都看得见。

```yaml
version: 1
project:
  name: real-world-learning-helper
  default_targets: [handbook]

slots:
  knowledge: { kind: file, path: inputs/Knowledge.md }
  examples: { kind: file, path: inputs/Examples.md }
  expansion: { kind: file, path: inputs/Expansion.md }
  handbook: { kind: file, path: handbook.docx }
```

这里的 `slot` 可以先理解成一个“有名字的文件位置”。HG 会记住这个文件每次被接受时的版本。这样以后手册变了，你能追到是哪份资料变了。

## 第二步，范围要由人确认

三份资料放进来还不够。你还要告诉流程，这次手册给谁看、讲到什么深度、哪些内容暂时不写。把这个决定写成文件，作为第一步的输入。

```yaml
slots:
  scope_prompt: { kind: file, path: fixtures/scope.md }
  scope: { kind: file, path: scope.md }

rules:
  - id: choose_scope
    in: [scope_prompt]
    out: [scope]
    run: { using: human, command: "Confirm the course scope from this exact file" }
```

案例运行器会通过 Human Rule 自动提交固定的 `fixtures/scope.md`，用来验证流程会接收范围文件，并拒绝绑定到旧问题的回答。这一步验证的是门控行为，不是一次真实的审批质量评估。

```bash
HG_KEEP_RUN_ROOT=1 scripts/test-real-world-cases.sh learning-helper contract
```

运行器会自动完成这个固定响应，然后继续跑完整个案例。要测试自己的范围文件，请把案例复制到你选择的项目目录，再使用 `hg human decide --from <你的范围文件>`。

## 第三步，三份资料分别处理

如果把三份资料一次性塞给一个模型，任何一份小改动都可能让整本手册重跑。这里用三个按来源分开的步骤，再交给后面的合并步骤。本案例里的固定命令只验证这种拆分和选择性失效，不评价模型生成的文字质量。

```yaml
slots:
  generated_graph: { kind: file, path: generated-distillation.yaml }
  knowledge_distillation: { kind: file, path: distillations/Knowledge.md }
  examples_distillation: { kind: file, path: distillations/Examples.md }
  expansion_distillation: { kind: file, path: distillations/Expansion.md }

rules:
  - id: plan_distillation
    in: [scope]
    out: [generated_graph]
    run:
      using: codex
      model: gpt-5.6-luna
      command: "Write the child graph definition to out/generated_graph"

  - id: distill_knowledge
    in: [knowledge, generated_graph]
    out: [knowledge_distillation]
    run: { using: subgraph, command: "slot:generated_graph" }
```

`generated_graph` 是“接下来如何分开处理资料”的一份版本化配置。三个步骤各自读取一份资料，彼此没有共享未记录的工作区。只改 `Expansion.md` 时，另外两份结果可以继续使用。

## 第四步，把整理结果合成手册，再检查文件

先用规则合成 Markdown 草稿，再让文档脚本生成 Word。检查也写成规则，只有覆盖检查通过，Word 文件才会出现。

```yaml
rules:
  - id: assemble_draft
    in: [template, conclusion, knowledge_distillation,
         examples_distillation, expansion_distillation]
    out: [draft]
    run: "cat in/template in/examples_distillation in/expansion_distillation in/knowledge_distillation in/conclusion > out/draft"

  - id: render_docx
    in: [draft, coverage, scope, docx_builder]
    out: [handbook]
    when: "test \"$(jq -r '.decision' coverage)\" = accept"
    run: "sh in/docx_builder in/draft out/handbook"
```

要查看运行结果，可以在运行前设置 `HG_KEEP_RUN_ROOT=1`。运行器会打印一个由你的系统选择的保留目录。把那个目录填入下面的 `RUN_ROOT` 变量。

```bash
RUN_ROOT=/path/to/your/retained/run
hg materialize handbook --project "$RUN_ROOT"
hg status --project "$RUN_ROOT" --output json
hg explain handbook --project "$RUN_ROOT" --output json
```

HG 先确认草稿检查通过，再保存一份不可变的结果版本。你删掉或改坏本地 Word 文件时，历史结果还在，可以重新物化。

## 第五步，故意只改一份资料

把一个小段落加到 `inputs/Expansion.md`，然后再次运行。

```bash
RUN_ROOT=/path/to/your/project
hg put expansion "$RUN_ROOT/inputs/Expansion.md" --project "$RUN_ROOT"
hg run handbook --project "$RUN_ROOT" --output json
hg materialize handbook --project "$RUN_ROOT"
```

这次你会看到 Expansion 分支重新整理，最后手册包含新内容。Knowledge 和 Examples 的整理版本保持不变。第一次基准运行有 10 次实际工作，未改输入的重跑仍是 10 次，只改 Expansion 后变成 15 次。

## 这一步为什么需要这么多结构

复杂度来自三件具体事情。输入不止一个，人工范围会改变后续所有工作，最后的文件还要经过结构和视觉检查。把它写成一条长脚本，脚本可以跑，出了问题却很难回答“哪份资料导致了这次重做”。HG 把每个输入和每个结果单独保存，所以选择性重做有地方可依靠。

## 我们实际跑过什么

2026-08-09 的五次成功 live 运行都完成了固定范围响应、固定的按来源处理步骤、Word 生成、LibreOffice 渲染和 GLM-OCR 标题回读。五次耗时分别为 33.910、44.003、34.081、46.635、37.284 秒。运行验证了公式对象存在、渲染页面存在，以及只改一份输入时其余两条结果不变。

这些数字是当前观察结果，不是已经锁定的性能承诺。正式的时间和成本预算另行校准。

## 你可以从哪里改起

先改 `inputs/Expansion.md`，观察一条分支如何变化。若要测试范围变化，请改 `fixtures/scope.md` 后重新运行；范围输入变化才会让旧范围决定失效。完整配置和固定输入都在案例目录中。
