## 2026-03-17 - Semantic Accordion Trigger
**Learning:** Custom accessible disclosure widgets (accordions) often use `div` elements with `onclick` handlers, bypassing native keyboard navigation. Adding `tabindex="0"` and keydown handlers is brittle.
**Action:** Convert `div` triggers to natively focusable `<button>` elements, reset their default styles (`background: none; border: none; font-family: inherit`), and apply clear `:focus-visible` styling to immediately restore full keyboard accessibility and screen reader support (combined with `aria-expanded`).
