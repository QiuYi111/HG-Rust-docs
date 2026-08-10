# 番茄钟

做完这一页，你会看懂一条完整的自改进循环。Coder 改候选，Critic 写回意见，新的意见让 Coder 再运行。Critic 接受后，人工批准当前 Revision，最后得到 `approved` Git 工件。

运行真实案例需要 `hg`、Git、`jq` 和可用的 Codex 执行器。

<div class="hg-diagram">
  <img src="../../../assets/diagrams/pomodoro.zh.svg" alt="番茄钟自改进循环">
</div>

## 完整图定义

下面就是案例使用的完整配置。它已经放进公开文档，可以直接阅读和复制，也可以[下载原始 YAML](../../includes/pomodoro.yaml)。

<div class="hg-yaml" markdown>

```yaml
--8<-- "includes/pomodoro.yaml"
```

</div>

## Slot 怎样分工

| Slot | 类型 | 在图里的作用 |
|---|---|---|
| `brief` | file | 用户给出的修改要求。brief 改动后，旧评审会因 checksum 不匹配而失效。 |
| `candidate` | git | 正在修改的番茄钟仓库。Coder 读取当前 Revision，也把新提交写回这里。 |
| `critique` | file | Critic 写出的结构化反馈，保存决定、检查结果、候选 commit、brief checksum 和轮次。 |
| `approval` | file | Human Rule 对某个确切输入前沿作出的决定。 |
| `approved` | git | 通过评审与人工批准后复制出的最终 Git 工件。 |


`candidate` 和 `critique` 都同时出现在 Rule 的输入与输出关系中。它们的 Revision 交替变化，循环因此自然形成。

## Rule 逐条看

| Rule | 读取 | 写入 | 什么时候运行 |
|---|---|---|---|
| `coder` | brief、candidate、critique | candidate | 评审要求 revise，或评审记录的 brief checksum 已经过期。它克隆候选、完成最小修改、验证并提交一次 Git commit。 |
| `critique` | brief、candidate、critique | critique | 候选 commit 或 brief checksum 与旧评审不一致。它检查候选并写出 revise 或 accept。 |
| `request_approval` | brief、candidate、critique | approval | Critic 已接受，并且评审记录仍精确对应当前候选与 brief。 |
| `package_approved` | brief、candidate、critique、approval | approved | 评审仍有效，人工决定为 approve。它把候选克隆到最终 Slot。 |


图里没有 Loop 节点。第一次 `critique` 写出 revise 后，`coder` 的输入前沿改变。Coder 写出新 `candidate` 后，`critique` 的输入前沿又改变。Critic 写出 accept 时，Coder 的 `when` 变成 false，这个循环便停下来。

## 先验证调度语义

在案例工作区根目录运行确定性测试。

```bash
cargo test -p hg-cli --test m18_pomodoro_loop -- --nocapture
```

测试会在两种并发容量下得到同一条因果顺序。

```text
coder → critique → coder → critique
```

这一步不调用 Agent。它验证反馈 Revision 会触发下一轮，接受条件会停止循环，并发容量不会改变依赖语义。

## 跑真实案例

初始化并导入案例要求的输入后，运行默认目标。到达 Human Rule 时，先取得当前 Activation，再提交决定。

```bash
hg run approved --jobs 2 --project .
hg human pending --project . --output json
hg human decide --activation <CURRENT_KEY> --decision approve --project .
hg run approved --jobs 2 --project .
hg materialize approved --project .
```

人工决定绑定到当时的输入 Revision。批准以后若 `candidate` 又发生变化，旧决定不会覆盖新候选。
