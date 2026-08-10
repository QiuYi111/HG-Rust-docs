# CAD Release

CAD Release is the specialist-tool case. It uses KiCad, ngspice, and LibreOffice to produce board source, STEP, PDF, simulation, renders, and a release presentation while preserving independent review evidence.

<div class="hg-diagram">
  <img src="../../../assets/diagrams/cad.en.svg" alt="CAD release graph">
</div>

## G0 through G6

G0 fixes design intent. G1 creates source. G2 exports mechanical, drawing, render, DRC, and simulation evidence in parallel. G3 runs separate visual, mechanical, and CAD critics. G4 assembles a dossier and presentation. G5 compares a skill candidate with a frozen benchmark. G6 remains a Human Rule.

The fixture injects one presentation failure. Repair reruns only affected downstream work and preserves upstream design evidence. A skill candidate that does not improve the frozen benchmark is not promoted.

## Run the case

```bash
scripts/test-real-world-cases.sh cad-release contract
scripts/test-real-world-cases.sh cad-release live
```

Use contract mode to inspect graph and gate behavior first. Live mode needs KiCad, ngspice, and LibreOffice. The outputs qualify the workflow; they do not certify a physical design for manufacturing.

Dependencies and complete Rules live in the case directory's `README.md` and `harness.yaml`.
