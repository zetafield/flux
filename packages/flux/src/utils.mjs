import fg from "fast-glob";
import fse from "fs-extra";
import matter from "gray-matter";
import { Liquid } from "liquidjs";
import fs from "node:fs/promises";
import path from "node:path";

export function extractDateFromFilename(filePath) {
  const filename = path.basename(filePath);
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
  return match ? match[1] : null;
}

export function createLiquid(projectRoot = process.cwd()) {
  const rootsRaw = [
    path.resolve(projectRoot, "_layouts"),
    path.resolve(projectRoot, "_includes"),
    path.resolve(projectRoot, "_partials"),
    path.resolve(projectRoot, "_components"),
  ];
  const roots = rootsRaw.filter((dir) => fse.pathExistsSync(dir));
  const effectiveRoots = roots.length > 0 ? roots : [projectRoot];

  return new Liquid({
    root: effectiveRoots,
    extname: ".liquid",
    cache: false,
  });
}

export async function loadData(projectRoot = process.cwd()) {
  const dataDir = path.resolve(projectRoot, "_data");
  const data = {};

  if (await fse.pathExists(dataDir)) {
    const files = await fg(["**/*.json"], { cwd: dataDir });

    for (const file of files) {
      const content = await fs.readFile(path.resolve(dataDir, file), "utf8");
      const key = file.replace(/\.json$/i, "").replace(/\//g, ".");
      data[key] = JSON.parse(content);
    }
  }

  return data;
}

export function shouldSkipDraft(filePath) {
  return (
    path.basename(filePath).startsWith("_") && process.env.FLUX_DRAFT !== "1"
  );
}

export function cleanPath(filePath) {
  return filePath
    .replace(/\.(md|html)$/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

export function buildUrl(filePath) {
  const cleaned = cleanPath(filePath);
  return cleaned === "index" ? "/" : `/${cleaned}`.replace(/\/index$/, "/");
}

async function processContentFile(filePath, projectRoot) {
  const raw = await fs.readFile(path.resolve(projectRoot, filePath), "utf8");
  const { data: frontmatter } = matter(raw);

  const filenameDate = extractDateFromFilename(filePath);
  const url = buildUrl(filePath);

  return {
    ...frontmatter,
    url,
    date: filenameDate || frontmatter.date,
    inputPath: filePath,
  };
}

function sortCollection(collection) {
  return collection.sort((a, b) => {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB - dateA;
  });
}

export async function getCollections(projectRoot = process.cwd()) {
  const files = await fg(["**/*.{md,html}"], {
    cwd: projectRoot,
    ignore: ["node_modules/**", "_*/**", "_site/**", "_temp/**"],
  });

  const collections = { all: [], root: [] };

  for (const file of files) {
    if (shouldSkipDraft(file)) continue;

    const item = await processContentFile(file, projectRoot);
    collections.all.push(item);

    const dirPath = path.dirname(file);
    if (dirPath === "." || dirPath === "") {
      collections.root.push(item);
    } else {
      const collectionName = dirPath.split("/")[0];
      if (!collections[collectionName]) collections[collectionName] = [];
      collections[collectionName].push(item);
    }
  }

  Object.values(collections).forEach(sortCollection);
  return collections;
}

export async function loadGlobals(projectRoot = process.cwd()) {
  const [data, collections] = await Promise.all([
    loadData(projectRoot),
    getCollections(projectRoot),
  ]);
  return { data, collections };
}

// Helper to aid editor IntelliSense for flux.config.mjs consumers
export function defineConfig(config) {
  return config;
}
