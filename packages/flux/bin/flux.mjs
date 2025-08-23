#!/usr/bin/env node
import { cac } from "cac";
import { createServer, preview, mergeConfig } from "vite";
import fse from "fs-extra";
import path from "node:path";
import pc from "picocolors";
import { FluxBuilder } from "../src/builder.mjs";
import { createDevPlugin } from "../src/dev-plugin.mjs";

const cli = cac("flux");

async function loadUserConfig() {
  const configPaths = [
    path.resolve("flux.config.mjs"),
    path.resolve("flux.config.js"),
  ];

  for (const configPath of configPaths) {
    try {
      if (await fse.pathExists(configPath)) {
        const mod = await import(configPath);
        const config = mod?.default || mod || {};
        return validateConfig(config, configPath);
      }
    } catch {
      // Continue to next config path
    }
  }

  return {};
}

function validateConfig(config, configPath) {
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
    const relativePath = path.relative(".", configPath);
    console.warn(
      pc.yellow(`! Flux ignored unsupported options in ${relativePath}:`),
    );
    console.warn(pc.yellow(`  ${warnings.join(", ")}`));
    console.warn(pc.yellow(`  Supported: ${allowedKeys.join(", ")}`));
  }

  return validConfig;
}

// DEV: Use minimal plugin for dev server routing
cli
  .command("dev", "Start development server")
  .option("-p, --port <port>", "Port number", { default: 3589 })
  .option("-d, --draft", "Include draft files (prefixed with _)")
  .action(async (options) => {
    if (options.draft) process.env.FLUX_DRAFT = "1";

    const userConfig = await loadUserConfig();
    const viteConfig = mergeConfig(
      {
        plugins: [
          createDevPlugin(), // Minimal plugin for dev routing only
          ...(userConfig.plugins || []),
        ],
      },
      {
        server: { port: Number(options.port) },
        ...userConfig, // Allow user to override other Vite options
      },
    );

    const server = await createServer(viteConfig);
    await server.listen();
    server.printUrls();
  });

// BUILD: Orchestrate the entire build process
cli.command("build", "Build for production").action(async () => {
  const builder = new FluxBuilder();
  await builder.build();
});

// PREVIEW: Standard Vite preview of built files
cli
  .command("preview", "Preview production build")
  .option("-p, --port <port>", "Port number", { default: 4589 })
  .action(async (options) => {
    const viteConfig = {
      build: {
        outDir: path.resolve("_site"),
      },
      preview: {
        port: Number(options.port),
      },
    };

    const server = await preview(viteConfig);
    server.printUrls();
  });

cli.help();
cli.parse();
