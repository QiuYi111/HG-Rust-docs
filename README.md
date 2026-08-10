# HarnessGraph documentation

This repository builds the bilingual HarnessGraph documentation website with MkDocs Material. The published site uses one warm, light color scheme derived from the project banner.

## Preview locally

```bash
python3 -m pip install -r requirements-docs.txt
mkdocs serve
```

## Validate the site

```bash
mkdocs build --strict --site-dir site
npm ci
npm run diagrams
```

The source repository and runnable examples live at <https://github.com/QiuYi111/HG-Rust>.
