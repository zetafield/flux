import { defineConfig } from "@zetafield/flux";

export default defineConfig({
  markdown: {
    highlight: true,
    themeLight: "light-plus",
    themeDark: "tokyo-night",
  },
  vite: {
    css: {
      transformer: "lightningcss",
      lightningcss: {
        // optionally set targets via browserslist if desired
      },
    },
    build: {
      minify: false,
    },
  },
});
