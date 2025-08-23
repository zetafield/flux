---
title: Quick Start
---

# Let's Build a Blog in Under 5 Minutes!

Ready to get your hands dirty? Let's build a beautiful blog super quickly and get you familiar with how Flux works. No fluff, just the good stuff!

## Create Your New Project

First things first – let's create a shiny new Flux project using our interactive setup:

```bash
# Use your favorite package manager – we'll go with npm for this example
npm create @zetafield/flux
```

Flux will ask you a few quick questions. For this tutorial, choose:
- **Project name:** "My Awesome Blog" 
- **Directory:** Accept the suggested `./my-awesome-blog`
- **Description:** Something fun like "My personal blog built with Flux"
- **Template:** Select **"Blog - Ready for blogging with post layouts"**

Now hop into your new project:

```bash
cd my-awesome-blog
```

Flux automatically installs dependencies, but if you need to install them manually:

```bash
npm install
```

Fire up the dev server and watch the magic happen:

```bash
npm run dev
```

Boom! Head over to `http://localhost:3589` in your browser and you'll see your brand new blog come to life!

_TODO: add a screenshot here_

## What's All This Stuff?

Your project structure looks something like this:

```
.
├── index.md               # Your homepage
├── about.md              # About page (because everyone needs one!)
├── blog.md               # Blog listing page
├── blog/                 # Where your posts live
│   ├── 2025-08-15-welcome.md       # Your first post
│   └── 2025-08-20-demo-page.md     # A demo with all the markdown goodies
├── assets/
│   ├── css/              # Your stylesheets (Vite will process these)
│   ├── js/               # JavaScript files
│   └── images/           # All your pretty pictures
├── public/               # Static files (copied as-is)
├── _layouts/             # Your page templates
│   ├── base.liquid       # The main layout wrapper
│   └── post.liquid       # Special layout for blog posts
├── _data/                # Global site data
│   ├── site.json         # Site settings
│   └── nav.json          # Navigation structure
└── package.json
```

## How Content Works

Here's the cool part – any `.html` or `.md` file in your project becomes a page on your site! Flux automatically figures out the URLs:

```
.
├── index.md                      # → https://yoursite.com
├── about.md                      # → https://yoursite.com/about
├── blog.md                       # → https://yoursite.com/blog
├── blog/
│   ├── _my-draft-post.md         # Draft (starts with "_")
│   ├── 2025-08-15-first-post.md  # → https://yoursite.com/blog/first-post
│   └── 2025-08-16-another.md     # → https://yoursite.com/blog/another
```

Each page has two parts – let's look at your `about.md`:

```markdown
---
title: About
---

Welcome! This is our about page.

## Our Team

We're pretty awesome.
```

The stuff between the `---` lines is called **frontmatter** – it's like metadata for your page. The rest is just regular markdown content.

### Layout Magic

By default, every page uses the `_layouts/base.liquid` template. Want a different layout? Just add `layout: custom.liquid` to your frontmatter. Want no layout at all? Use `layout: false`.

### Dates Are Smart

Flux is clever about dates! If your filename starts with "YYYY-MM-DD" (like `2025-08-15-my-post.md`), it automatically extracts the date and makes it available as `page.date`. Super handy for organizing posts chronologically!

You can also set the date manually in frontmatter – it'll override the filename date.

### Draft Mode

Got a post you're still working on? Just start the filename with an underscore (`_my-draft.md`) and Flux treats it as a draft. Drafts don't show up in builds, but you can see them in development by running:

```bash
npm run dev --draft
```

## Next Steps

Want to dive deeper? Check out:

- [Core Concepts](/concepts) – Learn how everything fits together
- [Installation](/installation) – More installation options and setup details
- [Deploy Your Site](/deploy) – Get your blog live on the internet!

Happy blogging!
