<div class="language-switch"><a href="../../zh/model/">中文</a> · <strong>English</strong></div>

# Object model

Authors start with Slots and Rules. The remaining objects are maintained by the kernel so that versioning, execution, commits, recovery, concurrency, and explanation share one authoritative model.

<div class="diagram">
  <img src="../../assets/model.svg" alt="The relationships between Project, Slot, Rule, Revision, Activation, Attempt, Receipt, and Event" />
</div>

## Author model: Slot + Rule

### Slot: a stable Artifact name

A Slot is a stable graph name, not a file path. It has an explicit `kind`, may have a materialization path, and may declare a writer policy.

```yaml
slots:
  request: { kind: file, path: request.txt }
  report: { kind: file, path: report.md }
```

The current formal value of a Slot is its **Head**, which points to an immutable **Revision**. A Slot without a writer Rule is usually a Source Slot imported by `hg put`, a watcher, a Webhook, or a person. A Slot with a writer Rule is a Derived Slot; its materialized path cannot be treated as a new Head directly.

### Rule: the only state-transition node

A Rule declares input Slots, output Slots, an executor, and optional Guard, Session, permission, budget, and Effect policies:

```yaml
rules:
  - id: make_report
    in: [request]
    out: [report]
    run:
      using: shell
      command: "cp $HG_IN/request $HG_OUT/report"
```

The `in` / `out` relation already defines dependencies, so there is no second Edge structure to maintain. Branches, joins, and feedback loops emerge from Slot + Rule composition; `refine_gate`, Human, and Effect have no privileged node semantics.

## Kernel objects

| Object | Precise meaning | Where to inspect it |
|---|---|---|
| `GraphRevision` | Immutable normalized graph definition with SlotSpecs, RuleSpecs, and target indexes | `check`, `graph`, `inspect` |
| `Revision` | Addressable, immutable Artifact fact | `artifact history`, `inspect` |
| `Head` | The Revision currently accepted for a Slot | `status`, `explain` |
| `Materialization` | A Revision projected into a file, directory, Git, or external system | `materialize`, `drift` |
| `Activation` | A logical need for a Rule and an exact input Revision vector | `plan`, `events` |
| `Attempt` | One real execution, possibly a failure, retry, or recovery | `log`, `logs` |
| `Receipt` | Verified and accepted terminal proof of an Attempt | `status`, cache decisions |
| `Session` | Executor context reusable across Attempts | `session` commands |
| `Lease` | Concurrency ownership proof for execution and commit | `inspect`, `events` |
| `Event` | An append-only fact stream for observation, recovery, and UI projections | `events`, `watch` |
| `Effect` | Rule policy and Receipt for interaction with an external system | `effect verify` |

## Revisions, Heads, and Materialization

```text
Slot ──head──> Revision ──materialize──> path / worktree / external system
```

- A **Revision** is an immutable state in history, identified by a Digest.
- A **Head** is the Revision currently accepted for a Slot.
- A **Materialization** is an accessible projection of a Head; it may be missing, damaged, or drifted, but it cannot rewrite Revision history.

Deleting `report.md` does not delete the `report` Head. `hg materialize report` restores the file from the existing Revision; if the file was hand-edited, `hg drift report` reports the difference instead of treating it as a new Derived Slot version.

## How an Activation is derived from current facts

Given a GraphRevision, a Rule contract, and the Heads of its input Slots, the Activation Key is:

```text
activation_key = H(
  graph_revision_id,
  contract_digest(rule),
  ordered[(slot_id, head_revision_id)]
)
```

An Activation is not a process or a Session. It becomes desired/ready only when required inputs exist, the Guard is `TRUE`, no valid Receipt handles it, no writer conflict exists, and the budget permits execution.

One Activation can have multiple Attempts. Agent nondeterminism is not disguised as a pure function: the system records each Attempt’s exact inputs, executor, Session checkpoints, candidate outputs, and checks, while at most one Receipt is accepted for the current Activation.

## How a Receipt decides reuse

An effective Receipt must at least:

- have `SUCCEEDED` or `NO_CHANGE` status;
- bind the same Activation Key;
- reference output Revisions that still exist;
- remain consistent with the current writer policy and Slot Heads;
- use structural checks covered by the current contract digest;
- retain a valid Effect Readback, or follow a policy that allows one-time verification.

Changing an input, Rule contract, executor adapter, output validation, or Effect policy therefore causes the next reconciliation to reassess the result. File existence alone is not a cache hit.

## The boundary between Attempt, Receipt, and Session

```text
Activation  ──may have──> Attempt 1 ──may use──> Session A
     │                     Attempt 2 ──may use──> Session A or B
     │
     └────────────── accepted Attempt ──> Receipt ──> Slot Head update
```

- `Activation` means “the current input vector needs processing”;
- `Attempt` means “an execution actually happened”;
- `Session` is reusable execution context;
- `Receipt` proves that a result was verified and accepted.

Every Session step receives the complete current contract and change hints. Losing a Session can affect efficiency, but cannot be a prerequisite for recovering formal state.

## Fixed points and GraphRun terminal states

The Runtime computes a backward closure from the target Slots. A GraphRun can reach `STABLE_SUCCESS` only when the closure has no pending Activations, running Attempts, failures, blocks, writer conflicts, or materialization errors, and every target Slot has a valid Head.

Therefore:

- “No Rule is runnable” is not success;
- an old file is not proof that the target is fresh;
- feedback loops use new Revisions to trigger the next round and need no Loop node;
- oscillation, exhausted budgets, missing Sources, and Guard errors retain distinct terminal states.
