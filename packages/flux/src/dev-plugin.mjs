import fse from "fs-extra";
import path from "node:path";
import pc from "picocolors";
import { renderContent } from "./renderer.mjs";

export function createDevPlugin() {
  const projectRoot = process.cwd();

  return {
    name: "flux-dev",

    // Only handle dev server routing - no build logic!
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== "GET") return next();

        const url = new URL(req.url, "http://localhost").pathname;

        // Skip assets and files with extensions
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
    handleHotUpdate({ file, server }) {
      const relativePath = path.relative(projectRoot, file);

      // For CSS files under assets/, trigger a full reload (static links)
      if (/\.css$/.test(file) && file.includes("assets/")) {
        console.log(pc.cyan(`• CSS changed: ${relativePath}`));
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
