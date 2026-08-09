<div class="language-switch"><strong>中文</strong> · <a href="../../en/cases/harness-lifecycle/">English</a></div>

# Harness Lifecycle，把一次工程治理流程做成可检查的交接证据

你有一个产品想法，想把从澄清问题到交接记录的工程治理流程跑通。这个案例生成产品问题、两道响应门、规格、计划、任务、角色检查、Agent 报告和最终 Git 证据包。当前示范输入里的 OpenCode 只写固定报告，没有修改示例项目，也没有实际运行项目测试，所以本页验证的是流程门控、证据留存和 Git 交接，不是完整的软件实现。

完整案例在 [HG-Rust 的 Harness Lifecycle 目录](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/harness-lifecycle)。

<div class="diagram">
  <img src="../../assets/case-harness.svg" alt="产品想法经过澄清、风险确认、规格计划任务、受限执行和检查后提交为 Git 项目" />
</div>

## 第一步，从产品想法开始，不急着写代码

把产品简介和一个小项目放进流程。第一步让 Agent 提出两个问题。最小功能是什么，什么证据能证明它完成了。

```yaml
slots:
  project_fixture: { kind: dir, path: fixtures/project }
  product_brief: { kind: file, path: product-brief.md }
  questions: { kind: file, path: lifecycle/questions.md }

rules:
  - id: grill_product
    in: [project_fixture, product_brief]
    out: [questions]
    run:
      using: codex
      model: gpt-5.6-luna
      command: "Write the two product questions to out/questions"
```

这里 HG 的作用很简单。问题文件是下一步人工回答的输入，后续内容不会绕过它直接开始。

## 第二步，风险高的事情要有明确批准

案例运行器会通过人工决定步骤（Human Rule）自动提交固定的产品定义和核心批准文件。流程会根据示范输入写出可行性判断。如果风险属于核心部分，还需要第二道门。这里验证的是决定和版本的关系，不评价真人审批质量。

```yaml
rules:
  - id: define_product
    in: [questions, human_responses]
    out: [product_definition]
    run: { using: human, command: "Provide the exact product definition JSON" }

  - id: approve_core
    in: [feasibility, human_responses]
    out: [core_approval]
    run: { using: human, command: "Approve or reject the core-risk demonstration" }
```

如果产品问题在两次决定之间发生变化，旧回答不会解锁新流程。HG 把每次决定和它回答的那一版问题绑在一起，避免“看过旧版本就算批准新版本”。

## 第三步，把规格、计划和任务写出来

批准后，流程才会生成规格、计划和任务。这个案例的最小行为是 `increment(1) == 2`，任务里同时写清允许改的文件、不能改的文件和验收命令。

```yaml
rules:
  - id: write_spec
    in: [product_definition, core_approval]
    out: [spec]
    run: "write the accepted behavior to out/spec"

  - id: write_tasks
    in: [product_definition, feasibility, core_approval]
    out: [tasks]
    run: "write RED, GREEN, verification, and report tasks to out/tasks"
```

这里会自然遇到一个权限问题。TDD-RED 只能写测试，不能改 `src/`。案例故意提交一次越权请求，HG 必须拒绝它。

## 第四步，让两个 Agent 各做自己的一小段

协调 Agent（Supervisor）只发出一项明确任务。当前示范中的 OpenCode 执行 Agent 通过真实进程边界写回固定报告，不修改 `src/lib.rs`，也不运行 `cargo test`。

```yaml
rules:
  - id: supervisor_iteration
    in: [spec, plan, tasks, role_check]
    out: [next_task]
    run:
      using: codex
      model: gpt-5.6-luna
      command: "Write one bounded implementation task with allowed files and acceptance"

  - id: opencode_worker
    in: [project_fixture, next_task, role_check]
    out: [worker_report]
    run: "run the worker inside the permitted project boundary"
```

HG 在这里记录的是案例定义的角色检查、Agent 进程边界和报告文件。这个角色检查是本案例里的 Rule，不是 HG 对所有项目自动提供的通用权限系统。

## 第五步，检查证据并交接 Git 证据包

评估和审查通过后，流程把示范输入和证据文件提交为 Git 结果。它证明结果可以交接和追溯，不代表示例项目已经完成一次真实功能开发。

```bash
scripts/test-real-world-cases.sh harness-lifecycle contract
scripts/test-real-world-cases.sh harness-lifecycle live
RUN_ROOT=/path/to/your/retained/run
hg materialize final_repo --project "$RUN_ROOT"
hg artifact history final_repo --project "$RUN_ROOT"
```

Git 结果必须有提交且工作区干净。没有提交或仍有未保存改动时，HG 不会把它伪装成一个可交接的版本。

## 这一步为什么复杂

这里同时存在产品判断、风险批准、角色边界、两个 Agent、报告和 Git 交接。普通脚本很容易把这些步骤揉成一次“跑完了”的状态。HG 让每个决定和每个证据文件都有自己的位置，所以你能看清哪一步批准了什么，哪一步留下了什么。

## 我们实际跑过什么

2026-08-09 的五次成功 live 运行都完成了产品质询、过期回答拒绝、核心风险批准、案例角色检查拒绝、Luna Supervisor、OpenCode 报告边界和最终 Git 提交。耗时为 75.849、62.541、88.272、55.498、58.801 秒。每次基准路径都有 14 次实际工作和一个 Git 证据包提交。它们没有验证代码实现质量或项目测试结果。

这些数据说明流程可以运行和交接，不代表任何组织都可以跳过自己的审批制度。正式性能和成本预算还没有锁定。

## 你可以从哪里改起

先改 `fixtures/human-responses.json` 里的越权路径，观察固定的角色检查如何拒绝不符合约定的请求。这个示范没有“放行另一种路径”的分支；要测试新的工程行为，需要另写 Rule 和测试。
