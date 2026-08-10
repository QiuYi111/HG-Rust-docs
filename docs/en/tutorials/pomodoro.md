# Pomodoro

By the end of this page, you will understand a complete self-improvement loop. A Coder changes the candidate, a Critic writes feedback, and the new feedback makes the Coder eligible again. Once the Critic accepts, a person approves that exact Revision and the graph produces the final `approved` Git artifact.

The live case requires `hg`, Git, `jq`, and a working Codex executor.

<div class="hg-diagram">
  <img src="../../../assets/diagrams/pomodoro.en.svg" alt="Pomodoro self-improvement loop">
</div>

## Complete graph definition

This is the exact configuration used by the case. It is part of the public documentation, so you can read and copy it here or [download the raw YAML](../../includes/pomodoro.yaml).

<div class="hg-yaml" markdown>

```yaml
--8<-- "includes/pomodoro.yaml"
```

</div>

## What each Slot does

| Slot | Kind | Role in the graph |
|---|---|---|
| `brief` | file | The requested change. A new brief invalidates a critique whose checksum no longer matches. |
| `candidate` | git | The Pomodoro repository under revision. The Coder reads its current Revision and writes the next commit back to it. |
| `critique` | file | Structured feedback containing the decision, checks, candidate commit, brief checksum, and round. |
| `approval` | file | A Human Rule decision bound to one exact input frontier. |
| `approved` | git | The final Git artifact copied only after critique and human approval both pass. |


Both `candidate` and `critique` participate in read and write relationships. Their Revisions alternate, which produces the loop.

## What each Rule does

| Rule | Reads | Writes | Eligibility and work |
|---|---|---|---|
| `coder` | brief, candidate, critique | candidate | Runs when critique says revise or its brief checksum is stale. It clones the candidate, makes the smallest change, verifies it, and creates one commit. |
| `critique` | brief, candidate, critique | critique | Runs when the candidate commit or brief checksum differs from the old critique. It writes revise or accept. |
| `request_approval` | brief, candidate, critique | approval | Runs only when the accepted critique still matches the current candidate and brief. |
| `package_approved` | brief, candidate, critique, approval | approved | Runs when critique remains valid and the human decision is approve. |


There is no Loop node. A revise critique changes the Coder's input frontier. A new candidate then changes the Critic's frontier. When the Critic writes accept, the Coder's `when` expression becomes false and the loop stops.

## Verify scheduler semantics first

Run the deterministic test from the companion case workspace root.

```bash
cargo test -p hg-cli --test m18_pomodoro_loop -- --nocapture
```

It produces the same causal order at two concurrency limits.

```text
coder → critique → coder → critique
```

This path does not call an agent. It checks that feedback triggers another round, acceptance stops the loop, and worker capacity does not change dependency semantics.

## Run the live case

After initializing the case and importing its inputs, run the default target. When the Human Rule becomes pending, retrieve the current Activation and decide it.

```bash
hg run approved --jobs 2 --project .
hg human pending --project . --output json
hg human decide --activation <CURRENT_KEY> --decision approve --project .
hg run approved --jobs 2 --project .
hg materialize approved --project .
```

The decision is bound to the input Revisions visible at that moment. If `candidate` changes after approval, the old decision cannot approve the new candidate.
