## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-08-01 - Playwright Visibility Assertion on Opacity
**Learning:** Playwright and similar UI verification tools consider elements with `opacity: 0` as "visible" because they still occupy physical layout space in the DOM. Merely using opacity transitions to hide tooltips can cause tests like `expect(element).not_to_be_visible()` to fail.
**Action:** Always pair `opacity` transitions with explicit `visibility: hidden` (or `display: none`) when hiding UI components, and transition or set `visibility: visible` when showing them. This ensures robust automated testing and proper screen-reader compliance.
