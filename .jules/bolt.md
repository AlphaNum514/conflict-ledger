## 2025-01-24 - [Consolidated Scroll Handler & Layout Caching]
**Learning:** High-frequency scroll events combined with layout-triggering properties like `offsetTop` cause significant layout thrashing in large standalone HTML files. Consolidation and caching are essential for maintaining 60fps.
**Action:** Always prefer a single unified throttled scroll handler and use a `refreshOffsets` pattern to cache layout properties, invalidating only on resize or specific DOM modifications.
