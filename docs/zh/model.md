# 两个原语

一个 `harness.yaml` 主要由 `slots` 和 `rules` 组成。其余对象用于保存执行事实，不会扩大作者模型。

<div class="hg-diagram">
  <img src="../../assets/diagrams/two-primitives.zh.svg" alt="Slot 和 Rule 的关系">
</div>

## Slot

Slot 给工件一个稳定名字，并声明它的类型与物化位置。

```yaml
slots:
  brief: { kind: file, path: request/brief.md }
  candidate: { kind: git, path: artifacts/candidate }
  report: { kind: file, path: artifacts/report.md }
```

写入 Slot 的每个已提交版本都是一个 Revision。Revision 不可变，因此内核能够回答某条 Rule 当时读到了什么，也能判断现有输出是否仍然匹配当前输入。

## Rule

Rule 声明输入、输出和执行方式。

```yaml
rules:
  - id: write_report
    in: [brief, candidate]
    out: [report]
    run: "printf '# Report\n' > out/report"
```

执行时，输入出现在 `in/`，输出必须写入 `out/`。成功的 Attempt 会原子提交声明过的全部输出。命令失败、超时或漏写输出时，本轮不会留下部分 Revision。

## 运行时事实

| 名称 | 含义 |
| --- | --- |
| Revision | 某个 Slot 中不可变的工件版本 |
| Activation | Rule 与一组确切输入 Revision 形成的可执行实例 |
| Attempt | 对某个 Activation 的一次执行 |
| Receipt | 一次成功执行留下的可复用记录 |

Lease 用于防止多个 worker 同时占有同一个 Activation。Session 用于让执行器在多轮任务间保留受控上下文。它们都属于运行时机制。

## 三种常用执行方式

Shell Rule 直接运行命令。Agent Rule 通过执行器调用模型。Human Rule 暂停并等待人工提交决定。

```yaml
run: "cp in/source out/result"
```

```yaml
run:
  using: codex
  command: "Read in/brief and write only out/report."
```

```yaml
run:
  using: human
  command: "Approve the reviewed candidate"
```

三者共享 Slot 与 Rule 的读写语义，因此可以在同一张图里组合。
