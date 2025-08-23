---
title: Core Concepts
---

# How Flux Thinks

Let's dive into the core ideas that make Flux tick. Don't worry – it's simpler than you might think!

## Content is King

In Flux, everything starts with content. Drop a `.md` or `.html` file anywhere in your project, and boom – you've got a page! No routing configs, no complex setups. Just write and go.

## Templates Make Things Pretty

Templates are where you define how your pages look. We use [Liquid](https://liquidjs.com/) – the same templating language that powers Shopify, Jekyll, and tons of other sites.

Templates live in special folders:

- `_layouts/` – Page layouts (like your main page wrapper)
- `_components/` – Reusable chunks of HTML
- `_includes/` – Another name for components (use whichever you prefer!)

Your content gets injected into templates using `{{ content }}`. Magic!

### Layout Inheritance

Want to get fancy? You can have layouts that extend other layouts:

**Base layout** (`_layouts/base.liquid`):

```liquid
<!doctype html>
<html>
  <head>
    <title>{{ page.title }}</title>
  </head>
  <body>
    {% block content -%}
    {%- endblock %}
  </body>
</html>
```

**Post layout** (`_layouts/post.liquid`):

```liquid
{% layout 'base' %}

{% block content %}
<article>
  <h1>{{ page.title }}</h1>
  <time>{{ page.date }}</time>
  {{ content }}
</article>
{% endblock %}
```

Then just set `layout: post` in your frontmatter!

## Data Powers Everything

Flux gives you two ways to work with data:

### 1. Global Data (`data` variable)

Drop JSON files in `_data/` and they become globally available:

**`_data/site.json`**:

```json
{
  "title": "My Awesome Site",
  "description": "Where awesome happens daily"
}
```

Use it anywhere: `{{ data.site.title }}`

### 2. Collections (`collections` variable)

Flux automatically organizes your content into collections based on folder structure:

```
.
├── index.md          # collections.root
├── about.md           # collections.root
├── blog/
│   ├── post-1.md      # collections.blog
│   └── post-2.md      # collections.blog
└── projects/
    ├── project-a.md   # collections.projects
    └── project-b.md   # collections.projects
```

Want to list all blog posts? Easy:

```liquid
{% for post in collections.blog %}
  <h2>
    <a href="{{ post.url }}">{{ post.title }}</a>
  </h2>
{% endfor %}
```

## Assets: The Two-Folder System

Flux handles assets in two different ways:

### `public/` - Copy As-Is

Files here get copied directly to your site without any processing:

- `public/robots.txt` → `_site/robots.txt`
- `public/favicon.ico` → `_site/favicon.ico`

Perfect for files that need to keep their exact names.

### `assets/` - Process & Optimize

Files here get the full Vite treatment – compilation, optimization, and hashing:

- `assets/css/main.css` → `_site/assets/css/main-abc123.css`
- `assets/js/app.js` → `_site/assets/js/app-def456.js`

Vite automatically handles imports, so your CSS can reference images, your JS can import modules, etc.

## Configuration (When You Need It)

Most of the time, Flux just works. But when you need to add Vite plugins (like Tailwind CSS), create a config file:

**`flux.config.js`**:

```js
import tailwind from "@tailwindcss/vite";

export default {
  plugins: [tailwind()],
};
```

We keep the config minimal on purpose – less configuration means more time building cool stuff!

## The Build Process

When you run `npm run build`, here's what happens:

1. **Content Processing**: Flux renders all your `.md` and `.html` files with their templates
2. **Asset Optimization**: Vite processes, optimizes, and hashes your assets
3. **Static Output**: Everything gets compiled into `_site/` as pure static files

The result? A lightning-fast static site that you can deploy anywhere!

## Development vs Production

**Development** (`npm run dev`):

- Live reloading when you change files
- Draft posts are visible (files starting with `_`)
- Assets are served fresh (no caching)

**Production** (`npm run build`):

- Optimized, minified assets
- Draft posts are excluded
- Everything's ready for deployment

## That's the Gist!

Flux follows a simple philosophy: **content first, minimal configuration, maximum flexibility**. You write, Flux handles the rest.

Ready to put this knowledge to work?

- Try the [Quick Start](/quick-start) guide
- Learn about [deploying your site](/deploy)
- Or just start building – the best way to learn is by doing!
