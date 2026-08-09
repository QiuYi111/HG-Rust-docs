<div class="language-switch"><strong>中文</strong> · <a href="../../en/cases/acquired-podcast/">English</a></div>

# Acquired Podcast，从一个主题做到一套结构化播客制作包

你要演示一期公司故事播客的制作流程。案例会生成带来源字段的研究文件、三幕脚本和两份机器可读制作单。研究材料使用固定记录和同一个公开首页，脚本和制作会议也是固定的短文本，所以它验证的是流程连接、网络边界和恢复行为，不等同于一次深度事实研究或可直接播出的节目。

完整案例在 [HG-Rust 的 Acquired Podcast 目录](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/acquired-podcast)。

<div class="diagram">
  <img src="../../assets/case-acquired.svg" alt="播客主题经过人工确认、六路受限研究、补充研究、三幕脚本和 QA 后生成两份制作单" />
</div>

## 第一步，先确认这一期到底讲什么

节目主题通常会在写作过程中变形。案例运行器通过 Human Rule 提交固定主题文件，验证研究只读取已经确认的主题版本。这一步验证门控和版本关系，不评价真人编辑的判断质量。

```yaml
slots:
  topic_prompt: { kind: file, path: fixtures/topic.md }
  topic: { kind: file, path: topic.md }

rules:
  - id: choose_topic
    in: [topic_prompt]
    out: [topic]
    run: { using: human, command: "Approve the exact company topic file" }
```

这样做的好处很直接。研究结果会带着主题版本走，主题改了以后，旧研究不会被当成新主题的答案。

## 第二步，把研究问题拆开，并限制网络

“研究这家公司”太宽。案例把它拆成起源、商业模式、产品、竞争、领导层和转折点六个问题。每个问题生成一份带来源网址的研究文件。

```yaml
slots:
  origins: { kind: file, path: research/origins.json }
  business_model: { kind: file, path: research/business-model.json }
  product: { kind: file, path: research/product.json }
  competition: { kind: file, path: research/competition.json }

rules:
  - id: research_origins
    in: [topic, recorded_research]
    out: [origins]
    permissions: { network: [www.berkshirehathaway.com] }
    run: "fetch the allowed source and write out/origins" # 讲解用缩写，完整命令见案例目录
```

六个方向可以同时做，但同时做多少要有上限。

```bash
scripts/test-real-world-cases.sh acquired-podcast contract

# 条件允许时，再运行真实外部工具版本
scripts/test-real-world-cases.sh acquired-podcast live
```

运行器用 `--jobs 3` 作为并发上限。网络策略只允许案例锁定的主机，直接访问其他主机、重定向到其他主机或解析到私网地址都会被拒绝。这里 HG 解决的是两个现实问题。研究可以快一点，研究边界也不会因为某个脚本写错而放大。

## 第三步，研究完成不等于可以写稿

研究门会先看六份文件是否齐全。这个案例固定安排一次竞争信息补充，演示资料补齐后才能进入制作。它不是动态编辑对话的质量评估。

```yaml
rules:
  - id: review_research
    in: [origins, business_model, product, competition,
         leadership, inflections, supplement, gate_request]
    out: [research_gate]
    run: "accept only after the requested supplement is complete"
```

研究门的回答也是文件。它把“还要补什么”和“现在可以进入制作”分开，避免制作步骤靠一句模糊的备注继续往下跑。

## 第四步，把来源带进制作会议和三幕结构

研究通过后，Luna 制作步骤只读取已经接受的研究文件，然后写出制作会议记录。接下来三幕分别使用不同的研究输入。

```yaml
rules:
  - id: production_meeting
    in: [topic, origins, business_model, product, competition,
         leadership, inflections, research_gate]
    out: [meeting]
    run:
      using: codex
      model: gpt-5.6-luna
      command: "Write a production meeting that cites the accepted sources"

  - id: write_act_one
    in: [meeting, origins, business_model]
    out: [act_one]
    run: "write Act I"
```

这样拆的原因不是为了让配置看起来专业。三幕的事实来源不同，改动时需要知道哪一幕受影响。最终脚本还会生成主持人和嘉宾两份制作单，二者引用同一份脚本版本。

## 第五步，加入一次可重复的 QA

脚本先合成，再由一个确定性的 QA 步骤检查是否出现修订标记。通过后才会生成两份 Audio Director 制作清单。这个 QA 验证的是流程条件，不是编辑质量。

```bash
RUN_ROOT=/path/to/your/retained/run
hg materialize script --project "$RUN_ROOT"
hg materialize audio_manifest_host --project "$RUN_ROOT"
hg materialize audio_manifest_guest --project "$RUN_ROOT"
hg events --project "$RUN_ROOT" --output json
```

你会看到三幕脚本、修订轮次和两份制作单都能从同一条流程记录中找到。

## 第六步，取消一次，再恢复

案例运行器会在六个研究结果都已经提交、下游步骤仍在运行时执行取消，再创建一个恢复运行。恢复运行当前使用并发 1，它会复用取消前已经提交的六个版本。案例断言的是版本保持不变，不对网络下载次数作额外承诺。

```bash
RUN_ROOT=/path/to/your/retained/run
hg runs --project "$RUN_ROOT" --output json
```

五次 live 样本都验证了六份已完成研究文件保持不变。第一次运行的并发上限是 3，恢复运行的并发是 1，这是当前命令的明确行为。

## 这一步为什么复杂

复杂度来自事实来源、网络权限、并行任务、编辑补充、制作会议、脚本修订和取消恢复同时存在。任何一个环节写成全局状态，都会让下一次运行很难判断哪些东西仍然可信。HG 把来源、决定、脚本和制作单分开保存，每个文件都能追到它的输入。

## 我们实际跑过什么

2026-08-09 的五次成功 live 运行都完成了六个受限研究方向、一次固定补充步骤、Luna 进程边界、三幕固定文本和两份制作单。耗时为 60.484、45.056、54.680、51.280、69.804 秒。五次都验证了取消后恢复，并保留六份已提交研究版本。

这些是当前观察数据。正式时间、Token 和成本预算还没有锁定。

## 你可以从哪里改起

先把 `fixtures/gate-request.json` 的补充文字改掉，再运行 contract profile。然后把某一个研究规则的允许主机改掉，观察请求到达代理后如何被网络策略拒绝。
