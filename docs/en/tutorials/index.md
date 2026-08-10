# Tutorial path

These tutorials grow in complexity. Each page explains the graph, runs a deterministic path, and identifies the boundary you can replace with a live agent or external tool.

| Order | Case | Main structure | Recommended run |
| --- | --- | --- | --- |
| 1 | [Pomodoro](pomodoro.md) | Smallest self-improvement loop and human approval | Rust contract test |
| 2 | [Learning Helper](learning-helper.md) | Human scope, parallel distillation, join, and review | contract |
| 3 | [Grill](grill.md) | Multi-turn human and agent terminal session | mock or iTerm2 |
| 4 | [Acquired](acquired.md) | Live research, parallel branches, supplement gate, and script join | contract or live |
| 5 | [Harness Lifecycle](harness.md) | Complete engineering lifecycle | contract or live |
| 6 | [CAD Release](cad-release.md) | Specialist tools, independent critics, and human release gate | contract or live |

Every tutorial uses a current example from the kernel repository. A `contract` profile keeps the same graph and commit semantics while replacing live executors with deterministic boundaries. A `live` profile calls real agents, networks, document tools, or CAD tools and therefore needs the matching environment.

If your goal is scheduler validation, complete the first two tutorials and continue to the [Graph semantics lab](../graph-lab.md).
