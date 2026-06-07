## 2025-03-24 - [Layout Thrashing in Scroll Handlers]
**Learning:** Multiple independent scroll listeners querying `offsetTop` or `scrollHeight` simultaneously cause significant layout thrashing (forced synchronous layouts). This is especially problematic in single-page applications with many sections and interactive elements.
**Action:** Consolidate all scroll-based logic into a single, throttled `requestAnimationFrame` handler and cache layout-triggering values (like `offsetTop`) globally, refreshing them only when the DOM structure changes.
