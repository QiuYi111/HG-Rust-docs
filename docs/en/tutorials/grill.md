# Grill

Grill places a multi-turn human and agent discussion inside an ordinary Shell Rule. HG waits for the session to end, validates the declared outputs, then commits the product contract and roadmap together.

<div class="hg-diagram">
  <img src="../../../assets/diagrams/grill.en.svg" alt="Grill multi-turn interaction graph">
</div>

## The boundary that matters

`product_grill` reads `goal` and `grill_driver`, then writes `product_contract` and `roadmap` in one Attempt. The multi-turn conversation lives inside the executor. The graph still contains one Rule.

HG owns input and output atomicity. The session script owns the terminal experience and `/exit` protocol.

## Run mock mode first

```bash
cargo build -p hg-cli --bin hg
export PATH="$PWD/target/debug:$PATH"
cd examples/03-interactive-grill
hg init --project .
hg put goal goal.md --project .
hg put grill_driver scripts/grill_session.py --project .
HG_GRILL_MODE=mock hg run roadmap --project .
hg materialize product_contract --project .
hg materialize roadmap --project .
```

`artifacts/product.json` and `artifacts/roadmap.json` should both exist. This path validates the Rule, output checks, and atomic commit without opening a terminal window.

## Run a live session

Live mode currently needs macOS, iTerm2, and an authenticated `codex` CLI. Remove `HG_GRILL_MODE=mock` and run `hg run roadmap --project .`. Continue the discussion in the new window until the agent has written both outputs. Enter `/exit` to let the parent Attempt validate and commit them.

Current launcher and recovery limits are listed in the case directory's `README.md`.
