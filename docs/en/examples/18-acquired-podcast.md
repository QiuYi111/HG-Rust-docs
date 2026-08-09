<div class="language-switch"><a href="../../../zh/examples/18-acquired-podcast/">中文</a> · <strong>English</strong></div>

# 18 · Acquired Podcast: constrained research to a two-voice package

This real workflow turns a Human-approved company topic into an auditable three-act podcast package. Six research dimensions run under `--jobs 3`; a research gate requests one targeted competition supplement; a Luna production meeting binds accepted sources; three acts then pass through bounded QA/revision and produce separate host and guest Audio Director manifests.

The complete graph and pinned inputs are in the [Acquired Podcast case directory](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/acquired-podcast).

## Graph and security boundary

```text
Human topic
   ↓
6 × allowlisted research ──(jobs=3)──→ research gate → targeted supplement
                                                   ↓
Luna production meeting → act 1 / act 2 / act 3 → QA/revision → host + guest manifests
```

Network access is not ambient capability. The live profile permits only exact hosts pinned by the case, through a local filtering proxy. Direct egress, undeclared hosts, redirect bypasses, and private-address resolution fail closed. Source URLs must be present in research Artifacts, while credentials are never materialized.

## Run and inspect

```bash
scripts/test-real-world-cases.sh acquired-podcast contract
scripts/test-real-world-cases.sh acquired-podcast live
```

The runner proves that:

- the graph resumes from an exact Human topic response;
- six research Attempts reach an observed overlap of exactly three;
- an unchanged rerun remains at 19 → 19 Attempts;
- targeted supplemental research raises the total to 22;
- immediate cancel/resume preserves all six completed research Heads;
- the three-act script and two audio manifests satisfy their schemas.

`--jobs 3` is the initial run's concurrency ceiling. The current `hg resume`
creates a child run at concurrency one. The recovery assertion proves reuse of
completed Heads, not continued three-way concurrency during resume.

## Kernel pressure

The recovery exercise found two core defects. Parallel error handling could overwrite persisted `CANCELLED` with `FAILED`, and terminal Attempts retained their leases until expiry. HG now preserves cancellation as the terminal state and releases fenced leases on Attempt exit.

Executor supervision also drains stdout and stderr concurrently into bounded tails. Timeout or cancellation terminates the Unix process group, preventing real research or Agent processes from blocking on pipes or leaving descendants behind.

## Current observed data

Five successful live samples took 60.484, 45.056, 54.680, 51.280, and 69.804 seconds; the observed p95 is 69.804 seconds. Every sample verified cancel/resume reuse. Formal budgets remain unlocked, and provider-reported zero cost is not a claim of zero real cost.

## Boundary

The case proves traceability between research sources, Human decisions, scripts, and audio instructions. It is not fact-checking or publication clearance; editorial review, copyright judgment, and produced-audio acceptance remain necessary.

[Back to the case library](index.md) · [Constrained-agent foundation](12-secure-agent-task.md)
