---
"@kumix/eslint-config": minor
---

Initial release of `@kumix/eslint-config`.

Flat ESLint config (ESLint 9+, ESM-only) focused on type-aware linting, designed to run alongside `@kumix/biome-config` which handles formatting and import sorting. Includes:

- ESLint recommended rules plus typescript-eslint `strictTypeChecked` and `stylisticTypeChecked`.
- Turborepo config via `eslint-config-turbo`.
- Browser, ES2024, and worker globals, with CommonJS handling for `*.cjs` and common config files, and type checking disabled for plain `.js`/`.cjs`/`.mjs`.
- Custom rules: enforced member accessibility (no `public` keyword) and leading-underscore naming for private members; rules covered by Biome (unused vars, non-null assertions) turned off.

Exposed as `configs.base` and `configs.fast` (currently aliases of the same config).
