## 2025-05-24 - [Scroll Performance & Layout Thrashing]
**Learning:** Multiple unthrottled scroll listeners reading layout properties (`offsetTop`, `scrollHeight`) cause significant layout thrashing. Consolidating into a single `requestAnimationFrame` throttled handler and caching layout values (`offsetTop`) outside the listener improves performance drastically.
**Action:** Always consolidate scroll events and cache layout-triggering properties. Use a global `refreshOffsets` mechanism to update cache on resize or visibility changes (e.g., `display: none` to `block`).
