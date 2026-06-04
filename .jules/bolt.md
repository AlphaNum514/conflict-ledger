# Bolt's Journal - Critical Learnings

## 2026-06-04 - [Consolidating Scroll Listeners and Layout Caching]
**Learning:** In long-form single-page applications, multiple scroll listeners accessing `offsetTop` can lead to significant layout thrashing. Consolidating these into a single `requestAnimationFrame`-throttled handler with cached offsets dramatically reduces CPU usage and improves frame rates.
**Action:** Always prefer a unified scroll handler for high-frequency events and cache layout-triggering properties (`offsetTop`, `offsetHeight`, etc.) whenever possible, ensuring the cache is refreshed on layout-changing events (resize, content toggles).
