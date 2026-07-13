# @kumix/eslint-config-react

## 0.1.1

### Patch Changes

- Updated dependencies [[`189383e`](https://github.com/kumixlabs/config/commit/189383eb931723433bc12a046388df87e4a3b3ba)]:
  - @kumix/eslint-config@0.1.1

## 0.1.0

### Minor Changes

- [`e2af0a9`](https://github.com/kumixlabs/config/commit/e2af0a9e3ed6be6fe4263bfd143551753bd82e9a) Thanks [@kumixio](https://github.com/kumixio)! - Initial release of `@kumix/eslint-config-react` and `@kumix/eslint-config-vite`.
  - `@kumix/eslint-config-react` — flat ESLint config (ESLint 9+, ESM-only) that layers React support on top of `@kumix/eslint-config`. Adds `eslint-plugin-react` (recommended + JSX runtime), `eslint-plugin-react-hooks` (`recommended-latest`), and `@tanstack/eslint-plugin-query`. Turns off `react/react-in-jsx-scope` and `react/prop-types`, and allows the `css`, `tw`, and `vaul-drawer-wrapper` props. Exposed as `configs.react`, `configs.reactFull`, and `configs.reactFast`.
  - `@kumix/eslint-config-vite` — extends `@kumix/eslint-config-react` with Vite/HMR rules via `eslint-plugin-react-refresh` and TanStack Router linting via `@tanstack/eslint-plugin-router`. Exposed as `configs.vite`, `configs.viteFull`, and `configs.viteFast`.
