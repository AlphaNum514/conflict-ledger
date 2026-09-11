## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-08-13 - Layout Thrashing in Mousemove Listeners
**Learning:** Querying `offsetHeight` / `offsetWidth` inside `mousemove` events forces synchronous reflow (layout thrashing) because style values have been invalidated by prior modifications. Tracking tooltips with direct `left`/`top` CSS adjustments requires full-page repaints, causing dropped frames on high-refresh monitors.
**Action:** Promote tooltips to their own GPU composite layer using `position: fixed` and `will-change: transform`. Cache dimensions (`offsetHeight`, `offsetWidth`) exactly once on hover start (`showTip`), apply constraints beforehand, and throttled mouse updates via `requestAnimationFrame` with coordinate caching.

## 2026-08-15 - Array Sorting Comparator DOM Access and Regex Overhead
**Learning:** Accessing DOM element properties (`textContent`), performing string operations (`trim`), and evaluating regular expressions (`replace(/[^-\d.]/g, '')`) inside the $O(N \log N)$ comparison callback of `Array.prototype.sort()` causes repeated DOM reads and unnecessary string processing per comparison step.
**Action:** Use a pre-parsed mapping array (Schwartzian transform pattern) to extract text and numbers in $O(N)$ before sorting, and batch DOM mutations using `DocumentFragment`.

## 2026-09-10 - O(N) IntersectionObserver Allocations in Loop Structures
**Learning:** Creating individual `IntersectionObserver` instances inside iteration loops over DOM elements (such as table rows) allocates $N$ observer objects and registers $N$ separate browser internal listeners, leading to high garbage collection overhead and memory fragmentation.
**Action:** Declare a single shared `IntersectionObserver` instance outside the loop. Attach element-specific state or references directly to the DOM target element, and unobserve individual targets as they intersect.

## 2026-09-11 - Un-debounced Layout Reads on Window Resize
**Learning:** Reading layout properties (`scrollHeight`, `innerHeight`, `offsetTop`) synchronously inside a raw `resize` event handler forces repeated browser reflows on every single resize pixel change, causing severe frame drops and jank during active window dragging.
**Action:** Always debounce resize event listeners that perform DOM layout reads (e.g. 150ms timeout) to defer layout recalculations until continuous resizing pauses.
