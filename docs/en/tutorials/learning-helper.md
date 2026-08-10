# Learning Helper

This graph turns three course sources into a Word handbook. By the end of the page, you will understand human scope selection, three-way parallel processing, a join, coverage review, and conditional rendering with ordinary Slots and Rules.

The live path requires a working Codex executor, document-generation tools, and the OCR environment declared by the case.

<div class="hg-diagram">
  <img src="../../../assets/diagrams/learning.en.svg" alt="Learning Helper graph">
</div>

## Complete graph definition

The page embeds the configuration used by the case. You can also [download the raw YAML](../../includes/learning-helper.yaml).

<div class="hg-yaml" markdown>

```yaml
--8<-- "includes/learning-helper.yaml"
```

</div>

## What each Slot does

| Slot | Kind | Role in the graph |
|---|---|---|
| `knowledge` | file | Definitions, equations, and core knowledge. |
| `examples` | file | Worked steps, exercises, and answers. |
| `expansion` | file | Extensions, caveats, and related ideas. |
| `scope_prompt` | file | The scope request shown to the person making the decision. |
| `docx_builder` | file | The script that converts the Markdown draft into DOCX. |
| `scope` | file | The Human Rule decision read by all three distillation Rules. |
| `knowledge_distillation` | file | Teaching-oriented treatment of the knowledge source. |
| `examples_distillation` | file | Teaching-oriented treatment of the examples source. |
| `expansion_distillation` | file | Teaching-oriented treatment of the expansion source. |
| `template` | file | Fixed handbook title and opening. |
| `conclusion` | file | Fixed handbook conclusion. |
| `draft` | file | The Markdown join of all five content branches. |
| `coverage` | file | Coverage decision and the checksum of the reviewed draft. |
| `handbook` | file | The generated Word document. |


Each source has a normal Slot and a direct writer. The graph shape is known before execution; no dynamic subgraph is needed.

## What each Rule does

| Rule | Reads | Writes | Work |
|---|---|---|---|
| `choose_scope` | scope_prompt | scope | Asks a person to confirm the course scope. |
| `distill_knowledge` | scope, knowledge | knowledge_distillation | Preserves definitions and equations and explains why they matter. |
| `distill_examples` | scope, examples | examples_distillation | Preserves concrete steps and answers as a worked-example section. |
| `distill_expansion` | scope, expansion | expansion_distillation | Extracts useful extensions and caveats from the supplied source. |
| `build_template` | scope | template | Creates the fixed title and records that scope is Revision-bound. |
| `build_conclusion` | scope | conclusion | Creates the fixed ending. |
| `assemble_draft` | template, conclusion, three distillations | draft | Joins the content and adds a coverage marker and equation. |
| `review_coverage` | draft, coverage | coverage | Rechecks when the draft checksum changes and writes accept or revise. |
| `render_docx` | draft, coverage, scope, docx_builder | handbook | Builds the DOCX only when coverage is accepted. |


The three distillation Rules share only `scope`, so the scheduler can run them in parallel. Changing `Knowledge.md` makes the knowledge branch and its downstream work stale while the other two branches can reuse their Receipts.

## Run and inspect it

Start with the deterministic contract path.

```bash
scripts/test-real-world-cases.sh learning-helper contract
```

It checks cache reuse, final-output propagation, and selective invalidation after changing one source.

Run the live path after preparing the agent, document tools, and OCR environment.

```bash
scripts/test-real-world-cases.sh learning-helper live
```

Inspect `handbook.docx`, then change only `inputs/Knowledge.md` and run again. The Examples and Expansion Receipts should remain reusable.
