<div class="language-switch"><strong>中文</strong> · <a href="../../../en/examples/08-guards-conditional-flow/">English</a></div>

# 08 · 条件守卫

这个案例把 Guard 的三种结果放进同一条 Rule。`mode=disabled` 让 Activation 进入 `SUPPRESSED`，`mode=error` 产生 `ERROR`，`mode=enabled` 才会执行 Agent Rule。

## 配置重点

```yaml
version: 1

slots:
  request: { kind: file, path: request.txt }
  mode: { kind: file, path: mode.txt }
  answer: { kind: file, path: answer.md }

rules:
  - id: conditional_answer
    in: [request, mode]
    out: [answer]
    when: >-
      case "$(cat $HG_IN/mode)" in
        enabled) exit 0 ;;
        disabled) exit 1 ;;
        error) exec hg-example-missing-guard-command ;;
        *) exit 1 ;;
      esac
    run:
      using: codex
      model: gpt-5.6-luna
      reasoning_effort: none
      command: >-
        Use shell commands only, never apply_patch. You must execute exactly this command and do nothing else:
        printf 'The TRUE guard enabled this Luna activation.\n' > out/answer
```

Guard 在声明输入的只读目录中执行。退出码 0 表示 `TRUE`，普通非零退出表示 `FALSE`，命令缺失或超时表示 `ERROR`。

## 运行

```bash
hg put request request.txt --project .

printf 'disabled\n' > mode.txt
hg put mode mode.txt --project .
hg run answer --project .

printf 'error\n' > mode.txt
hg put mode mode.txt --project .
hg run answer --project .

printf 'enabled\n' > mode.txt
hg put mode mode.txt --project .
hg run answer --project .
```

## 观察什么

- `disabled` 产生 `SUPPRESSED`，不会创建执行 Attempt。
- `error` 进入 Guard 错误，错误原因不会被压成 `FALSE`。
- `enabled` 让当前输入向量满足调度条件，Agent Rule 才会执行。
- 每次 `mode` Revision 变化都会重新计算 Guard。用 `hg explain answer` 查看具体输入和 Guard 结果。

[返回案例库](index.md) · [下一个 · 审计与解释](09-audit-and-explain.md)
