# @kumix/biome-config

## 0.2.1

### Patch Changes

- [`20c3c19`](https://github.com/kumixlabs/config/commit/20c3c19e7a5dfa85f65b1df66939c0bbfe0a5772) Thanks [@kumixio](https://github.com/kumixio)! - Fix docs: Tailwind nursery rules (`useTailwindStaticClassStrings`, `noTailwindRawColors`, `noTailwindRestyledComponents`) are off by default, not warn. Opt in per project.

## 0.2.0

### Minor Changes

- [`3245f82`](https://github.com/kumixlabs/config/commit/3245f82b41cd79928165bd750b648c707e2d3307) Thanks [@kumixio](https://github.com/kumixio)! - Update config for Biome 2.6:
  - Replace deprecated `linter.rules.recommended` with `"preset": "recommended"`
  - Rename `nursery.useSortedClasses` to `nursery.useTailwindSortedClasses` (Tailwind v4 sorting semantics)
  - Move Tailwind function list to top-level `tailwind` config: `mergeFunctions` (`cn`, `clsx`, `tw`, `tw.*`) and `variantFunctions` (`cva`)
  - Enable new Tailwind nursery rules as warnings: `useTailwindStaticClassStrings`, `noTailwindRawColors`, `noTailwindRestyledComponents`
  - Expand default ignore dirs (`.cloudflare`, `.nitro`, `.tanstack`, `.wrangler`, `dist-ssr`, `routeTree.gen.ts`)
  - Exclude `.changeset/` from formatting and linting
  - Bump peer `@biomejs/biome` to `>=2.6.0`

## 0.1.0

### Minor Changes

- [`96744ad`](https://github.com/kumixlabs/config/commit/96744ad4cef9beae5d3f063f491f5dc6b6e5792b) Thanks [@kumixio](https://github.com/kumixio)! - Initial release of `@kumix/biome-config`.

  Opinionated Biome configuration shipped as a raw `.jsonc` preset, consumed via `extends: ["@kumix/biome-config/base"]`. Includes:
  - Formatter defaults: 2-space indent, LF line endings, 100 line width, double quotes, always semicolons, trailing commas.
  - Recommended linter rules with pragmatic a11y opt-outs and a curated set of style/suspicious rules (`useConst`, `useTemplate`, `noExplicitAny`, `noDoubleEquals`, etc.).
  - Import organization via `assist.organizeImports` with grouping for URL/Node/Bun built-ins, React, Next, third-party, `@kumix/**`, and `@repo/**`.
  - JSON, HTML (experimental full support), and CSS (Tailwind directives) formatting.
