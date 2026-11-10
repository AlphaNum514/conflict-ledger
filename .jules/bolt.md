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

## 2026-09-28 - Redundant DOM Queries and Function Wrapper Duplication in Interactive Switchers
**Learning:** In single-file vanilla JS architectures, monkey-patching event handlers across script blocks (e.g. wrapping `window.showScenario` to attach accessibility attributes) often introduces duplicate DOM queries (`document.querySelectorAll`, `getElementById`) and redundant iteration loops on user interactions.
**Action:** Lazily initialize a DOM cache object (`scEls`, `scBtnMap`) on first interaction, and consolidate class state (`s-active`), ARIA attribute (`aria-pressed`), and content mutations into a single function pass. Defer secondary layout recalculations (`window.refreshOffsets`) using `requestAnimationFrame`.

## 2026-10-24 - High-Frequency Slider Input Flooding and Un-throttled Model Calculations
**Learning:** Range sliders firing `oninput` events emit unconstrained events matching the device polling rate (up to 120Hz-240Hz on modern touchscreens/gaming mice). Running math calculations and synchronously mutating multiple DOM elements (text nodes and class toggles) on every input event floods the main thread and causes severe frame jank and layout thrashing.
**Action:** Gate input-driven calculator calculations behind a `requestAnimationFrame` flag to batch DOM updates to at most once per display refresh frame (~60-120 FPS), while offering a synchronous bypass (`sync === true`) for preset clicks and programmatic initializations.
