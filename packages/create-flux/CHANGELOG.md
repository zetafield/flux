# @zetafield/create-flux

## 0.1.1

### Patch Changes

- b237abf: fix: improve blog template structure and styling
  - Updated blog layout and header for better navigation.
  - Enhanced CSS with variables for improved theming and consistency.
  - Refined Markdown rendering in blog posts and added new favicon assets.
  - Introduced a function to fetch the latest package version dynamically.

## 0.1.0

### Minor Changes

- fb50317: Initial release of Flux static site generator
  - **@zetafield/flux**: Core static site generator with Vite + LiquidJS
    - Build tool architecture orchestrating Vite
    - Support for Markdown and HTML content with frontmatter
    - Liquid templating with layout inheritance
    - Smart asset handling (public/ vs assets/ folders)
    - Collections based on directory structure
    - Development server with hot reloading
    - Clean URLs and draft support
  - **@zetafield/create-flux**: Interactive scaffolding tool
    - Package manager detection (npm, pnpm, yarn, bun)
    - Three template options (Empty, Minimal, Blog)
    - File-based template system
    - Interactive prompts with validation
    - Automatic dependency installation
