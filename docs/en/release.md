# Release notes

This site follows the HG-Rust `main` branch and describes the current kernel and first-class cases. Before a release, check the binary version, repository tag, and case lock files together.

## Current documentation baseline

- Authors work with Slot and Rule
- Parallel work, joins, conditions, and loops derive from reads and writes
- Shell, Agent, and Human execution share the Executor ABI
- Quick Start runs without an agent account
- First-class cases are Pomodoro, Learning Helper, Grill, Acquired, Harness Lifecycle, and CAD Release
- Chinese and English use matching navigation and diagrams

## Release checks

```bash
mkdocs build --strict --site-dir site
npm ci
npm run diagrams
```

Run Quick Start and all contract cases from a clean HG-Rust checkout as well. When a command, Slot name, or Rule name changes, update the Chinese and English pages in the same commit.
