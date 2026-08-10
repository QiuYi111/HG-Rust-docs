# Acquired

这张图从经过批准的公司主题出发，在线搜集带来源的资料，形成三幕播客脚本，再生成主持人与嘉宾的 Audio Director 清单。

合约路径使用固定材料。真实路径需要可用的 Codex 凭据与网络，并会访问研究 Rule 允许的站点。

<div class="hg-diagram">
  <img src="../../../assets/diagrams/acquired.zh.svg" alt="Acquired 研究与制作图">
</div>

## 完整图定义

下面是实际运行的完整配置，共有六路并行研究、一道证据门、三幕并行写作和两路音频清单输出。你也可以[下载原始 YAML](../../includes/acquired.yaml)。

<div class="hg-yaml" markdown>

```yaml
--8<-- "includes/acquired.yaml"
```

</div>

## Slot 怎样分工

| Slot | 阶段 | 在图里的作用 |
|---|---|---|
| `topic_prompt` | 输入 | 等待用户确认的公司主题。 |
| `gate_request` | 输入 | 证据门要求补充调查的具体问题。 |
| `topic` | 定界 | Human Rule 批准后的研究主题 Revision。 |
| `origins` | 研究 | 创立与早期历史的来源化资料。 |
| `business_model` | 研究 | 收入、资本分配与经营分部资料。 |
| `product` | 研究 | 产品、服务与客户价值资料。 |
| `competition` | 研究 | 竞争格局与防御能力资料。 |
| `leadership` | 研究 | 管理层、治理与继任资料。 |
| `inflections` | 研究 | 带日期和后果的战略转折资料。 |
| `supplement` | 研究 | 针对 gate_request 完成的补充竞争研究。 |
| `research_gate` | 验收 | 检查六份研究与补充材料后写出的决定。 |
| `meeting` | 制作 | 经过证据门后形成的三幕制作提纲。 |
| `act_one` | 写作 | 起源与商业模式对应的第一幕。 |
| `act_two` | 写作 | 产品与竞争对应的第二幕。 |
| `act_three` | 写作 | 领导层与转折对应的第三幕。 |
| `draft_script` | 汇合 | 三幕直接合并的初稿。 |
| `script` | 修订 | 加入来源衔接修订后的节目稿。 |
| `qa` | 输入 | QA 的初始决定，允许 pending 或 revise 触发修订。 |
| `qa_result` | 验收 | 对来源 URL 与修订标记的机器检查结果。 |
| `audio_manifest_host` | 输出 | 主持人声音使用的 Audio Director 清单。 |
| `audio_manifest_guest` | 输出 | 嘉宾声音使用的 Audio Director 清单。 |


## Rule 逐条看

| Rule | 读取 | 写入 | 作用 |
|---|---|---|---|
| `choose_topic` | topic_prompt | topic | 让用户批准确切主题文件。 |
| `research_origins` | topic | origins | 搜集创立历史，每份结果至少保留两个来源。 |
| `research_business_model` | topic | business_model | 调查收入、资本分配和经营分部。 |
| `research_product` | topic | product | 调查主要产品、服务和客户价值。 |
| `research_competition` | topic | competition | 调查竞争格局，分开来源事实与分析。 |
| `research_leadership` | topic | leadership | 调查管理层历史、治理与继任。 |
| `research_inflections` | topic | inflections | 调查战略转折，每项保留日期与来源化后果。 |
| `supplement_competition` | topic、competition、gate_request | supplement | 根据门请求完成一次有边界的补充调查。 |
| `review_research` | 六份研究、supplement、gate_request | research_gate | 用 `jq` 检查来源数量、摘要与补充状态。 |
| `production_meeting` | topic、全部研究、research_gate | meeting | 门接受后，把资料组织成三幕制作提纲。 |
| `write_act_one` | meeting、origins、business_model | act_one | 写第一幕并保留来源 URL。 |
| `write_act_two` | meeting、product、competition | act_two | 写第二幕，建立中心战略冲突。 |
| `write_act_three` | meeting、leadership、inflections | act_three | 写第三幕，用来源化后果收束主题。 |
| `assemble_episode` | act_one、act_two、act_three | draft_script | 按顺序合并三幕。 |
| `revise_episode` | draft_script、qa | script | QA 为 pending 或 revise 时补上来源衔接修订。 |
| `qa_episode` | script、qa | qa_result | 检查脚本含来源 URL 和修订标记。 |
| `direct_host_audio` | script、qa_result | audio_manifest_host | QA 接受后生成主持人清单。 |
| `direct_guest_audio` | script、qa_result | audio_manifest_guest | QA 接受后生成嘉宾清单。 |


六条主题研究 Rule 只共享 `topic`，所以可以并行。三幕写作只共享 `meeting`，也可以并行。两份音频清单读取同一个已接受脚本，同样没有彼此依赖。

## 运行并观察

先跑合约路径。

```bash
scripts/test-real-world-cases.sh acquired-podcast contract
```

它保留相同的 Slot、Rule、门和 JSON schema，用固定输入检查调度与恢复。

准备好网络和 Codex 凭据后再跑真实研究。

```bash
scripts/test-real-world-cases.sh acquired-podcast live
```

运行后先查看六份 `research/*.json`。每份材料至少应有两个带 URL、标题、获取时间和 evidence 的来源。随后检查 `research-gate.json`、三幕脚本和两份 audio director 清单。
