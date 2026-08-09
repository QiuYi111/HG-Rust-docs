<div class="language-switch"><a href="../../../zh/examples/08-guards-conditional-flow/">中文</a> · <strong>English</strong></div>

# 08 · Conditional guards

A Guard makes the decision to run a Rule observable. Exit code 0 means TRUE, an ordinary non-zero exit means FALSE, and a missing command or timeout means ERROR.

## Configuration focus

```yaml
rules:
  - id: answer_when_enabled
    in: [request, mode]
    out: [answer]
    when: "test \"$(cat in/mode)\" = enabled"
    run: "printf 'Enabled.\\n' > out/answer"
```

## Run it

```bash
printf 'disabled\n' > mode.txt
hg put mode mode.txt --project .
hg run answer --project .

printf 'enabled\n' > mode.txt
hg put mode mode.txt --project .
hg run answer --project .
```

With `disabled`, the Rule is suppressed rather than failed. With `enabled`, the changed input Revision makes it eligible again. Use `hg explain answer` to inspect the Guard state.

[Back to the case library](index.md) · [Next: Audit and explanation](09-audit-and-explain.md)
