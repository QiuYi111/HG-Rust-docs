<div class="language-switch"><a href="../../../zh/examples/14-hardware-project/">中文</a> · <strong>English</strong></div>

# 14 · Hardware design

Turn a small hardware requirement into an interface description, a test plan, and a final report. This case shows provenance across several output paths.

## Graph structure

```text
requirement ──┬──> interface ──┐
              └──> test_plan ──┴──> report
```

## Configuration focus

```yaml
slots:
  requirement: { kind: file, path: requirement.txt }
  interface: { kind: file, path: interface.md }
  test_plan: { kind: file, path: test-plan.md }
  report: { kind: file, path: report.md }
```

## Run it

```bash
hg put requirement requirement.txt --project .
hg run report --project .
hg materialize interface --project .
hg materialize test_plan --project .
hg materialize report --project .
```

The interface and test plan can evolve independently. The final report’s Receipt links them to the same requirement Revision.

[Back to the case library](index.md) · [Next: Scientific experiment](15-scientific-experiment.md)
