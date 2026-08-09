<div class="language-switch"><a href="../../../zh/examples/10-concurrent-workers-leases/">中文</a> · <strong>English</strong></div>

# 10 · Concurrency and leases

Two Workers may discover the same target concurrently, but lease ownership and fencing protect the commit so an old result cannot overwrite a newer one.

## Run it

```bash
hg put request request.txt --project .
hg run report --project . &
hg run report --project . &
wait
hg log --project . --output json
```

Usually one Worker owns the current execution lease and commits the new Head; the other waits, exits, or observes an effective Receipt. The race cannot create two competing authoritative Heads.

The lease protects who may commit, not who starts first. An executor may do duplicate work, but only a fenced result can become authoritative.

[Back to the case library](index.md) · [Next: Daemon and watch](11-daemon-watch.md)
