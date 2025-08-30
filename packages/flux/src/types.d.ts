import type { UserConfig as ViteUserConfig } from "vite";

export interface FluxMarkdownOptions {
	/** Enable Shiki highlighting. Default: false */
	highlight?: boolean;
	/** Shiki light theme name */
	themeLight?: string;
	/** Shiki dark theme name */
	themeDark?: string;
}

export interface FluxUserConfig {
	markdown?: FluxMarkdownOptions;
	/** Nested Vite configuration */
	vite?: ViteUserConfig;
}

export function defineConfig(config: FluxUserConfig): FluxUserConfig;

export type { ViteUserConfig };
