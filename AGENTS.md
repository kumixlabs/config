# AGENTS.md

Bun monorepo containing shared development configurations (ESLint, Biome, TypeScript) and a private MCP helper server. Turborepo orchestrates tasks, Biome lints/formats, and Vitest runs tests.

## Package Architecture

Every package is located in `packages/`. No `apps/` directories exist yet.

- **Build-reliant packages** (use `tsc` to build):
  - `@kumix/eslint-config` — Base ESLint flat config. Built with `tsc -p tsconfig.build.json`.
  - `@kumix/eslint-config-react` — React ESLint preset. Built with `tsc -p tsconfig.build.json`. Depends on `@kumix/eslint-config`.
  - `@kumix/eslint-config-vite` — Vite and React Refresh preset. Built with `tsc -p tsconfig.build.json`. Depends on `@kumix/eslint-config` & `-react`.
  - `@kumix/mcp` — Private Model Context Protocol server. Built with `tsc`.
- **Config-only packages** (no build step, ship raw configs from root):
  - `@kumix/tsconfig` — TypeScript base & platform-specific configs.
  - `@kumix/biome-config` — Shared Biome config rules (`base.jsonc`).

Internal packages reference each other via `"workspace:*"` protocol. All packages use TypeScript `6.0.3` via the root `"typescript": "catalog:"`.

## Task Commands

Run all command scripts from the workspace root:

- `bun run build` — Builds all packages via turbo (depends on `^build`).
- `bun run types:check` — Runs `tsc --noEmit` on packages (depends on `^build`).
- `bun run lint` — Runs Biome lints over the codebase (no turbo task).
- `bun run lint:fix` — Automatically corrects safe/unsafe Biome violations.
- `bun run format` — Formats files via Biome.
- `bun run test` — Runs Vitest unit tests (depends on `^build`).
- `bun run clean:all` — Clears cache files, node_modules, build outputs, and lock files.

### Verifying Changes

- **Test one package:** `bunx turbo run test --filter=@kumix/eslint-config`
- **MCP Server execution check:** `@kumix/mcp` test script runs its executable output with `--test` to verify load behavior. **Important:** Run `bun run build` before testing `@kumix/mcp` as its test runs against the compiled `dist/index.js` artifact. Vitest tests for the eslint packages run against `src/` directly and do not require a build first.

## CI & Publishing

- **CI Pipeline:** Pull request validation (`lint.yml`) runs the following sequence: `build -> lint -> types:check -> test`.
- **Releasing:** Triggered automatically via push to `main` with package updates. The release workflow uses Changesets. Do not invoke `bun run release` locally.
- **Changesets Quirks:**
  - `@kumix/mcp` is ignored in Changesets config (never versioned or published).
  - `updateInternalDependencies` is set to `"patch"`. A change to `@kumix/eslint-config` will trigger automatic version updates across all React and Vite ESLint presets.

## Operational Gotchas

- **No tsup/bundlers:** Package compilation relies strictly on `tsc`.
- **No lint task in turbo:** Biome acts directly on the workspace layout. It also lints all package tests (the `test/` directory is not excluded).
