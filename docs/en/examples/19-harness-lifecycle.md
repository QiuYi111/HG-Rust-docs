<div class="language-switch"><a href="../../../zh/examples/19-harness-lifecycle/">中文</a> · <strong>English</strong></div>

# 19 · Harness Lifecycle: engineering governance as a graph

This case executes a complete spec-governed engineering lifecycle as an HG graph. It grills a product definition and fences an obsolete Human answer; requires a second Human decision for `core` risk; produces spec, plan, and tasks; rejects a TDD-RED role violation; lets a Luna Supervisor issue exactly one bounded task to a real OpenCode worker; then evaluates, reviews, and commits the result as a durable Git Revision.

The full assets are in the [Harness Lifecycle directory](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/harness-lifecycle).

## Lifecycle graph

```text
product brief → Luna grill → Human clarification ─┐
                                                  ├→ risk classify → Human core approval
stale-response fencing ───────────────────────────┘
   ↓
spec → plan → tasks → role-boundary check → Luna Supervisor → OpenCode worker
   ↓
eval → review → durable Git Revision + lifecycle manifest
```

Both Human gates bind to a specific Activation. Once inputs change, an old response cannot unlock the new work even if its bytes are otherwise valid. The role check separately proves that TDD-RED cannot write implementation files.

## Run it

```bash
scripts/test-real-world-cases.sh harness-lifecycle contract
scripts/test-real-world-cases.sh harness-lifecycle live
```

The live profile consumes existing Codex and OpenCode credential handles without copying credentials into Slots, Receipts, or the final Git repository. A successful report includes:

- `stale_answer_rejected: true`;
- `core_suppressed: true` until the second Human decision;
- `role_violation_rejected: true`;
- `opencode_worker: true`;
- one final Git commit;
- a `harness-lifecycle/v1` manifest.

## Kernel significance

The case directly verifies Codex checkpoint creation, exact Human file
Revisions, stale fencing, and Git Artifact output. The Codex resume contract is
proved by separate kernel regressions, not by this case alone. Git output
accepts only a clean worktree with a valid HEAD. HG mirrors the commit before
committing its locator, making the result materializable and cacheable without
relying on the original temporary directory.

The Supervisor/worker boundary stays intentionally narrow: one iteration, explicit allowed and forbidden files, concrete acceptance criteria, and a report path. HG records coordination evidence but does not treat an Agent's prose claim as verified completion.

## Current observed data

Five successful live samples took 75.849, 62.541, 88.272, 55.498, and 58.801 seconds; the observed p95 is 88.272 seconds. Each baseline used 14 Attempts, the unchanged rerun remained at 14, and one final Git commit was produced. Formal duration, token, and cost calibration is deferred.

## Boundary

The case proves that governance rules can execute, reject, and retain evidence. It does not replace organizational authority: `core`/`infra` decisions, release rights, and final merge ownership remain Human responsibilities.

[Back to the case library](index.md) · [Feedback-loop foundation](13-feedback-loop.md)
