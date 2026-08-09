<div class="language-switch"><a href="../../zh/cases/learning-helper/">中文</a> · <strong>English</strong></div>

# Learning Helper: turn three sources into a traceable Word handbook

You have three source files for a course. You want one Word file with sources, an equation, and a checkable render. This case verifies file structure, the equation object, rendering, and re-computation after an input change. It does not evaluate whether the prose is suitable for real teaching.

The complete case is in the [HG-Rust Learning Helper directory](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/learning-helper). The steps below first explain the fixed input → processing → output relationships, then show how to run the case verifier.

<div class="diagram">
  <img src="../../assets/case-learning.svg" alt="Course sources pass through scope confirmation, separate distillation, and document checks into a Word handbook" />
</div>

## Step 1: describe the result before asking for prose

Start with the file you will hand over and the conditions for accepting it. Here the result is `handbook.docx`.

- All three sources appear in the handbook.
- The equation is a Word equation object, not just typed characters.
- The title, body, and equation remain visible after rendering.

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

You can read a `slot` as a named file position. HG records each accepted version of that file, so a later handbook can be traced back to the source that changed.

## Step 2: let a person set the scope

Three source files do not say who the handbook is for or how deep it should go. Ask for that decision as a file before generated work starts.

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

The case runner submits the fixed `fixtures/scope.md` through a Human Rule. This checks that the workflow accepts a scope file and rejects an answer bound to an old question. It does not evaluate the quality of a real person’s approval.

```bash
HG_KEEP_RUN_ROOT=1 scripts/test-real-world-cases.sh learning-helper contract
```

The runner submits this fixed response automatically and continues through the case. To try your own scope, copy the case into a project directory you choose and use `hg human decide --from <your-scope-file>`.

## Step 3: process the three sources with a fixed three-branch flow

If one model call receives all three sources, a small change can make the whole handbook repeat its work. Here the three processing relationships are written explicitly before a later step combines them. The current case has three fixed inputs, three fixed processing steps, and three fixed outputs. It does not select sources at runtime or rewrite the flow while it runs.

```yaml
slots:
  knowledge_distillation: { kind: file, path: distillations/Knowledge.md }
  examples_distillation: { kind: file, path: distillations/Examples.md }
  expansion_distillation: { kind: file, path: distillations/Expansion.md }

rules:
  - id: distill_knowledge
    in: [knowledge]
    out: [knowledge_distillation]
    run: "cp in/knowledge out/knowledge_distillation"

  - id: distill_examples
    in: [examples]
    out: [examples_distillation]
    run: "cp in/examples out/examples_distillation"

  - id: distill_expansion
    in: [expansion]
    out: [expansion_distillation]
    run: "cp in/expansion out/expansion_distillation"
```

This fixed graph is enough for the core problem in this case. Each step reads one source and does not share an untracked workspace. Changing `Expansion.md` therefore does not require the other two results to run again. The case verifies version tracking, cache reuse, and selective rework in a fixed flow; it does not verify automatic flow planning.

## Step 4: assemble the handbook and check the file

First assemble a Markdown draft. Then let the document script make the Word file. The Word step runs only after the coverage check accepts the draft.

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

To inspect the run, set `HG_KEEP_RUN_ROOT=1` before running. The runner prints a retained directory chosen by your system. Put that directory in the `RUN_ROOT` variable below:

```bash
RUN_ROOT=/path/to/your/retained/run
hg materialize handbook --project "$RUN_ROOT"
hg status --project "$RUN_ROOT" --output json
hg explain handbook --project "$RUN_ROOT" --output json
```

HG checks the draft before accepting the Word file and keeps an immutable result version. If the local Word file is deleted or damaged, the accepted result can be materialized again.

## Step 5: change one source and run again

Add a small paragraph to `inputs/Expansion.md`, then run:

```bash
RUN_ROOT=/path/to/your/project
hg put expansion "$RUN_ROOT/inputs/Expansion.md" --project "$RUN_ROOT"
hg run handbook --project "$RUN_ROOT" --output json
hg materialize handbook --project "$RUN_ROOT"
```

The Expansion branch is processed again and the new text reaches the handbook. The Knowledge and Examples distillation versions stay unchanged. The baseline used 10 actual Attempts, an unchanged rerun still used 10, and the one-source change used 15.

## Why the workflow needs this structure

The complexity comes from three concrete facts. There are several sources, a human scope decision changes downstream work, and the final file needs both structural and visual checks. One long script can run, but it cannot answer which source caused a rebuild. HG keeps each input and result separately, giving selective rework a reliable basis.

## What we actually ran

Five successful live runs on 2026-08-09 completed the fixed scope response, fixed source processing steps, Word generation, LibreOffice rendering, and GLM-OCR title readback. Elapsed times were 33.910, 44.003, 34.081, 46.635, and 37.284 seconds. The runs checked that the equation object exists, a rendered page exists, and the other two branches remain unchanged after an Expansion-only edit.

These are current observations, not a locked performance promise. Formal duration and cost calibration is separate work.

## Try changing next

Change `inputs/Expansion.md` first and watch one branch move. To test a scope change, change `fixtures/scope.md` and run again; a scope-input change is what invalidates the old decision. The complete configuration and pinned inputs are in the case directory.
