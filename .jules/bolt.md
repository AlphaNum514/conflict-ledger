## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-07-10 - GPU-accelerated Tooltip Engine
**Learning:** Tooltip positioning with `left`/`top` on high-frequency `mousemove` events causes layout thrashing and high main thread load. Moving to `position: fixed` with `translate3d` and caching dimensions (`offsetWidth`/`Height`) during the initial `showTip` event eliminates synchronous layout triggers and offloads positioning to the GPU compositor.
**Action:** Use `translate3d` and `requestAnimationFrame` throttling for any element that follows the mouse cursor. Cache dimensions once upon activation instead of reading them on every frame.
