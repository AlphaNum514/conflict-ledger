## 2026-06-15 - Unified Scroll Handler & Layout Caching
**Learning:** Accessing `offsetTop` or `scrollHeight` inside scroll event listeners triggers synchronous layout recalculation (layout thrashing), which is extremely expensive when multiple listeners are active. Consolidating listeners and caching layout values significantly reduces CPU usage during scrolling.
**Action:** Always cache layout-triggering properties outside of high-frequency events like `scroll` or `mousemove`, and only refresh the cache on specific invalidation events (resize, content changes).
