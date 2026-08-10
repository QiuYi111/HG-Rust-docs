# CAD Release

CAD Release uses KiCad, ngspice, and LibreOffice to produce PCB source, STEP, PDF, simulation, renders, and a release presentation while retaining three independent review artifacts.

The live path requires KiCad, ngspice, and LibreOffice. Its output qualifies the workflow; it does not certify the physical design for manufacturing.

<div class="hg-diagram">
  <img src="../../../assets/diagrams/cad.en.svg" alt="CAD release graph">
</div>

## Complete graph definition

The configuration runs from G0 through G6 and includes parallel export, independent critics, failure recovery, a skill benchmark, and human acceptance. You can also [download the raw YAML](../../includes/cad-release.yaml).

<div class="hg-yaml" markdown>

```yaml
--8<-- "includes/cad-release.yaml"
```

</div>

## What each Slot does

| Slot | Stage | Role in the graph |
|---|---|---|
| `requirements` | input | Board dimensions and delivery requirements. |
| `board_seed` | input | KiCad PCB used as the source seed. |
| `eval_matrix` | input | Frozen score baseline for the active and candidate skills. |
| `tool_failure` | input | Controls injected presentation failure. |
| `active_skill_seed` | input | Currently active CAD skill. |
| `design_intent` | G0 | Requirements checksum, board dimensions, and evidence level. |
| `source` | G1 | PCB source entering the release flow. |
| `step` | G2 | Mechanical STEP exported by KiCad. |
| `drawing` | G2 | Silkscreen and board-outline PDF. |
| `render` | G2 | Directory containing top and bottom renders. |
| `drc` | G2 | Native KiCad DRC result. |
| `simulation` | G2 | ngspice simulation evidence. |
| `visual_critique` | G3 | Independent visual check of renders and drawing. |
| `mechanical_critique` | G3 | STEP-format and mechanical-output check. |
| `cad_critique` | G3 | Source, DRC, and simulation check. |
| `dossier` | G4 | Evidence package containing intent and all three critiques. |
| `presentation` | G4 | Release PDF generated through LibreOffice. |
| `skill_candidate` | G5 | CAD skill candidate derived from this run. |
| `skill_benchmark` | G5 | Comparison with the frozen baseline. |
| `active_skill` | G5 | Skill retained or selected after the benchmark. |
| `g6_acceptance` | G6 | Human decision over the exact release evidence. |
| `release_manifest` | output | Final checksums, critics, simulation, and skill decision. |


## What each Rule does

| Rule | Reads | Writes | Work |
|---|---|---|---|
| `g0_capture_requirements` | requirements | design_intent | Freezes the requirements checksum and qualification level. |
| `g1_generate_source` | design_intent, board_seed | source | Produces the PCB source entering release. |
| `g2_export_step` | source | step | Exports the mechanical model with KiCad. |
| `g2_export_drawing` | source | drawing | Exports silkscreen and edge cuts as PDF. |
| `g2_render_board` | source | render | Produces top and bottom PNG renders. |
| `g2_native_drc` | source | drc | Runs native KiCad DRC. |
| `g2_simulate` | design_intent | simulation | Runs ngspice and records a 5 V to 2.5 V divider result. |
| `g3_visual_critic` | requirements, render, drawing | visual_critique | Checks render and drawing files and records checksums. |
| `g3_mechanical_critic` | requirements, step | mechanical_critique | Checks the STEP header and checksum. |
| `g3_cad_critic` | requirements, source, drc, simulation | cad_critique | Checks zero DRC violations and simulation status. |
| `g4_assemble_dossier` | design_intent, three critiques | dossier | Builds the G4 evidence package. |
| `g4_render_presentation` | dossier, tool_failure | presentation | Can fail once by injection; otherwise produces the release PDF. |
| `g5_derive_skill_candidate` | dossier | skill_candidate | Derives a skill candidate from the evidence. |
| `g5_benchmark_skill` | skill_candidate, eval_matrix | skill_benchmark | Compares with the frozen score and writes suppress if it did not improve. |
| `g5_select_active_skill` | active_skill_seed, skill_candidate, skill_benchmark | active_skill | Retains the seed skill when promotion is suppressed. |
| `g6_human_acceptance` | dossier, presentation, skill_benchmark, active_skill | g6_acceptance | Accepts or rejects the exact G6 evidence. |
| `finalize_release` | all release artifacts and g6_acceptance | release_manifest | Records checksums and the final decision after acceptance. |


The STEP, drawing, render, and DRC Rules read only `source`; simulation reads `design_intent`. These G2 branches can run in parallel. The three G3 Critics also read separate evidence and can run in parallel.

An injected presentation failure affects only the `presentation` branch. Recovery can reuse upstream design, export, and review Receipts. When the skill candidate does not beat the frozen baseline, the graph carries `active_skill_seed` forward as `active_skill`.

## Run and inspect it

```bash
scripts/test-real-world-cases.sh cad-release contract
scripts/test-real-world-cases.sh cad-release live
```

Use contract mode to check graph structure, gates, and failure recovery. After live mode, inspect `release/manifest.json` and compare it with the checksums in the three critique files.
