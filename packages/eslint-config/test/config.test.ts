import { describe, expect, it } from "vitest";

import { configs } from "../src/index.js";

describe("@kumix/eslint-config", () => {
  it("exposes buildConfig, base, and fast", () => {
    expect(typeof configs.buildConfig).toBe("function");
    expect(Array.isArray(configs.base)).toBe(true);
    expect(Array.isArray(configs.fast)).toBe(true);
  });

  it("base and fast are the same config", () => {
    expect(configs.base).toBe(configs.fast);
  });

  it("buildConfig returns a fresh non-empty array of config objects", () => {
    const built = configs.buildConfig();
    expect(Array.isArray(built)).toBe(true);
    expect(built.length).toBeGreaterThan(0);
    for (const entry of built) {
      expect(entry).toBeTypeOf("object");
      expect(entry).not.toBeNull();
    }
  });

  it("lints TypeScript and JavaScript files", () => {
    const built = configs.buildConfig();
    const globs = built.flatMap((entry) => entry.files ?? []).flat();
    expect(globs.some((glob) => String(glob).includes("ts"))).toBe(true);
  });

  it("defines the custom naming-convention and accessibility rules", () => {
    const built = configs.buildConfig();
    const withRules = built.find(
      (entry) => entry.rules?.["@typescript-eslint/naming-convention"],
    );
    expect(withRules).toBeDefined();
    expect(withRules?.rules?.["@typescript-eslint/explicit-member-accessibility"]).toBeDefined();
  });
});
