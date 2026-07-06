# Contributing to Kumix Config

Thank you for your interest in contributing! Kumix Config is a Bun monorepo of shared, publishable configuration packages (Biome, ESLint, TypeScript) plus a private MCP server.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers at **hai@kumix.io**.

## Why Contribute?

This project is community-driven. Your contributions help:

- Improve developer experience and documentation
- Fix issues and enhance reliability
- Extend tooling and workflow capabilities

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.3.0 or higher
- Node.js 24 or higher
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/config.git
   cd config
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Project

```bash
# Build all workspaces
bun run build

# Type-check all workspaces
bun run types:check

# Run all tests (Vitest, via Turborepo — builds deps first)
bun run test

# Lint (check)
bun run lint

# Lint (auto-fix)
bun run lint:fix

# Format code
bun run format
```

Note: `bun run test` goes through `turbo run test`, so dependencies are built first (`dependsOn: ["^build"]`).

### Working on a Specific Package

```bash
# Navigate to a package directory
cd packages/eslint-config  # or any package under packages/

# Run package-specific commands (available scripts vary per package)
bun run build          # Build the package (tsc)
bun run types:check    # Type-check the package
```

## Code Style

This project uses [Biome](https://biomejs.dev/) for linting and formatting to ensure consistent code quality.

### Code Standards

- **Indentation**: 2 spaces
- **Line Width**: 100 characters
- **Quotes**: Double quotes for JavaScript/TypeScript
- **Semicolons**: Always required
- **Trailing Commas**: All
- **Arrow Parentheses**: Always

### Lint and Format

Before committing, always run:

```bash
# Lint (check)
bun run lint

# Lint (auto-fix)
bun run lint:fix

# Format only
bun run format
```

## Making Changes

### Branch Naming

Use descriptive branch names:

- `feature/add-new-capability` - For new features
- `fix/build-script-bug` - For bug fixes
- `docs/update-readme` - For documentation
- `refactor/simplify-structure` - For refactoring

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(eslint-config): add naming-convention rule
fix(ci): correct bun run command in workflow
docs(readme): clarify release process
refactor(workspace): simplify outputs in turbo.json
test(eslint-config): add preset composition tests
```

**Format**: `type(scope): description`

**Types**:

- `feat` or `feature`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Maintenance tasks

### Writing Code

1. **Follow existing patterns**: Look at existing code for consistency
2. **Write TypeScript**: All code should be properly typed
3. **Keep it simple**: Avoid over-engineering solutions
4. **Add comments**: Only where the code isn't self-explanatory
5. **Export cleanly**: Follow the existing export patterns in each package

### Testing

**All changes must pass the following checks** before submitting:

```bash
# Type-check all workspaces
bun run types:check

# Build to ensure no build errors
bun run build

# Lint (check)
bun run lint

# Format code
bun run format
```

Make sure:

- All TypeScript types are correct
- No build errors or warnings
- Code follows the style guide
- Existing functionality is not broken

## Submitting Changes

### Pull Request Process

1. **Update your branch** with the latest changes from main:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your changes** to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub targeting the `main` branch

4. **Fill in the PR template** with:
   - **Clear title**: Use conventional commit format (e.g., "feat(eslint-config): add naming-convention rule")
   - **Description**: Explain what changed and why
   - **Breaking changes**: Clearly document any breaking changes
   - **Related issues**: Reference issues (e.g., "Fixes #123", "Closes #456")
   - **Screenshots/videos**: Add visual proof for UI changes
   - **Testing**: Describe how you tested the changes

5. **Wait for review**: Maintainers will review your PR and may request changes

**Keep PRs focused**: Large pull requests are harder to review. Try to keep changes focused on a single feature or fix.

### Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Tests pass (`bun run test`)
- [ ] Types check (`bun run types:check`)
- [ ] Build succeeds (`bun run build`)
- [ ] Code is properly linted and formatted (`bun run lint`)
- [ ] Commit messages follow conventional commits
- [ ] A changeset is added for any package change (`bunx changeset`)
- [ ] Documentation is updated (if needed)
- [ ] No breaking changes (or clearly documented if necessary)

## Package Development

### Adding a New Package

1. Create a new directory in `packages/`
2. Copy the structure from an existing package
3. Update `package.json` with appropriate metadata
4. Add a `tsconfig.json` that extends a `@kumix/tsconfig` preset (packages that build use `tsc`)
5. Ensure the package is included in the workspace (`packages/*` is already globbed)

### Package Structure

Packages that build (ESLint configs, MCP) use `tsc` and look like:

```
packages/your-package/
├── src/
│   └── index.ts          # Main exports
├── package.json          # Package metadata
├── tsconfig.json         # TypeScript configuration
└── README.md             # Package documentation
```

Config-only packages (`@kumix/biome-config`, `@kumix/tsconfig`) have no build step and ship raw config files from the package root instead of a `src/` directory.

### Publishing Packages (Maintainers Only)

This project uses [Changesets](https://github.com/changesets/changesets) for version management:

1. **Create a changeset**:

   ```bash
   bunx changeset
   ```

   Follow the prompts to describe your changes. Note: `@kumix/mcp` is private and ignored by changesets.

2. **Version packages**:

   ```bash
   bun run version
   ```

   This updates package versions and changelogs.

3. **Publish to npm**:

   ```bash
   bun run release
   ```

   This builds and publishes all changed packages.

## Security

If you discover a security vulnerability, please report it privately as described in [SECURITY.md](./SECURITY.md).

**Do not report security issues through public GitHub issues.**

## Questions and Support

If you have questions or need help:

- Check the [documentation](./README.md) and package READMEs
- Open an [issue](https://github.com/kumixlabs/config/issues)
- Start a [discussion](https://github.com/kumixlabs/config/discussions)

## License

By contributing to Kumix Config, you agree that your contributions will be licensed under the MIT License.
