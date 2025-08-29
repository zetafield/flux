import matter from "gray-matter";
import { marked, Marked } from "marked";
import { createHighlighter } from "shiki";
import fs from "node:fs/promises";
import fse from "fs-extra";
import path from "node:path";

import {
  createLiquid,
  extractDateFromFilename,
  loadGlobals,
} from "./utils.mjs";

let shikiHighlighter = null;
let markedInstance = null;
let lastThemes = "";

// Export function to reset highlighter (useful for dev server)
export function resetHighlighter() {
  if (shikiHighlighter) {
    shikiHighlighter.dispose();
  }
  shikiHighlighter = null;
  markedInstance = null;
  lastThemes = "";
}

async function setupMarkdown(userConfig) {
  const mdConfig = userConfig?.markdown || {};
  const enableHighlight = mdConfig.highlight !== false; // default: false

  if (enableHighlight) {
    const lightTheme = mdConfig.themeLight || mdConfig.theme || "github-light";
    const darkTheme = mdConfig.themeDark || mdConfig.theme || "github-dark";
    const themeKey = `${lightTheme}-${darkTheme}`;

    // Re-initialize if themes changed
    if (!shikiHighlighter || lastThemes !== themeKey) {
      if (shikiHighlighter) {
        shikiHighlighter.dispose();
      }
      lastThemes = themeKey;

      shikiHighlighter = await createHighlighter({
        themes: [lightTheme, darkTheme],
        langs: [
          "javascript",
          "typescript",
          "jsx",
          "tsx",
          "html",
          "css",
          "json",
          "markdown",
          "yaml",
          "bash",
          "shell",
          "liquid",
          "plaintext",
        ],
      });

      markedInstance = new Marked();
      markedInstance.use({
        renderer: {
          code(code, lang = "plaintext") {
            try {
              return shikiHighlighter.codeToHtml(code, {
                lang,
                themes: { light: lightTheme, dark: darkTheme },
              });
            } catch {
              return shikiHighlighter.codeToHtml(code, {
                lang: "plaintext",
                themes: { light: lightTheme, dark: darkTheme },
              });
            }
          },
        },
      });
    }
  }
}

export async function renderContent(
  filePath,
  projectRoot = process.cwd(),
  userConfig = {},
) {
  const raw = await fs.readFile(filePath, "utf8");
  const { content, data: frontmatter } = matter(raw);

  const liquid = createLiquid(projectRoot);
  const globals = await loadGlobals(projectRoot);

  const filenameDate = extractDateFromFilename(filePath);
  const pageMeta = { ...frontmatter };
  if (filenameDate) pageMeta.date = filenameDate || pageMeta.date;

  // Allow config-driven markdown behavior
  await setupMarkdown(userConfig);

  // Prepare page metadata (Shiki handles CSS via inline styles with CSS variables)
  const cssList = Array.isArray(frontmatter.css) ? [...frontmatter.css] : [];
  if (cssList.length > 0) pageMeta.css = cssList;

  let processedContent;

  if (filePath.endsWith(".md")) {
    const liquidProcessed = await liquid.parseAndRender(content, {
      ...globals,
      page: pageMeta,
    });
    processedContent = markedInstance
      ? markedInstance.parse(liquidProcessed)
      : marked(liquidProcessed);
  } else {
    processedContent = await liquid.parseAndRender(content, {
      ...globals,
      page: pageMeta,
    });
  }

  const layout =
    frontmatter.layout === false ? null : frontmatter.layout || "base";

  if (!layout) return processedContent;

  // Only render with a layout if the template actually exists in any template root
  const roots = [
    path.resolve(projectRoot, "_layouts"),
    path.resolve(projectRoot, "_includes"),
    path.resolve(projectRoot, "_partials"),
    path.resolve(projectRoot, "_components"),
  ].filter((dir) => fse.pathExistsSync(dir));

  const candidates = layout.endsWith(".liquid")
    ? [layout]
    : [`${layout}.liquid`];

  let templateFound = false;
  for (const root of roots) {
    for (const candidate of candidates) {
      const fileToCheck = path.resolve(root, candidate);
      if (await fse.pathExists(fileToCheck)) {
        templateFound = true;
        break;
      }
    }
    if (templateFound) break;
  }

  if (!templateFound) {
    return processedContent;
  }

  const ctx = { ...globals, page: pageMeta, content: processedContent };
  return liquid.renderFile(layout, ctx);
}
