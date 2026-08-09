# Quick start

This page explains the public workflow shape without distributing source code
or internal build instructions.

## 1. Define the desired result

Start with a small graph: one input Slot, one output Slot, and one Rule that
connects them. Keep the first result deterministic and easy to inspect.

```text
input Slot ──▶ Rule ──▶ output Slot
```

## 2. Use the command vocabulary

The public CLI vocabulary follows the reconciliation loop:

```bash
hg init
hg put input ./source
hg run output
hg status
```

The exact installation and compatibility instructions belong to the product
distribution you are evaluating and are intentionally not published in this
code-free repository.

## 3. Read the result as evidence

After a run, inspect:

- whether the desired Slot is satisfied;
- which inputs were considered current;
- whether a prior Receipt allowed safe reuse;
- whether the result was verified before becoming authoritative.

## 4. Make the next change deliberate

Change one input or Rule at a time. Then run the same target again and compare
the resulting state. The point of reconciliation is to make the delta
understandable, not merely to make a command finish.

!!! note "Public documentation boundary"

    This guide intentionally omits source checkout paths, private repository
    links, internal test fixtures, and deployment credentials.
