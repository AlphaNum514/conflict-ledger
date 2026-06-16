# Bolt's Journal - Critical Learnings

## 2025-05-15 - Unified Scroll Handler Pattern
**Learning:** Multiple scroll listeners and repeated `offsetTop` lookups caused noticeable main-thread jank during fast scrolling. Throttling with `requestAnimationFrame` and caching layout values significantly improves scroll performance. Marking scroll listeners as `{ passive: true }` further reduces jank by allowing the browser to optimize scrolling independently of JS execution.
**Action:** Always prefer a single, throttled scroll handler and cache layout-triggering properties (`offsetTop`, `offsetHeight`) whenever possible. Use passive listeners for high-frequency events like scroll and touch.
