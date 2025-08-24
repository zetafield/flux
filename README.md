# Flux - A Minimalistic Static Site Generator

Flux is a minimalistic static site generator for building websites with modern tooling.

Build sites using HTML, CSS, and JavaScript. Start with a single HTML file, add CSS for styling, and include JavaScript for interactivity. Flux handles the build process while you focus on creating.

For blogs and portfolios, create reusable layouts and write content in Markdown. This approach helps you learn web development fundamentals while building real websites.

Flux encourages vanilla JavaScript over complex frameworks. If you need more advanced features, consider tools like [Astro](https://astro.build/).

Flux is built on [Vite](http://vite.dev) for fast development and optimized builds.

Output is static files that deploy anywhere - GitHub Pages, Netlify, Vercel, Cloudflare Pages, AWS S3, or any VPS.

## Getting Started

Create a new Flux project using the interactive setup:

```bash
npm create @zetafield/flux
```

Navigate to your project and start development:

```bash
cd your-project-name
npm install
npm run dev
```

Visit `http://localhost:3589` and start building.

## Features

- Live reloading during development
- Markdown support for content
- Liquid templates for layouts
- Optimized builds for production  
- Deploy anywhere - static files only

## Templates

Choose your starting point during setup:

- **Empty** - Package.json only, build from scratch
- **Minimal** - Basic homepage and layout (default)
- **Blog** - Complete blog with posts and layouts

## Project Structure

```
.
├── index.md              # Homepage
├── about.md              # About page
├── blog/                 # Blog posts directory
│   └── first-post.md
├── assets/               # Processed by Vite
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   └── images/           # Image files
├── public/               # Static files (copied as-is)
├── _layouts/             # Page templates
│   └── base.liquid
├── _data/                # Global site data
│   └── site.json
└── package.json
```

## How Content Works

Any `.html` or `.md` file becomes a page. Each page has frontmatter for metadata:

```markdown
---
title: About
---

Welcome! This is our about page.

## Our Team

We're pretty awesome.
```

The content between `---` lines is frontmatter. The rest is regular markdown content.

## Templates

Templates use [Liquid](https://liquidjs.com/) for dynamic content:

```liquid
<h1>{{ page.title }}</h1>
<p>Welcome to {{ data.site.name }}!</p>

{% for post in collections.blog %}
  <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
  <time>{{ post.date | date: '%B %d, %Y' }}</time>
{% endfor %}
```

## Configuration

Optional configuration when needed:

```javascript
// flux.config.js
import tailwind from "@tailwindcss/vite";

export default {
  plugins: [tailwind()],
};
```

## Commands

```bash
npm run dev      # Start development server (http://localhost:3589)
npm run build    # Build for production (_site/ folder)  
npm run preview  # Preview production build (http://localhost:4589)
```

## Deployment

Build creates static files in `_site/` - deploy anywhere:

- **Netlify** - Connect your repo, set build command to `npm run build`
- **Vercel** - Auto-detects and deploys  
- **Cloudflare Pages** - Fast global CDN
- **GitHub Pages** - Enable in repo settings
- **Your own server** - Copy the `_site/` folder

## Requirements

- Node.js 18 or higher
- Package manager (npm, pnpm, yarn, or bun)

## Documentation

- [Installation](https://flux.zetafield.com/installation)
- [Quick Start](https://flux.zetafield.com/quick-start)  
- [Core Concepts](https://flux.zetafield.com/concepts)
- [Deploy Your Site](https://flux.zetafield.com/deploy)

## Contributing

Found a bug or have an idea? Check out our [GitHub Issues](https://github.com/zetafield/flux/issues).

## License

[MIT](./LICENSE)