<div class="language-switch"><a href="../../../zh/examples/11-daemon-watch/">中文</a> · <strong>English</strong></div>

# 11 · Daemon and watch

Long-running or externally triggered work can use the daemon commands. Use `--watch` when a live event projection is useful.

## Run it

```bash
hg run report --daemon --project .
hg daemon status --pidfile .hg/daemon.pid
hg run report --watch --project . --output json
hg events --follow --project .
hg daemon stop --pidfile .hg/daemon.pid
```

The daemon is only another execution projection; it uses the same Slot, Revision, Receipt, and Event semantics. `--watch` is useful in a terminal, while JSON/JSONL is useful for another consumer.

[Back to the case library](index.md) · [Next: Constrained agent task](12-secure-agent-task.md)
