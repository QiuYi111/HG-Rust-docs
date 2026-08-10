# Grill

Grill places a multi-turn human-agent conversation inside an ordinary Shell Rule. HG waits for the terminal session to end, validates both declared outputs, and commits the product contract and roadmap atomically.

The live session currently requires macOS, iTerm2, and an authenticated `codex` CLI. Mock mode only requires Python.

<div class="hg-diagram">
  <img src="../../../assets/diagrams/grill.en.svg" alt="Grill multi-turn interaction graph">
</div>

## Complete graph definition

This is the entire configuration and the smallest of the six first-class cases. You can also [download the raw YAML](../../includes/grill.yaml).

<div class="hg-yaml" markdown>

```yaml
--8<-- "includes/grill.yaml"
```

</div>

## What each Slot does

| Slot | Kind | Role in the graph |
|---|---|---|
| `goal` | file | The product goal to challenge and clarify. |
| `grill_driver` | file | The Python launcher that opens the terminal, maintains the conversation, and implements the exit protocol. |
| `product_contract` | file | The structured product contract produced by the session. |
| `roadmap` | file | The execution roadmap produced by the same session and used as the default target. |


## What each Rule does

| Rule | Reads | Writes | Work |
|---|---|---|---|
| `product_grill` | goal, grill_driver | product_contract, roadmap | Runs the session driver with a one-hour timeout and one allowed Attempt. Both outputs must validate before either is committed. |


The conversation remains inside the executor. The graph records the inputs and the artifacts a successful session must produce. If the session exits early or writes only one file, the Attempt cannot commit half a result.

## Run mock mode

```bash
cd examples/03-interactive-grill
hg init --project .
hg put goal goal.md --project .
hg put grill_driver scripts/grill_session.py --project .
HG_GRILL_MODE=mock hg run roadmap --project .
hg materialize product_contract --project .
hg materialize roadmap --project .
```

Both `artifacts/product.json` and `artifacts/roadmap.json` should exist.

## Run the live session

Remove `HG_GRILL_MODE=mock` and run the target again.

```bash
hg run roadmap --project .
```

A new iTerm2 window opens. Continue the conversation until the agent has written both outputs. Enter `/exit`; only then does the parent Attempt validate and commit them.
