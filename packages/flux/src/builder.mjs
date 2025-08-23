import fg from "fast-glob";
import fse from "fs-extra";
import fs from "node:fs/promises";
import path from "node:path";
import pc from "picocolors";
import { build as viteBuild } from "vite";
import { renderContent } from "./renderer.mjs";
import { shouldSkipDraft, cleanPath } from "./utils.mjs";

export class FluxBuilder {
  constructor() {
    this.projectRoot = process.cwd();
    this.tempRoot = path.resolve(this.projectRoot, "_temp");
    this.outDir = path.resolve(this.projectRoot, "_site");
    this.publicDir = path.resolve(this.projectRoot, "public");
  }

  async build() {
    console.log(pc.blue("* Building with Flux..."));

    try {
      // Phase 1: Pre-process content
      console.log(pc.cyan("• Processing content files..."));
      await this.preprocessContent();

      // Phase 2: Build with Vite
      console.log(pc.magenta("• Building with Vite..."));
      await this.runViteBuild();

      // Phase 3: Cleanup
      console.log(pc.gray("• Cleaning up..."));
      await this.cleanup();

      console.log(
        pc.green(
          `✓ Build complete! Output in ${path.relative(this.projectRoot, this.outDir)}`,
        ),
      );
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  async preprocessContent() {
    // Clean and setup temp directory
    await fse.emptyDir(this.tempRoot);

    // Copy assets to temp (so Vite can hash them)
    const assetsPath = path.resolve(this.projectRoot, "assets");
    if (await fse.pathExists(assetsPath)) {
      await fse.copy(assetsPath, path.resolve(this.tempRoot, "assets"));
    }

    // Find and process content files
    const files = await fg(["**/*.{md,html}"], {
      cwd: this.projectRoot,
      ignore: ["node_modules/**", "_*/**", "_site/**", "_temp/**"],
    });

    const inputs = {};

    for (const file of files) {
      if (shouldSkipDraft(file)) continue;

      const cleaned = cleanPath(file);
      const outputFile = `${cleaned}.html`;
      const tempFile = path.resolve(this.tempRoot, outputFile);

      await fse.ensureDir(path.dirname(tempFile));

      const html = await renderContent(
        path.resolve(this.projectRoot, file),
        this.projectRoot,
      );

      await fs.writeFile(tempFile, html, "utf8");
      inputs[cleaned] = tempFile;
    }

    return inputs;
  }

  async runViteBuild() {
    // Load user's Vite config
    const userConfig = await this.loadUserConfig();

    // Find all HTML files in temp for Vite input
    const htmlFiles = await fg(["**/*.html"], {
      cwd: this.tempRoot,
    });

    const inputs = {};
    for (const file of htmlFiles) {
      const key = file.replace(/\.html$/, "");
      inputs[key] = path.resolve(this.tempRoot, file);
    }

    // Create Vite build config
    const viteConfig = {
      // Start with user config
      ...userConfig,
      // Override with Flux-specific settings
      root: this.tempRoot,
      plugins: userConfig.plugins || [],
      publicDir: this.publicDir,
      build: {
        ...userConfig.build,
        outDir: this.outDir,
        emptyOutDir: true,
        cssCodeSplit: true,
        modulePreload: false, // Disable module preload polyfill
        rollupOptions: {
          ...userConfig.build?.rollupOptions,
          input: inputs,
          preserveEntrySignatures: "strict",
          output: {
            ...userConfig.build?.rollupOptions?.output,
            // Keep modules separate and route by type
            preserveModules: true,
            entryFileNames: "[name]-[hash].js",
            chunkFileNames: "[name]-[hash].js",
            assetFileNames: "[name]-[hash].[ext]",
          },
        },
      },
    };

    await viteBuild(viteConfig);
  }

  async loadUserConfig() {
    const configPaths = [
      path.resolve(this.projectRoot, "flux.config.mjs"),
      path.resolve(this.projectRoot, "flux.config.js"),
    ];

    for (const configPath of configPaths) {
      try {
        if (await fse.pathExists(configPath)) {
          const mod = await import(configPath);
          const config = mod?.default || mod || {};
          return this.validateConfig(config, configPath);
        }
      } catch {
        // Continue to next config path
      }
    }

    return {};
  }

  validateConfig(config, configPath) {
    const allowedKeys = ["plugins"];

    const validConfig = {};
    const warnings = [];

    for (const [key, value] of Object.entries(config)) {
      if (allowedKeys.includes(key)) {
        validConfig[key] = value;
      } else {
        warnings.push(key);
      }
    }

    if (warnings.length > 0) {
      const relativePath = path.relative(this.projectRoot, configPath);
      console.warn(
        pc.yellow(`! Flux ignored unsupported options in ${relativePath}:`),
      );
      console.warn(pc.yellow(`  ${warnings.join(", ")}`));
      console.warn(pc.yellow(`  Supported: ${allowedKeys.join(", ")}`));
    }

    return validConfig;
  }

  async cleanup() {
    if (await fse.pathExists(this.tempRoot)) {
      await fse.remove(this.tempRoot);
    }
  }
}
