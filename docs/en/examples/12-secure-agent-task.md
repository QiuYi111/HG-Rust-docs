<div class="language-switch"><a href="../../../zh/examples/12-secure-agent-task/">中文</a> · <strong>English</strong></div>

# 12 · Constrained agent task

This case gives an executor only a declared secret handle and limits the output to presence status instead of writing a secret into an Artifact or log.

## Configuration focus

```yaml
rules:
  - id: inspect_token
    in: [request]
    out: [token_status]
    permissions:
      network: none
      secrets: [APP_TOKEN]
    run:
      using: codex
      model: your-model-id
      command: >-
        if test -n "$HG_SECRET_APP_TOKEN";
        then printf PRESENT > out/token_status;
        else printf MISSING > out/token_status; fi
```

## Run it

```bash
export HG_SECRET_APP_TOKEN='synthetic-test-value'
hg run token_status --project .
hg materialize token_status --project .
hg logs <ATTEMPT_ID> --project .
```

Only the handle name `APP_TOKEN` appears in the configuration; the value comes from the runtime. The output says only whether the value is present, and logs redact the value. Use a secret manager for real credentials.

[Back to the case library](index.md) · [Next: Feedback loop](13-feedback-loop.md)
