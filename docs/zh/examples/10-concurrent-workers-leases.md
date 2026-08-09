<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/10-concurrent-workers-leases/">English</a></div>

# 10 · 并发与租约

两个 Worker 可以同时发现同一个目标，但提交需要经过租约与 fencing 保护，避免旧结果覆盖新结果。

## 运行

```bash
hg put request request.txt --project .
hg run report --project . &
hg run report --project . &
wait
hg log --project . --output json
```

## 观察什么

通常只有一个 Worker 会获得当前执行所有权并提交新的 Head；另一个 Worker 会等待、退出或观察到已有有效 Receipt。两次运行不会因为竞态产生两个互相覆盖的权威 Head。

## 设计要点

并发控制保护的是“谁可以提交”，不是“谁先开始执行”。因此执行器可以做重复工作，但只有通过当前 fencing 检查的结果才能成为权威版本。

[返回案例库](index.md) · [下一个：守护进程与观察](11-daemon-watch.md)
