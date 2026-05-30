# Bolt's Journal - Critical Learnings

## 2024-05-30 - Redundant DOM Observers and Scroll Thrashing
**Learning:** In a single-file architecture with multiple views (Simple/Research), global selectors like `document.querySelectorAll('[data-target]')` will find elements from all views. If each view initializes its own `IntersectionObserver` on the same selector, multiple observers will fire for the same elements, leading to redundant computations and DOM writes. Additionally, multiple unthrottled scroll listeners performing DOM queries and layout-triggering reads (`offsetTop`) on every event cause significant main-thread pressure and potential jank.

**Action:** Scope DOM queries to the specific view container where possible. Consolidate high-frequency event listeners (scroll, mousemove) into single, throttled handlers using `requestAnimationFrame`. Cache layout-triggering values like `offsetTop` and update them only when the layout actually changes (resize, toggle events).
