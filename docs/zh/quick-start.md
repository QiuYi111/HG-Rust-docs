<div class="language-switch"><strong>中文</strong> · <a href="../../en/quick-start/">English</a></div>

# Quick Start

本教程用一个输入文件生成一个问候文件，带你完成：定义图、导入输入、运行目标、物化结果，以及观察重复运行时的证据复用。

## 准备 `hg`

本教程假设 `hg` 已安装并且可以在终端中找到。先确认版本：

```bash
hg --version
```

如果命令不可用，请先安装与你的系统和发行包匹配的 HG-Rust CLI，再继续下面的步骤。

## 1. 创建项目

```bash
mkdir hg-quickstart
cd hg-quickstart
hg init --project .
```

用下面的配置替换项目中的 `harness.yaml`：

```yaml
version: 1
project:
  name: quickstart
  default_targets: [greeting]

slots:
  request: { kind: file, path: request.txt }
  greeting: { kind: file, path: greeting.md }

rules:
  - id: create_greeting
    in: [request]
    out: [greeting]
    run: "printf '# Hello\\n\\nWelcome to HarnessGraph.\\n' > out/greeting"
```

这段配置声明了两个 Slot 和一个 Rule：`request` 是输入，`greeting` 是期望结果，Rule 将输入转换为输出。

## 2. 导入输入并检查配置

```bash
printf 'A first reconciliation project.\n' > request.txt
hg put request request.txt --project .
hg check --project . --strict
```

`hg put` 会把输入记录为一个 Revision。`hg check` 会解析并检查图定义，不会执行 Rule。

## 3. 计划并运行

```bash
hg plan greeting --project .
hg run greeting --project .
hg materialize greeting --project .
```

运行完成后，`greeting.md` 是输出 Slot 的物化文件。更重要的是，内核同时保存了该输出的 Revision 和 Receipt。

## 4. 查看状态与解释

```bash
hg status --project .
hg explain greeting --project .
hg artifact history greeting --project .
```

`status` 适合回答“现在是否稳定”；`explain` 适合回答“为什么需要或不需要执行”；`artifact history` 展示该 Slot 的版本历史。

## 5. 观察复用

再次运行同一个目标：

```bash
hg run greeting --project .
```

输入 Revision 和 Rule 合约没有变化时，已有 Receipt 可以证明结果仍然有效，系统不需要重复执行同一工作。

## 下一步

- 想理解设计取舍：阅读[核心哲学](principles.md)。
- 想编写完整配置：阅读[配置参考](configuration-reference.md)。
- 想处理失败、审批、Agent 或并发：从[四个实操教程](cases/index.md)选择一个完整案例。

!!! note "输入与结果的边界"

    工作区文件可以被删除或手动修改。需要恢复时，使用 `hg drift` 检查差异，再使用 `hg materialize` 从当前 Head 恢复物化结果。
