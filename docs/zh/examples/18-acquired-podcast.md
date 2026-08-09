<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/18-acquired-podcast/">English</a></div>

# 18 · Acquired Podcast：受限研究到双人音频包

这个真实案例把一个经人工确认的公司主题变成可审计的三幕播客包。六个研究维度在 `--jobs 3` 下并行运行，研究门要求一次有针对性的竞争补充，Luna 制作会议绑定获准来源，随后生成三幕脚本、执行有界 QA/修订，并分别输出主持人与嘉宾的 Audio Director manifest。

完整配置与固定输入位于 [Acquired Podcast 案例目录](https://github.com/QiuYi111/HG-Rust/tree/main/examples/real-world/acquired-podcast)。

## 图与安全边界

```text
Human topic
   ↓
6 × allowlisted research ──(jobs=3)──→ research gate → targeted supplement
                                                   ↓
Luna production meeting → act 1 / act 2 / act 3 → QA/revision → host + guest manifests
```

网络不是 ambient capability。live profile 只允许锁文件声明的精确主机，通过本地过滤代理执行；直接出口、未声明主机、重定向绕过和私网解析都会失败关闭。来源 URL 必须进入研究 Artifact，凭证不会被物化。

## 运行与观察

```bash
scripts/test-real-world-cases.sh acquired-podcast contract
scripts/test-real-world-cases.sh acquired-podcast live
```

运行器会依次验证：

- Human topic 文件响应后图继续；
- 六个研究 Attempt 的最大重叠数恰为 3；
- 未变重跑保持 19 → 19 个 Attempt；
- 补充竞争研究后变为 22 个 Attempt；
- 取消后立即恢复，六个已完成研究 Head 字节不变；
- 三幕脚本和两个音频 manifest 满足 schema。

`--jobs 3` 是初始运行的并发上限；当前 `hg resume` 以并发 1 创建子运行。
该恢复断言证明的是已完成 Head 的复用，不表示恢复阶段继续保持三路并发。

## 对内核的压力

取消/恢复演练暴露了两个核心缺陷。并行错误路径曾把持久化的 `CANCELLED` 覆盖为 `FAILED`；终止的 Attempt 也曾把 lease 保留到过期，使即时恢复受阻。当前内核会保留取消终态，并在 Attempt 退出时立即释放带 fencing 的 lease。

执行器同时使用双管道并发读取和有界尾部捕获，超时或取消会终止 Unix process group，避免真实研究/Agent 子进程堵塞管道或遗留后代进程。

## 当前实测数据

五次成功 live 样本耗时为 60.484、45.056、54.680、51.280、69.804 秒，观测 p95 为 69.804 秒。五次都验证了 cancel/resume 复用。正式预算尚未锁定，provider cost=0 不等于真实成本为零。

## 适用边界

案例证明研究来源、人工决定、脚本和音频指令之间的追踪关系，不构成事实核查或出版许可。公开发布仍需编辑复核、版权判断和真实音频制作验收。

[返回案例库](index.md) · [查看受限代理基础案例](12-secure-agent-task.md)
