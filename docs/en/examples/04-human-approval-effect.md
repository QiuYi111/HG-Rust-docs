<div class="language-switch"><a href="../../../zh/examples/04-human-approval-effect/">中文</a> · <strong>English</strong></div>

# 04 · Human approval and effects

This case separates proposing from changing an external system: create a proposal, record a Human decision, and execute the Effect only after approval.

## Configuration focus

```yaml
rules:
  - id: propose
    in: [request]
    out: [proposal]
    run:
      using: codex
      model: your-model-id
      command: "Write a proposal to out/proposal."
  - id: approve
    in: [proposal]
    out: [decision]
    run: { using: human, command: "Approve this proposal" }
  - id: publish
    in: [proposal, decision]
    out: [published]
    run: "cp in/proposal out/published"
    effect:
      idempotency: "publish-proposal-v1"
      readback: "verify published state"
```

## Run it

```bash
hg run published --project .
hg human pending --project . --output json
hg human decide --activation <ACTIVATION_KEY> --decision approve --project .
hg run published --project .
hg effect verify <EFFECT_KEY> --project .
```

## Inspect

Before approval, the publish Rule must not cross the Human node. After approval, the Effect Receipt records the idempotency key and observed remote state.

[Back to the case library](index.md) · [Next: Review and revision](05-agent-review-revise.md)
