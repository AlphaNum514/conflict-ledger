## 2025-02-18 - Missing global :focus-visible implementation
**Learning:** The project's documentation claimed to have full `:focus-visible` support, but the actual CSS file was completely missing a global `:focus-visible` rule, resulting in poor keyboard navigation accessibility.
**Action:** Always verify the actual presence of fundamental accessibility styles in the codebase, even when the documentation asserts they are already implemented.
