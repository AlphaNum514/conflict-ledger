
## 2026-03-18 - Replacing Div Triggers with Buttons for Accordions
**Learning:** Accordion triggers built with `<div>` elements and `onclick` handlers break keyboard accessibility by preventing native focus and standard `Space`/`Enter` activation.
**Action:** Always use `<button>` elements with `aria-expanded` attributes for interactive triggers that expand/collapse content. CSS can easily reset the button styling to match existing design patterns while preserving native accessibility features.
