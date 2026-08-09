<div class="language-switch"><a href="../../zh/operations/">中文</a> · <strong>English</strong></div>

# Operations, recovery, and audit

This page organizes everyday work as “observe → understand → change → verify.”

## Observe before changing

```bash
hg status --output json
hg explain report --output json
hg events --limit 50 --output json
hg artifact history report --output json
```

These commands are read-only and are a good first step for an automated diagnosis or human investigation.

## Workspace drift

When a materialized file is deleted or edited:

```bash
hg drift report
hg materialize report
```

`drift` describes the difference between the workspace and the current Head. `materialize` restores the Head; it does not invent a new business Revision.

## Failure and retry

```bash
hg log --output json
hg retry report
hg resume <RUN_ID>
```

If an upstream result already has an effective Receipt, a downstream retry can reuse it. To force a new evaluation, invalidate the relevant Receipt first:

```bash
hg invalidate report --reason "input policy changed"
hg run report
```

Invalidation is an append-only event; it does not delete historical Revisions.

## Sessions and long-running work

```bash
hg session list
hg session show <SESSION_ID>
hg session checkpoint <SESSION_ID>
hg session close <SESSION_ID>
```

Checkpoint and continuity support depend on the executor. Keeping Sessions, Attempts, and Events connected reduces guesswork when a long task must continue.

The Codex Executor persists the real `thread.started` checkpoint and uses the
current `codex exec resume` contract for continuation. A missing or invalid
thread fails closed instead of silently creating a new session that only looks
like a continuation.

An active executor records checkpoints automatically. The current
`session checkpoint` CLI returns `TEMPORARILY_UNAVAILABLE` when no live resident
session is accessible.

## Bounded concurrency and process termination

```bash
hg run report --jobs 3 --output json
```

`--jobs` is a maximum concurrency capacity. The Runtime prevents Activations
with conflicting writers to exclusive output Slots from sharing a batch; the
default remains serial. Shell and Agent stdout/stderr are
drained concurrently into bounded, redacted tails. Cancellation or timeout
terminates the Unix process group so descendants do not outlive their parent.

A terminal Attempt releases its fenced lease immediately. Recovery repairs only
orphan Attempts owned by terminal GraphRuns and does not steal active worker
ownership.
The current `hg resume` creates its child GraphRun with `max_concurrency: 1` and
does not automatically inherit the original `--jobs N`.

## Human approval and external effects

<div class="diagram">
  <img src="../../assets/human-effect.svg" alt="The relationship between a proposal, human decision, external effect, and readback proof" />
</div>

Recommended sequence:

1. Produce a proposal Artifact.
2. Record the decision with a Human Rule.
3. Execute the Effect only after approval.
4. Verify remote state with idempotency and readback.

```bash
hg effect verify <EFFECT_KEY>
```

Long Human responses can be committed as exact file Revisions with
`human decide --from <FILE>`. A decision is bound to an Activation; once inputs
change, the old response cannot unlock the new work.

## Git results and constrained network

A Git output must be a clean worktree with a valid HEAD. HG preserves a mirror
of the commit before committing its locator, so the result remains materializable
and cacheable instead of pointing only to an ephemeral directory.

Explicit network policy is currently enforced fail-closed with macOS
`sandbox-exec`. Allow mode exposes only an exact-host
filtering proxy; direct egress, redirects to undeclared hosts, and private-address
resolution are denied. If enforcement is unavailable, the executor fails before
starting the child process.

## Maintenance commands

```bash
hg doctor
hg repair
hg gc --dry-run
hg migrate --check
```

`gc`, `repair`, and `migrate` can change local state. Start with `--dry-run` or `--check`, confirm the target, and only then perform the write operation.

## Events and explanations are results

When a run must be handed to another person or tool, preserve `status --output json`, relevant Events, and Receipt identifiers instead of only a terminal transcript.
