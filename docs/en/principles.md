<div class="language-switch"><a href="../../zh/principles/">中文</a> · <strong>English</strong></div>

# Core philosophy

HG-Rust is not a task runner that strings commands together and attaches a log to each run. It answers a stricter question:

> **Which Artifacts can no longer be proven correct by the latest facts?**

Requirements, source code, test reports, review decisions, Prompts, Memory, Skills, trajectories, and external events can all be Artifacts. HG-Rust puts them in one versioned model, then continuously reconciles a target until it reaches a fixed point—or clearly reports why it cannot.

## Remember this first: the author model is only Slot + Rule

Authors declare two things:

- **Slot**: a stable Artifact name;
- **Rule**: a transformation contract that consumes Slots, invokes an executor, and produces Slots.

`Revision`, `Activation`, `Attempt`, `Receipt`, `Session`, `Lease`, and `Event` are kernel facts maintained for correctness, recovery, concurrency, and auditability. They are not a second graph language that every author must maintain.

```text
Slot + Rule
    │
    ├── input/output relations project the dependency graph
    ├── a new Revision triggers the next reconciliation
    └── validation, commit, recovery, and explanation stay in the kernel
```

Rule `in` / `out` declarations already define causality, so there is no second, potentially conflicting set of explicit Edges to maintain. Branches, joins, feedback loops, human decisions, and external effects are all compositions of Slots and Rules.

## 1. A Slot is not a path: a Revision is the authority

A Slot is a stable name, not a filename, directory, or process state. Its current formal value is its **Head**, which points to an immutable **Artifact Revision**:

```text
Slot ──head──> immutable Revision
  │
  └──materialization──> file / directory / Git worktree / external projection
```

A path is only a Materialization. This means:

- deleting a materialized file does not delete historical Revisions;
- a damaged Materialization can be restored from CAS or Git without rerunning an Agent;
- historical Revisions cannot disappear because a path was overwritten;
- a hand-edited workspace is reported as drift instead of being disguised as a new Derived Slot fact.

This separation keeps “what was ever produced,” “which Revision is current,” and “what is currently on disk” distinct.

## 2. Reconcile does not walk edges; it coordinates facts toward a target

Traditional workflow systems often ask, “Which node runs next?” HG-Rust asks which results in the target’s input closure have not been proven by current facts.

One `hg run`:

1. computes the target’s backward closure;
2. derives exact Activations from current Slot Head vectors;
3. evaluates Guards, Receipts, write conflicts, and budgets;
4. executes Activations that lack valid proof;
5. commits new Revisions and lets events derive the next round;
6. continues until the target reaches a fixed point or an explainable terminal state.

“No Rule is runnable” is not a success condition. Missing Sources, Guard errors, failures, write conflicts, degraded Materializations, exhausted budgets, and oscillation are distinct states.

Feedback loops do not need a special Loop node. A successful commit creates a new Revision, which naturally creates a new Activation for dependent Rules. An SCC is used for budgets, fair scheduling, Session lifetime, and oscillation diagnosis—not to hide an execution order in the kernel.

## 3. Causality must be explicit, never hidden in a path or a memory

Any persistent state that can affect a downstream result must be either:

- an explicit input Slot to the Rule; or
- execution configuration included in the normalized Rule contract digest.

Therefore:

- Prompt, Memory, Skill, model configuration, and provider options cannot exist only in process context;
- a Transcript that affects downstream work must be a declared output Slot;
- dynamic graph changes must produce a `graph_patch` Artifact, which is validated and applied at a reconcile barrier;
- an old Session memory cannot become a hidden input to current truth.

An explicit causal closure lets the system answer “which inputs produced this Revision” and reliably invalidate an old Receipt when an input changes.

## 4. Activation, Attempt, and Session each have one meaning

This separation is how HG-Rust handles Agent nondeterminism, failure, and long-lived execution.

| Object | What it means | What it is not |
|---|---|---|
| `Activation` | A logical need for one Rule and an exact Revision vector | Not a process or chat session |
| `Attempt` | One real execution of that Activation | Not the project’s formal result |
| `Session` | Executor context reusable across Attempts | Not authority or commit proof |
| `Receipt` | The verified, accepted terminal proof of an Attempt | Not an ordinary log or “exit code 0” |

The Activation Key is derived from the GraphRevision, the Rule contract, and the ordered input Revision vector:

```text
activation_key = H(
  graph_revision,
  rule_contract,
  [(slot_id, head_revision_id)]
)
```

One Activation can have multiple Attempts because an Agent can fail, retry, or resume a Session. Every step still receives the complete current contract. A Session may reduce cold starts and repeated context; losing it can reduce efficiency, but cannot prevent formal state recovery.

## 5. A Receipt is commit proof, not a cache label

A successful result must satisfy all of the following:

1. the Attempt reached a durable terminal state;
2. every declared output passed kind, structure, and path-boundary checks;
3. candidate Revisions were written to content-addressed storage;
4. the Receipt and Slot Heads committed in one database transaction;
5. the Lease fencing token was still valid at commit time.

Only a `SUCCEEDED` or `NO_CHANGE` Receipt that still satisfies the current input, output, and validation conditions may handle the current Activation. File existence, a zero process exit code, or an old log is not a cache hit.

Logical commit comes before materialization. If a path update fails, the committed Revision remains available and the system reports repairable Materialization degradation instead of rerunning an expensive Agent.

## 6. Failures, conflicts, and effects are formal facts

HG-Rust does not hide exceptions in stderr or turn “nothing ran” into stable success. Attempts, Activations, and GraphRuns leave queryable states. Typical GraphRun terminal states include:

- `STABLE_SUCCESS`: the target closure reached a fixed point;
- `STABLE_NO_TARGET_CHANGE`: the result is stable with no target change;
- `BLOCKED_MISSING_SOURCE`: a required Source Revision is missing;
- `FAILED`: execution, Guard, or business validation failed;
- `WRITE_CONFLICT`: multiple writers were simultaneously eligible without arbitration;
- `BUDGET_EXHAUSTED` / `OSCILLATION_DETECTED`: governance limits stopped progress;
- `CANCELLED` / `DEGRADED_MATERIALIZATION`: cancellation or materialization needs attention.

Single-writer is the default. Multiple writers require an explicit arbitration policy; YAML order, lexical order, or “last writer wins” cannot silently resolve a conflict.

Publishing, messaging, deployment, and procurement are still ordinary Rules, but they must declare an Effect policy. Idempotency keys, Readback, and structured Effect Receipts address the window where a remote action succeeded before the local commit completed. A Human Rule is likewise bound to an exact Activation Key and input Revision vector; an old approval cannot silently approve new facts.

## 7. The kernel provides mechanisms, not domain cognition

`refine_gate`, repair, promotion, rollback, Human, Effect, Memory, and Skill are not privileged kernel node types. To the Runtime, these graphs have the same semantics:

```text
test_report  -> repair_gate   -> repair
CAD_review   -> redesign_gate -> redesign
trajectory   -> refine_gate   -> refine
```

Each is simply a Rule that consumes Revisions, evaluates a Guard, produces Revisions, and writes a Receipt. Domain judgment belongs in versioned Policies, Validators, Skills, Adapters, or graph templates; the kernel guarantees isolation, scheduling, commits, recovery, permissions, and auditability.

That lets one kernel support software development, document production, scientific experiments, hardware design, and Agent collaboration without adding new domain-specific node semantics.

## Formal model

```text
State       = Slot Heads over immutable Artifact Revisions
Transition  = Rule
Trigger     = unhandled current input Revision vector
Acceptance  = validation + fenced atomic commit
History     = Attempt + Receipt + Event
Caching     = valid committed Receipt
Concurrency = Lease + writer arbitration
Continuity  = optional Executor Session
```

## Four cases that are easy to confuse

| Situation | HG-Rust’s decision |
|---|---|
| A requirement changes | The new requirement Revision changes the input vector; the old Receipt no longer proves the current result, so the Activation is derived again |
| An output file is deleted | The Head and Receipt remain valid; `materialize` restores the path without rerunning the Rule |
| An Agent crashes before commit | The Attempt records a failed or lost terminal state; without a Receipt there is no formal output, and a retry is safe |
| An external effect is uncertain | Use the Effect key and Readback to establish remote state before deciding whether to retry |

This is what “artifact-native, stateful, reactive, recoverable, and governed” means: the author language stays small while the kernel carries the correctness burden.
