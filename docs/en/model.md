# Two primitives

A `harness.yaml` is mostly `slots` and `rules`. Other objects preserve execution facts without expanding the author model.

<div class="hg-diagram">
  <img src="../../assets/diagrams/two-primitives.en.svg" alt="The relationship between Slot and Rule">
</div>

## Slot

A Slot gives an artifact a stable name, kind, and materialization path.

```yaml
slots:
  brief: { kind: file, path: request/brief.md }
  candidate: { kind: git, path: artifacts/candidate }
  report: { kind: file, path: artifacts/report.md }
```

Each committed version in a Slot is an immutable Revision. The kernel can therefore identify exactly what a Rule read and decide whether an existing output still matches the current inputs.

## Rule

A Rule declares its inputs, outputs, and execution method.

```yaml
rules:
  - id: write_report
    in: [brief, candidate]
    out: [report]
    run: "printf '# Report\n' > out/report"
```

At execution time, inputs appear under `in/` and declared outputs must be written under `out/`. A successful Attempt commits every output atomically. Failure, timeout, or a missing output leaves no partial Revision.

## Runtime facts

| Name | Meaning |
| --- | --- |
| Revision | An immutable artifact version in a Slot |
| Activation | A Rule paired with an exact input Revision frontier |
| Attempt | One execution of an Activation |
| Receipt | The reusable record of a successful execution |

A Lease prevents multiple workers from owning the same Activation. A Session lets an executor retain controlled context across related runs. Both are runtime mechanisms.

## Three common execution methods

A Shell Rule runs a command. An Agent Rule delegates semantic work to an executor. A Human Rule pauses for a responsible decision.

```yaml
run: "cp in/source out/result"
```

```yaml
run:
  using: codex
  command: "Read in/brief and write only out/report."
```

```yaml
run:
  using: human
  command: "Approve the reviewed candidate"
```

All three share Slot and Rule dataflow, so they compose in the same graph.
