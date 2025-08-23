---
title: Installation
---

# Getting Flux Up and Running

Installing Flux is super straightforward – we've got you covered no matter which package manager you prefer!

## Interactive Setup

The fastest way to get started is with our scaffolding tool. Just run one command and Flux will walk you through everything:

```bash
# npm
npm create @zetafield/flux

# pnpm (our personal favorite!)
pnpm create @zetafield/flux

# yarn
yarn create @zetafield/flux

# bun (for the speed demons)
bunx create-@zetafield/flux
```

Flux will ask you a few quick questions:

1. **Project name:** What should we call your site? (e.g., "My Awesome Blog")
2. **Project directory:** Where should we create it? (auto-suggested based on your project name)
3. **Description:** A brief description for your site (optional)
4. **Template:** Choose your starting point:
   - **Empty** - Only package.json, build from scratch
   - **Minimal** - Homepage with basic layout (recommended)
   - **Blog** - Ready for blogging with post layouts

That's it! Flux creates everything and you're ready to start building.

## Skip the Questions

Want to get started even faster? Use the `--yes` flag to skip prompts and use sensible defaults:

```bash
npm create @zetafield/flux my-site --yes
```

This creates a "Minimal" template with default settings.

## Template Options

We've got three templates to get you started:

**Empty** – Only package.json file. Perfect if you want to build everything from scratch.

**Minimal** – A simple site with homepage, about page, and basic styling. Great starting point!

**Blog** – A full-featured blog setup with posts, layouts, and enhanced styling. Ready to write!

## What You Get

After installation, you'll have:

- A complete Flux project structure
- All dependencies installed
- Ready-to-run dev server
- Build and preview commands set up

## System Requirements

Flux needs:

- **Node.js** 18 or higher
- Your favorite package manager (npm, pnpm, yarn, or bun)

That's it! No complex build tools to configure or dependencies to wrestle with.

## Next Steps

After the setup completes, you'll see instructions to:

1. **Enter your project directory**: `cd your-project-name`
2. **Install dependencies**: Flux detects your package manager and shows the right command
3. **Start developing**: `npm run dev` (or your package manager equivalent)

Then:

4. **Make some changes** and watch them update live
5. **Check out** [Quick Start](/quick-start) for a guided tour
6. **Learn the fundamentals** in [Core Concepts](/concepts)

Ready to build something awesome? Let's go!
