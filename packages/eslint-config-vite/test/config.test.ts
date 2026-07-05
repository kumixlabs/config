import { describe, expect, it } from "vitest";

import { configs } from "../src/index.js";

describe("@kumix/eslint-config-vite", () => {
  it("re-exports react presets from @kumix/eslint-config-react", () => {
    expect(Array.isArray(configs.base)).toBe(true);
    expect(Array.isArray(configs.fast)).toBe(true);
    expect(Array.isArray(configs.react)).toBe(true);
    expect(Array.isArray(configs.reactFull)).toBe(true);
    expect(Array.isArray(configs.reactFast)).toBe(true);
  });

  it("exposes the vite config and composed presets", () => {
    expect(Array.isArray(configs.vite)).toBe(true);
    expect(Array.isArray(configs.viteFull)).toBe(true);
    expect(Array.isArray(configs.viteFast)).toBe(true);
  });

  it("composes viteFull from reactFull + vite", () => {
    expect(configs.viteFull.length).toBe(configs.reactFull.length + configs.vite.length);
  });

  it("composes viteFast from reactFast + vite", () => {
    expect(configs.viteFast.length).toBe(configs.reactFast.length + configs.vite.length);
  });

  it("targets ts/tsx files in the vite config", () => {
    const globs = configs.vite.flatMap((entry) => entry.files ?? []).flat();
    expect(globs.some((glob) => String(glob).includes("tsx"))).toBe(true);
  });
});
