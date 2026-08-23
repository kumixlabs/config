import { describe, expect, it } from "vitest";

import { configs } from "../src/index.js";

describe("@kumix/eslint-config-react", () => {
  it("re-exports fast from @kumix/eslint-config", () => {
    expect(Array.isArray(configs.fast)).toBe(true);
  });

  it("exposes the react config and composed preset", () => {
    expect(Array.isArray(configs.react)).toBe(true);
    expect(Array.isArray(configs.reactFast)).toBe(true);
  });

  it("composes reactFast from fast + react", () => {
    expect(configs.reactFast.length).toBe(configs.fast.length + configs.react.length);
  });

  it("sets react version detection in the react config", () => {
    const withSettings = configs.react.find((entry) => entry.settings?.react);
    expect(withSettings?.settings?.react).toMatchObject({ version: "detect" });
  });
});
