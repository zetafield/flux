---
title: Quick Start
---

This guide will walk you through creating a blog with Flux. You'll have a working site up and running in just a few minutes.

## Create Your New Project

Create a new Flux project using the interactive scaffolding tool:

```bash
npm create @zetafield/flux
```

Flux will ask you a few questions to set up your project. For this tutorial, choose:

- **Project name:** "My Awesome Blog"
- **Directory:** Accept the suggested `./my-awesome-blog`
- **Description:** "My personal blog built with Flux"
- **Template:** Select **"Blog - Ready for blogging with post layouts"**

Navigate to your new project:

```bash
cd my-awesome-blog
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3589` in your browser to see your new blog.

## Project Structure

Your project structure looks like this:

```
.
├── index.md              # Homepage
├── about.md              # About page
├── blog.md               # Blog listing page
├── blog/                 # Blog posts directory
│   ├── 2025-08-15-welcome.md       # First post
│   └── 2025-08-20-demo-page.md     # Demo post with formatting examples
├── assets/               # Processed by Vite
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   └── images/           # Image files
├── public/               # Static files (copied as-is)
├── _layouts/             # Page templates
│   ├── base.liquid       # Main layout template
│   └── post.liquid       # Blog post layout
├── _data/                # Global site data
│   ├── site.json         # Site configuration
│   └── nav.json          # Navigation structure
└── package.json
```

## How Content Works

Any `.html` or `.md` file in your project becomes a page on your site. Flux automatically generates URLs based on file paths:

```
.
├── index.md                      # → https://yoursite.com
├── about.md                      # → https://yoursite.com/about.html
├── blog.md                       # → https://yoursite.com/blog.html
├── blog/
│   ├── _my-draft-post.md         # Draft (starts with "_")
│   ├── 2025-08-15-first-post.md  # → https://yoursite.com/blog/first-post.html
│   └── 2025-08-16-another.md     # → https://yoursite.com/blog/another.html
```

Each page has two parts. Here's an example `about.md` file:

```markdown
---
title: About
---

Welcome! This is our about page.

## Our Team

We're pretty awesome.
```

The content between the `---` lines is called **frontmatter** and contains metadata for your page. The rest is regular markdown content.

### Layouts

By default, every page uses the `_layouts/base.liquid` template. To use a different layout, add `layout: custom.liquid` to your frontmatter. To disable layouts completely, use `layout: false`.

### Dates

Flux automatically handles dates in filenames. If your filename starts with "YYYY-MM-DD" (like `2025-08-15-my-post.md`), it extracts the date and makes it available as `page.date`. This is useful for organizing blog posts chronologically.

You can also set the date manually in frontmatter, which will override the filename date.

### Draft Posts

To create a draft post, start the filename with an underscore (`_my-draft.md`). Draft posts don't appear in builds, but you can view them during development by running:

```bash
npm run dev --draft
```

## Next Steps

To learn more about Flux, check out:

- [Installation](/installation) – More installation options and setup details
- [Deploy Your Site](/deploy) – Get your blog live on the internet

You now have a working blog with Flux. Start writing content and customizing your site!
