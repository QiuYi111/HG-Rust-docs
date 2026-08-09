<div class="language-switch"><a href="../../zh/quick-start/">中文</a> · <strong>English</strong></div>

# Quick Start

This tutorial imports one input file, produces a greeting file, and then shows how a repeated run can reuse its evidence.

## Prepare `hg`

This guide assumes that `hg` is installed and available in your terminal. Confirm the version first:

```bash
hg --version
```

If the command is unavailable, install the HG-Rust CLI distribution for your operating system before continuing.

## 1. Create a project

```bash
mkdir hg-quickstart
cd hg-quickstart
hg init --project .
```

Replace the project’s `harness.yaml` with:

```yaml
version: 1
project:
  name: quickstart
  default_targets: [greeting]

slots:
  request: { kind: file, path: request.txt }
  greeting: { kind: file, path: greeting.md }

rules:
  - id: create_greeting
    in: [request]
    out: [greeting]
    run: "printf '# Hello\\n\\nWelcome to HarnessGraph.\\n' > out/greeting"
```

The configuration declares two Slots and one Rule: `request` is the input, `greeting` is the desired result, and the Rule transforms the input into that result.

## 2. Import the input and check the graph

```bash
printf 'A first reconciliation project.\n' > request.txt
hg put request request.txt --project .
hg check --project . --strict
```

`hg put` records the input as a Revision. `hg check` parses and validates the graph without executing a Rule.

## 3. Plan and run

```bash
hg plan greeting --project .
hg run greeting --project .
hg materialize greeting --project .
```

After the run, `greeting.md` is the materialized file for the output Slot. The kernel also stores its Revision and Receipt.

## 4. Inspect status and explanation

```bash
hg status --project .
hg explain greeting --project .
hg artifact history greeting --project .
```

Use `status` to ask “is it stable now?”, `explain` to ask “why did it run or not run?”, and `artifact history` to inspect the Slot’s versions.

## 5. Observe reuse

Run the same target again:

```bash
hg run greeting --project .
```

When the input Revision and Rule contract are unchanged, the existing Receipt proves that the result can be reused.

## Next steps

- Read [Core philosophy](principles.md) to understand the design.
- Read the [Configuration reference](configuration-reference.md) to write a complete graph.
- Choose a complete workflow from the [four hands-on tutorials](cases/index.md) for approval, Agents, recovery, or concurrency.

!!! note "Inputs and materialization"

    A workspace file can be deleted or edited by hand. Use `hg drift` to inspect the difference, then `hg materialize` to restore the current Head.
