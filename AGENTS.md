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
bun run test          # vitest run — runs root vitest.config.ts DIRECTLY, bypasses turbo
bun run test:coverage # vitest run --coverage (v8)
bun run clean:all     # turbo clean:all + rm -rf .turbo coverage node_modules (keeps bun.lock)
```

There is no `lint` task in `turbo.json` — the root `lint`/`lint:fix` scripts invoke Biome only.

`bun run test` bypasses turbo, so it does NOT get turbo's `dependsOn: ["^build"]`. Build first if a test needs `dist/`.

## Testing

`vitest.config.ts` uses `projects: ["packages/*"]` — each package is its own vitest project. The three ESLint packages have tests in `packages/*/test/*.test.ts`; Biome ignores any `test` dir (see below). `@kumix/mcp`'s `test` script is `node dist/index.js --test`, a smoke check that requires a prior build.

Run a single package's tests: `bun run test -- --run eslint-config`. The ESLint config tests import each package's `src/` and assert its preset composition, so they don't need `dist/`.

## Linting quirks

- Root `biome.jsonc` extends `@kumix/biome-config/base` and sets `"includes": ["!!**/test"]` — Biome ignores any `test` directory.
- `lint-staged` (in root `package.json`, no separate file): JS/TS → `biome check --write`, MD/YAML → `prettier --write`, JSON/JSONC/HTML → `biome format --write`. All use `--no-errors-on-unmatched`.

## Git hooks & commits

- Husky pre-commit runs lint-staged; commit-msg runs commitlint.
- Commitlint (`.commitlintrc.cjs`): `@commitlint/config-conventional`. Allowed types: `feat`, `feature`, `fix`, `refactor`, `docs`, `build`, `test`, `ci`, `chore`.

## Publishing

```bash
bun run version   # changeset version && bun update
bun run release   # bash ./scripts/publish.sh
```

`scripts/publish.sh` finds every `packages/*/package.json`, skips `"private": true`, runs `bun publish`, then `changeset tag`. Changesets: `commit: false` (no auto-commit), `baseBranch: main`, `bumpVersionsWithWorkspaceProtocolOnly: true`, `ignore: ["@kumix/mcp"]`.

## Dependency notes

Internal deps use `workspace:*`. The root `catalog` is currently empty — `typescript` is pinned directly at `^6.0.3` in each package, not via `catalog:`.
