# Harness Lifecycle

This graph puts one specification-governed software-engineering iteration inside HG. Product definition, risk assessment, approval, spec, plan, tasks, worker evidence, evaluation, and review all become revisioned artifacts.

The live path uses existing Codex and OpenCode credential handles. Credentials do not enter Slots, Receipts, or the final Git artifact.

<div class="hg-diagram">
  <img src="../../../assets/diagrams/harness.en.svg" alt="Harness lifecycle graph">
</div>

## Complete graph definition

The configuration shows two Human Rules, a deliberate role-boundary rejection, one Supervisor and worker iteration, and the final Git commit. You can also [download the raw YAML](../../includes/harness-lifecycle.yaml).

<div class="hg-yaml" markdown>

```yaml
--8<-- "includes/harness-lifecycle.yaml"
```

</div>

## What each Slot does

| Slot | Stage | Role in the graph |
|---|---|---|
| `project_fixture` | input | The fixed project directory the worker eventually modifies. |
| `human_responses` | input | Human decisions and the role-violation fixture used by the case. |
| `product_brief` | input | Initial product request. |
| `questions` | product | Clarifying questions produced by the Grill step. |
| `product_definition` | product | Exact MVP definition confirmed by a person. |
| `feasibility` | risk | Feasibility, risk level, and reason. |
| `core_approval` | risk | Independent human decision for the core-risk change. |
| `spec` | specification | Approved behavior specification. |
| `plan` | specification | RED, GREEN, evaluation, report, and review plan. |
| `tasks` | specification | Bounded worker task list. |
| `role_check` | governance | Structured evidence that rejects the role violation. |
| `next_task` | scheduling | One bounded task produced by the Supervisor. |
| `worker_report` | implementation | Changed files, commands, tests, and acceptance evidence. |
| `evaluation` | acceptance | Evaluation of behavior and worker evidence. |
| `report` | acceptance | Implementation report for this iteration. |
| `review` | acceptance | Final acceptance review. |
| `final_repo` | output | Git artifact containing code and lifecycle evidence. |


## What each Rule does

| Rule | Reads | Writes | Work |
|---|---|---|---|
| `grill_product` | project_fixture, product_brief | questions | Produces two minimal product questions. |
| `define_product` | questions, human_responses | product_definition | Human Rule that submits the exact product definition. |
| `assess_feasibility` | project_fixture, product_definition | feasibility | Records the core-risk assessment. |
| `approve_core` | feasibility, human_responses | core_approval | Second Human Rule for the core-risk decision. |
| `write_spec` | product_definition, core_approval | spec | Writes behavior after approval. |
| `write_plan` | feasibility, core_approval | plan | Writes the implementation plan after approval. |
| `write_tasks` | product_definition, feasibility, core_approval | tasks | Writes the task list after approval. |
| `enforce_role_boundary` | human_responses, core_approval | role_check | Detects a TDD-RED write to implementation and records reject. |
| `supervisor_iteration` | spec, plan, tasks, role_check | next_task | Creates one constrained GREEN task after the rejection. |
| `opencode_worker` | project_fixture, next_task, role_check | worker_report | Runs OpenCode for one implementation iteration. |
| `evaluate_iteration` | spec, worker_report | evaluation | Checks test evidence and writes the evaluation. |
| `report_iteration` | plan, tasks, worker_report, evaluation | report | Summarizes the iteration. |
| `review_iteration` | spec, role_check, worker_report, evaluation, report | review | Checks rejection evidence, acceptance items, and report completeness. |
| `commit_lifecycle` | project and all lifecycle evidence | final_repo | Initializes a Git repository, copies code and evidence, and commits it. |


Product definition and core-risk approval are separate decisions bound to different input frontiers. The role check writes reject as an artifact. That rejection then becomes an ordinary input to the Supervisor and worker path.

## Run and inspect it

```bash
scripts/test-real-world-cases.sh harness-lifecycle contract
```

The contract path checks stale human-response isolation, the second risk decision, role-boundary rejection, and the spec, eval, and report inside the final Git artifact.

Run the live boundary after preparing Codex and OpenCode.

```bash
scripts/test-real-world-cases.sh harness-lifecycle live
```

Inspect `lifecycle-repo/.pm/runtime` and `specs/001-counter`. Every file comes from a declared Slot and can be traced to this iteration's inputs and Receipts.
