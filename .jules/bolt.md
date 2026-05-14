# Bolt's Journal - The Conflict Ledger

## 2025-05-15 - Scroll Performance and Layout Thrashing
**Learning:** The application uses multiple scroll listeners across two different views (Simple and Research). Both listeners are active simultaneously regardless of which view is visible. The Research view's navigation highlighting listener is un-throttled and performs multiple layout-triggering `offsetTop` reads and DOM writes on every scroll event. Additionally, both views' progress bars repeatedly read `scrollHeight`, which also triggers layout.

**Action:** Consolidate scroll listeners, throttle them using `requestAnimationFrame`, and cache layout-dependent values (`offsetTop`, `scrollHeight`). Ensure cached values are updated on window resize and view switches.
