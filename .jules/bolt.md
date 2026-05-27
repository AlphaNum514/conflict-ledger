# Bolt's Performance Journal

## 2024-05-14 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` and `scrollHeight` inside scroll event listeners triggers synchronous layout calculation (layout thrashing), which is expensive during high-frequency events like scrolling. In this codebase, multiple listeners were doing this independently.
**Action:** Consolidate scroll listeners into a single throttled handler using `requestAnimationFrame` and cache layout-triggering properties.
