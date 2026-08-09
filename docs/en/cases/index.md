<div class="language-switch"><a href="../../zh/cases/">中文</a> · <strong>English</strong></div>

# Four hands-on case studies

If HG is new to you, start here.

These four cases come from workflows that have actually been run. They produce a learning handbook, a podcast production package, an engineering governance record, and a CAD release package. The domains are different, but the working pattern is the same.

People state what they want to deliver. HG takes in the source material and follows the dependencies. Every step leaves a result that can be inspected. When material changes, only the affected work is repeated. If a step fails, is cancelled, or needs a human decision, the workflow can continue from the work that is already complete.

## The shared picture

<div class="diagram">
  <img src="../../assets/real-world-suite.svg" alt="Four hands-on cases share a path from goal and inputs through configuration, execution, recovery, and delivery" />
</div>

Each case answers a practical question.

| Tutorial | What you finish with | Start here if you want to learn |
|---|---|---|
| [Learning Helper](learning-helper.md) | A Word handbook with an equation and checked layout | How an input change affects only the work that depends on it |
| [Acquired Podcast](acquired-podcast.md) | A sourced three-act package ready for production | Parallel research, network limits, cancellation, and resume |
| [Harness Lifecycle](harness-lifecycle.md) | An engineering governance record with spec, plan, tasks, reports, and Git evidence | Human gates, role boundaries, and Agent collaboration |
| [CAD Release](cad-release.md) | PCB, model, drawing, simulation, renders, and release evidence | Multiple tools, limited checks, and human release ownership |

## How the tutorials teach

Each page starts with a real work goal. You first describe the result you want. Then the tutorial lets the practical problems appear: inputs change, a person must decide, an external tool fails, or several pieces of work can run at once. HG is introduced at the point where it solves that problem, followed by a command you can run and inspect.

## Recommended order

1. Read [Learning Helper](learning-helper.md) for the basic input → work → check → delivery loop.
2. Read [Acquired Podcast](acquired-podcast.md) for parallel research and constrained network access.
3. Read [Harness Lifecycle](harness-lifecycle.md) for human decisions, permissions, and Agent work.
4. Read [CAD Release](cad-release.md) for multi-tool release work and final acceptance.

Each tutorial includes configuration excerpts, the complete case directory, commands, a change-and-rerun exercise, and evidence from actual runs. To reproduce one, clone the [HG-Rust repository](https://github.com/QiuYi111/HG-Rust) into a directory you choose and run the commands from its repository root; the case runner prepares its own run directory.

Run the `scripts/test-real-world-cases.sh` commands from the HG-Rust repository root.

## Prepare your environment

Make sure Rust/Cargo, `jq`, `sqlite3`, Python 3, and Git are available. Start with each case’s contract (a repeatable local verification mode). Use live (the real-tool mode) only when the tutorial’s external tools are available. The runner submits fixed demonstration responses for gate and recovery checks; this is not a real person’s approval.

The tutorials use “read a configuration excerpt, then run the verifier.” The excerpt explains the dependency graph; the complete runnable configuration and inputs are in the case directory, so you do not have to assemble the system from an empty folder.

After the four tutorials, use [Feature reference and small examples](../examples/reference.md). It combines the earlier small examples by topic and is meant for lookup, not as a first-time reading path.
