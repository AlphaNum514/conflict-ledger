## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-07-26 - High-Frequency Layout Thrashing in Tooltip Engines
**Learning:** Querying element dimensions (`offsetWidth` and `offsetHeight`) inside high-frequency `mousemove` handlers causes synchronous reflow/layout thrashing if the style is mutated (e.g. by setting `maxWidth` or coordinates) in the same frame.
**Action:** Cache the tooltip dimensions once on `mouseover` (`showTip`) using a visual-hidden phase (`visibility: hidden`) so the browser can calculate the correct layout sizes. Use these cached dimensions and `translate3d` with `position: fixed` and `will-change: transform` inside a `requestAnimationFrame` gate to ensure smooth GPU-composited coordinate tracking.
