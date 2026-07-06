## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-06-25 - Tooltip Engine Jitter & Layout Thrashing
**Learning:** High-frequency events like `mousemove` will cause severe UI jank if they trigger synchronous layout reflows. Reading `offsetWidth` or `offsetHeight` for a tooltip on every mouse move forces the browser to calculate the box model repeatedly, which is extremely expensive in a complex document.
**Action:** Cache element dimensions once during the "show" event or only when content changes. Use `position: fixed` to isolate the element from document flow and `translate3d()` for positioning to leverage the GPU and avoid the layout/paint pipeline for every pixel of movement.
