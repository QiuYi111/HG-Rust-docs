<div class="language-switch"><a href="../../zh/cli/">中文</a> · <strong>English</strong></div>

# CLI

`hg` is the command-line entry point for HarnessGraph Kernel. Commands express intent and project facts; the configuration and recorded results determine what happens next.

## Global options

```text
--project <PATH>       project root
--output <human|json|jsonl>
--quiet                suppress human-readable output
--non-interactive      disable interactive prompts
```

The project can be omitted when the CLI can find `harness.yaml` in the current directory or an ancestor.

## Command families

| Intent | Commands |
|---|---|
| Initialize and check | `init`, `check`, `lint`, `fmt` |
| Import and inspect state | `put`, `status`, `inspect` |
| Plan and run | `plan`, `run`, `resume`, `cancel`, `runs` |
| Results and history | `explain`, `artifact show`, `artifact history`, `artifact diff` |
| Materialize and repair | `materialize`, `drift`, `repair`, `doctor`, `gc` |
| Events and logs | `events`, `log`, `logs` |
| Invalidate and retry | `invalidate`, `retry` |
| Human and external effects | `human pending`, `human show`, `human decide`, `effect verify` |
| Sessions | `session list`, `session show`, `session checkpoint`, `session close` |
| Daemon | `daemon start`, `daemon status`, `daemon stop`, `daemon ping` |
| Auxiliary output | `graph`, `completion`, `man` |

## The common workflow

```bash
hg init --project .
hg check --strict
hg put request request.txt
hg plan report
hg run report
hg status
hg explain report
```

## Structured output

```bash
hg status --output json
hg events --output jsonl
hg log --output json
```

- `human` is for terminal reading.
- `json` is for one-shot scripts.
- `jsonl` is for event streams and line-oriented consumers.

## Run control

```bash
hg run report --watch
hg run report --detach
hg resume <RUN_ID>
hg cancel <RUN_ID>
hg run report --budget-attempts 3 --budget-duration 120
```

Use `hg events --follow` for a live event projection. Cancellation affects the current run and does not delete already committed Revisions.

## Human decisions

```bash
hg human pending --output json
hg human show <ACTIVATION_KEY>
hg human decide --activation <ACTIVATION_KEY> --decision approve
```

When operating a real project, include a comment that will help a later reader understand the decision.
