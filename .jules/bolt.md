## 2025-05-14 - Unified Scroll Handler and Layout Caching
**Learning:** Multiple scroll listeners performing redundant DOM reads (like `offsetTop` and `scrollHeight`) cause layout thrashing and degrade scroll performance, especially on mobile devices or long pages.
**Action:** Consolidate scroll-dependent logic into a single throttled `requestAnimationFrame` handler and cache layout-triggering properties, invalidating them only when the DOM structure actually changes.
