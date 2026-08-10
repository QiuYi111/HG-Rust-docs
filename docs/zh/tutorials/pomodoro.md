# 番茄钟

这是最小的完整自改进循环。Coder 修改一个番茄钟，Critic 检查结果并写回意见。Critic 接受后，Human Rule 才允许当前候选进入 `approved`。

<div class="hg-diagram">
  <img src="../../../assets/diagrams/pomodoro.zh.svg" alt="番茄钟自改进循环">
</div>

## 读图

`coder` 同时读取 `candidate` 与 `critique`，并写回新的 `candidate`。`critique` Rule 又读取新候选并写回评审。两个 Slot 的 Revision 交替变化，每次变化都会形成新的 Activation。

Critic 写出 `accept` 后，`coder` 的 `when` 不再成立。此时 `request_approval` 才具备运行条件。图中没有 Loop 节点。

## 先跑确定性合约

在 HG-Rust 仓库根目录执行。

```bash
cargo test -p hg-cli --test m18_pomodoro_loop -- --nocapture
```

测试会在两种并发容量下验证同一条顺序。

```text
coder → critique → coder → critique
```

通过后，你已经验证了反馈 Revision 会产生下一轮，接受条件会让循环停止，调度容量不会改变依赖语义。

## 查看真实配置

打开 [`examples/01-pomodoro/harness.yaml`](https://github.com/QiuYi111/HG-Rust/blob/main/examples/01-pomodoro/harness.yaml)，重点查看 `coder`、`critique` 和 `request_approval` 三条 Rule 的 `in`、`out` 与 `when`。

真实运行需要可用的 Codex 执行器、Git 和 `jq`。完整初始化命令位于案例的 [`README`](https://github.com/QiuYi111/HG-Rust/tree/main/examples/01-pomodoro)。运行到 Human Rule 后，用下面的命令取得当前 Activation，再提交决定。

```bash
hg human pending --project . --output json
hg human decide --activation <CURRENT_KEY> --decision approve --project .
hg run approved --jobs 2 --project .
hg materialize approved --project .
```

人工决定绑定到确切的输入前沿。候选在批准后发生变化时，旧批准不会自动覆盖新候选。
