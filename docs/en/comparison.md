<div class="language-switch"><a href="../../zh/comparison/">中文</a> · <strong>English</strong></div>

# Comparison with existing products

HG-Rust overlaps with build tools, CI platforms, data orchestrators, and durable workflow systems, but they answer different first questions. The important difference is not “who has more features.” It is **what counts as current truth, and what condition counts as complete**.

## Start with the semantic center

| System | Primary organizing objects | Typical question | Center of completion |
|---|---|---|---|
| Make / Just | Targets, dependencies, recipes | Does this target file need rebuilding? | The target has been produced and is no longer out of date |
| GitHub Actions | Events, workflows, jobs, runners | Did the work triggered by this repository event finish? | The Workflow Run / Job reached a terminal state |
| Apache Airflow | DAGs, tasks, schedules, data intervals | Did the batch for this interval complete? | The DAG Run’s task dependencies completed |
| Temporal | Workflows, activities, durable execution history | How does this business process continue across failures? | The Workflow reached an application-defined state |
| Dagster | Software-defined assets, dependencies, lineage | How should data assets be produced, observed, and governed? | The Asset Materialization / Run reached the expected state |
| **HG-Rust** | **Slots, Rules, Revisions, Receipts** | **Can the latest facts prove that this target is fresh?** | **The target’s input closure reached a fixed point** |

These systems are not mutually exclusive replacements. Make can be a Rule Executor inside HG-Rust; GitHub Actions can trigger `hg run`; Airflow or Temporal can invoke HG-Rust as a governed step; Dagster can provide a data-asset view. The choice is about which layer owns the meaning of “complete.”

## Make / Just: rebuilding files vs. maintaining engineering facts

Make and Just are excellent at organizing targets, dependencies, and commands for fast local builds. Their core question is whether a target should be rebuilt from its dependencies and recipe.

HG-Rust differs in that:

- a target is modeled as a Slot whose authority is an immutable Revision, not the “latest file” at a path;
- reuse is determined by the exact input Revision vector, the Rule contract, and a valid Receipt;
- multi-output commits, failure recovery, Lease fencing, human decisions, and external Effects become shared kernel facts;
- a deleted or damaged Materialization can be repaired without rerunning the Rule.

If the job is simply compiling source and producing local files, Make or Just is often the more direct choice. They can also run as a Rule command while HG-Rust manages the higher-level artifact causality and acceptance.

## GitHub Actions: event-driven CI/CD vs. artifact reconciliation

GitHub Actions organizes CI/CD around repository events, Workflows, Jobs, and Runners. It is a strong fit for “after a commit, Pull Request, schedule, or external event, run this set of checks and deployment steps.”

HG-Rust draws a different boundary:

- an event can enter as a Source Slot, but the event alone is not a complete proof of current artifact state;
- a successful Workflow Run does not automatically mean that a project Slot is fresh for its current input closure;
- HG-Rust records the input Revisions, Attempt, Receipt, and Events for each Activation, then determines the GraphRun result from target fixed-point semantics;
- Agents, scripts, people, and external systems can use the same Rule contract; a hosted Runner is one execution environment among others.

A common composition is for GitHub Actions to provide repository events and hosted execution while HG-Rust coordinates documents, reviews, repairs, or release artifacts that must remain explainable as inputs evolve.

## Apache Airflow: scheduled batches vs. the current fact closure

Airflow’s DAG model organizes tasks, dependencies, schedules, and data intervals for periodic or batch workflows. Its time semantics are valuable for date-partitioned ETL, reporting, and data pipelines.

HG-Rust does not use a time interval as its primary trigger:

- current inputs are Source Slot Revisions; a change creates a new Activation for affected results;
- the target is derived from its input closure rather than treating one DAG Run as the only completion boundary;
- `NO_CHANGE`, missing Source, a false Guard, failure, write conflict, and oscillation have different meanings;
- streams, files, directories, Git, external events, and human decisions can share one Artifact model.

If “run one data interval every hour” is the central requirement, Airflow is the natural fit. If “whenever the latest facts change, reconcile the current target to a verifiable stable state” is central, HG-Rust is more direct. Time scheduling can also enter the graph as an external Source Slot event.

## Temporal: durable business processes vs. target artifact state

Temporal centers Workflows, Activities, and durable execution history. It fits business processes that must continue across process, network, and infrastructure failures, such as orders, approvals, and long-lived transactions.

HG-Rust centers a different problem:

- Temporal’s basic object is a progressing Workflow Execution; HG-Rust’s basic question is whether a target Slot has been proven fresh by current input facts;
- Temporal typically lets Workflow code decide the next step; HG-Rust derives desired Activations from current Heads, Guards, and valid Receipts;
- HG-Rust does not treat a Session or process cursor as formal state; candidate outputs advance Heads only after validation and fenced atomic commit;
- a Temporal Activity can run `hg run`, and an HG-Rust Rule can call a durable external service, so the two can be composed.

When the center is “where has this business process progressed?”, Temporal is the right center. When the center is “are the current engineering artifacts still proven by the latest facts?”, HG-Rust is the right center.

## Dagster: data-asset governance vs. general Artifact reconciliation

Dagster is the closest category to HG-Rust: it puts data assets, dependencies, lineage, observability, and materialization at the center.

HG-Rust extends the focus to autonomous engineering:

- an Artifact is not limited to a data asset; it can be a requirement, source tree, Git Revision, test report, Prompt, Memory, Skill, trajectory, or external Receipt;
- each Rule execution is separated into Activation, Attempt, and an optional Session, making nondeterminism and session reuse inspectable;
- a Receipt is not merely a run record; it binds input Revisions, output Revisions, checks, and atomic acceptance;
- Human, Effect, and Agent execution share the same Rule semantics as deterministic scripts;
- feedback loops progress through new Revisions and do not require refinement to become a privileged kernel node type.

If the primary problem is data-asset partitioning, materialization, lineage, and observation, Dagster may fit better. If one result model must cover documents, software, reviews, Agents, experiments, and external actions, HG-Rust provides a more general reconciliation kernel.

## The real HG-Rust difference: a different definition of completion

HG-Rust treats this chain as one formal semantic model rather than a collection of features:

```text
Slot Head
   ↓  current input Revision vector
Activation
   ↓  one or more real executions
Attempt
   ↓  validation + CAS + fenced atomic commit
Receipt
   ↓  event-driven downstream derivation
Target backward closure reaches a fixed point
```

In this model:

- a file existing is not success;
- a process exiting 0 is not a commit;
- having no runnable task is not stability;
- Session memory is not authoritative state;
- an old approval cannot silently approve new inputs;
- an external effect’s uncertainty is handled with an idempotency key and Readback.

## How to choose or combine

- Primarily local builds and file rebuilding: choose Make / Just.
- Primarily repository events, CI, and deployment: choose GitHub Actions.
- Primarily time-windowed data batches: choose Airflow.
- Primarily failure-resilient business processes: choose Temporal.
- Primarily data assets, lineage, and observability: choose Dagster.
- Primarily “when inputs change, continuously reconcile a verifiable engineering result to stability”: choose HG-Rust.
- Already using one of these platforms but need Revisions, Receipts, and Human/Agent collaboration: use the platform as an outer trigger, Rule Executor, or runtime environment and compose it with HG-Rust.

## Official concept documentation

These links point to official concept documentation for the comparison systems:

- [GNU Make · How Make Works](https://www.gnu.org/software/make/manual/html_node/How-Make-Works.html)
- [GitHub Actions · Concepts](https://docs.github.com/en/actions/concepts)
- [Apache Airflow · Dags](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dags.html)
- [Temporal · Documentation](https://docs.temporal.io/)
- [Dagster · Documentation](https://docs.dagster.io/)
