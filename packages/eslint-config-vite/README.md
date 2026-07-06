# @kumix/eslint-config-vite

[![Version](https://img.shields.io/npm/v/@kumix/eslint-config-vite.svg)](https://www.npmjs.com/package/@kumix/eslint-config-vite)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ESLint configuration for Vite projects with React Refresh support.

This package is only available via ES Modules and requires ESLint 9 or greater, since it uses flat configs.

## Installation

```bash
bun add -D @kumix/eslint-config-vite eslint typescript
```

## Configurations

This package provides two configurations:

- **viteFull** - Full configuration extending `@kumix/eslint-config-react` reactFull with React Refresh rules
- **viteFast** - Performance-optimized configuration extending `@kumix/eslint-config-react` reactFast with React Refresh rules

### Recommended Starter Configuration

For most Vite React projects, use the fast configuration with TypeScript project settings:

```js
// eslint.config.js
import { configs } from "@kumix/eslint-config-vite";

export default [
  // Full configuration
  // ...configs.viteFull,
  // Fast configuration optimized for Biome (recommended)
  ...configs.viteFast,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
```

## React Refresh Plugin

This configuration adds the `eslint-plugin-react-refresh` plugin to ensure your React components work properly with Vite's Hot Module Replacement (HMR):

### Key Rules

- **react-refresh/only-export-components** - Warns when files export things other than React components, which can break HMR
  - Uses the plugin's `configs.vite` preset defaults

## Biome Integration

When using `viteFast`, you get the same React and Vite-specific rules but with the performance benefits from the base fast configuration. **For optimal performance, use [`@kumix/biome-config`](https://www.npmjs.com/package/@kumix/biome-config)** alongside the fast configuration:

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

### `viteFull` vs `viteFast`

`viteFull` extends `@kumix/eslint-config-react`'s `reactFull` and `viteFast` extends `reactFast`, each adding the Vite/React Refresh layer. The underlying `reactFull` and `reactFast` presets are currently identical, so both Vite presets resolve to the same rule set today — pick whichever name reads best for your project.

### Vite & React-Specific Rules

Both presets add the same layers, since Biome has no equivalents:

- Everything from `@kumix/eslint-config-react` (React, React Hooks, TanStack Query)
- TanStack Router linting (`@tanstack/eslint-plugin-router`, `flat/recommended`)
- React Refresh rules for Vite HMR (`eslint-plugin-react-refresh`, `configs.vite`)

See the [@kumix/eslint-config README](https://github.com/kumixlabs/config/tree/main/packages/eslint-config#biome-integration) for the full list of rules handled by Biome.

## Links

- [npm Package](https://www.npmjs.com/package/@kumix/eslint-config-vite)
- [Contributing Guide](../../../CONTRIBUTING.md)
- [Code of Conduct](../../../CODE_OF_CONDUCT.md)
- [License](../../../LICENSE)

## License

MIT © [Kumix Labs](../../../LICENSE)
