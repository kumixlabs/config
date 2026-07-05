import { describe, expect, it } from "vitest";

import { configs } from "../src/index.js";

describe("@kumix/eslint-config-react", () => {
  it("re-exports base and fast from @kumix/eslint-config", () => {
    expect(Array.isArray(configs.base)).toBe(true);
    expect(Array.isArray(configs.fast)).toBe(true);
  });

  it("exposes the react config and composed presets", () => {
    expect(Array.isArray(configs.react)).toBe(true);
    expect(Array.isArray(configs.reactFull)).toBe(true);
    expect(Array.isArray(configs.reactFast)).toBe(true);
  });

  it("composes reactFull from base + react", () => {
    expect(configs.reactFull.length).toBe(configs.base.length + configs.react.length);
  });

  it("composes reactFast from fast + react", () => {
    expect(configs.reactFast.length).toBe(configs.fast.length + configs.react.length);
  });

  it("sets react version detection in the react config", () => {
    const withSettings = configs.react.find((entry) => entry.settings?.react);
    expect(withSettings?.settings?.react).toMatchObject({ version: "detect" });
  });
});
