<div class="language-switch"><a href="../../../zh/examples/20-cad-release/">中文</a> · <strong>English</strong></div>

# 20 · CAD Release: recoverable G0–G6 release

This release-grade case runs G0–G6 through real KiCad 10, ngspice 46, LibreOffice, and Luna. It produces a version-consistent PCB source, STEP model, PDF drawing, simulation result, top and bottom 3D renders, and presentation. Visual, Mechanical, and CAD critics are independent Rules. An injected presentation failure then proves that repair stays execution-local instead of invalidating accepted design evidence.

All assets are in the [CAD Release directory](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/cad-release).

## Release graph

```text
G0 requirements → G1 design intent → G2 KiCad source
  → G3 STEP / drawing / render / DRC / simulation
  → G4 visual + mechanical + CAD critics
  → G5 dossier + presentation + frozen skill benchmark
  → G6 Human acceptance → release manifest
```

Both top and bottom renders must be non-empty; DRC must report zero violations; simulation must pass; and all three independent critics must commit passing evidence. A frozen evaluation matrix compares the candidate skill. When it does not improve the benchmark, promotion is suppressed and the active skill stays byte-identical.

## Run and inject failure

```bash
scripts/test-real-world-cases.sh cad-release contract
scripts/test-real-world-cases.sh cad-release live
```

The runner first makes the presentation stage fail from a fixture and records 11 upstream Heads. It then changes only the failure-control Artifact and resumes. The second run must stop at Human-owned G6 with all 11 Heads unchanged. Only an exact G6 acceptance file permits the graph to emit a `cad-release/v1` manifest.

## Kernel capability map

| Release requirement | HG mechanism |
|---|---|
| Parallel tools | `--jobs 3` ceiling and exclusive-output writer-conflict protection |
| Failed tool cannot pollute history | Atomic Attempt commit; failure has no Receipt |
| Local recovery | Reuse of valid upstream Receipts and Revision Heads |
| Independent review | Three critics own separate Rules and output Slots |
| Release ownership | G6 Human Rule with Activation fencing |
| Skill-promotion safety | Frozen benchmark Artifact plus explicit suppress result |

## Current observed data

Five successful live samples took 28.949, 22.429, 31.719, 18.572, and 32.619 seconds; the observed p95 is 32.619 seconds. Every baseline used 18 Attempts, the unchanged rerun remained at 18, and every sample verified local repair, three independent critics, skill suppression, and the G6 Human gate. Formal budgets are not calibrated yet.

## Critical limitation

This is qualification of orchestration behavior, tool boundaries, and evidence lineage. It is not physical-design certification and does not claim the PCB is ready for manufacture. A real release still requires the applicable electrical, mechanical, DFM, regulatory, and safety reviews.

[Back to the case library](index.md) · [Hardware-design foundation](14-hardware-project.md)
