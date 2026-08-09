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

Codex Executor 会保存真实 `thread.started` checkpoint，并在继续执行时使用
当前的 `codex exec resume` 合约。缺失或无效的 thread 会失败关闭，不会静默
创建一个看似继续、实为全新的会话。

checkpoint 由活跃执行器自动记录；当前 CLI 的 `session checkpoint` 在没有
可访问的 live resident session 时会返回 `TEMPORARILY_UNAVAILABLE`。

## 有界并发与进程停止

```bash
hg run report --jobs 3 --output json
```

`--jobs` 是最大并发容量；Runtime 会阻止 exclusive 输出 Slot 存在 writer
冲突的 Activation 进入同一批次，默认值仍为串行。Shell/Agent 进程的 stdout
与 stderr 被并发排空到有界、脱敏的尾部捕获。
取消或超时会终止 Unix process group，因此子进程不会在父进程退出后继续运行。

终止 Attempt 会立即释放带 fencing 的 lease。恢复逻辑只修复已终止 GraphRun
拥有的孤儿 Attempt，不会把仍在运行的其他 worker 误判为孤儿。
当前 `hg resume` 创建的子 GraphRun 使用 `max_concurrency: 1`，不会自动继承
原运行的 `--jobs N`。

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

较长的人工响应可以用 `human decide --from <FILE>` 作为精确文件 Revision
提交。决定绑定 Activation；输入变化后，旧响应不能解锁新工作。

## Git 结果与受限网络

Git 类型输出必须是有 HEAD 的干净工作树。HG 在提交 locator 前保存 commit
镜像，因此结果能被物化和缓存，而不是只指向易失的临时目录。

当前显式网络策略由 macOS `sandbox-exec` 强制并 fail-closed。allow 模式仅通过精确主机过滤代理提供网络；
直接出口、重定向到未允许主机和解析到私网地址都被拒绝。没有可用的强制机制时，
执行器会在启动子进程前失败。

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
