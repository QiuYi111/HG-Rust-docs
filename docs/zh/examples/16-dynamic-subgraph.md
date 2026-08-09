<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/16-dynamic-subgraph/">English</a></div>

# 16 · 动态子图

这个案例对应动态子图的 `GraphSpec Slot` 形式。Planner Rule 先生成一个完整的子图定义，把它提交为不可变的 `generated_graph` Revision；通用 `subgraph` Executor 再读取这个 Revision，在隔离项目中运行子图，并只返回声明的 `answer` Slot。

它与[静态子图](06-subgraph-project.md)的区别在于，父图不直接引用固定的子图文件。子图定义本身成为输入 Artifact，定义变化会形成新的输入向量和新的子图执行证据。

## 父图配置

下面是可直接改造成项目配置的完整结构。示例中的 `gpt-5.6-luna` 是仓库官方案例使用的模型标识，实际运行时请替换为发行环境中可用的模型；配置不包含凭证。

```yaml
version: 1
project:
  name: dynamic-subgraph
  default_targets: [answer]

slots:
  request: { kind: file, path: request.txt }
  generated_graph: { kind: file, path: generated-child.yaml }
  answer: { kind: file, path: answer.md }

rules:
  - id: plan_child_graph
    in: [request]
    out: [generated_graph]
    run:
      using: codex
      model: gpt-5.6-luna
      reasoning_effort: none
      command: >-
        读取 request，生成完整的子图 GraphSpec，并写入 out/generated_graph。
        子图必须声明 request 与 answer 两个 Slot，以及一个生成 answer 的 Rule。

  - id: run_generated_graph
    in: [request, generated_graph]
    out: [answer]
    run: { using: subgraph, command: "slot:generated_graph" }
```

子图定义本身也要满足配置规范。例如 Planner 可以产生这样的 GraphSpec。

```yaml
version: 1
slots:
  request: { kind: file, path: request.txt }
  answer: { kind: file, path: answer.md }
rules:
  - id: generated_answer
    in: [request]
    out: [answer]
    run:
      using: codex
      model: gpt-5.6-luna
      reasoning_effort: none
      command: "读取 request，将带有 provenance 标记的答案写入 out/answer"
```

`generated_graph` 是 `run_generated_graph` 的声明输入。Runtime 从 Attempt 的只读输入快照解析它，控制 Slot 只负责定义子图，不会作为业务内容传入子图。子图获得父 Rule 声明的业务输入，并只能返回声明的输出。

## 准备输入并运行

```text
Build and execute a child graph that returns a provenance marker.
```

```bash
hg init --project .
hg put request request.txt --project .
hg run answer --project . --output json
hg materialize generated_graph --project .
hg materialize answer --project .
hg events --project . --output json
```

## 观察什么

- 第一个 Activation 运行 `plan_child_graph`，提交 `generated_graph` Revision。
- 第二个 Activation 的 `command: "slot:generated_graph"` 精确消费这份 Revision。
- `SubgraphRun` Event 记录 `graph_spec_slot: generated_graph`，审计者可以沿 Artifact 找到子图定义来源。
- 子图在隔离项目中运行，父图只接收 `answer`，不会看到子图的未声明状态。
- 修改 request 会重新生成 GraphSpec，并让后续子图执行绑定到新的输入 Revision。
- 缺少或不合法的 GraphSpec 会使父 Attempt 失败，系统不会把一个普通工作区文件当作隐式图定义。

动态 GraphSpec Slot 负责组合子图。项目级 `graph_patch` 的 apply barrier 负责切换父图本身，两者的作用范围不同。

[返回案例库](index.md) · [回到产品介绍](../index.md)
