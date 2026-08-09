<div class="language-switch"><a href="../../zh/comparison/">中文</a> · <strong>English</strong></div>

# Comparison with existing products

HG-Rust overlaps with build tools, CI platforms, data orchestrators, and durable workflow systems, but their centers of gravity differ. The table compares core abstractions, not product quality.

| Product category | Core abstraction | Best suited to | How HG-Rust differs |
|---|---|---|---|
| Make / Just | Targets, dependencies, commands | Local builds and file changes | Makes versions, Receipts, recovery, and explanation runtime facts instead of relying mainly on paths and timestamps |
| GitHub Actions | Events, Workflows, Jobs, Runners | CI/CD around a code-hosting platform | Centers on the current state and causal history of project artifacts; hosted runners and triggers are not the core model |
| Apache Airflow | DAGs, Tasks, schedules, data intervals | Batch and periodic data workflows | Rule outputs are versioned Artifacts, and reuse follows input Revisions plus Receipts rather than one DAG Run’s state |
| Temporal | Workflows, Activities, durable execution | Business processes that must continue across failures | Temporal centers on progressing a code-defined workflow; HG-Rust centers on bringing a desired artifact to a stable state |
| Dagster | Assets, dependencies, lineage, observability | Data asset orchestration and governance | Extends the artifact idea to documents, reviews, Agents, and external effects with shared Attempt/Receipt evidence |

## A practical choice guide

- Need to build files: start with Make or Just.
- Need tests and deployments after repository events: start with GitHub Actions.
- Need scheduled, interval-based batch processing: start with Airflow.
- Need a business workflow to survive network and infrastructure failures: start with Temporal.
- Need data assets, lineage, and observability: start with Dagster.
- Need to reconcile a verifiable result whenever its inputs change: HG-Rust is the more direct abstraction.

## The HG-Rust combination

HG-Rust joins four concerns in one chain:

1. Declarative result model: Slot + Rule.
2. Content and history model: immutable Revision.
3. Execution evidence: Attempt + Receipt + Session.
4. Controlled change: Human + Effect + Event.

## Further reading

These links point to official concept documentation:

- [GNU Make · How Make Works](https://www.gnu.org/software/make/manual/html_node/How-Make-Works.html)
- [GitHub Actions · Concepts](https://docs.github.com/en/actions/concepts)
- [Apache Airflow · Dags](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dags.html)
- [Temporal · Documentation](https://docs.temporal.io/)
- [Dagster · Documentation](https://docs.dagster.io/)
