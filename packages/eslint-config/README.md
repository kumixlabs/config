# @kumix/eslint-config

[![Version](https://img.shields.io/npm/v/@kumix/eslint-config.svg)](https://www.npmjs.com/package/@kumix/eslint-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Common ESLint configuration.

This package is only available via ES Modules and requires ESLint 9 or greater, since it uses flat configs.

## Installation

```bash
bun add -D @kumix/eslint-config eslint typescript
```

## Configuration

This package exposes a single flat config, designed to run alongside [`@kumix/biome-config`](https://www.npmjs.com/package/@kumix/biome-config) (Biome handles formatting and import sorting, ESLint handles type-aware linting).

It is available under two named exports, `base` and `fast`, which are currently aliases of the same config — use whichever name you prefer.

```js
// eslint.config.js
import { configs } from "@kumix/eslint-config";

export default [
  ...configs.base,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
```

### What's included

- ESLint recommended rules (`@eslint/js`)
- typescript-eslint `strictTypeChecked` + `stylisticTypeChecked` (type-aware)
- Turborepo config (`eslint-config-turbo`)
- Browser, ES2024, and worker globals; CommonJS handling for `*.cjs` and common config files
- Type checking disabled for plain `.js`/`.cjs`/`.mjs` files
- Ignores: `**/.wrangler/**`, `dist/**`, and Vite timestamp files

### Custom rules

- `@typescript-eslint/explicit-member-accessibility`: error (no `public` keyword)
- `@typescript-eslint/naming-convention`: private members must be `camelCase` with a leading underscore
- `no-unused-vars` / `@typescript-eslint/no-unused-vars`: off (handled by Biome)
- `@typescript-eslint/no-non-null-assertion`: off (handled by Biome)

## Biome Integration

This config intentionally leaves formatting and import sorting to Biome, and focuses ESLint on type-aware linting that Biome can't do. Rules already covered by Biome (unused variables, `==` vs `===`, non-null assertions) are turned off here to avoid duplicate reporting.

**For the best experience, pair it with [`@kumix/biome-config`](https://www.npmjs.com/package/@kumix/biome-config):**

```bash
bun add -D @kumix/biome-config @biomejs/biome
```

```jsonc
// biome.jsonc
{
  "$schema": "https://biomejs.dev/schemas/latest/schema.json",
  "extends": ["@kumix/biome-config/base"],
}
```

### Division of responsibilities

| Concern                                   | Handled by |
| ----------------------------------------- | ---------- |
| Formatting                                | Biome      |
| Import sorting / organizing               | Biome      |
| Unused imports / variables                | Biome      |
| `==` vs `===` (`noDoubleEquals`)          | Biome      |
| Type-aware linting (`strictTypeChecked`)  | ESLint     |
| Stylistic type rules                      | ESLint     |
| Naming conventions & member accessibility | ESLint     |

## Links

- [npm Package](https://www.npmjs.com/package/@kumix/eslint-config)
- [Contributing Guide](../../CONTRIBUTING.md)
- [Code of Conduct](../../CODE_OF_CONDUCT.md)
- [License](../../LICENSE)

## License

MIT © [Kumix Labs](../../LICENSE)
