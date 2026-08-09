<div class="language-switch"><strong>中文</strong> · <a href="../../en/release/">English</a></div>

# 发布说明

本网站对应 HarnessGraph Kernel 0.1 的用户文档，配置文件版本为 `1`。文档用稳定的概念、配置字段和 CLI 命令帮助用户构建可验证的产物流程。

## 本版涵盖

- Slot + Rule 作者模型。
- File、Directory、Git、Stream 和 Opaque Artifact 类型。
- Revision、Head、Activation、Attempt、Receipt、Session 和 Event。
- Shell、Agent、Human、交互服务和 Subgraph 执行器入口。
- Guard 三态、执行预算、网络/秘密声明、Effect 幂等与回读。
- 循环反馈固定点和通过 `GraphSpec` Revision 生成的动态子图。
- JSON、JSONL、事件跟踪、漂移修复、恢复、失效和重试。
- 20 个案例，包括四个带 contract/live 双配置和统一报告的真实工作流。

## 本次内核与案例增量

- `hg run --jobs N` 有界并发，以及 exclusive 输出 Slot 的同批 writer 冲突保护；
- 双管道有界捕获、Unix process-group 取消/超时；
- 失败/孤儿 Attempt 恢复、取消终态保持和即时 lease 释放；
- Codex Executor 自动 checkpoint/resume（由执行器与运行时回归覆盖）；
- 精确 Human 文件 Revision 与 stale Activation fencing；
- 可物化、可缓存的 Git Revision 输出；
- 显式网络策略下、由 macOS `sandbox-exec` 强制的精确主机 allowlist；其他平台在无法强制时拒绝启动；
- `hg.real-world-report/v1` 真实案例报告。

这些能力由 [Learning Helper](examples/17-learning-helper.md)、
[Acquired Podcast](examples/18-acquired-podcast.md)、
[Harness Lifecycle](examples/19-harness-lifecycle.md) 和
[CAD Release](examples/20-cad-release.md) 共同验证。正式性能/成本校准与
CI 调度不属于本次发布完成项。

## 兼容性约定

| 项目 | 约定 |
|---|---|
| 配置 | `harness.yaml`，`version: 1` |
| 输出 | `human`、`json`、`jsonl` |
| 目标系统 | macOS、Linux |
| 命令入口 | `hg` |

## 阅读约定

配置字段与命令名使用代码字体；状态名使用大写时，表示结构化输出中的稳定值。示例中的模型标识、秘密句柄和远程资源均为占位符，请替换为你的运行环境配置。

## 版本演进

当配置格式或 CLI 输出协议发生不兼容变化时，会提升版本并在迁移说明中记录。运行前可以使用：

```bash
hg migrate --check
hg check --strict
```

如需从概念开始，请返回[产品介绍](index.md)；如需直接动手，请进入[Quick Start](quick-start.md)。
