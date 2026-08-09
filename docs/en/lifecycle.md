<div class="language-switch"><a href="../../zh/lifecycle/">中文</a> · <strong>English</strong></div>

# Execution lifecycle

HG-Rust separates planning, execution, commit, reuse, and recovery into observable stages. State names appear in structured output and Events.

<div class="diagram">
  <img src="../../assets/lifecycle.svg" alt="The main lifecycle states for an Activation and Attempt" />
</div>

## From target to result

1. **Desired**: current inputs have no effective Receipt, so a new Activation is needed.
2. **Suppressed**: a Guard returned FALSE, so the Rule is intentionally quiet for these inputs.
3. **Blocked**: a required input is missing, so the kernel cannot proceed safely.
4. **Running**: an Attempt has started and the executor is producing candidate outputs.
5. **Committing**: outputs are being validated and committed; this is the short atomicity-sensitive window.
6. **Succeeded**: new Revisions and a Receipt have been committed.
7. **Cached**: the current input contract already has a reusable Receipt.

Failure, cancellation, and budget exhaustion are never presented as success. Inspect the reason, then use `resume`, `retry`, or a changed input to continue.

## Attempts and Receipts

An Attempt can be `RUNNING`, `COMMITTING`, `SUCCEEDED`, `FAILED`, `CANCELLED`, or `LOST`. A Receipt is its immutable terminal record; `SUCCEEDED` and `NO_CHANGE` Receipts can satisfy an Activation.

## Concurrency and leases

Several Workers may discover the same target at once, but only the Worker that owns the current lease and passes fencing may commit a Head. An old Worker cannot overwrite a newer result.

`--jobs N` sets maximum concurrency. The Runtime prevents same-batch writer
conflicts on exclusive output Slots and rebuilds the desired view after each
parallel batch. A batch of `NO_CHANGE` outputs therefore cannot skip a successor
that has just become runnable.

An Attempt releases its fenced lease immediately on exit. A persisted
`CANCELLED` terminal state in the parallel path is not overwritten by a later
generic `FAILED` result.

<div class="diagram">
  <img src="../../assets/lease.svg" alt="Two Workers compete for a lease and only the owner commits" />
</div>

## Three Guard states

`when` is a read-only predicate:

| Result | Meaning | Effect |
|---|---|---|
| TRUE | Condition holds | The Rule may enter an Activation |
| FALSE | Condition does not hold | The Rule is suppressed until inputs change |
| ERROR | The predicate could not be evaluated reliably | The run reports an error rather than treating it as FALSE |

Keeping ERROR separate from FALSE prevents a misspelled check from being mistaken for a valid business condition.

## Stable success and recovery

`hg run` advances the target’s input closure until it:

- reaches stable success;
- reports an explicit blocked or failed target;
- finds a missing source Slot;
- reaches an attempt, cost, or time budget; or
- is cancelled by the user.

Use `hg explain` to decide whether to add an input, repair materialization, invalidate a Receipt, or resume a run.
