<div class="language-switch"><strong>中文</strong> · <a href="../../en/configuration/">English</a></div>

# 配置总览

项目配置文件名为 `harness.yaml`，版本字段目前为 `1`。配置分为项目元数据、Slot 和 Rule 三层。

## 最小结构

```yaml
version: 1
project:
  name: report-project
  default_targets: [report]

slots:
  request: { kind: file, path: request.txt }
  report: { kind: file, path: report.md }

rules:
  - id: make_report
    in: [request]
    out: [report]
    run: "cp in/request out/report"
```

### `version`

配置格式版本。当前填写 `1`。

### `project`

`name` 是项目名称；`default_targets` 是未在命令行传入目标时使用的 Slot 列表。

### `slots`

每个 Slot 至少需要 `kind`。常见配置如下：

```yaml
slots:
  document: { kind: file, path: docs/document.md }
  assets: { kind: dir, path: build/assets }
  source_tree: { kind: git, path: . }
  feed: { kind: stream }
  binary: { kind: opaque, path: build/app.bin }
```

支持的 `kind` 为 `file`、`dir`、`git`、`stream` 和 `opaque`。系统不会根据扩展名猜测类型。

### `rules`

每个 Rule 需要 `id`、`in`、`out` 和 `run`。`run` 可以是字符串形式的 Shell 命令，也可以是带执行器参数的映射。

## 输入、输出与执行目录

执行器会得到一个隔离的工作目录：

```text
workspace/
├── in/       # 当前输入 Slot
├── out/      # 只允许写入候选输出
└── execution.json
```

Shell Rule 通常从 `in/<slot>` 读取，并写入 `out/<slot>`。只有候选输出通过验证和提交后，才会成为新的 Revision。

## 让配置先通过检查

```bash
hg check --project . --strict
hg fmt --project . --check
```

检查阶段会发现未知执行器、重复 ID、缺少 `kind`、无效的策略值和不符合约定的 YAML 结构。

## 配置设计建议

- Slot 名称使用稳定、可读的业务名，不要把临时文件名当作模型名称。
- 一个 Rule 尽量表达一个可验证的转换，便于定位失败和复用结果。
- 先用 `shell` 完成确定性验证，再为需要推理或人工判断的步骤选择其他执行器。
- 外部动作单独建 Rule，并配置幂等键与 readback。
- 给长任务配置 `limits`，给敏感任务配置 `permissions`。

下一步阅读[执行器与策略](executors.md)或[配置参考](configuration-reference.md)。
