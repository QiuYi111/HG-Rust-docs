# Installation

You need Node.js 18 or newer. Install HarnessGraph with one command:

```bash
npm install --global harnessgraph
```

npm selects the correct build automatically. You do not need to choose a platform package. Apple Silicon Mac, Intel Mac, and Windows x64 are currently supported.

Check the installation:

```bash
hg --version
```

Upgrading is also one command:

```bash
npm install --global harnessgraph@latest
```

If installation succeeds but the terminal cannot find `hg`, close and reopen the terminal. If it is still missing, run `npm prefix --global` and make sure npm's global command directory is on `PATH`.
