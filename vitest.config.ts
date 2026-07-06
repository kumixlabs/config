import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Each folder in `packages/*` is treated as a separate Vitest project.
    // See https://vitest.dev/guide/projects
    projects: ["packages/*"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: ["**/dist/**", "**/node_modules/**", "**/*.config.*"],
      // Relaxed tripwire thresholds: this repo ships config presets whose
      // runtime branches are hard to exercise from unit tests, so we use
      // coverage as a regression signal rather than a hard gate.
      thresholds: {
        lines: 40,
        functions: 40,
        statements: 40,
        branches: 40,
      },
    },
  },
});
