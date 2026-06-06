# Bolt's Journal

## 2025-05-14 - Unified Throttled Scroll Handler
**Learning:** Multiple scroll listeners, especially unthrottled ones performing layout-triggering calculations (like `offsetTop`), cause significant layout thrashing and main-thread jank.
**Action:** Consolidate all scroll-dependent UI updates (progress bars, nav highlighting, scroll-to-top button) into a single `requestAnimationFrame`-throttled handler. Cache layout-dependent values (offsets, scroll height) and only refresh them on `resize` or view changes.
