# Kumix Config

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/bun-1.3.14-black)](https://bun.sh)

A collection of ready-to-use packages for modern application development. This monorepo includes reusable packages for shared linting and TypeScript configurations.

## Packages

| Package                                                      | Version                                                                                                                         | Description                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [@kumix/biome-config](./packages/biome-config)               | [![npm](https://img.shields.io/npm/v/@kumix/biome-config.svg)](https://www.npmjs.com/package/@kumix/biome-config)               | Opinionated Biome config for lint/format    |
| [@kumix/eslint-config](./packages/eslint-config)             | [![npm](https://img.shields.io/npm/v/@kumix/eslint-config.svg)](https://www.npmjs.com/package/@kumix/eslint-config)             | Shared ESLint configuration                 |
| [@kumix/eslint-config-react](./packages/eslint-config-react) | [![npm](https://img.shields.io/npm/v/@kumix/eslint-config-react.svg)](https://www.npmjs.com/package/@kumix/eslint-config-react) | ESLint configuration for React              |
| [@kumix/eslint-config-vite](./packages/eslint-config-vite)   | [![npm](https://img.shields.io/npm/v/@kumix/eslint-config-vite.svg)](https://www.npmjs.com/package/@kumix/eslint-config-vite)   | ESLint configuration for Vite               |
| [@kumix/tsconfig](./packages/tsconfig)                       | [![npm](https://img.shields.io/npm/v/@kumix/tsconfig.svg)](https://www.npmjs.com/package/@kumix/tsconfig)                       | Extendable TypeScript configuration presets |

## Tech Stack

- **Package Manager**: Bun
- **Monorepo Tool**: Turborepo
- **Build Tool**: TypeScript compiler (`tsc`)
- **Linting/Formatting**: Biome
- **Testing**: Vitest
- **Language**: TypeScript

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.3.0 or higher
- Node.js 24 or higher

### Installation

```bash
# Clone repository
git clone https://github.com/kumixlabs/config.git
cd config

# Install dependencies (Bun)
bun install
```

### Common Commands

```bash
# Development
bun run dev                # Run all packages (watch mode)
bun run build              # Build all packages
bun run types:check        # Type-check all packages

# Linting & Formatting (Biome)
bun run lint               # Lint with safe fixes
bun run lint:fix           # Lint with comprehensive fixes
bun run format             # Format code

# Testing (Vitest, runs directly — bypasses Turborepo)
bun run test                          # Run all tests
bun run test:coverage                 # Run tests with V8 coverage
bun run test -- --run eslint-config   # Run one package's tests by pattern

# Maintenance
bun run clean:all          # Deep clean (.turbo, bun.lock, coverage, node_modules)
```

Note: `bun run test` runs the root `vitest.config.ts` directly and does not build dependencies first. Run `bun run build` beforehand if a test needs a package's `dist/` output.

### Working on Individual Packages

```bash
# Navigate to a specific package
cd packages/eslint-config  # or any package under packages/

# Package commands (available scripts vary per package)
bun run build              # Build the package (tsc)
bun run types:check        # Type-check the package
```

## Development Workflow

1. **Create a branch** for your changes
2. **Make your changes** in the appropriate package(s)
3. **Run tests** and type-check: `bun run test && bun run types:check`
4. **Format your code**: `bun run format && bun run lint:fix`
5. **Commit your changes** following conventional commits
6. **Submit a pull request**

For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributing

We welcome contributions! This project is community-driven and your help makes it better.

**Getting Started:**

- Read the [Contributing Guide](./CONTRIBUTING.md) for development setup and guidelines
- Check the [Code of Conduct](./CODE_OF_CONDUCT.md)
- Browse [open issues](https://github.com/kumixlabs/config/issues) or start a [discussion](https://github.com/kumixlabs/config/discussions)

## Security

If you discover a security vulnerability, please email **kumixlabs@gmail.com**. All vulnerabilities will be addressed promptly.

Do not report security issues through public GitHub issues.

## License

MIT License — see [LICENSE](./LICENSE) for details.

By contributing to Kumix Config, you agree that your contributions will be licensed under the MIT License.
