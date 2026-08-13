## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-08-13 - Layout Thrashing in Mousemove Listeners
**Learning:** Querying `offsetHeight` / `offsetWidth` inside `mousemove` events forces synchronous reflow (layout thrashing) because style values have been invalidated by prior modifications. Tracking tooltips with direct `left`/`top` CSS adjustments requires full-page repaints, causing dropped frames on high-refresh monitors.
**Action:** Promote tooltips to their own GPU composite layer using `position: fixed` and `will-change: transform`. Cache dimensions (`offsetHeight`, `offsetWidth`) exactly once on hover start (`showTip`), apply constraints beforehand, and throttled mouse updates via `requestAnimationFrame` with coordinate caching.
