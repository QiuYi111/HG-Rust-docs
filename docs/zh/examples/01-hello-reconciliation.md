<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/01-hello-reconciliation/">English</a></div>

# 01 · 最小协调

这是最小可运行图：导入一个请求，生成一个问候文件，再次运行时观察 Receipt 复用。

## 配置重点

```yaml
slots:
  request: { kind: file, path: request.txt }
  greeting: { kind: file, path: greeting.md }
rules:
  - id: greet
    in: [request]
    out: [greeting]
    run: "printf '# Hello\\n' > out/greeting"
```

## 运行

```bash
hg init --project .
hg put request request.txt --project .
hg run greeting --project .
hg materialize greeting --project .
hg run greeting --project .
```

## 观察什么

第一次运行创建新的 Revision 和 Receipt；第二次运行使用相同输入与 Rule 合约，不需要重复产生结果。用 `hg explain greeting` 可以看到这个判断。

[返回案例库](index.md) · [下一个：缓存、失效与修复](02-cache-invalidate-repair.md)
