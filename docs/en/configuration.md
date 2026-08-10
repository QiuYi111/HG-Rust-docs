# Configuration and executors

Start with the smallest useful Slots and Rules. Add policy only when a real constraint calls for it. This keeps dependencies visible and preserves the compact author model.

## Minimal configuration

```yaml
version: 1
project:
  name: hello-reconciliation
  default_targets: [greeting]
slots:
  request: { kind: file, path: request.txt }
  greeting: { kind: file, path: greeting.md }
rules:
  - id: greet
    in: [request]
    out: [greeting]
    run: "{ printf '# Hello\\n\\n'; cat in/request; } > out/greeting"
```

## Slot kinds

Use `file` for one file, `dir` for a directory tree, and `git` for a repository where commit identity and history matter. The `path` is a materialization destination, not the Rule's runtime working directory.

## Rule policy

`permissions` declares network and secret boundaries. `limits` controls timeout and maximum attempts. `session` selects agent session reuse. `when` evaluates eligibility on current inputs.

```yaml
permissions: { network: none, secrets: [] }
limits: { timeout: 900, max_attempts: 2 }
session: { policy: reuse, scope: project }
```

These fields constrain execution without changing Slot dependencies.

## Executor ABI

Every executor receives the same session directory. Inputs are mounted under `in/`. A Rule writes declared results under `out/`. The kernel validates those outputs before committing Revisions.

Shell is a good fit for deterministic tools. Agent executors such as Codex handle open-ended semantic work. Human execution is appropriate when a person must own the decision. Choose according to the task, then declare the required network, credentials, session, and effect boundaries.

See [CLI and operations](reference.md) for commands. The [tutorial path](tutorials/index.md) links to complete, current `harness.yaml` files.
