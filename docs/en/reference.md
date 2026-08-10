# CLI and operations

This page keeps the commands needed for daily work. Treat local `hg <COMMAND> --help` output as the final parameter reference.

## Define and inspect

```bash
hg init --project .
hg check --strict --project .
hg graph --project .
hg plan <TARGET> --project .
```

## Import, run, and materialize

```bash
hg put <SLOT> <PATH> --project .
hg run <TARGET> --jobs 4 --project .
hg materialize <SLOT> --project .
hg status --project .
```

`put` creates an input Revision. `run` reconciles a target. `materialize` projects a Revision into the workspace. `status` reports current facts.

## Human decisions

```bash
hg human pending --project . --output json
hg human decide --activation <KEY> --decision approve --project .
```

Find the current Activation key before submitting a decision. Do not keep and reuse an old key because a new input frontier creates a new Activation.

## Diagnostic order

When a run stops, use `check` to rule out a definition error, then use `plan` to inspect missing upstream work. Continue with `status`, pending Human Activations, and failed Attempts. If a loop does not continue, check whether the feedback Slot committed a new Revision and whether its `when` clause remains eligible.

Preserve the project's `.hg` state directory during recovery. Receipts, Attempts, and Revisions are diagnostic evidence. Removing them also removes recovery context.
