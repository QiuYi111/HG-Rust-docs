# 安装

需要 Node.js 18 或更高版本。运行一条命令即可：

```bash
npm install --global harnessgraph
```

npm 会自动安装适合当前电脑的版本，不需要手动选择平台包。当前支持 Apple Silicon Mac、Intel Mac 和 Windows x64。

安装后检查命令：

```bash
hg --version
```

升级同样只需一条命令：

```bash
npm install --global harnessgraph@latest
```

如果安装成功但终端找不到 `hg`，关闭并重新打开终端后再试。仍然失败时，运行 `npm prefix --global`，确认 npm 的全局命令目录已经加入 `PATH`。
