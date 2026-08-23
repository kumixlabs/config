import type { Linter } from "eslint";

import { configs } from "@kumix/eslint-config";
import { react } from "./react.js";

export { react } from "./react.js";

export const fast: Linter.Config[] = configs.fast;

export const reactFast: Linter.Config[] = [...fast, ...react];
