<div class="language-switch"><strong>中文</strong> · <a href="../../en/operations/">English</a></div>

# 运行、恢复与审计

本页把日常操作按“发现问题 → 判断原因 → 采取动作 → 验证结果”组织。

## 先观察，再改变

```bash
hg status --output json
hg explain report --output json
hg events --limit 50 --output json
hg artifact history report --output json
```

这组命令是只读的，适合在自动化诊断或人工排查开始时使用。

## 工作区漂移

当物化文件被删除或修改时：

```bash
hg drift report
hg materialize report
```

`drift` 说明工作区与当前 Head 的差异；`materialize` 以 Head 为准恢复文件。它不会凭空创建新的业务 Revision。

## 失败与重试

```bash
hg log --output json
hg retry report
hg resume <RUN_ID>
```

如果上游结果已经有有效 Receipt，重试下游时可以复用已提交工作。若需要强制重新执行，先使对应 Receipt 失效：

```bash
hg invalidate report --reason "input policy changed"
hg run report
```

失效是一个追加事件，不会删除历史 Revision。

## 会话与长任务

```bash
hg session list
hg session show <SESSION_ID>
hg session checkpoint <SESSION_ID>
hg session close <SESSION_ID>
```

Session 是否支持 checkpoint 和连续执行取决于执行器。对于可恢复执行，保留 Session、Attempt 和 Event 的关联，可以减少“从哪里继续”的猜测。

## 人工审批与外部效果

<div class="diagram">
  <img src="../../assets/human-effect.svg" alt="提案、人工决定、外部效果和回读证明的关系" />
</div>

推荐顺序：

1. 生成提案 Artifact。
2. 用 Human Rule 记录决定。
3. 只有批准后才执行 Effect。
4. 使用幂等键和 readback 验证外部状态。

```bash
hg effect verify <EFFECT_KEY>
```

## 维护命令

```bash
hg doctor
hg repair
hg gc --dry-run
hg migrate --check
```

`gc`、`repair` 和 `migrate` 可能改变本地状态。先使用 `--dry-run` 或 `--check`，确认目标后再执行写入操作。

## 事件与解释是一等结果

当运行结果需要交接给另一位使用者或自动化系统时，优先保存 `status --output json`、相关 Event 和 Receipt 标识。单独保存终端文本无法保留完整状态。
