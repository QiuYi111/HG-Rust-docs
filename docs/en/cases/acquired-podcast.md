<div class="language-switch"><a href="../../zh/cases/acquired-podcast/">中文</a> · <strong>English</strong></div>

# Acquired Podcast: from one topic to a structured podcast package

You want to demonstrate a company-story podcast workflow. The case produces sourced research files, a three-act script, and two machine-readable production sheets. The inputs use fixed notes and one public home page, while the meeting and acts are fixed short text. It therefore verifies workflow wiring, network boundaries, and recovery, not deep fact research or a broadcast-ready episode.

The complete case is in the [HG-Rust Acquired Podcast directory](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/acquired-podcast).

<div class="diagram">
  <img src="../../assets/case-acquired.svg" alt="A podcast topic passes through human approval, six constrained research paths, supplemental research, a three-act script, and QA into two production sheets" />
</div>

## Step 1: agree on this episode’s topic

Topics often drift while people write. The case runner submits a fixed topic file through a Human Rule and checks that research follows the accepted topic version. This tests the gate and version relationship; it does not evaluate the quality of a real editor’s decision.

```yaml
slots:
  topic_prompt: { kind: file, path: fixtures/topic.md }
  topic: { kind: file, path: topic.md }

rules:
  - id: choose_topic
    in: [topic_prompt]
    out: [topic]
    run: { using: human, command: "Approve the exact company topic file" }
```

Research now follows the approved topic version. If the topic changes, old research cannot silently answer the new question.

## Step 2: split research questions and restrict the network

“Research the company” is too broad. This case uses six questions: origins, business model, product, competition, leadership, and turning points. Each produces a sourced research file.

```yaml
slots:
  origins: { kind: file, path: research/origins.json }
  business_model: { kind: file, path: research/business-model.json }
  product: { kind: file, path: research/product.json }
  competition: { kind: file, path: research/competition.json }

rules:
  - id: research_origins
    in: [topic, recorded_research]
    out: [origins]
    permissions: { network: [www.berkshirehathaway.com] }
    run: "fetch the allowed source and write out/origins" # shortened for explanation; see the case for the runnable command
```

Six directions can overlap, but the overlap needs a ceiling.

```bash
scripts/test-real-world-cases.sh acquired-podcast contract

# Run the real external-tool profile when its dependencies are available.
scripts/test-real-world-cases.sh acquired-podcast live
```

The runner uses `--jobs 3` as the concurrency ceiling. The network policy allows only the hosts pinned by the case. Direct access to another host, a redirect to another host, or a private-address resolution is denied. HG solves two practical problems here: research can overlap, while a faulty script cannot quietly expand its network reach.

## Step 3: completed research still needs an editorial decision

The research gate checks that all six files exist. This case includes one fixed competition supplement to show that missing material can be completed before production. It is not an evaluation of an interactive editor’s judgement.

```yaml
rules:
  - id: review_research
    in: [origins, business_model, product, competition,
         leadership, inflections, supplement, gate_request]
    out: [research_gate]
    run: "accept only after the requested supplement is complete"
```

The gate’s response is also a file. It separates “more research is needed” from “production may start,” so a vague note cannot accidentally release the next step.

## Step 4: carry sources into the production meeting and acts

Once research is accepted, the Luna production step reads the accepted files and writes a meeting record. Each act then uses the research that belongs to it.

```yaml
rules:
  - id: production_meeting
    in: [topic, origins, business_model, product, competition,
         leadership, inflections, research_gate]
    out: [meeting]
    run:
      using: codex
      model: gpt-5.6-luna
      command: "Write a production meeting that cites the accepted sources"

  - id: write_act_one
    in: [meeting, origins, business_model]
    out: [act_one]
    run: "write Act I"
```

The split is useful because the acts depend on different facts. When one research direction changes, you can see which act is affected. The final script also produces separate host and guest production sheets that reference the same script version.

## Step 5: make QA repeatable

The script is assembled first. A deterministic QA step checks for a revision marker. Only an accepted revision produces the two Audio Director production sheets. This checks a workflow condition, not editorial quality.

```bash
RUN_ROOT=/path/to/your/retained/run
hg materialize script --project "$RUN_ROOT"
hg materialize audio_manifest_host --project "$RUN_ROOT"
hg materialize audio_manifest_guest --project "$RUN_ROOT"
hg events --project "$RUN_ROOT" --output json
```

The three acts, revision round, and two production sheets can all be found from the same recorded run.

## Step 6: cancel once, then resume

The case runner cancels after all six research results have been committed while downstream work is still running, then creates a resumed run. The resumed run uses concurrency one and reuses the six committed versions. The assertion is that those versions stay unchanged; it makes no separate claim about network download counts.

```bash
RUN_ROOT=/path/to/your/retained/run
hg runs --project "$RUN_ROOT" --output json
```

All five live samples checked that the six completed research files stayed unchanged. The initial run’s ceiling was three; the resumed run’s concurrency is one by design.

## Why this workflow is complex

Sources, network permissions, parallel tasks, editorial supplementation, a production meeting, script revision, and cancellation recovery all occur in one job. If any of them is kept as hidden global state, the next run cannot tell which work is still trustworthy. HG keeps the source, decision, script, and production sheets separate and records their relationships.

## What we actually ran

Five successful live runs on 2026-08-09 completed the six constrained research paths, one fixed supplement, the Luna process boundary, fixed three-act text, and two production sheets. Elapsed times were 60.484, 45.056, 54.680, 51.280, and 69.804 seconds. Every run also completed cancellation and resume while preserving the six committed research versions.

These are current observations. Formal duration, token, and cost budgets are not locked.

## Try changing next

Change the supplement text in `fixtures/gate-request.json`, then run the contract profile. Next change an allowed host in one research Rule and observe the proxy reject the request.
