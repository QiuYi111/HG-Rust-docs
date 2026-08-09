# HarnessGraph Kernel documentation

This repository contains the official documentation website for HarnessGraph
Kernel (HG-Rust). It is built with MkDocs Material and published with GitHub
Pages.

Website: <https://qiyi111.github.io/HG-Rust-docs/>

## Local preview

```bash
python3 -m pip install -r requirements-docs.txt
mkdocs serve
```

Run the same strict build used by continuous integration before publishing:

```bash
mkdocs build --strict --site-dir site
```

The site contains Chinese and English editions. Start with either language on
the home page, then follow the Quick Start or the case library.
