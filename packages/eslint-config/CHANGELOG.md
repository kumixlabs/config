# @kumix/eslint-config

## 0.1.0

### Minor Changes

- [`96744ad`](https://github.com/kumixlabs/config/commit/96744ad4cef9beae5d3f063f491f5dc6b6e5792b) Thanks [@kumixio](https://github.com/kumixio)! - Initial release of `@kumix/eslint-config`.

  Flat ESLint config (ESLint 9+, ESM-only) focused on type-aware linting, designed to run alongside `@kumix/biome-config` which handles formatting and import sorting. Includes:
  - ESLint recommended rules plus typescript-eslint `strictTypeChecked` and `stylisticTypeChecked`.
  - Turborepo config via `eslint-config-turbo`.
  - Browser, ES2024, and worker globals, with CommonJS handling for `*.cjs` and common config files, and type checking disabled for plain `.js`/`.cjs`/`.mjs`.
  - Custom rules: enforced member accessibility (no `public` keyword) and leading-underscore naming for private members; rules covered by Biome (unused vars, non-null assertions) turned off.

  Exposed as `configs.base` and `configs.fast` (currently aliases of the same config).
