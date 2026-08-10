# Acquired

This graph starts from an approved company topic, gathers source-backed research from the web, produces a three-act podcast script, and generates separate Audio Director manifests for the host and guest.

The contract path uses fixed material. The live path requires working Codex credentials and network access to the domains allowed by the research Rules.

<div class="hg-diagram">
  <img src="../../../assets/diagrams/acquired.en.svg" alt="Acquired research and production graph">
</div>

## Complete graph definition

The runnable configuration contains six parallel research branches, an evidence gate, three parallel writing branches, and two audio-manifest outputs. You can also [download the raw YAML](../../includes/acquired.yaml).

<div class="hg-yaml" markdown>

```yaml
--8<-- "includes/acquired.yaml"
```

</div>

## What each Slot does

| Slot | Stage | Role in the graph |
|---|---|---|
| `topic_prompt` | input | The company topic presented for approval. |
| `gate_request` | input | A bounded follow-up question required by the evidence gate. |
| `topic` | scope | The approved topic Revision read by every research Rule. |
| `origins` | research | Source-backed founding and early-history research. |
| `business_model` | research | Revenue, capital-allocation, and operating-segment research. |
| `product` | research | Product, service, and customer-value research. |
| `competition` | research | Competitive landscape and defensibility research. |
| `leadership` | research | Leadership, governance, and succession research. |
| `inflections` | research | Strategic inflections with dates and sourced consequences. |
| `supplement` | research | Targeted competition follow-up requested by the gate. |
| `research_gate` | acceptance | The decision written after validating the six reports and supplement. |
| `meeting` | production | A three-act production brief built from accepted evidence. |
| `act_one` | writing | Origins and business-model act. |
| `act_two` | writing | Product and competition act. |
| `act_three` | writing | Leadership and inflections act. |
| `draft_script` | join | Direct concatenation of the three acts. |
| `script` | revision | Episode script after source-transition revision. |
| `qa` | input | Bootstrap QA decision that allows pending or revise to trigger revision. |
| `qa_result` | acceptance | Machine check for source URLs and the revision marker. |
| `audio_manifest_host` | output | Audio Director manifest for the host voice. |
| `audio_manifest_guest` | output | Audio Director manifest for the guest voice. |


## What each Rule does

| Rule | Reads | Writes | Work |
|---|---|---|---|
| `choose_topic` | topic_prompt | topic | Asks a person to approve the exact topic file. |
| `research_origins` | topic | origins | Researches founding history and records at least two sources. |
| `research_business_model` | topic | business_model | Researches revenue, capital allocation, and segments. |
| `research_product` | topic | product | Researches products, services, and customer value. |
| `research_competition` | topic | competition | Researches competition and separates sourced facts from analysis. |
| `research_leadership` | topic | leadership | Researches leadership history, governance, and succession. |
| `research_inflections` | topic | inflections | Researches strategic turning points with dates and consequences. |
| `supplement_competition` | topic, competition, gate_request | supplement | Performs one bounded follow-up investigation. |
| `review_research` | six reports, supplement, gate_request | research_gate | Uses `jq` to validate source counts, summaries, and supplement status. |
| `production_meeting` | topic, all research, research_gate | meeting | Creates a three-act brief after the gate accepts. |
| `write_act_one` | meeting, origins, business_model | act_one | Writes act one and preserves source URLs. |
| `write_act_two` | meeting, product, competition | act_two | Writes act two around the central strategic tension. |
| `write_act_three` | meeting, leadership, inflections | act_three | Writes act three with sourced consequences. |
| `assemble_episode` | act_one, act_two, act_three | draft_script | Concatenates the three acts in order. |
| `revise_episode` | draft_script, qa | script | Adds source-transition revision when QA is pending or revise. |
| `qa_episode` | script, qa | qa_result | Checks for source URLs and the revision marker. |
| `direct_host_audio` | script, qa_result | audio_manifest_host | Produces the host manifest after QA accepts. |
| `direct_guest_audio` | script, qa_result | audio_manifest_guest | Produces the guest manifest after QA accepts. |


The six research Rules share only `topic`, so they can run in parallel. The three writing Rules share `meeting` and can also run in parallel. The two manifests read the same accepted script without depending on each other.

## Run and inspect it

Start with the contract profile.

```bash
scripts/test-real-world-cases.sh acquired-podcast contract
```

It preserves the same Slots, Rules, gate, and JSON schemas while using fixed inputs to test scheduling and recovery.

Run live research after preparing network access and Codex credentials.

```bash
scripts/test-real-world-cases.sh acquired-podcast live
```

Inspect the six files under `research/`. Each should contain at least two sources with URLs, titles, retrieval times, and evidence. Then inspect `research-gate.json`, the three acts, and both Audio Director manifests.
