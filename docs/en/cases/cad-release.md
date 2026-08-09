<div class="language-switch"><a href="../../zh/cases/cad-release/">中文</a> · <strong>English</strong></div>

# CAD Release: put design, checks, and release in one workflow

You need to deliver a small PCB. This demonstration uses a fixed PCB seed; it does not ask a model to design the circuit. It shows how to connect the board, 3D model, drawing, simulation result, top and bottom renders, check records, and final release record. If one presentation file fails, you want to repair that file without rebuilding accepted design and simulation work. A person must own the final release decision.

The complete case is in the [HG-Rust CAD Release directory](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/cad-release).

<div class="diagram">
  <img src="../../assets/case-cad.svg" alt="Design requirements pass through PCB, model, drawing, simulation, three reviews, and local repair before human release acceptance" />
</div>

## Step 1: fix the design requirements first

G0 reads the requirements file and produces design intent. Its version is carried by every later result.

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

When the requirements change, the design intent and later delivery artifacts are checked against the new version instead of silently reusing the old board.

## Step 2: give each real tool one job

KiCad exports the STEP model, drawing, top and bottom renders, and DRC result. ngspice runs the simulation. Every output has its own named location.

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

That is why this case is more than a KiCad command. Each tool has its own input format and failure mode. HG keeps the results separate, so a later check can identify the failing tool.

## Step 3: keep three limited checks independent

Each check has a clear limit: the visual check confirms that renders and drawings exist and records their checksums; the mechanical check confirms the STEP format marker; the CAD check reads the DRC and simulation status. They do not share one generic “passed” string, and they do not replace an engineer’s review of layout, structure, electrical safety, or manufacturing conditions.

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

HG protects shared outputs at commit time. Independent checks may overlap, while two steps cannot silently overwrite the same protected result.

## Step 4: make the presentation fail once on purpose

The case first enables a presentation failure. The first run fails after recording the upstream results. Turn off only the failure switch and run again.

```bash
scripts/test-real-world-cases.sh cad-release contract
scripts/test-real-world-cases.sh cad-release live
```

After repair, all 11 upstream results stay unchanged and the presentation is regenerated. This shows that HG keeps step results rather than one disposable run directory.

## Step 5: let a person own the release decision

G6 reads the evidence and waits for an explicit JSON decision. Without that decision, the final release record is not created.

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

The case also compares a candidate skill with a fixed evaluation matrix. This candidate is marked as not improved, so HG keeps the current skill. That checks the “do not replace without improvement” control flow; it is not a real skill benchmark.

## Why this workflow is complex

The job includes CAD files, model export, drawing, rendering, DRC, simulation, three limited checks, local repair, skill comparison, and human release. Each output can fail independently, while release cannot rely on one final file. HG separates the evidence and adds a final human gate.

## What we actually ran

Five successful live runs on 2026-08-09 completed KiCad, ngspice, LibreOffice, Luna, three limited checks, local failure repair, and the G6 response gate. The runner submitted a fixed JSON response to exercise that gate; this was not an engineer sign-off. Elapsed times were 28.949, 22.429, 31.719, 18.572, and 32.619 seconds. Each run checked that all 11 upstream results stayed identical before and after presentation repair.

This is workflow qualification evidence, not manufacturing permission or electrical, mechanical, or safety certification. Formal duration and cost budgets are not locked.

## Try changing next

Change `fixtures/tool-failure.json` and run again to see local failure repair. Then change `fixtures/eval-matrix.json` and observe why a non-improving candidate skill does not replace the current one.
