# Grill

Grill 把一段多轮人机讨论放进普通 Shell Rule。HG 等待会话结束，检查声明输出，再把产品契约和路线图一起提交。

<div class="hg-diagram">
  <img src="../../../assets/diagrams/grill.zh.svg" alt="Grill 多轮人机交互图">
</div>

## 图的关键

`product_grill` 读取 `goal` 与 `grill_driver`，一次写出 `product_contract` 和 `roadmap`。多轮对话发生在执行器内部，图仍然只有一条 Rule。

这条边界很重要。HG 负责输入与输出的原子提交，会话脚本负责终端体验和 `/exit` 协议。

## 先跑 mock

```bash
cargo build -p hg-cli --bin hg
export PATH="$PWD/target/debug:$PATH"
cd examples/03-interactive-grill
hg init --project .
hg put goal goal.md --project .
hg put grill_driver scripts/grill_session.py --project .
HG_GRILL_MODE=mock hg run roadmap --project .
hg materialize product_contract --project .
hg materialize roadmap --project .
```

完成后，`artifacts/product.json` 与 `artifacts/roadmap.json` 应同时存在。这条路径验证 Rule、输出校验与原子提交，不会打开终端窗口。

## 再跑真实会话

真实模式目前需要 macOS、iTerm2 和已登录的 `codex` CLI。去掉 `HG_GRILL_MODE=mock` 后执行 `hg run roadmap --project .`。新窗口打开后可以连续讨论，直到 Agent 写好两个输出。输入 `/exit` 后，父 Attempt 才会继续提交。

当前限制与会话恢复边界记录在案例目录的 `README.md`。
