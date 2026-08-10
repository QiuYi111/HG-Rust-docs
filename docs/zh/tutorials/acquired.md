# Acquired

这个案例从经过批准的公司主题出发，搜集真实资料，形成三幕播客脚本，再生成主持人与嘉宾的 Audio Director 清单。

<div class="hg-diagram">
  <img src="../../../assets/diagrams/acquired.zh.svg" alt="Acquired 研究与制作图">
</div>

## 第一步，批准研究主题

`choose_topic` 是 Human Rule。它把研究范围固定为一个 Topic Revision，六条研究 Rule 都读取它。

## 第二步，并行搜集资料

起源、商业模式、产品、竞争、领导层与关键转折六条 Agent Rule 可以并行运行。每份研究 Artifact 都要记录来源 URL、标题、获取时间与证据。图里没有预录研究结论。

补充研究单独读取竞争资料与 `gate_request`。`review_research` 检查每路资料与补充结果，再允许制作会议开始。

## 第三步，汇合成节目

制作会议把已接受的资料组织成三幕。三条写作 Rule 分别生成一幕，`assemble_episode` 汇合它们。QA 接受后，主持人与嘉宾清单可以并行生成。

## 运行

先跑合约路径，它保留相同 Slot、Rule、Receipt、门和 schema。

```bash
scripts/test-real-world-cases.sh acquired-podcast contract
```

需要验证真实搜集资料时再运行 live。

```bash
scripts/test-real-world-cases.sh acquired-podcast live
```

live 会访问每条 Rule 声明允许的域名，需要可用的 Codex 凭据与网络。每份研究至少要有两个来源，否则门不会通过。配置与锁定信息见案例 [`README`](https://github.com/QiuYi111/HG-Rust/tree/main/examples/04-acquired-podcast) 和 [`case.lock.yaml`](https://github.com/QiuYi111/HG-Rust/blob/main/examples/04-acquired-podcast/case.lock.yaml)。
