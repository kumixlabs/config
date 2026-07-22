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
bun run lint          # biome check ONLY
bun run lint:fix      # biome check --write --unsafe ONLY
bun run format        # biome format --write
bun run test          # turbo run test (dependsOn ^build — builds deps first)
bun run test:watch    # turbo run test:watch
bun run test:coverage # turbo run test:coverage (dependsOn ^build, v8)
bun run clean:all     # turbo clean:all + rm -rf .turbo bun.lock .husky/_ node_modules
```

There is no `lint` task in `turbo.json` — the root `lint`/`lint:fix` scripts invoke Biome only.

`bun run test` goes through turbo with `dependsOn: ["^build"]` — this builds each package's **dependencies**, not the package itself. The three ESLint packages' tests import `src/` directly, so they don't need `dist/`. `@kumix/mcp`'s test (`node dist/index.js --test`) **does** need its own `dist/`, which turbo does not build for it — run `bun run build` first or the MCP test fails. The `test`, `test:coverage`, and `test:watch` tasks are all declared in `turbo.json`. `test` and `test:coverage` output `coverage/**`; `test:watch` is uncached and persistent (watch mode, also depends on `^build`).

## Testing

Each of the three ESLint packages has its own `vitest.config.ts` (`include: ["test/**/*.test.ts"]`) with tests in `packages/*/test/*.test.ts`. The root has no `vitest.config.ts` — `bun run test` delegates to `turbo run test`, which runs each package's `test` script. `@kumix/biome-config` and `@kumix/tsconfig` have no `test` script and are skipped.

Coverage (v8) is configured per-package in each `vitest.config.ts` with 90% line / 85% branch thresholds. Run a single package's tests via turbo: `bunx turbo run test --filter=@kumix/eslint-config`.

## Linting quirks

- Root `biome.jsonc` extends `@kumix/biome-config/base` with no extra overrides. The `test` dir is **linted** (the previous `!!**/test` exclusion was removed when test infra was split per-package), so test files must pass Biome like the rest of the codebase.
- `lint-staged` (in root `package.json`, no separate file): JS/TS → `biome check --write`, MD/YAML → `prettier --write`, JSON/JSONC/HTML → `biome format --write`. All use `--no-errors-on-unmatched`.

## CI

Both workflows (`.github/workflows/`) gate on the same sequence: `build -> lint -> types:check -> test`. `lint.yml` runs on PRs to `main`; `release.yml` runs on push to `main` touching `.changeset/**` or `packages/**`. Release is automated — `changesets/action` opens a "version packages" PR, then publishes via `bun run release` (which calls `scripts/publish.sh`). Do not run `bun run release` locally.

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

Internal deps use `workspace:*`. The root `catalog` pins `typescript` at `6.0.3`; every package references it via `"typescript": "catalog:"`.
