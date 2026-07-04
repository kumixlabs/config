---
"@kumix/tsconfig": minor
---

Initial release of `@kumix/tsconfig`.

Extendable TypeScript configuration presets targeting ES2022 with strict mode, bundler module resolution, and declaration output. Presets are resolved through an `exports` map (e.g. `@kumix/tsconfig/base`):

- `base` — general TypeScript projects.
- `dom` — adds DOM libs for browser code.
- `react` — extends `dom`, enables the automatic JSX runtime, type-check only.
- `next` — extends `react` for Next.js projects.
- `node` — adds Node.js types.
- `bun` — adds Bun types.
- `cf` — adds Cloudflare Workers types.

`outDir` is intentionally left to the consumer, since a relative `outDir` in a shared config would resolve against this package rather than the consuming project.
