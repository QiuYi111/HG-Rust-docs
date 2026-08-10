# 发布说明

本文档跟随 HG-Rust `main` 分支维护，描述当前内核与一等案例。发布前请同时检查二进制版本、仓库 tag 和案例锁定文件。

## 当前文档基线

- 作者模型只使用 Slot 与 Rule
- 并行、汇合、条件与循环由读写关系派生
- Shell、Agent 与 Human 共享 Executor ABI
- Quick Start 可在没有 Agent 账号时运行
- 一等案例顺序为番茄钟、Learning Helper、Grill、Acquired、Harness Lifecycle 与 CAD Release
- 中文与英文使用同一导航和同一组图

## 发布检查

```bash
mkdocs build --strict --site-dir site
npm ci
npm run diagrams
```

还应从干净的 HG-Rust checkout 运行 Quick Start 与所有 contract 案例。文档命令、Slot 名称或 Rule 名称发生变化时，中英文页面要在同一次提交中更新。
