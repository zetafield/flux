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
  const enableHighlight = mdConfig.highlight === true; // default: false

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

function maskMarkdownCode(rawMarkdown) {
  const codeBlocks = [];
  const inlineCodes = [];

  // Mask fenced code blocks first (supports optional language after backticks)
  let masked = rawMarkdown.replace(
    /```[\t ]*([\w-]+)?\n[\s\S]*?```/g,
    (match) => {
      const idx = codeBlocks.length;
      codeBlocks.push(match);
      return `__FLUX_CODE_BLOCK_${idx}__`;
    },
  );

  // Mask inline code (simple, after fences are removed)
  masked = masked.replace(/`[^`]*`/g, (match) => {
    const idx = inlineCodes.length;
    inlineCodes.push(match);
    return `__FLUX_INLINE_CODE_${idx}__`;
  });

  return { masked, codeBlocks, inlineCodes };
}

function restoreMarkdownCode(maskedMarkdown, codeBlocks, inlineCodes) {
  let restored = maskedMarkdown;
  for (let i = 0; i < inlineCodes.length; i++) {
    restored = restored.replace(
      new RegExp(`__FLUX_INLINE_CODE_${i}__`, "g"),
      inlineCodes[i],
    );
  }
  for (let i = 0; i < codeBlocks.length; i++) {
    restored = restored.replace(
      new RegExp(`__FLUX_CODE_BLOCK_${i}__`, "g"),
      codeBlocks[i],
    );
  }
  return restored;
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
    // Prevent Liquid from interpreting code in fenced/inline blocks by masking
    const { masked, codeBlocks, inlineCodes } = maskMarkdownCode(content);

    const liquidProcessedMasked = await liquid.parseAndRender(masked, {
      ...globals,
      page: pageMeta,
    });

    const liquidProcessed = restoreMarkdownCode(
      liquidProcessedMasked,
      codeBlocks,
      inlineCodes,
    );
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
