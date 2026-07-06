# AGENTS.md

Bun monorepo — Kumix shared configs (Biome, ESLint, tsconfig) + a private MCP server. Turborepo orchestrates builds; Biome lints/formats; vitest runs tests. ESM only. `engines`: node >=24, bun >=1.3.0. `packageManager`: bun@1.3.14.

## Packages (`packages/*`, no `apps/*` yet)

- `@kumix/eslint-config` — base ESLint flat config. Built with `tsc -p tsconfig.build.json`.
- `@kumix/eslint-config-react` — React preset. Built with `tsc -p tsconfig.build.json`.
- `@kumix/eslint-config-vite` — Vite/TanStack Router preset. Built with `tsc -p tsconfig.build.json`.
- `@kumix/tsconfig` — ships raw `tsconfig.*.json` (base/bun/cf/dom/next/node/react). **No build step.**
- `@kumix/biome-config` — ships raw `base.jsonc`. **No build step.**
- `@kumix/mcp` — private MCP server (`packages/mcp/src/index.ts`). Built with `tsc`. Ignored by changesets.

No `tsup` anywhere. Every package that builds uses `tsc`.

## Commands (run from root)

```bash
bun run build         # turbo build (dependsOn ^build)
bun run types:check   # turbo types:check (dependsOn ^build — builds deps first)
bun run lint          # biome check ONLY (does not run turbo lint)
bun run lint:fix      # biome check --write --unsafe ONLY
bun run format        # biome format --write
bun run test          # turbo run test (dependsOn ^build — builds deps first)
bun run test:watch    # turbo run test:watch
bun run test:coverage # turbo run test:coverage (dependsOn ^build, v8)
bun run clean:all     # turbo clean:all + rm -rf .turbo bun.lock node_modules (also deletes bun.lock)
```

There is no `lint` task in `turbo.json` — the root `lint`/`lint:fix` scripts invoke Biome only.

`bun run test` goes through turbo, so it gets `dependsOn: ["^build"]` and `dist/` is built first. The `test` and `test:coverage` tasks are declared in `turbo.json` (outputs `coverage/**`); `test:watch` is not, so turbo runs it uncached with defaults.

## Testing

Each of the three ESLint packages has its own `vitest.config.ts` (`projects: ["test"]`) with tests in `packages/*/test/*.test.ts`. The root has no `vitest.config.ts` — `bun run test` delegates to `turbo run test`, which runs each package's `test` script. `@kumix/biome-config` and `@kumix/tsconfig` have no `test` script and are skipped. `@kumix/mcp`'s `test` script is `node dist/index.js --test`, a smoke check that requires a prior build.

Coverage (v8) is configured per-package in each `vitest.config.ts` with relaxed 40% tripwire thresholds (config presets have few exercisable branches). Run a single package's tests via turbo: `bunx turbo run test --filter=@kumix/eslint-config`. The ESLint config tests import each package's `src/` and assert its preset composition, so they don't need `dist/`.

## Linting quirks

- Root `biome.jsonc` extends `@kumix/biome-config/base` with no extra overrides. The `test` dir is **linted** (the previous `!!**/test` exclusion was removed when test infra was split per-package), so test files must pass Biome like the rest of the codebase.
- `lint-staged` (in root `package.json`, no separate file): JS/TS → `biome check --write`, MD/YAML → `prettier --write`, JSON/JSONC/HTML → `biome format --write`. All use `--no-errors-on-unmatched`.

## Git hooks & commits

- Husky pre-commit runs lint-staged; commit-msg runs commitlint.
- Commitlint (`.commitlintrc.cjs`): `@commitlint/config-conventional`. Allowed types: `feat`, `feature`, `fix`, `refactor`, `docs`, `build`, `test`, `ci`, `chore`.

## Publishing

```bash
bun run version   # changeset version && bun update
bun run release   # bash ./scripts/publish.sh
```

`scripts/publish.sh` finds every `packages/*/package.json`, skips `"private": true`, queries the npm registry for the already-published version, skips the package if it matches, otherwise runs `bun publish`, then `changeset tag`. Changesets: `commit: false` (no auto-commit), `baseBranch: main`, `bumpVersionsWithWorkspaceProtocolOnly: true`, `updateInternalDependencies: "patch"`, `ignore: ["@kumix/mcp"]`. The `patch` internal-dep policy means a change to one package ripples a patch bump to its workspace dependents (e.g. a change to `@kumix/eslint-config` also bumps `-react` and `-vite`).

## Dependency notes

Internal deps use `workspace:*`. The root `catalog` is currently empty — `typescript` is pinned directly at `^6.0.3` in each package, not via `catalog:`.
