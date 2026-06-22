## 2025-06-22 - Unified Scroll Handler & Layout Caching
**Learning:** Multiple independent scroll listeners querying `offsetTop` or `scrollHeight` cause significant layout thrashing, especially in long-form investigative pieces with many sections. Throttling with `requestAnimationFrame` is insufficient if the callback still triggers reflows. Caching layout values (`offsetTop`) and recalculating them only on specific invalidation events (resize, view switch, accordion toggle) eliminates the bottleneck.

**Action:** Always consolidate scroll-dependent UI updates (progress bars, nav highlighting, sticky toggles) into a single throttled listener and use a centralized layout cache (`refreshOffsets`) that is updated only when the DOM structure changes.
