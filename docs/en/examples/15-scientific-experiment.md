<div class="language-switch"><a href="../../../zh/examples/15-scientific-experiment/">中文</a> · <strong>English</strong></div>

# 15 · Scientific experiment

Turn CSV data into observations and then into a report that states its limitations. Traceability does not mean that a conclusion is automatically valid.

## Graph structure

```text
data.csv ──> observations ──> report
       \────────────────────> report
```

## Configuration focus

```yaml
rules:
  - id: observe
    in: [data]
    out: [observations]
    run: { using: codex, model: your-model-id, command: "Read in/data and write observations to out/observations." }
  - id: report
    in: [data, observations]
    out: [report]
    run: "cat in/observations > out/report"
```

## Run it

```bash
hg put data data.csv --project .
hg run report --project .
hg materialize observations --project .
hg materialize report --project .
hg artifact history report --project .
```

Data, observations, and the report each have a Revision. Re-importing the data produces new observations and a new report; the report should state its sample size, assumptions, and unsupported conclusions.

[Back to the case library](index.md) · [Back to the case overview](index.md)
