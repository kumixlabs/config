import type { Linter } from "eslint";

import { configs } from "@kumix/eslint-config-react";
import { vite } from "./vite.js";

export { vite } from "./vite.js";

export const reactFast: Linter.Config[] = configs.reactFast;

export const viteFast: Linter.Config[] = [...reactFast, ...vite];
