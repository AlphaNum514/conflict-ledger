## 2026-03-17 - [Consolidated Scroll Handler & Layout Caching]
**Learning:** The application had multiple scroll listeners, each triggering layout-recalculation properties like `offsetTop` and `scrollHeight`. This caused significant layout thrashing during scrolling.
**Action:** Consolidate all scroll-linked UI updates into a single `requestAnimationFrame`-throttled listener. Cache layout values and refresh them only on specific events (resize, load, view switch, or explicit UI layout changes).
>>>>>>> REPLACE
