# CLI orientation

The command line is a projection of reconciliation facts. Commands are grouped
by intent so a reader can move from declaring work to inspecting evidence.

## Command families

| Intent | Public vocabulary |
|---|---|
| Start a project | `init`, `check` |
| Declare or inspect artifacts | `put`, `artifact`, `status` |
| Plan and reconcile | `plan`, `run`, `resume`, `cancel` |
| Understand a result | `explain`, `events`, `log` |
| Verify local state | `doctor`, `repair`, `drift` |

## Human and machine output

Use human-readable output while exploring. Use structured output when another
tool needs to consume the result:

```bash
hg status --output human
hg status --output json
hg events --output jsonl
```

The principle is stable facts first: a structured response should identify the
operation, result state, and any relevant explanation without requiring a human
to parse terminal decoration.

## A useful inspection sequence

```text
status → explain → events → artifact history
```

This sequence moves from “what is true now?” to “why is it true?” and then to
“what changed over time?”.

!!! warning "Operational care"

    Commands that repair, invalidate, cancel, or garbage-collect state should
    be treated as deliberate operations. Confirm the target and preserve the
    evidence needed to explain the change.
