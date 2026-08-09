<div class="language-switch"><a href="../../zh/configuration/">中文</a> · <strong>English</strong></div>

# Configuration overview

The project configuration file is `harness.yaml`, and its current format version is `1`. The file has three layers: project metadata, Slots, and Rules.

## Minimal structure

```yaml
version: 1
project:
  name: report-project
  default_targets: [report]

slots:
  request: { kind: file, path: request.txt }
  report: { kind: file, path: report.md }

rules:
  - id: make_report
    in: [request]
    out: [report]
    run: "cp in/request out/report"
```

### `version`

The configuration format version. Use `1`.

### `project`

`name` is the project name. `default_targets` lists the Slots used when the command line does not provide targets.

### `slots`

Every Slot needs an explicit `kind`:

```yaml
slots:
  document: { kind: file, path: docs/document.md }
  assets: { kind: dir, path: build/assets }
  source_tree: { kind: git, path: . }
  feed: { kind: stream }
  binary: { kind: opaque, path: build/app.bin }
```

Supported kinds are `file`, `dir`, `git`, `stream`, and `opaque`. The system does not infer a kind from a file extension.

### `rules`

Each Rule needs an `id`, `in`, `out`, and `run`. `run` can be a shell command string or an executor mapping.

## Inputs, outputs, and execution directories

An executor receives an isolated workspace:

```text
workspace/
├── in/       # current input Slots
├── out/      # candidate outputs
└── execution.json
```

A Shell Rule normally reads `in/<slot>` and writes `out/<slot>`. Only validated and committed candidates become new Revisions.

## Check the configuration first

```bash
hg check --project . --strict
hg fmt --project . --check
```

The checks catch unknown executors, duplicate IDs, missing `kind` fields, invalid policy values, and malformed YAML structure.

## Configuration guidance

- Use stable, readable business names for Slots; do not make a temporary filename the model name.
- Keep one Rule focused on one verifiable transformation.
- Start deterministic checks with `shell`, then choose another executor when reasoning or a human decision is required.
- Put external actions in their own Rule and configure idempotency plus readback.
- Set `limits` for long-running work and `permissions` for sensitive work.

Next read [Executors and policies](executors.md) or the [Configuration reference](configuration-reference.md).
