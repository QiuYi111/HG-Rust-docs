<div class="language-switch"><a href="../../../zh/examples/08-guards-conditional-flow/">中文</a> · <strong>English</strong></div>

# 08 · Conditional guards

This case puts all three Guard outcomes on one Rule. `mode=disabled` moves the Activation to `SUPPRESSED`, `mode=error` produces `ERROR`, and `mode=enabled` allows the Agent Rule to run.

## Configuration focus

```yaml
version: 1

slots:
  request: { kind: file, path: request.txt }
  mode: { kind: file, path: mode.txt }
  answer: { kind: file, path: answer.md }

rules:
  - id: conditional_answer
    in: [request, mode]
    out: [answer]
    when: >-
      case "$(cat $HG_IN/mode)" in
        enabled) exit 0 ;;
        disabled) exit 1 ;;
        error) exec hg-example-missing-guard-command ;;
        *) exit 1 ;;
      esac
    run:
      using: codex
      model: gpt-5.6-luna
      reasoning_effort: none
      command: >-
        Use shell commands only, never apply_patch. You must execute exactly this command and do nothing else:
        printf 'The TRUE guard enabled this Luna activation.\n' > out/answer
```

The Guard runs against the declared read-only inputs. Exit code 0 means `TRUE`, an ordinary non-zero exit means `FALSE`, and a missing command or timeout means `ERROR`.

## Run it

```bash
hg put request request.txt --project .

printf 'disabled\n' > mode.txt
hg put mode mode.txt --project .
hg run answer --project .

printf 'error\n' > mode.txt
hg put mode mode.txt --project .
hg run answer --project .

printf 'enabled\n' > mode.txt
hg put mode mode.txt --project .
hg run answer --project .
```

## What to observe

- `disabled` produces `SUPPRESSED` and no execution Attempt.
- `error` enters Guard error with its cause preserved instead of being reduced to `FALSE`.
- `enabled` makes the current input vector schedulable, so the Agent Rule runs.
- Every `mode` Revision change reevaluates the Guard. Use `hg explain answer` to inspect the exact inputs and Guard result.

[Back to the case library](index.md) · [Next: Audit and explanation](09-audit-and-explain.md)
