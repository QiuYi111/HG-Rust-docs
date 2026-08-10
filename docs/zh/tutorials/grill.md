# Grill

Grill 把一段多轮人机讨论放进普通 Shell Rule。HG 等待终端会话结束，检查两个声明输出，再把产品契约和路线图原子提交。

真实会话当前需要 macOS、iTerm2 和已经登录的 `codex` CLI。mock 路径只需要 Python。

<div class="hg-diagram">
  <img src="../../../assets/diagrams/grill.zh.svg" alt="Grill 多轮人机交互图">
</div>

## 完整图定义

这是完整配置，也是六个一等案例里最小的一张图。你可以[下载原始 YAML](../../includes/grill.yaml)。

<div class="hg-yaml" markdown>

```yaml
--8<-- "includes/grill.yaml"
```

</div>

## Slot 怎样分工

| Slot | 类型 | 在图里的作用 |
|---|---|---|
| `goal` | file | 用户希望讨论并澄清的产品目标。 |
| `grill_driver` | file | 打开终端、维护多轮会话并落实退出协议的 Python 脚本。 |
| `product_contract` | file | 会话结束后得到的结构化产品契约。 |
| `roadmap` | file | 同一次会话写出的执行路线图，也是默认目标。 |


## Rule 逐条看

| Rule | 读取 | 写入 | 作用 |
|---|---|---|---|
| `product_grill` | goal、grill_driver | product_contract、roadmap | 调用会话驱动脚本。最长运行一小时，只允许一个 Attempt。两个输出都通过校验后才一起提交。 |


多轮对话留在执行器内部。图只关心输入是什么、成功后必须得到哪些工件。会话中途退出或只写出一个文件时，Attempt 不会提交半套结果。

## 先跑 mock

```bash
cd examples/03-interactive-grill
hg init --project .
hg put goal goal.md --project .
hg put grill_driver scripts/grill_session.py --project .
HG_GRILL_MODE=mock hg run roadmap --project .
hg materialize product_contract --project .
hg materialize roadmap --project .
```

完成后，`artifacts/product.json` 与 `artifacts/roadmap.json` 应同时存在。

## 再跑真实会话

去掉 `HG_GRILL_MODE=mock`，重新运行目标。

```bash
hg run roadmap --project .
```

iTerm2 会打开一个新窗口。你可以和 Agent 连续讨论，直到两个输出都写好。输入 `/exit` 后，父 Attempt 才继续校验并提交。
