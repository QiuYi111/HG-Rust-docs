<div class="language-switch"><a href="../../zh/model/">中文</a> · <strong>English</strong></div>

# Object model

Authors start with Slots and Rules. The remaining objects give the kernel durable evidence for execution, commits, recovery, and explanation.

<div class="diagram">
  <img src="../../assets/model.svg" alt="The relationships between Project, Slot, Rule, Revision, Activation, Attempt, Receipt, and Event" />
</div>

## Author model: Slot + Rule

### Slot

A Slot is a named desired Artifact. It has an explicit `kind`, an optional materialization path, and an optional writer policy.

```yaml
slots:
  request: { kind: file, path: request.txt }
  report: { kind: file, path: report.md }
```

The Slot name participates in dependencies. The path lets people and other tools read the result.

### Rule

A Rule declares how input Slots produce output Slots:

```yaml
rules:
  - id: make_report
    in: [request]
    out: [report]
    run: "cp in/request out/report"
```

A Rule can have multiple inputs and outputs. The kernel considers input Heads, the Rule contract, and existing Receipts before creating an Activation.

## Kernel records

| Object | Meaning | Where to inspect it |
|---|---|---|
| Revision | An immutable Artifact state | `artifact history`, `inspect` |
| Activation | An exact input contract for one Rule | `plan`, `events` |
| Attempt | One execution try for that contract | `log`, `logs` |
| Receipt | Terminal proof of success or `NO_CHANGE` | `status`, cache decisions |
| Session | An execution identity that can span steps | `session` commands |
| Event | An append-only state transition | `events`, `watch` |
| Effect | A change that must interact with an external system | `effect verify` |

## Revisions, Heads, and materialization

- A **Revision** is an immutable state in history.
- A **Head** is the Revision currently accepted for a Slot.
- **Materialization** restores a Head to its configured path.

Deleting `report.md` does not delete the `report` Head. `hg materialize report` restores it; `hg drift report` reports a hand-edited file.

## How a Receipt decides reuse

An effective Receipt matches at least:

- the input Slot Revision vector;
- the normalized Rule execution contract;
- the executor adapter fingerprint;
- guard, write-conflict, and validation results.

Changing an input, Rule, executor, or policy therefore causes the next reconciliation to reassess the result.

## Fixed point

A GraphRun reaches stable success when the target and its input closure are fresh. An old file is not enough; the current inputs and Receipt must still agree.
