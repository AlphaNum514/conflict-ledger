## 2026-05-16 - Eliminate Layout Thrashing in Scroll Handlers
**Learning:** High-frequency events like `scroll` frequently trigger layout thrashing if properties like `offsetTop` or `scrollHeight` are accessed. This is especially true in single-page applications with many sections. The overhead of multiple event listeners also adds up on mobile.
**Action:** Consolidate scroll handlers, use `requestAnimationFrame` for throttling, and cache layout values that only change on `resize` or `load`. Use a `setTimeout` (50ms) to refresh offsets after view switches that use `display: none/block`.
