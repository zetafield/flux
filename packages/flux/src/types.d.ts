export interface FluxOptions {
	/** Enable clean URLs in dev/preview (serve "/file" for "file.*" and "/dir/" for "dir/index.*"). Default: true */
	cleanUrls?: boolean;
}

declare const _default: (options?: FluxOptions) => import("vite").Plugin;
export default _default;
