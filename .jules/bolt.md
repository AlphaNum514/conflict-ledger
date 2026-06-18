## 2026-06-18 - Consolidating Scroll Listeners and Optimizing Layout Access
**Learning:** Multiple scroll listeners reading layout properties (offsetTop, scrollHeight) causes layout thrashing and redundant computations. Consolidating into a single throttled listener with cached values significantly improves scrolling performance.
**Action:** Use a single scroll listener with requestAnimationFrame and a layout cache refreshed only when necessary.
