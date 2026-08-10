# Quick Start

This run uses one Shell Rule and requires no agent account. You will create an output Revision, then observe Receipt reuse on the second run.

## Prepare

You need Node.js 18 or newer, npm, Git, and a Unix-like shell. Install the prebuilt `hg` first:

```bash
npm install --global harnessgraph
hg --version
```

Then get the examples:

```bash
git clone https://github.com/QiuYi111/HG-Rust.git
cd HG-Rust
```

Run `hg --help`. The command list should include `init`, `put`, `run`, `status`, and `materialize`.
See the [installation guide](installation.md) if the terminal cannot find `hg`.

## Open the first graph

The repository includes a minimal recipe. Enter its directory and initialize runtime state.

```bash
cd examples/recipes/minimal-reconciliation
hg init --project .
```

Its `harness.yaml` contains two Slots and one Rule.

```yaml
slots:
  request: { kind: file, path: request.txt }
  greeting: { kind: file, path: greeting.md }
rules:
  - id: greet
    in: [request]
    out: [greeting]
    run: "{ printf '# Hello\\n\\n'; cat in/request; } > out/greeting"
```

## Import the input

`put` commits the workspace file as a new Revision of `request`.

```bash
hg put request request.txt --project .
hg status --project .
```

The status output should show a Revision for `request` while `greeting` still needs to be produced.

## Reconcile the target

```bash
hg run greeting --project .
hg materialize greeting --project .
cat greeting.md
```

`run` creates an Activation for the current input frontier, executes `greet`, and commits a `greeting` Revision. `materialize` projects it to the declared workspace path. The file should begin with `# Hello`.

## Observe reuse

Run the same target again without changing the input.

```bash
hg run greeting --project .
```

The Shell command does not need to run again. The current frontier already has a successful Receipt and the target is current.

## Make downstream state stale

Change `request.txt`, import it, and run again.

```bash
printf 'Welcome to HarnessGraph.\n' > request.txt
hg put request request.txt --project .
hg run greeting --project .
hg materialize greeting --project .
```

The new `request` Revision forms a new Activation, so `greet` executes again. You have completed the smallest reconciliation cycle.

Continue with the [Pomodoro tutorial](tutorials/pomodoro.md), which adds agent critique feedback and revision-bound human approval to the same semantics.
