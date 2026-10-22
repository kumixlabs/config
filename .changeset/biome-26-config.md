---

## "@kumix/biome-config": minor

Update config for Biome 2.6:
- Replace deprecated `linter.rules.recommended` with `"preset": "recommended"`
- Rename `nursery.useSortedClasses` to `nursery.useTailwindSortedClasses` (Tailwind v4 sorting semantics)
- Move Tailwind function list to top-level `tailwind` config: `mergeFunctions` (`cn`, `clsx`, `tw`, `tw.*`) and `variantFunctions` (`cva`)
- Enable new Tailwind nursery rules as warnings: `useTailwindStaticClassStrings`, `noTailwindRawColors`, `noTailwindRestyledComponents`
- Expand default ignore dirs (`.cloudflare`, `.nitro`, `.tanstack`, `.wrangler`, `dist-ssr`, `routeTree.gen.ts`)
- Bump peer `@biomejs/biome` to `>=2.6.0`
