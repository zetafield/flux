# Flux

A minimal Vite-powered, LiquidJS-based, zero-JS static site generator designed for learning and simplicity.

## Philosophy

**Minimal & Educational** - Flux teaches vanilla HTML, CSS, and JavaScript fundamentals without complex abstractions. Start simple, grow naturally.

**Industry Standards** - Built with proven tools (LiquidJS, Vite) that provide transferable skills you'll use in real projects.

**Static First** - Generate clean, deployable static files optimized for CDN hosting. No runtime dependencies.

## Quick Start

```bash
npm create @zetafield/flux
# Follow the interactive prompts to set up your project
cd your-project-name
npm run dev
```

## What You'll Learn

**Progressive Learning Path:**

1. Static HTML, CSS, and JavaScript basics
2. Template includes and variables with Liquid
3. Markdown for content creation
4. Frontmatter and data-driven pages
5. Loops, conditionals, and dynamic content

**Skills That Transfer:**

- **LiquidJS** → Shopify theme development
- **Vite** → Modern JavaScript tooling
- **Static sites** → CDN deployment strategies
- **Asset optimization** → Production web performance

## Technology Stack

- **Templating**: LiquidJS (Shopify-compatible)
- **Build Tool**: Vite (fast dev server + optimization)
- **Content**: Markdown with frontmatter support
- **Assets**: Automatic CSS/JS hashing for CDN caching

## Project Structure

```
my-site/
├── src/
│   ├── index.liquid        # Your pages
│   ├── about.md           # Markdown support
│   ├── assets/
│   │   ├── css/style.css  # Auto-optimized & hashed
│   │   ├── js/main.js     # Auto-optimized & hashed
│   │   └── images/        # Static files
│   ├── _layouts/          # Page templates
│   ├── _components/       # Reusable partials
│   └── _data/             # Site-wide JSON data
└── dist/                  # Generated static output
```

## File Types

All files support YAML frontmatter:

```yaml
---
title: "My Page"
layout: "base"
date: "2025-01-15"
---
```

**Supported Extensions:**

- `.liquid` - Full templating features
- `.html` - Basic templating
- `.md` - Markdown with Liquid processing

## Asset Handling

**Processed by Vite** (optimized & hashed):

- CSS files in `assets/css/`
- JavaScript files in `assets/js/`

**Static Assets** (copied as-is):

- Images and other files

**Template Usage:**

```liquid
<link rel="stylesheet" href="/assets/css/style.css">
<script src="/assets/js/main.js"></script>
<img src="/assets/images/logo.png" alt="Logo">
```

## Templating Examples

```liquid
<!-- Variables -->
{{ page.title }}
{{ data.site.name }}

<!-- Includes -->
{% include 'header.liquid' %}

<!-- Conditionals -->
{% if page.featured %}
  <span class="featured">★</span>
{% endif %}

<!-- Loops -->
{% for post in collections.posts %}
  <h2>{{ post.data.title }}</h2>
{% endfor %}

<!-- Filters -->
{{ page.date | date: '%B %d, %Y' }}
```

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Requirements

- Node.js 20.19+ or 22.12+

## Authoring Details

- Place pages under `src/` as `.liquid`, `.md`, or `.html`
- Layouts live under `src/_layouts/`, components under `src/_components/`
- Site data lives in `src/_data/**` and is available under the `data` scope (e.g., `_data/site.json` → `data.site`)
- Assets under `src/assets/**` (CSS/JS are fingerprinted by Vite; others copied as-is)
- Collections are derived from top-level folders under `src/` (excluding underscored folders and `assets`)
- Per-page assets: declare `css`/`js` arrays in frontmatter and render them in the layout

## Configuration

Create `flux.config.json` (or `.js/.ts`) at project root:

```
{
  "srcDir": "src",
  "outDir": "dist",
  "cleanUrls": true
}
```

- **cleanUrls**: dev/preview-only routing convenience. Build output mirrors source structure.
- Production builds always emit `dist/404.html`

## Clean URLs policy

For v0.1 we use clean-only links in dev/preview (no redirect files generated):

- If `cleanUrls: true`:
  - `src/file.*` is served at `/file`
  - `src/dir/index.*` is served at `/dir/`
- Dev/preview redirect `.html` → clean URL. Build does not emit redirect files.
- Build output respects source paths: `file.*` → `file.html`, `dir/index.*` → `dir/index.html`.

## Developing the CLI

Run the CLI from the workspace:

```
pnpm --filter @zetafield/flux dev
```

The example app in `my-site/` is linked to the workspace package.

## Releasing

This repo uses a pnpm monorepo with scoped packages `@zetafield/create-flux` and `@zetafield/flux`.

- Versioning/publish via Changesets (setup pending)
- Publish:

```
pnpm -r publish --access public
```

## License

[MIT](./LICENSE)
