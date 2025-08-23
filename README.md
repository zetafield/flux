# Flux - A Minimalistic Static Site Generator

Flux is built for folks who want to learn web fundamentals the fun way—by keeping things simple and straightforward.

We're big fans of vanilla HTML, CSS, and JavaScript here. Start with just one `.html` page—that's it! Once you've got that down, throw in some CSS to make it look amazing. Want to add some interactivity? Sprinkle in a bit of JavaScript and watch your page come to life. It's pretty cool!

Planning to build a blog or portfolio? Flux makes it easy to set up common layouts for all your pages, and you can write your content in Markdown (because who doesn't love Markdown?). This way, you'll gradually pick up all the essential web development skills. There's something really satisfying about seeing your handcrafted code turn into a real website.

Now, if you're thinking about adding React or Vue to the mix, pause for a second—do you actually need them? Sometimes vanilla JavaScript can handle what you're after. But hey, if you do need something more powerful, there are great options out there like Astro.

Behind the scenes, we use Vite to make sure everything runs smoothly from development to deployment.

The best part? Everything outputs as static files, so you can deploy pretty much anywhere—GitHub Pages, Netlify, Vercel, Cloudflare Pages, AWS S3, you name it!

## Quick Start

```bash
npm create @zetafield/flux
# Follow the interactive prompts
cd your-project-name
npm run dev
```

Visit `http://localhost:3589` and start building!

## What You Get

- **Live reloading** during development
- **Markdown support** for easy writing  
- **Liquid templates** for consistent designs
- **Optimized builds** for production
- **Deploy anywhere** - just static files

## Template Starters

Choose your starting point during setup:

- **Empty** - Only package.json, build from scratch
- **Minimal** - Homepage with basic layout (recommended)
- **Blog** - Ready for blogging with posts and layouts

## Project Structure

```
my-blog/
├── index.md              # Your homepage
├── about.md              # Pages (Markdown or HTML)
├── blog/                 # Organize content in folders
│   └── first-post.md
├── assets/
│   ├── css/main.css      # Styles (processed by Vite)
│   └── js/main.js        # Scripts (processed by Vite)  
├── public/               # Static files (copied as-is)
├── _layouts/             # Page templates
│   └── base.liquid
├── _components/          # Reusable parts
│   └── header.liquid
└── _data/                # Site data (JSON)
    └── site.json
```

## Creating Content

All files support frontmatter:

```yaml
---
title: "My Page"
date: "2025-01-15"
layout: "base"
---

# Your content here

Write in **Markdown** or use Liquid templates for dynamic content.
```

## Templates with Liquid

```liquid
<!-- Variables -->
<h1>{{ page.title }}</h1>
<p>Welcome to {{ data.site.name }}!</p>

<!-- Includes -->
{% include 'header' %}

<!-- Loops -->
{% for post in collections.blog %}
  <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
  <time>{{ post.date | date: '%B %d, %Y' }}</time>
{% endfor %}
```

## Configuration

Create `flux.config.js` to customize Vite:

```javascript
export default {
  plugins: [
    // Add Vite plugins here
  ]
}
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
- **GitHub Pages** - Enable in repo settings  
- **Cloudflare Pages** - Fast global CDN
- **Your own server** - Just copy the `_site/` folder

## Requirements

- Node.js 18+
- Your favorite package manager (npm, pnpm, yarn, bun)

## Learn More

- [Installation Guide](https://flux.zetafield.com/installation)
- [Quick Start Tutorial](https://flux.zetafield.com/quick-start)  
- [Deploy Your Site](https://flux.zetafield.com/deploy)

## Contributing

This is a small, passionate project built by developers who remember when making websites was fun. Found a bug? Have an idea? Check out our [GitHub Issues](https://github.com/zetafield/flux/issues) - we'd love to hear from you!

## License

[MIT](./LICENSE)