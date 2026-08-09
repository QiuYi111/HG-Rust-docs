<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/08-guards-conditional-flow/">English</a></div>

# 08 · 条件守卫

Guard 让 Rule 是否执行成为配置中的可观察条件。退出码为 0 表示 TRUE，普通非零退出表示 FALSE，命令不存在或超时表示 ERROR。

## 配置重点

```yaml
rules:
  - id: answer_when_enabled
    in: [request, mode]
    out: [answer]
    when: "test \"$(cat in/mode)\" = enabled"
    run: "printf 'Enabled.\\n' > out/answer"
```

## 运行

```bash
printf 'disabled\n' > mode.txt
hg put mode mode.txt --project .
hg run answer --project .

printf 'enabled\n' > mode.txt
hg put mode mode.txt --project .
hg run answer --project .
```

## 观察什么

`disabled` 时 Rule 被抑制，不应被误报为执行失败；`enabled` 后，输入 Revision 变化会使 Rule 再次进入计划。可以用 `hg explain answer` 查看 Guard 状态。

[返回案例库](index.md) · [下一个：审计与解释](09-audit-and-explain.md)
