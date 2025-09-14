import type { UserConfig as ViteUserConfig } from "vite";

export interface FluxMarkdownOptions {
  /** Enable Shiki highlighting. Default: false */
  highlight?: boolean;
  /** Shiki light theme name */
  themeLight?: string;
  /** Shiki dark theme name */
  themeDark?: string;
}

export interface FluxConfig {
  markdown?: FluxMarkdownOptions;
  /** Nested Vite configuration */
  vite?: ViteUserConfig;
}

export function defineConfig(config: FluxConfig): FluxConfig;

// Backwards compatibility for older imports
export type FluxUserConfig = FluxConfig;

export type { ViteUserConfig };
