<div class="language-switch"><a href="../../zh/cases/harness-lifecycle/">中文</a> · <strong>English</strong></div>

# Harness Lifecycle: make engineering governance handoff evidence inspectable

You have a product idea and want to run the governance path from clarification to handoff evidence. This case produces product questions, two response gates, a specification, plan, tasks, a role check, an Agent report, and a final Git evidence package. In the current demonstration, OpenCode writes a fixed report, does not edit the example project, and does not run project tests. The page therefore verifies workflow gates, evidence retention, and Git handoff, not a complete software implementation.

The complete case is in the [HG-Rust Harness Lifecycle directory](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/harness-lifecycle).

<div class="diagram">
  <img src="../../assets/case-harness.svg" alt="A product idea passes through clarification, risk approval, specification, plan, tasks, bounded execution, checks, and a Git project" />
</div>

## Step 1: start with the product idea, not code

Put the product brief and a small project into the workflow. The first Agent step asks two questions: what is the smallest behavior, and what evidence proves it?

```yaml
slots:
  project_fixture: { kind: dir, path: fixtures/project }
  product_brief: { kind: file, path: product-brief.md }
  questions: { kind: file, path: lifecycle/questions.md }

rules:
  - id: grill_product
    in: [project_fixture, product_brief]
    out: [questions]
    run:
      using: codex
      model: gpt-5.6-luna
      command: "Write the two product questions to out/questions"
```

HG’s role is straightforward here. The questions file becomes the input to the human answer, so later work cannot silently skip it.

## Step 2: require a clear approval for risky work

A person submits the product definition. The workflow writes a feasibility result. If the work is core risk, a second human approval is required.

```yaml
rules:
  - id: define_product
    in: [questions, human_responses]
    out: [product_definition]
    run: { using: human, command: "Provide the exact product definition JSON" }

  - id: approve_core
    in: [feasibility, human_responses]
    out: [core_approval]
    run: { using: human, command: "Approve or reject the core-risk demonstration" }
```

A case runner submits fixed product-definition and core-approval files through Human Rules. The workflow writes a feasibility result and requires a second gate for core risk. This checks the relationship between a decision and its input version; it does not evaluate a real person’s approval quality.

If the product question changes between the two decisions, the old answer cannot unlock the new workflow. HG binds each decision to the version of the question it answered.

## Step 3: write the specification, plan, and tasks

Only after approval does the workflow create the specification, plan, and tasks. The smallest behavior here is `increment(1) == 2`, and the task also states which files may be changed, which files are forbidden, and which command proves acceptance.

```yaml
rules:
  - id: write_spec
    in: [product_definition, core_approval]
    out: [spec]
    run: "write the accepted behavior to out/spec"

  - id: write_tasks
    in: [product_definition, feasibility, core_approval]
    out: [tasks]
    run: "write RED, GREEN, verification, and report tasks to out/tasks"
```

That immediately creates a permissions question. TDD-RED may write tests but not `src/`. The case submits a forbidden write on purpose, and HG must reject it.

## Step 4: give two Agents one bounded piece each

The Supervisor emits one concrete task. In this demonstration, the OpenCode worker crosses a real process boundary and writes a fixed report. It does not edit `src/lib.rs` or run `cargo test`.

```yaml
rules:
  - id: supervisor_iteration
    in: [spec, plan, tasks, role_check]
    out: [next_task]
    run:
      using: codex
      model: gpt-5.6-luna
      command: "Write one bounded implementation task with allowed files and acceptance"

  - id: opencode_worker
    in: [project_fixture, next_task, role_check]
    out: [worker_report]
    run: "run the worker inside the permitted project boundary"
```

HG records the case-defined role check, Agent process boundary, and report file. The role check is a Rule in this case; it is not a general permission system automatically supplied to every HG project.

## Step 5: check the evidence and hand over a Git evidence package

After evaluation and review, the workflow commits the demonstration inputs and evidence files as a Git result. This proves that evidence can be handed over and traced; it does not claim that the example project completed a real feature implementation.

```bash
scripts/test-real-world-cases.sh harness-lifecycle contract
scripts/test-real-world-cases.sh harness-lifecycle live
RUN_ROOT=/path/to/your/retained/run
hg materialize final_repo --project "$RUN_ROOT"
hg artifact history final_repo --project "$RUN_ROOT"
```

The Git result must have a commit and a clean worktree. Without those, HG does not pretend that a handoff-ready version exists.

## Why this workflow is complex

Product judgment, risk approval, role limits, two Agents, reports, and Git handoff all happen in one iteration. A normal script can collapse them into “the command finished.” HG gives every decision and evidence file a place, so you can see which decision allowed which work and what it produced.

## What we actually ran

Five successful live runs on 2026-08-09 completed product questioning, stale-answer rejection, core-risk approval, the case role check, a Luna Supervisor, the OpenCode report boundary, and the final Git commit. Elapsed times were 75.849, 62.541, 88.272, 55.498, and 58.801 seconds. Each baseline used 14 actual Attempts and produced one Git evidence package commit. They did not verify code quality or project test results.

This shows that the workflow can run and hand over evidence. It does not replace the approval process of your organization. Formal duration and cost budgets are not locked.

## Try changing next

Change the forbidden path in `fixtures/human-responses.json` and watch the fixed role check reject the request. This demonstration has no alternate allow branch; a new engineering behavior would need its own Rule and tests.
