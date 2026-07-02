## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-07-02 - GPU-Accelerated Tooltips and Dimension Caching
**Learning:** High-frequency mouse events (like tooltips following the cursor) cause severe layout thrashing if they read DOM properties like `offsetWidth` or `offsetHeight` and then immediately write to `left`/`top`. Promoting the tooltip to its own compositor layer using `position: fixed` and `will-change: transform` allows the browser to handle movement on the GPU.
**Action:** Cache element dimensions once when the tooltip is shown (using `visibility: hidden` if necessary) and use `translate3d` within a `requestAnimationFrame` gate to update position. This eliminates layout/paint cycles during mouse movement.
