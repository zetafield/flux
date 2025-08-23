# @zetafield/flux

Flux is a minimal static site generator powered by Vite and LiquidJS. It focuses on simple authoring with `.liquid`, `.md`, and `.html` files, clean URLs, and hashed assets for fast CDN delivery.

Features

- Liquid templates with includes and layouts
- Markdown with frontmatter via marked + gray-matter
- Global data from `src/_data/*.json` (available under `data.*`)
- Automatic collections (`collections.{folder}` and `collections.all`, newest first)
- Vite dev server and production asset build (CSS/JS hashing)
- Per-page CSS/JS via frontmatter arrays
- Clean URLs with global controls only (no per-page overrides)

Install

```
pnpm add -D @zetafield/flux
# or: npm i -D @zetafield/flux
```

Quick start

1. Project structure

```
src/
  index.liquid
  about.md
  assets/
    css/style.css
    js/main.js
    images/logo.png
  _layouts/
    layout.liquid
  _components/
    header.liquid
  _data/
    site.json
```

2. Scripts

```
{
  "scripts": {
    "dev": "flux dev",
    "build": "flux build",
    "preview": "flux preview"
  }
}
```

3. Run

```
pnpm dev
pnpm build
pnpm preview
```

Authoring

- Pages: any `.liquid`, `.md`, or `.html` under `src/`.
- Layouts: `src/_layouts/`, components: `src/_components/`.
- Frontmatter supports `layout` and any custom keys.
- Optional per-page assets via frontmatter arrays:

```
---
title: About
layout: layout
css:
  - /assets/css/docs.css
js:
  - /assets/js/main.js
---
```

In `src/_layouts/layout.liquid`:

```
{% if page.css %}
  {% for href in page.css %}
    <link rel="stylesheet" href="{{ href }}" />
  {% endfor %}
{% endif %}
{% if page.js %}
  {% for src in page.js %}
    <script src="{{ src }}"></script>
  {% endfor %}
{% endif %}
```

Collections

- Top-level folders under `src/` (except underscored ones and `assets`) become collections.
- Accessible as `collections.{name}` and `collections.all` (sorted by date desc).

Global data

- JSON under `src/_data/**` is exposed under the `data` scope, nested by folders.
  - `_data/site.json` → `data.site`
  - `_data/nav/header.json` → `data.nav.header`
  - Rule: choose “single file” or “folder” per branch. If a parent file (e.g., `_data/nav.json`) is not an object while nested files exist (e.g., `_data/nav/header.json`), the build will error with a helpful message.

Configuration
Create `flux.config.json` (or `.js/.ts`) at project root:

```
{
  "srcDir": "src",
  "outDir": "dist",
  "cleanUrls": true
}
```

- Clean URLs is a global control only (dev/preview routing).
- 404 is always emitted as `/404.html` in production builds.

Assets

- Put CSS/JS under `src/assets/**`. Build emits hashed files and rewrites `/assets/...` in HTML.
- Images and other static files are copied as-is.
- Reference assets using `/assets/...`.

Clean URLs policy

- When `cleanUrls: true`, do not link to `.html` pages. Use:
- Dev/preview redirect `.html` → clean during development only. Build does not emit redirect files.
- Build output respects source paths: `file.*` → `file.html`, `dir/index.*` → `dir/index.html`.

Requirements

- Node.js >= 18.18

License
MIT
