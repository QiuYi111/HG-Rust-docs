<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/11-daemon-watch/">English</a></div>

# 11 · 守护进程与观察

当运行时间较长或需要由其他进程触发时，可以使用守护进程命令；当需要实时查看进度时，可以使用 `--watch`。

## 运行

```bash
hg run report --daemon --project .
hg daemon status --pidfile .hg/daemon.pid
hg run report --watch --project . --output json
hg events --follow --project .
hg daemon stop --pidfile .hg/daemon.pid
```

## 观察什么

守护进程只是运行方式的投影，仍然使用同一套 Slot、Revision、Receipt 和 Event 语义。`--watch` 适合终端，JSON/JSONL 适合其他工具订阅。

[返回案例库](index.md) · [下一个：受限的代理任务](12-secure-agent-task.md)
