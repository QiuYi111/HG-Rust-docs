# Acquired

This case starts from an approved company topic, gathers live evidence, builds a three-act podcast script, and emits separate Audio Director manifests for host and guest.

<div class="hg-diagram">
  <img src="../../../assets/diagrams/acquired.en.svg" alt="Acquired research and production graph">
</div>

## Step 1, approve the topic

`choose_topic` is a Human Rule. It fixes the research scope as one Topic Revision, which all six research Rules read.

## Step 2, gather evidence in parallel

Agent Rules research origins, business model, product, competition, leadership, and inflection points in parallel. Every research Artifact records source URLs, titles, retrieval times, and evidence. Recorded research conclusions are not graph inputs.

A supplement Rule reads the competition research and `gate_request`. `review_research` checks every branch and the supplement before production can begin.

## Step 3, join the episode

The production meeting organizes accepted evidence into three acts. Three writing Rules produce those acts. `assemble_episode` joins them. Once QA accepts the script, host and guest manifests can run in parallel.

## Run the case

Start with the contract path. It keeps the same Slots, Rules, Receipts, gates, and schemas.

```bash
scripts/test-real-world-cases.sh acquired-podcast contract
```

Use the live path when you need to validate real research.

```bash
scripts/test-real-world-cases.sh acquired-podcast live
```

Live execution visits domains allowed by each Rule and needs working Codex credentials and network access. Every research Artifact needs at least two sources before the gate passes. See the case directory's `README.md` and `case.lock.yaml`.
