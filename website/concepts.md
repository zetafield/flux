---
title: Core Concepts
---

Understanding how Flux works will help you build sites efficiently.

## File-Based Routing

Flux creates pages from your file structure. Add a `.md` or `.html` file anywhere in your project and it becomes a page with a corresponding URL.

### How URLs Are Generated

The file path determines the URL:

- `index.md` → `/`
- `about.md` → `/about`
- `blog/index.md` → `/blog/`
- `blog/my-post.md` → `/blog/my-post`
- `projects/web-app.md` → `/projects/web-app`

### Index Files

Files named `index.md` or `index.html` become the default page for that directory:

```
blog/
├── index.md        # /blog/
├── first-post.md   # /blog/first-post
└── second-post.md  # /blog/second-post
```

### Nested Directories

Create nested URLs by organizing files in folders:

```
docs/
├── index.md           # /docs/
├── getting-started.md # /docs/getting-started
└── advanced/
    ├── index.md       # /docs/advanced/
    └── config.md      # /docs/advanced/config
```

No routing configuration needed - the file structure is the routing.

## Templates and Layouts

Templates define how your pages look using [Liquid](https://liquidjs.com/) templating language.

Template directories:

- `_layouts/` - Page layouts and wrappers
- `_components/` - Reusable Liquid components
- `_includes/` - Same as components, just a different name - use whichever you prefer

Content from your pages is inserted into layouts using `{{ content }}`.

### Simple Layouts

For basic layouts, use `{{ content }}` to insert page content:

**Simple layout** (`_layouts/page.liquid`):

```liquid
<!doctype html>
<html>
  <head>
    <title>{{ page.title }}</title>
  </head>
  <body>
    <main>
      {{ content }}
    </main>
  </body>
</html>
```

### Layout Inheritance

For more complex setups, layouts can extend other layouts using blocks:

**Base layout** (`_layouts/base.liquid`):

```html
<!doctype html>
<html>
  <head>
    <title>{{ page.title }}</title>
  </head>
  <body>
    {% block content %}{% endblock %}
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

Use by setting `layout: post` in frontmatter.

## Template Variables

Flux provides three global template variables:

### The `data` Variable

JSON files in `_data/` become accessible through the `data` variable:

**`_data/site.json`**:

```json
{
  "title": "My Site",
  "description": "Site description"
}
```

Access with: `{{ data.site.title }}`

### The `page` Variable

Current page metadata from frontmatter and file properties:

- `{{ page.title }}` - Page title from frontmatter
- `{{ page.date }}` - Page date
- `{{ page.url }}` - Page URL

Example frontmatter:

```yaml
---
title: My Blog Post
date: 2024-01-15
author: Jane Doe
---
```

Access custom frontmatter: `{{ page.author }}`

### The `collections` Variable

Content is automatically organized by folder structure and accessible through the `collections` variable:

```
.
├── index.md           # collections.root
├── about.md           # collections.root
├── blog/
│   ├── post-1.md      # collections.blog
│   └── post-2.md      # collections.blog
└── projects/
    ├── project-a.md   # collections.projects
    └── project-b.md   # collections.projects
```

List blog posts:

```liquid
{% for post in collections.blog %}
  <h2>
    <a href="{{ post.url }}">{{ post.title }}</a>
  </h2>
{% endfor %}
```

## Assets Management

Two folder system for different needs:

### `public/` - Direct Copy

Files copied without processing:

- `public/robots.txt` → `_site/robots.txt`
- `public/favicon.ico` → `_site/favicon.ico`

Use for files that need exact names.

### `assets/` - Processed by Vite

Files are compiled, optimized, and hashed:

- `assets/css/main.css` → `_site/assets/css/main-abc123.css`
- `assets/js/app.js` → `_site/assets/js/app-def456.js`

Vite handles imports and dependencies automatically.

## Configuration

Optional configuration when needed:

**`flux.config.js`**:

```js
import tailwind from "@tailwindcss/vite";

export default {
  markdown: { // powered by Shiki syntax highlighter
    highlight: true,
    themeLight: "light-plus",
    themeDark: "tokyo-night",
  },
  vite: {
    // Vite config options
    plugins: [tailwind()]
  }
};
```

Minimal configuration keeps setup simple.

## Build Process

Running `npm run build`:

1. **Content Processing** - Renders `.md` and `.html` files with templates
2. **Asset Optimization** - Vite processes and optimizes assets
3. **Static Output** - Compiles everything to `_site/`

Results in a static site ready for deployment.

## Development vs Production

**Development** (`npm run dev`):

- Live reloading on file changes
- Draft posts visible (files starting with `_`)
- Fresh assets served

**Production** (`npm run build`):

- Optimized and minified assets
- Draft posts excluded
- Deployment-ready output

Next steps:

- [Quick Start](/quick-start) guide
- [Deployment](/deploy) options
- Start building your first site
