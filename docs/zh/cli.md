<div class="language-switch"><strong>中文</strong> · <a href="../../en/cli/">English</a></div>

# CLI

`hg` 是 HarnessGraph Kernel 的命令行入口。命令负责表达意图和投影事实；项目配置与已记录的结果共同决定下一步动作。

## 全局选项

```text
--project <PATH>       指定项目根目录
--output <human|json|jsonl>
--quiet                不输出人类可读文本
--non-interactive      禁止需要交互的提示
```

项目参数也可以省略，CLI 会从当前目录向上查找 `harness.yaml`。

## 命令族

| 目的 | 命令 |
|---|---|
| 初始化和检查 | `init`、`check`、`lint`、`fmt` |
| 导入与状态 | `put`、`status`、`inspect` |
| 计划与运行 | `plan`、`run`、`resume`、`cancel`、`runs` |
| 结果与历史 | `explain`、`artifact show`、`artifact history`、`artifact diff` |
| 物化与修复 | `materialize`、`drift`、`repair`、`doctor`、`gc` |
| 事件与日志 | `events`、`log`、`logs` |
| 失效与重试 | `invalidate`、`retry` |
| 人工与外部效果 | `human pending`、`human show`、`human decide`、`effect verify` |
| 会话 | `session list`、`session show`、`session checkpoint`、`session close` |
| 守护进程 | `daemon start`、`daemon status`、`daemon stop`、`daemon ping` |
| 辅助输出 | `graph`、`completion`、`man` |

## 最常用的工作流

```bash
hg init --project .
hg check --strict
hg put request request.txt
hg plan report
hg run report
hg status
hg explain report
```

## 结构化输出

```bash
hg status --output json
hg events --output jsonl
hg log --output json
```

- `human` 适合终端阅读。
- `json` 适合一次性脚本处理。
- `jsonl` 适合事件流和逐行消费。

## 运行控制

```bash
hg run report --watch
hg run report --detach
hg resume <RUN_ID>
hg cancel <RUN_ID>
hg run report --budget-attempts 3 --budget-duration 120
```

运行期间用 `hg events --follow` 观察追加事件；取消只影响当前运行，不会删除已经提交的 Revision。

## 人工决定

```bash
hg human pending --output json
hg human show <ACTIVATION_KEY>
hg human decide --activation <ACTIVATION_KEY> --decision approve
```

实际使用时，请在决定中加入能帮助后续审阅的 comment。
