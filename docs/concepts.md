# Concepts

HarnessGraph Kernel treats engineering work as reconciliation over desired
artifacts. The public model is intentionally small: name the result, describe
how it is produced, and let the runtime keep the evidence of what happened.

## Slot

A Slot is a named desired artifact. It is the stable vocabulary a person uses
to describe a result such as a report, dataset, build output, or review.

Slots are about meaning, not a specific path on disk. That separation makes it
possible to reason about freshness, change, and recovery without equating
"file exists" with "result is correct".

## Rule

A Rule declares how one or more input Slots produce one or more output Slots.
Rules make dependencies explicit and give the runtime a graph it can reconcile.

The public authoring model is therefore:

```text
desired artifact → inputs → rule → candidate result → verified revision
```

## Revision

A Revision is an immutable artifact state. A Slot points to the state currently
considered authoritative, while older states remain useful for comparison,
explanation, and recovery.

## Receipt

A Receipt is evidence that a Rule execution completed with a particular set of
inputs and produced a verified result. A valid Receipt can make repeated work
unnecessary; mere presence of an output file cannot.

## Session

A Session gives a long-running or interactive execution a durable identity. It
can carry checkpoints and provide a place to explain how work was continued,
paused, or recovered.

## Event

Events describe meaningful state changes in the reconciliation loop. They make
the system observable without requiring readers to infer history from transient
terminal output.

## The public safety posture

The public model favors:

- explicit desired outputs over implicit side effects;
- immutable states over mutable “latest” files;
- evidence-backed reuse over existence-based caching;
- explainable transitions over hidden orchestration;
- human-readable concepts before implementation detail.

These concepts are the safe public boundary. This site does not publish the
implementation or private engineering records behind them.
