# CLI 与运行

本页保留日常使用需要的命令。以本机 `hg <COMMAND> --help` 为最终参数来源。

## 建图与检查

```bash
hg init --project .
hg check --strict --project .
hg graph --project .
hg plan <TARGET> --project .
```

## 导入、运行与物化

```bash
hg put <SLOT> <PATH> --project .
hg run <TARGET> --jobs 4 --project .
hg materialize <SLOT> --project .
hg status --project .
```

`put` 创建输入 Revision。`run` 让目标收敛。`materialize` 把某个 Revision 投影到工作区。`status` 查看当前事实。

## 人工决定

```bash
hg human pending --project . --output json
hg human decide --activation <KEY> --decision approve --project .
```

先取得当前 Activation key，再提交决定。不要保存旧 key 反复使用，因为新的输入前沿会产生新的 Activation。

## 诊断顺序

运行停住时，先执行 `check` 排除定义错误，再用 `plan` 查看目标缺失的上游。随后查看 `status`、pending Human Activation 与失败 Attempt。循环没有继续时，重点检查反馈 Slot 是否提交了新 Revision，以及 `when` 是否仍然成立。

需要恢复时保留项目的 `.hg` 状态目录。Receipt、Attempt 与 Revision 是诊断证据，清空它们会同时清空恢复上下文。
