import fse from "fs-extra";
import path from "node:path";
import pc from "picocolors";
import { renderContent, resetHighlighter } from "./renderer.mjs";

export function createDevPlugin() {
  const projectRoot = process.cwd();
  let userConfig = null;

  return {
    name: "flux-dev",

    // Only handle dev server routing - no build logic!
    async configureServer(server) {
      // Load config once when dev server starts
      userConfig = await (async () => {
        const configPaths = [
          path.resolve(projectRoot, "flux.config.mjs"),
          path.resolve(projectRoot, "flux.config.js"),
        ];
        for (const p of configPaths) {
          try {
            if (await fse.pathExists(p)) {
              const mod = await import(`file://${p}`);
              return mod?.default || mod || {};
            }
          } catch (error) {
            console.warn(`Failed to load config ${p}:`, error);
          }
        }
        return {};
      })();

      server.middlewares.use(async (req, res, next) => {
        if (req.method !== "GET") return next();

        const url = new URL(req.url, "http://localhost").pathname;

        // Shiki generates inline styles with CSS variables - no external CSS serving needed

        // Skip other assets and files with extensions
        if (/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/.test(url)) {
          return next();
        }

        // Find matching content file
        const cleanUrl = url.slice(1); // Remove leading slash
        const candidates = [
          `${cleanUrl}.md`,
          `${cleanUrl}.html`,
          cleanUrl ? `${cleanUrl}/index.md` : `index.md`,
          cleanUrl ? `${cleanUrl}/index.html` : `index.html`,
        ].filter(Boolean);

        let file = null;
        for (const candidate of candidates) {
          if (await fse.pathExists(path.resolve(projectRoot, candidate))) {
            file = candidate;
            break;
          }
        }

        if (!file) return next();

        try {
          const html = await renderContent(
            path.resolve(projectRoot, file),
            projectRoot,
            userConfig,
          );

          // Ensure Vite injects HMR client and transforms HTML
          const transformed = await server.transformIndexHtml(url, html);
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(transformed);
        } catch (error) {
          next(error);
        }
      });
    },

    // Hot reload for content changes
    async handleHotUpdate({ file, server }) {
      const relativePath = path.relative(projectRoot, file);

      // For CSS files under assets/, trigger a full reload (static links)
      if (/\.css$/.test(file) && file.includes("assets/")) {
        console.log(pc.cyan(`• CSS changed: ${relativePath}`));
        server.ws.send({ type: "full-reload" });
        return [];
      }

      // For config changes, reload config and trigger full page reload
      if (/flux\.config\.(mjs|js)$/.test(file)) {
        console.log(pc.magenta(`• Config changed: ${relativePath}`));

        // Reset Shiki highlighter so it re-initializes with new themes
        resetHighlighter();

        // Reload user config
        userConfig = await (async () => {
          const configPaths = [
            path.resolve(projectRoot, "flux.config.mjs"),
            path.resolve(projectRoot, "flux.config.js"),
          ];
          for (const p of configPaths) {
            try {
              if (await fse.pathExists(p)) {
                // Use timestamp to bypass ES module cache
                const cacheBuster = `?t=${Date.now()}`;
                const mod = await import(`file://${p}${cacheBuster}`);
                return mod?.default || mod || {};
              }
            } catch (error) {
              console.warn(`Failed to load config ${p}:`, error);
            }
          }
          return {};
        })();
        server.ws.send({ type: "full-reload" });
        return [];
      }

      // For content and template files, trigger full page reload
      if (
        /\.(md|html|json|liquid)$/.test(file) ||
        file.includes("_layouts/") ||
        file.includes("_includes/") ||
        file.includes("_partials/") ||
        file.includes("_components/")
      ) {
        console.log(pc.blue(`• Content changed: ${relativePath}`));
        server.ws.send({ type: "full-reload" });
        return [];
      }

      // Let Vite handle other files normally
      return undefined;
    },
  };
}
