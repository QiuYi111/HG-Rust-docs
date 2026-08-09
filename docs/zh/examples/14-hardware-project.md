<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/14-hardware-project/">English</a></div>

# 14 · 硬件设计

把一个小型硬件需求拆成接口说明、测试计划和最终报告，适合展示多阶段产物的来源关系。

## 图结构

```text
requirement ──┬──> interface ──┐
              └──> test_plan ──┴──> report
```

## 配置重点

```yaml
slots:
  requirement: { kind: file, path: requirement.txt }
  interface: { kind: file, path: interface.md }
  test_plan: { kind: file, path: test-plan.md }
  report: { kind: file, path: report.md }
```

## 运行

```bash
hg put requirement requirement.txt --project .
hg run report --project .
hg materialize interface --project .
hg materialize test_plan --project .
hg materialize report --project .
```

## 观察什么

接口和测试计划可以独立更新；最终报告的 Receipt 会把它们与同一份需求 Revision 关联起来。

[返回案例库](index.md) · [下一个：科学实验](15-scientific-experiment.md)
