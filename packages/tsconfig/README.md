# @kumix/tsconfig

[![Version](https://img.shields.io/npm/v/@kumix/tsconfig.svg)](https://www.npmjs.com/package/@kumix/tsconfig)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Common TypeScript configuration for modern projects.

## Installation

```bash
npm install @kumix/tsconfig
# or
bun add @kumix/tsconfig
```

## Usage

Create a `tsconfig.json` in your project root and extend one of the presets:

```json
{
  "extends": "@kumix/tsconfig/base",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

## Available Presets

### `@kumix/tsconfig/base`

Base configuration for general TypeScript projects.

**Features:**

- Target: ES2022
- Module: ES2022
- Strict mode enabled
- Module resolution: bundler
- ESM interop enabled
- Resolve JSON modules
- Emits declarations + declaration maps to `dist`

**Use case:** General TypeScript libraries and projects

```json
{
  "extends": "@kumix/tsconfig/base"
}
```

### `@kumix/tsconfig/bun`

Configuration for Bun projects.

**Features:**

- Extends `base`
- Bun types enabled
- Optimized for Bun runtime

**Use case:** Bun applications and libraries

```json
{
  "extends": "@kumix/tsconfig/bun"
}
```

### `@kumix/tsconfig/cf`

Configuration for Cloudflare Workers projects.

**Features:**

- Extends `base`
- Cloudflare Workers types
- Edge runtime optimized

**Use case:** Cloudflare Workers, Pages Functions

```json
{
  "extends": "@kumix/tsconfig/cf"
}
```

### `@kumix/tsconfig/dom`

Configuration for browser/DOM projects.

**Features:**

- Extends `base`
- DOM types enabled
- Browser APIs available

**Use case:** Browser-based applications, vanilla JS projects

```json
{
  "extends": "@kumix/tsconfig/dom"
}
```

### `@kumix/tsconfig/next`

Configuration for Next.js projects.

**Features:**

- Extends `react`
- Next.js-specific optimizations
- Plugin support for Next.js

**Use case:** Next.js applications

```json
{
  "extends": "@kumix/tsconfig/next"
}
```

### `@kumix/tsconfig/node`

Configuration for Node.js libraries and applications.

**Features:**

- Extends `base`
- Node.js types enabled

**Use case:** Node.js packages, CLI tools, server-side code

```json
{
  "extends": "@kumix/tsconfig/node"
}
```

### `@kumix/tsconfig/react`

Configuration for React projects (supports both React 18+ and 19+).

**Features:**

- Extends `dom` (which extends `base`)
- JSX: react-jsx (automatic JSX runtime)
- Module: ESNext, no emit (type-check only)
- DOM types enabled

**Use case:** React applications and libraries

```json
{
  "extends": "@kumix/tsconfig/react"
}
```

## Override Options

When extending any preset, you should override these options to match your project:

```json
{
  "extends": "@kumix/tsconfig/base",
  "compilerOptions": {
    "rootDir": "./src", // Your source directory
    "outDir": "./dist" // Your build output
  },
  "include": [
    "src/**/*" // Files to include
  ],
  "exclude": ["node_modules", "dist"]
}
```

## Links

- [npm Package](https://www.npmjs.com/package/@kumix/tsconfig)
- [Contributing Guide](../../CONTRIBUTING.md)
- [Code of Conduct](../../CODE_OF_CONDUCT.md)
- [License](../../LICENSE)

## License

MIT © [Kumix Inc.](../../LICENSE)
