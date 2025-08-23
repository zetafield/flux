---
title: Installation
---

Create a new Flux project using the scaffold tool or set up manually.

## Using the Scaffold Tool

Create a new project with the interactive setup:

```bash
npm create @zetafield/flux
```

Or with other package managers:

```bash
# pnpm
pnpm create @zetafield/flux

# yarn
yarn create @zetafield/flux

# bun
bun create @zetafield/flux
```

You'll be prompted for:

- Project name
- Directory location
- Optional description
- Template choice (Empty, Minimal, or Blog)

To skip prompts and use defaults:

```bash
npm create @zetafield/flux --yes
```

## Templates

- **Empty** - Package.json only, build from scratch
- **Minimal** - Basic homepage and layout (default)
- **Blog** - Complete blog with posts and layouts

## Manual Setup

To set up manually:

1. Create a new directory
2. Initialize `package.json`
3. Install Flux as a dependency `@zetafield/flux`
4. Configure build scripts

## Requirements

- Node.js 18 or higher
- Package manager (npm, pnpm, yarn, or bun)

## Next Steps

1. Navigate to your project directory
2. Install dependencies
3. Run `npm run dev` to start development

See [Quick Start](/quick-start) for more details.
