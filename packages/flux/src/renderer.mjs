import matter from "gray-matter";
import { marked } from "marked";
import fs from "node:fs/promises";
import {
  createLiquid,
  extractDateFromFilename,
  loadGlobals,
} from "./utils.mjs";

export async function renderContent(filePath, projectRoot = process.cwd()) {
  const raw = await fs.readFile(filePath, "utf8");
  const { content, data: frontmatter } = matter(raw);

  const liquid = createLiquid(projectRoot);
  const globals = await loadGlobals(projectRoot);

  const filenameDate = extractDateFromFilename(filePath);
  const pageMeta = { ...frontmatter };
  if (filenameDate) pageMeta.date = filenameDate || pageMeta.date;

  let processedContent;

  if (filePath.endsWith(".md")) {
    processedContent = marked(content);
  } else {
    processedContent = await liquid.parseAndRender(content, {
      ...globals,
      page: pageMeta,
    });
  }

  const layout =
    frontmatter.layout === false ? null : frontmatter.layout || "base";

  if (!layout) return processedContent;

  const ctx = { ...globals, page: pageMeta, content: processedContent };
  return liquid.renderFile(layout, ctx);
}
