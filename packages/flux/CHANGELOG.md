# @zetafield/flux

## 0.2.0

### Minor Changes

- a61740e: feat: enhance Flux configuration options and markdown processing
  - Updated Flux configuration to support nested Vite options.
  - Enhanced markdown processing with code masking for better rendering.
  - Refactored FluxBuilder and related files to utilize new configuration structure.
  - Improved website styles and typography for better visual consistency.

## 0.1.1

### Patch Changes

- 5300bb6: fix: enhance content rendering with layout template checks

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
