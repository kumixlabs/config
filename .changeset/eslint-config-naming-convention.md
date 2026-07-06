---
"@kumix/eslint-config": patch
---

Narrow the private-member `naming-convention` rule to the
`["property", "accessor", "method"]` selectors so constructor parameter
properties (`constructor(private foo: string)`) are no longer flagged.
The leading-underscore requirement still applies to ordinary private
properties, accessors, and methods.
