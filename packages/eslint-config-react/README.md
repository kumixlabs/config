# @kumix/eslint-config-react

[![Version](https://img.shields.io/npm/v/@kumix/eslint-config-react.svg)](https://www.npmjs.com/package/@kumix/eslint-config-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ESLint configuration to use for React projects using Tanstack Query and Router.

This package is only available via ES Modules and requires ESLint 9 or greater, since it uses flat configs.

## Installation

```bash
bun add -D @kumix/eslint-config-react eslint typescript
```

## Configurations

This package provides two configurations:

- **reactFull** - Full configuration extending `@kumix/eslint-config` base with React rules
- **reactFast** - Performance-optimized configuration extending `@kumix/eslint-config` fast with React rules

### Recommended Starter Configuration

For most React projects, use the fast configuration with TypeScript project settings:

```js
// eslint.config.js
import { configs } from "@kumix/eslint-config-react";

export default [
  // For full configuration with Prettier and all plugins
  // ...configs.reactFull,
  // For fast configuration optimized for Biome (recommended)
  ...configs.reactFast,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
```

## Biome Integration

When using `reactFast`, you get the same React-specific rules but with the performance benefits from the base fast configuration. **For optimal performance, use [`@kumix/biome-config`](https://www.npmjs.com/package/@kumix/biome-config)** alongside the fast configuration:

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

### `reactFull` vs `reactFast`

`reactFull` and `reactFast` extend `@kumix/eslint-config`'s `base` and `fast` presets respectively. Those presets are currently identical, so `reactFull` and `reactFast` resolve to the same rule set today — pick whichever name reads best for your project.

### React-Specific Rules

Both presets add the same React layer on top of the base config, since Biome has no equivalents:

- React recommended rules (`eslint-plugin-react`)
- React Hooks rules (`eslint-plugin-react-hooks`, `recommended-latest`)
- TanStack Query linting (`@tanstack/eslint-plugin-query`)
- `react/react-in-jsx-scope` and `react/prop-types` turned off (JSX runtime + TypeScript)
- `react/no-unknown-property` allows `css`, `tw`, and `vaul-drawer-wrapper`

See the [@kumix/eslint-config README](https://github.com/kumixlabs/config/tree/main/packages/eslint-config#biome-integration) for the full list of rules handled by Biome.

## Links

- [npm Package](https://www.npmjs.com/package/@kumix/eslint-config-react)
- [Contributing Guide](../../../CONTRIBUTING.md)
- [Code of Conduct](../../../CODE_OF_CONDUCT.md)
- [License](../../../LICENSE)

## License

MIT © [Kumix Inc.](../../../LICENSE)
