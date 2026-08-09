<div class="language-switch"><strong>中文</strong> · <a href="../../en/configuration-reference/">English</a></div>

# 配置参考

本页集中列出 `harness.yaml` 的字段、取值和最小示例。字段名保持与配置文件一致。

## 顶层字段

| 字段 | 必需 | 说明 |
|---|---:|---|
| `version` | 是 | 配置格式版本，目前为 `1` |
| `project` | 否 | 项目名称和默认目标 |
| `slots` | 否 | Slot 定义映射 |
| `rules` | 否 | Rule 定义列表 |

## Slot 字段

| 字段 | 必需 | 有效值 |
|---|---:|---|
| `kind` | 是 | `file`、`dir`、`git`、`stream`、`opaque` |
| `path` | 否 | 物化路径 |
| `writer_policy` | 否 | `exclusive`（默认）或 `multiple` |

## Rule 字段

| 字段 | 必需 | 说明 |
|---|---:|---|
| `id` | 是 | Rule 的稳定标识符 |
| `in` | 否 | 输入 Slot 列表 |
| `out` | 否 | 输出 Slot 列表 |
| `run` | 是 | 字符串命令或执行器映射 |
| `when` | 否 | Guard 字符串或 Guard 映射 |
| `session` | 否 | 会话复用策略 |
| `limits` | 否 | 超时和最大尝试次数 |
| `permissions` | 否 | 网络和秘密句柄 |
| `effect` | 否 | 外部动作的幂等与回读策略 |

## 策略字段

```yaml
rules:
  - id: controlled_step
    in: [input]
    out: [output]
    when: "test -s in/input"
    session:
      policy: once
      scope: attempt
    limits:
      timeout: 120
      max_attempts: 2
    permissions:
      network: none
      secrets: [REPORT_TOKEN]
    run:
      using: shell
      command: "cp in/input out/output"
    effect:
      idempotency: "report-release-v1"
      readback: "check remote state"
      delivery: "at-most-once"
```

### `limits`

- `timeout`：单次 Rule 执行的秒数。
- `max_attempts`：该 Rule 允许的最大尝试次数。

### `permissions`

- `network: none`：不声明网络访问；也可以填写允许的网络目标列表。
- `secrets`：声明需要注入的秘密句柄名称。值由运行环境提供，不能写入 YAML。

### `effect`

- `idempotency`：外部动作的稳定幂等键。
- `readback`：用于确认外部系统状态的回读说明或命令。
- `delivery`：描述交付语义，例如 `at-most-once`。

## 一个完整示例

```yaml
version: 1
project:
  name: controlled-report
  default_targets: [report]

slots:
  request: { kind: file, path: request.txt }
  report: { kind: file, path: report.md }
  approval: { kind: file, path: approval.json }

rules:
  - id: write_report
    in: [request]
    out: [report]
    limits: { timeout: 60, max_attempts: 2 }
    permissions: { network: none, secrets: [] }
    run: "cp in/request out/report"

  - id: approve_report
    in: [report]
    out: [approval]
    run: { using: human, command: "Approve this report" }
```

保存后运行：

```bash
hg check --strict
hg plan report
```
