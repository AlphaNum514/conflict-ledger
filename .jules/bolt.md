## 2025-05-14 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing layout-triggering properties like `offsetTop` or `scrollHeight` inside high-frequency event listeners (like scroll) causes forced synchronous layouts (layout thrashing), significantly degrading performance.
**Action:** Cache layout values outside of the event loop and refresh them only when necessary (e.g., on resize, load, or view switch). Use `requestAnimationFrame` to throttle DOM updates.
