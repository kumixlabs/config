---
"@kumix/biome-config": minor
---

Initial release of `@kumix/biome-config`.

Opinionated Biome configuration shipped as a raw `.jsonc` preset, consumed via `extends: ["@kumix/biome-config/base"]`. Includes:

- Formatter defaults: 2-space indent, LF line endings, 100 line width, double quotes, always semicolons, trailing commas.
- Recommended linter rules with pragmatic a11y opt-outs and a curated set of style/suspicious rules (`useConst`, `useTemplate`, `noExplicitAny`, `noDoubleEquals`, etc.).
- Import organization via `assist.organizeImports` with grouping for URL/Node/Bun built-ins, React, Next, third-party, `@kumix/**`, and `@repo/**`.
- JSON, HTML (experimental full support), and CSS (Tailwind directives) formatting.
