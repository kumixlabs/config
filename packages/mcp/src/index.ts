#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { glob } from "glob";
import { z } from "zod";

// Check for test flag
const isTestMode = process.argv.includes("--test");

if (isTestMode) {
  console.log("✅ MCP server executable test passed");
  process.exit(0);
}

// Get current directory for ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Get the correct packages directory relative to this file
// This works regardless of where the server is run from
const PACKAGES_ROOT = resolve(__dirname, "..", "..");
const PACKAGES_DIR = PACKAGES_ROOT;

interface PackageInfo {
  name: string;
  version: string;
  description: string;
  main: string | undefined;
  exports: string[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  /** Source root for built packages; null for config-only packages. */
  srcDir: string | null;
  packageDir: string;
  componentFiles: string[];
  category: "config";
}

interface ComponentInfo {
  name: string;
  package: string;
  path: string;
  fullPath: string;
}

// Package information cache
const packages = new Map<string, PackageInfo>();
// Components are keyed by `${packageName}::${pathWithoutExt}` so files that
// share a basename across packages (e.g. `index.ts`, `tsconfig.*.json`) don't
// silently overwrite each other.
const components = new Map<string, ComponentInfo>();

class KumixConfigMCPServer {
  private async loadPackageInfo(): Promise<void> {
    try {
      // Scan packages directory (top-level packages only; nested copies under
      // node_modules are workspace symlinks of the same packages and would
      // otherwise be indexed twice).
      const packageDirs = await glob(join(PACKAGES_DIR, "**/package.json"), {
        windowsPathsNoEscape: true,
        ignore: ["**/node_modules/**", "**/dist/**"],
      });

      // Get parent directories of all package.json files
      const allPackageDirs = packageDirs.map((pkgJsonPath) => dirname(pkgJsonPath));

      for (const packageDir of allPackageDirs) {
        const packageJsonPath = join(packageDir, "package.json");

        try {
          await access(packageJsonPath);
          const packageJsonContent = await readFile(packageJsonPath, "utf-8");
          const packageJson = JSON.parse(packageJsonContent);

          if (packageJson.name?.startsWith("@kumix/") && packageJson.name !== "@kumix/mcp") {
            // Built packages keep their sources under src/; config-only packages
            // (biome-config, tsconfig) ship raw files from the package root.
            const srcDir = join(packageDir, "src");
            let componentRoot: string | null = null;

            try {
              await access(srcDir);
              componentRoot = srcDir;
            } catch (_error) {
              componentRoot = null;
            }

            let componentFiles: string[] = [];
            if (componentRoot) {
              // TypeScript/TSX sources for built packages
              componentFiles = await glob(join(componentRoot, "**/*.{ts,tsx}"), {
                windowsPathsNoEscape: true,
                ignore: ["**/*.test.ts", "**/*.test.tsx"],
              });
            } else {
              // Config-only packages: index raw config files from the package root
              // (e.g. base.jsonc, tsconfig.*.json). Skip manifests and changelogs.
              componentFiles = await glob(
                [
                  join(packageDir, "*.jsonc"),
                  join(packageDir, "tsconfig.*.json"),
                  join(packageDir, "*.json"),
                ],
                {
                  windowsPathsNoEscape: true,
                  ignore: ["**/package.json", "**/package-lock.json"],
                },
              );
            }

            // Extract exported components/members from package.json exports
            const exports = Object.keys(packageJson.exports || {})
              .filter((key) => key !== "./package.json")
              .map((key) => key.replace("./", ""));

            const packageInfo: PackageInfo = {
              name: packageJson.name,
              version: packageJson.version,
              description: packageJson.description,
              main: packageJson.main,
              exports: exports,
              dependencies: packageJson.dependencies || {},
              devDependencies: packageJson.devDependencies || {},
              srcDir: componentRoot,
              packageDir, // Store package root directory
              componentFiles,
              category: "config",
            };

            packages.set(packageJson.name, packageInfo);

            // Index every discovered file as a "component" so find/read works
            // for both src-bearing and config-only packages. Paths are stored
            // relative to the same root that readComponentCode joins against.
            // The composite key prevents collisions when multiple packages ship
            // files with the same basename (e.g. `index.ts`, `tsconfig.*.json`).
            const baseForRelative = componentRoot ?? packageDir;
            for (const componentFile of componentFiles) {
              const componentName = basename(componentFile, extname(componentFile));
              const relativePath = relative(baseForRelative, componentFile).replace(/\\/g, "/");
              const key = `${packageJson.name}::${relativePath}`;

              components.set(key, {
                name: componentName,
                package: packageJson.name,
                path: relativePath,
                fullPath: componentFile,
              });
            }
          }
        } catch (error) {
          // One malformed package.json shouldn't kill the whole index, but
          // silent swallowing makes missing packages impossible to debug.
          console.error(`Failed to load ${packageJsonPath}:`, error);
        }
      }
    } catch (error) {
      console.error("Error loading package info:", error);
    }
  }

  async listPackages(category: string = "all") {
    if (packages.size === 0) {
      await this.loadPackageInfo();
    }

    let filteredPackages = Array.from(packages.values());

    if (category !== "all") {
      filteredPackages = filteredPackages.filter((pkg) => pkg.category === category);
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              packages: filteredPackages.map((pkg) => ({
                name: pkg.name,
                version: pkg.version,
                description: pkg.description,
                category: pkg.category,
                exportsCount: pkg.exports.length,
              })),
              total: filteredPackages.length,
            },
            null,
            2,
          ),
        },
      ],
    };
  }

  async getPackageInfo(packageName: string) {
    if (packages.size === 0) {
      await this.loadPackageInfo();
    }

    const pkg = packages.get(packageName);
    if (!pkg) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                error: `Package ${packageName} not found`,
                availablePackages: Array.from(packages.keys()),
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(pkg, null, 2),
        },
      ],
    };
  }

  async findComponent(componentName: string, packageFilter?: string) {
    if (packages.size === 0) {
      await this.loadPackageInfo();
    }

    const needle = componentName.toLowerCase();
    let matchingComponents = Array.from(components.values()).filter((comp) =>
      comp.name.toLowerCase().includes(needle),
    );

    if (packageFilter) {
      // Match the unscoped suffix (e.g. "eslint-config" matches
      // "@kumix/eslint-config" but not "@kumix/eslint-config-react"),
      // case-insensitively. The full "@scope/name" identifier is also
      // accepted as an exact match.
      const filter = packageFilter.toLowerCase();
      const unscopedFilter = filter.replace(/^@[^/]+\//, "");
      matchingComponents = matchingComponents.filter((comp) => {
        const compUnscoped = comp.package.replace(/^@[^/]+\//, "").toLowerCase();
        return comp.package.toLowerCase() === filter || compUnscoped === unscopedFilter;
      });
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              components: matchingComponents,
              total: matchingComponents.length,
            },
            null,
            2,
          ),
        },
      ],
    };
  }

  async readComponentCode(packageName: string, componentPath: string) {
    if (packages.size === 0) {
      await this.loadPackageInfo();
    }

    const pkg = packages.get(packageName);
    if (!pkg) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                error: `Package ${packageName} not found`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    // Resolve against the package's source root (or package root for
    // config-only packages), then verify the result stays inside that root.
    // This blocks path-traversal via "../" segments in the caller input.
    const root = pkg.srcDir ?? pkg.packageDir;
    const fullPath = resolve(root, componentPath);
    const rel = relative(root, fullPath);
    if (rel.startsWith("..") || isAbsolute(rel)) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                error: "Component path escapes the package root",
                package: packageName,
                component: componentPath,
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    try {
      await access(fullPath);
      const code = await readFile(fullPath, "utf-8");

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                package: packageName,
                component: componentPath,
                code,
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (_error) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                error: `Component file not found: ${componentPath}`,
                package: packageName,
                searchedPath: rel,
              },
              null,
              2,
            ),
          },
        ],
      };
    }
  }

  async getUsageExample(packageName: string, componentName?: string) {
    if (packages.size === 0) {
      await this.loadPackageInfo();
    }

    const pkg = packages.get(packageName);
    if (!pkg) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                error: `Package ${packageName} not found`,
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    // Try to find README or examples
    const readmePath = pkg.srcDir
      ? join(pkg.srcDir, "..", "README.md")
      : join(pkg.packageDir, "README.md");

    try {
      await access(readmePath);
      const readme = await readFile(readmePath, "utf-8");

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                package: packageName,
                component: componentName,
                readme,
                note: componentName
                  ? `Specific examples for ${componentName} not found. Showing package README.`
                  : "Package README and usage examples",
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (_error) {
      // Generate basic usage example
      const example = this.generateUsageExample(packageName, componentName);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                package: packageName,
                component: componentName,
                example,
                note: "Generated usage example",
              },
              null,
              2,
            ),
          },
        ],
      };
    }
  }

  private generateUsageExample(packageName: string, componentName?: string): string {
    switch (packageName) {
      case "@kumix/biome-config":
        return `// Biome config usage example
// Add this to your project's biome.jsonc
{
  "$schema": "https://biomejs.dev/schemas/latest/schema.json",
  "extends": ["${packageName}/base"]
}`;

      case "@kumix/eslint-config":
      case "@kumix/eslint-config-react":
      case "@kumix/eslint-config-vite": {
        // The composed preset name differs per package.
        const fastPreset =
          packageName === "@kumix/eslint-config"
            ? "fast"
            : packageName === "@kumix/eslint-config-react"
              ? "reactFast"
              : "viteFast";
        const fullPreset =
          packageName === "@kumix/eslint-config"
            ? "base"
            : packageName === "@kumix/eslint-config-react"
              ? "reactFull"
              : "viteFull";
        return `// ESLint config usage example
// eslint.config.js
import { configs } from "${packageName}";

export default [
  // Full configuration
  // ...configs.${fullPreset},

  // Fast configuration optimized for Biome (recommended)
  ...configs.${fastPreset},
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];`;
      }

      case "@kumix/tsconfig":
        return `// TypeScript config usage example
// Extend in your tsconfig.json:
{
  "extends": "${packageName}/base",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}

// Or pick a preset:
//   ${packageName}/bun · /cf · /dom · /next · /node · /react`;

      default:
        if (componentName) {
          return `// Example usage for ${packageName} (${componentName})
import { ${componentName} } from "${packageName}";`;
        }
        return `// Example usage for ${packageName}
// See the package README for specific export shapes.`;
    }
  }
}

// Create server instance
const server = new McpServer({
  name: "Kumix Config",
  version: "0.1.0",
});

// Instance of our business logic
const kumixServer = new KumixConfigMCPServer();

// Register tools using the new API
server.registerTool(
  "list_packages",
  {
    description: "List all available Kumix config packages",
    inputSchema: {
      category: z.enum(["config", "all"]).default("all").describe("Filter packages by category"),
    },
  },
  async ({ category }) => {
    const result = await kumixServer.listPackages(category || "all");
    return result;
  },
);

server.registerTool(
  "get_package_info",
  {
    description: "Get detailed information about a specific package",
    inputSchema: {
      package_name: z
        .string()
        .min(1, "Package name is required")
        .describe("The name of the package (e.g., @kumix/biome-config)"),
    },
  },
  async ({ package_name }) => {
    const result = await kumixServer.getPackageInfo(package_name);
    return result;
  },
);

server.registerTool(
  "find_component",
  {
    description: "Find a specific component in the packages",
    inputSchema: {
      component_name: z
        .string()
        .min(1, "Component name is required")
        .describe("The name of the component to find"),
      package_filter: z
        .string()
        .optional()
        .describe("Optional package to search in (e.g., eslint-config, eslint-config-react)"),
    },
  },
  async ({ component_name, package_filter }) => {
    const result = await kumixServer.findComponent(component_name, package_filter);
    return result;
  },
);

server.registerTool(
  "read_component_code",
  {
    description: "Read the source code of a specific component",
    inputSchema: {
      package_name: z
        .string()
        .min(1, "Package name is required")
        .describe("The package containing the component"),
      component_path: z
        .string()
        .min(1, "Component path is required")
        .describe("The relative path to the component from src/"),
    },
  },
  async ({ package_name, component_path }) => {
    const result = await kumixServer.readComponentCode(package_name, component_path);
    return result;
  },
);

server.registerTool(
  "get_usage_example",
  {
    description: "Get usage examples for a package or specific component",
    inputSchema: {
      package_name: z
        .string()
        .min(1, "Package name is required")
        .describe("The package to get examples for"),
      component_name: z.string().optional().describe("Optional specific component name"),
    },
  },
  async ({ package_name, component_name }) => {
    const result = await kumixServer.getUsageExample(package_name, component_name);
    return result;
  },
);

/**
 * Main entry point for the Kumix Config MCP Server
 *
 * This script initializes the MCP server using the official MCP SDK and
 * provides tools and resources for exploring the config packages.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Kumix Config MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
