---
"@kumix/eslint-config": patch
"@kumix/eslint-config-react": patch
"@kumix/eslint-config-vite": patch
---

Remove duplicate presets. `base`/`reactFull`/`viteFull` were aliases of `fast`/`reactFast`/`viteFast`. Use `fast`, `reactFast`, and `viteFast` respectively.
