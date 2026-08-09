<div class="language-switch"><a href="../../zh/release/">中文</a> · <strong>English</strong></div>

# Release notes

This site documents HarnessGraph Kernel 0.1 for users. The configuration format is version `1`. The guide focuses on stable concepts, configuration fields, and CLI commands for building verifiable artifact flows.

## Included in this edition

- Slot + Rule author model.
- File, Directory, Git, Stream, and Opaque Artifact kinds.
- Revision, Head, Activation, Attempt, Receipt, Session, and Event.
- Shell, Agent, Human, interactive-service, and Subgraph executor entry points.
- Three-state Guards, execution budgets, network/secret declarations, and Effect idempotency/readback.
- Cyclic feedback fixed points and dynamic subgraphs generated from a `GraphSpec` Revision.
- Human, JSON, JSONL, event-following, drift repair, recovery, invalidation, and retry commands.
- 20 cases, including four real workflows with contract/live twins and common reports.

## Kernel and case increment

- bounded `hg run --jobs N` concurrency with same-batch writer-conflict protection for exclusive output Slots;
- dual-pipe bounded capture and Unix process-group cancellation/timeout;
- failed/orphan Attempt recovery, preserved cancellation state, and immediate lease release;
- automatic Codex Executor checkpoint/resume, covered by executor/runtime regressions;
- exact Human file Revisions with stale-Activation fencing;
- materializable and cacheable Git Revision output;
- exact-host allowlists for explicit network policy, enforced by macOS `sandbox-exec`; other platforms reject execution when enforcement is unavailable;
- `hg.real-world-report/v1` real-world case reports.

These capabilities are exercised together by [Learning Helper](cases/learning-helper.md),
[Acquired Podcast](cases/acquired-podcast.md),
[Harness Lifecycle](cases/harness-lifecycle.md), and
[CAD Release](cases/cad-release.md). Formal performance/cost calibration
and CI scheduling are not claimed as complete in this release.

## Compatibility conventions

| Area | Convention |
|---|---|
| Configuration | `harness.yaml`, `version: 1` |
| Output | `human`, `json`, `jsonl` |
| Target systems | macOS, Linux |
| Command | `hg` |

## Reading conventions

Configuration fields and command names use code formatting. Uppercase state names are the stable values used in structured output. Model identifiers, secret handles, and remote resources in examples are placeholders; replace them with your runtime configuration.

## Version evolution

Incompatible changes to the configuration format or CLI output protocol will receive a new version and a migration note. Before a run, you can check:

```bash
hg migrate --check
hg check --strict
```

Start with the [Product overview](index.md), or go directly to the [Quick Start](quick-start.md).
