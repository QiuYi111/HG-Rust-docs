<div class="language-switch"><a href="../../../zh/examples/17-learning-helper/">中文</a> · <strong>English</strong></div>

# 17 · Learning Helper: a traceable course handbook

This real workflow turns three course sources into a Word handbook containing a mathematical equation. Instead of sending a folder to one model call, it models Human scope approval, per-source distillation, parallel synthesis, coverage review, revision, and document acceptance separately. The resulting evidence explains which input caused each recomputation.

The complete assets are in the [HG-Rust Learning Helper directory](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/learning-helper).

## Workflow

```text
three independent sources ─┐
Human scope decision ──────┼→ Luna GraphSpec → 3 independent distillation subgraphs
                           └→ concept + example synthesis → review/revise → DOCX → render/OCR
```

The dynamic `GraphSpec` is itself a Revision. Knowledge, Examples, and Expansion cross separate Subgraph Rules, so changing Expansion does not invalidate the other two distillations.

## Run it

The contract and live profiles use the same graph. Contract substitutes deterministic process-boundary tools; live uses real Luna, the Documents toolchain, LibreOffice, and GLM-OCR.

```bash
scripts/test-real-world-cases.sh learning-helper contract

HG_DOCUMENTS_SKILL_DIR=/path/to/documents \
HG_DOCUMENTS_PYTHON=/path/to/python \
HG_GLMOCR_SKILL_DIR=/path/to/glmocr \
HG_GLMOCR_PYTHON=/path/to/python \
scripts/test-real-world-cases.sh learning-helper live
```

[`case.lock.yaml`](https://github.com/QiuYi111/HG-Rust/blob/main/examples/real-world/learning-helper/case.lock.yaml) pins dependencies, models, inputs, and still-pending calibration fields. Credentials remain external handles and never become Artifacts.

## Verified behavior

| Scenario | Observable result |
|---|---|
| First run | A Human Rule blocks until the exact `scope.md` Revision is submitted |
| Unchanged rerun | Attempt count remains 10 → 10, proving Receipt reuse |
| Expansion-only change | Attempts become 15; Knowledge and Examples distillation Heads stay byte-identical |
| Final document | Valid DOCX ZIP structure, OMML equation, successful LibreOffice render |
| Visual readback | GLM-OCR recognizes the title, body, and equation content |

The workflow also exposed a scheduler fixed-point defect: unchanged outputs from a bounded parallel batch could leave a deferred successor unvisited while the GraphRun reported `STABLE_SUCCESS`. HG now rebuilds the desired view after every parallel batch and separates Receipt progress from Slot-frontier progress.

## Current observed data

Five successful live samples on 2026-08-09 took 33.910, 44.003, 34.081, 46.635, and 37.284 seconds; the observed five-point p95 is 46.635 seconds. Each baseline run used 10 Attempts and the unchanged rerun remained at 10. Duration, token, and economic-cost budgets are not formally calibrated. Provider-reported zero cost is raw telemetry, not a claim of zero real cost.

## Boundary

This case demonstrates artifact-level causality, selective invalidation, and document acceptance. It does not prove generated teaching content is intrinsically correct; expert approval, accessibility checks, and content-safety review remain release responsibilities.

[Back to the case library](index.md) · [Dynamic subgraph foundation](16-dynamic-subgraph.md)
