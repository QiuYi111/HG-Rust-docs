# Quick Start

这次运行只使用 Shell Rule，不需要 Agent 账号。完成后你会看到一个输出 Revision，以及第二次运行对 Receipt 的复用。

## 准备

需要 Rust 工具链、Git 和一个类 Unix shell。

```bash
git clone https://github.com/QiuYi111/HG-Rust.git
cd HG-Rust
cargo build -p hg-cli --bin hg
export PATH="$PWD/target/debug:$PATH"
```

运行 `hg --help` 后应看到 `init`、`put`、`run`、`status` 与 `materialize` 等命令。

## 创建第一张图

仓库已经提供最小案例。先进入目录并初始化运行时状态。

```bash
cd examples/recipes/minimal-reconciliation
hg init --project .
```

案例中的 `harness.yaml` 只有两个 Slot 和一条 Rule。

```yaml
slots:
  request: { kind: file, path: request.txt }
  greeting: { kind: file, path: greeting.md }
rules:
  - id: greet
    in: [request]
    out: [greeting]
    run: "{ printf '# Hello\\n\\n'; cat in/request; } > out/greeting"
```

## 导入输入

`put` 把工作区文件提交为 `request` 的新 Revision。

```bash
hg put request request.txt --project .
hg status --project .
```

状态输出中应能看到 `request` 已有 Revision，而 `greeting` 仍待生成。

## 收敛目标

```bash
hg run greeting --project .
hg materialize greeting --project .
cat greeting.md
```

`run` 为当前输入前沿创建 Activation，执行 `greet`，再提交 `greeting` Revision。`materialize` 把它投影回声明的工作区路径。文件开头应为 `# Hello`。

## 观察复用

不改输入，再运行一次。

```bash
hg run greeting --project .
```

这次不需要重新执行 Shell。当前输入前沿已经拥有成功 Receipt，目标也已经是最新状态。

## 让下游重新变旧

修改 `request.txt` 后重新导入并运行。

```bash
printf 'Welcome to HarnessGraph.\n' > request.txt
hg put request request.txt --project .
hg run greeting --project .
hg materialize greeting --project .
```

新的 `request` Revision 形成新的 Activation，因此 `greet` 再执行一次。你刚刚完成了最小的状态收敛过程。

下一步推荐 [番茄钟教程](tutorials/pomodoro.md)。它沿用同一套语义，加入 Agent 评审反馈和人工批准。
