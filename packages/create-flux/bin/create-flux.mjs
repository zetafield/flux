#!/usr/bin/env node
import { cac } from "cac";
import fse from "fs-extra";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pc from "picocolors";
import prompts from "prompts";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.resolve(__dirname, "../templates");

const cli = cac("create-flux");

cli.version(require('../package.json').version);

// Detect package manager from user agent or process
function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent || "";

  // Debug: uncomment to see user agent in development
  // console.log(`DEBUG: User agent: "${userAgent}"`);

  if (userAgent.includes("pnpm")) return "pnpm";
  if (userAgent.includes("yarn")) return "yarn";
  if (userAgent.includes("bun")) return "bun";
  if (userAgent.includes("npm")) return "npm";

  // Fallback: default to npm when user agent is not set or unrecognized
  return "npm";
}

async function writeJson(file, obj) {
  await fse.ensureDir(path.dirname(file));
  await fs.writeFile(file, `${JSON.stringify(obj, null, 2)}\n`, "utf8");
}

function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function scaffold(targetDir, options) {
  const dir = path.resolve(process.cwd(), targetDir);
  const name = path.basename(dir);
  const packageManager = detectPackageManager();
  await fse.ensureDir(dir);

  console.log(pc.cyan(`• Creating project structure...`));

  // Generate template-based content
  console.log(pc.cyan(`• Creating ${options.template} template...`));
  await createTemplateContent(dir, options);

  console.log(pc.green(`✓ Project created at ${dir}`));
  console.log();
  console.log("Next steps:");
  console.log(pc.cyan(`  cd ${path.basename(dir)}`));

  // Use detected package manager for suggestions
  if (packageManager === "yarn") {
    console.log(pc.cyan("  yarn install"));
    console.log(pc.cyan("  yarn dev"));
  } else if (packageManager === "bun") {
    console.log(pc.cyan("  bun install"));
    console.log(pc.cyan("  bun run dev"));
  } else if (packageManager === "pnpm") {
    console.log(pc.cyan("  pnpm install"));
    console.log(pc.cyan("  pnpm dev"));
  } else {
    // npm or fallback
    console.log(pc.cyan("  npm install"));
    console.log(pc.cyan("  npm run dev"));
  }
}

async function createTemplateContent(dir, options) {
  const { template } = options;
  const name = path.basename(dir);

  // Helper function for workspace detection
  async function findWorkspaceRoot(startDir) {
    let cur = startDir;
    while (true) {
      const candidate = path.join(cur, "pnpm-workspace.yaml");
      if (await fse.pathExists(candidate)) return cur;
      const next = path.dirname(cur);
      if (next === cur) return null;
      cur = next;
    }
  }

  // Common package.json creation
  async function createPackageJson() {
    const workspaceRoot = await findWorkspaceRoot(dir);
    const fluxVersion = workspaceRoot ? "workspace:*" : "^0.0.0";

    const pkg = {
      name: options.packageName || toKebabCase(name),
      description: options.description || "A static site built with Flux",
      private: true,
      type: "module",
      scripts: {
        dev: "flux dev",
        build: "flux build",
        preview: "flux preview",
      },
      devDependencies: {
        "@zetafield/flux": fluxVersion,
      },
    };
    await writeJson(path.join(dir, "package.json"), pkg);
  }

  // Replace placeholders in file content
  function replacePlaceholders(content, replacements) {
    let result = content;
    for (const [placeholder, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(placeholder, "g"), value);
    }
    return result;
  }

  // Copy template files and process placeholders
  async function copyTemplate(templateName) {
    const templatePath = path.join(templatesDir, templateName);
    const replacements = {
      "{{PROJECT_NAME}}": options.projectName || name,
      "{{PROJECT_DESCRIPTION}}":
        options.description || "A static site built with Flux",
    };

    // Copy all files from template directory
    const copyWithPlaceholders = async (src, dest) => {
      const stat = await fs.stat(src);

      if (stat.isDirectory()) {
        await fse.ensureDir(dest);
        const entries = await fs.readdir(src);
        for (const entry of entries) {
          await copyWithPlaceholders(
            path.join(src, entry),
            path.join(dest, entry),
          );
        }
      } else {
        const content = await fs.readFile(src, "utf8");
        const processedContent = replacePlaceholders(content, replacements);
        await fs.writeFile(dest, processedContent, "utf8");
      }
    };

    await copyWithPlaceholders(templatePath, dir);
  }

  if (template === "empty") {
    // Empty template - only package.json
    await createPackageJson();
    return;
  }

  if (template === "minimal" || template === "blog") {
    // Copy template files
    await copyTemplate(template);

    // Create package.json (overwrites template placeholder if exists)
    await createPackageJson();
  }
}

cli
  .command("[dir]", "Create a new Flux site")
  .option("-y, --yes", "Skip prompts and use defaults", { default: false })
  .action(async (dir, flags) => {
    console.log(pc.blue("* Welcome to Flux! Let's create your static site."));
    console.log();

    if (flags.yes) {
      // Use defaults for --yes flag
      const target = dir || "my-flux-site";
      const targetPath = path.resolve(process.cwd(), target);

      // Check if directory exists and is not empty
      if (await fse.pathExists(targetPath)) {
        try {
          const items = await fs.readdir(targetPath);
          if (items.length > 0) {
            console.log(pc.red(`! Directory "${target}" is not empty.`));
            console.log(
              pc.yellow(
                "  Please choose an empty directory or remove existing files.",
              ),
            );
            process.exit(1);
          }
        } catch (error) {
          console.log(pc.red(`! Cannot access directory "${target}".`));
          console.log(pc.yellow("  Please check permissions."));
          process.exit(1);
        }
      }

      await scaffold(target, {
        projectName: "My Flux Site",
        packageName: toKebabCase("My Flux Site"),
        description: "A static site built with Flux",
        template: "minimal",
      });
      return;
    }

    const response = await prompts([
      {
        type: "text",
        name: "projectName",
        message: "Project name:",
        initial: "My Flux Site",
        validate: (value) => (value.trim() ? true : "Project name is required"),
      },
      {
        type: "text",
        name: "targetDir",
        message: "Where should we create your project?",
        initial: (prev) => `./${toKebabCase(prev)}`,
        validate: (value) => (value.trim() ? true : "Directory is required"),
      },
      {
        type: "text",
        name: "description",
        message: "Description (optional):",
        initial: "A static site built with Flux",
      },
      {
        type: "select",
        name: "template",
        message: "Choose a starter template:",
        choices: [
          { title: "Empty - Only package.json, build from scratch", value: "empty" },
          { title: "Minimal - Homepage with basic layout", value: "minimal" },
          {
            title: "Blog - Ready for blogging with post layouts",
            value: "blog",
          },
        ],
        initial: 1, // Default to Minimal
      },
    ]);

    // Handle user cancellation
    if (!response.projectName || !response.targetDir) {
      console.log(pc.yellow("! Setup cancelled"));
      process.exit(1);
    }

    // Check if directory exists and is not empty before scaffolding
    const targetPath = path.resolve(process.cwd(), response.targetDir.trim());
    if (await fse.pathExists(targetPath)) {
      try {
        const items = await fs.readdir(targetPath);
        if (items.length > 0) {
          console.log(
            pc.red(`! Directory "${response.targetDir.trim()}" is not empty.`),
          );
          console.log(
            pc.yellow(
              "  Please run the command again with an empty directory.",
            ),
          );
          process.exit(1);
        }
      } catch (error) {
        console.log(
          pc.red(`! Cannot access directory "${response.targetDir.trim()}".`),
        );
        console.log(pc.yellow("  Please check permissions and try again."));
        process.exit(1);
      }
    }

    await scaffold(response.targetDir.trim(), {
      projectName: response.projectName.trim(),
      packageName: toKebabCase(response.projectName.trim()),
      description:
        response.description?.trim() || "A static site built with Flux",
      template: response.template,
    });
  });

cli
  .help((sections) => {
    sections.push('');
    sections.push('Examples:');
    sections.push('  $ npm create @zetafield/flux');
    sections.push('  $ npm create @zetafield/flux my-site -y');
    sections.push('  $ pnpm create @zetafield/flux');
    sections.push('');
    sections.push('Templates:');
    sections.push('  empty    Only package.json - build from scratch');
    sections.push('  minimal  Homepage with basic layout (default)');
    sections.push('  blog     Ready for blogging with post layouts');
  })
  .parse();
