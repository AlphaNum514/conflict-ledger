## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-08-13 - Layout Thrashing in Mousemove Listeners
**Learning:** Querying `offsetHeight` / `offsetWidth` inside `mousemove` events forces synchronous reflow (layout thrashing) because style values have been invalidated by prior modifications. Tracking tooltips with direct `left`/`top` CSS adjustments requires full-page repaints, causing dropped frames on high-refresh monitors.
**Action:** Promote tooltips to their own GPU composite layer using `position: fixed` and `will-change: transform`. Cache dimensions (`offsetHeight`, `offsetWidth`) exactly once on hover start (`showTip`), apply constraints beforehand, and throttled mouse updates via `requestAnimationFrame` with coordinate caching.

## 2026-08-15 - Array Sorting Comparator DOM Access and Regex Overhead
**Learning:** Accessing DOM element properties (`textContent`), performing string operations (`trim`), and evaluating regular expressions (`replace(/[^-\d.]/g, '')`) inside the $O(N \log N)$ comparison callback of `Array.prototype.sort()` causes repeated DOM reads and unnecessary string processing per comparison step.
**Action:** Use a pre-parsed mapping array (Schwartzian transform pattern) to extract text and numbers in $O(N)$ before sorting, and batch DOM mutations using `DocumentFragment`.

## 2026-08-23 - Redundant DOM Text Node Mutations in Scroll Handlers
**Learning:** Mutating DOM text nodes (`element.textContent`) on every frame of a scroll listener—even when guarded by `requestAnimationFrame`—causes redundant DOM text node updates and string allocations when the value hasn't changed.
**Action:** Always cache the rounded or formatted output value in an outer scope variable and only write to `textContent` when the formatted value actually changes.
