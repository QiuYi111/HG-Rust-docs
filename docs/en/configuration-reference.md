<div class="language-switch"><a href="../../zh/configuration-reference/">中文</a> · <strong>English</strong></div>

# Configuration reference

This page lists `harness.yaml` fields, accepted values, and a complete compact example. Field names match the configuration file.

## Top-level fields

| Field | Required | Description |
|---|---:|---|
| `version` | Yes | Configuration format, currently `1` |
| `project` | No | Project name and default targets |
| `slots` | No | Slot definition map |
| `rules` | No | Rule definition list |

## Slot fields

| Field | Required | Accepted values |
|---|---:|---|
| `kind` | Yes | `file`, `dir`, `git`, `stream`, `opaque` |
| `path` | No | Materialization path |
| `writer_policy` | No | `exclusive` (default) or `multiple` |

## Rule fields

| Field | Required | Description |
|---|---:|---|
| `id` | Yes | Stable Rule identifier |
| `in` | No | Input Slot list |
| `out` | No | Output Slot list |
| `run` | Yes | Command string or executor mapping |
| `when` | No | Guard string or mapping |
| `session` | No | Session reuse policy |
| `limits` | No | Timeout and maximum attempts |
| `permissions` | No | Network and secret handles |
| `effect` | No | Idempotency and readback policy |

## Policy fields

```yaml
rules:
  - id: controlled_step
    in: [input]
    out: [output]
    when: "test -s in/input"
    session:
      policy: once
      scope: attempt
    limits:
      timeout: 120
      max_attempts: 2
    permissions:
      network: none
      secrets: [REPORT_TOKEN]
    run:
      using: shell
      command: "cp in/input out/output"
    effect:
      idempotency: "report-release-v1"
      readback: "check remote state"
      delivery: "at-most-once"
```

### `limits`

- `timeout`: seconds allowed for one Rule execution.
- `max_attempts`: maximum attempts allowed for the Rule.

### `permissions`

- `network: none`: declares no network access; a list can declare allowed targets.
- `secrets`: names of secret handles. Values come from the execution environment and must not be written to YAML.

### `effect`

- `idempotency`: stable key for the external action.
- `readback`: description or command used to confirm remote state.
- `delivery`: delivery semantics such as `at-most-once`.

## A complete example

```yaml
version: 1
project:
  name: controlled-report
  default_targets: [report]

slots:
  request: { kind: file, path: request.txt }
  report: { kind: file, path: report.md }
  approval: { kind: file, path: approval.json }

rules:
  - id: write_report
    in: [request]
    out: [report]
    limits: { timeout: 60, max_attempts: 2 }
    permissions: { network: none, secrets: [] }
    run: "cp in/request out/report"

  - id: approve_report
    in: [report]
    out: [approval]
    run: { using: human, command: "Approve this report" }
```

Then run:

```bash
hg check --strict
hg plan report
```
