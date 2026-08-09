## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-07-08 - GPU-Accelerated Tooltip Positioning
**Learning:** Using 'position: fixed' with 'translate3d' for global tooltips allows the browser to bypass Layout and Paint stages during movement, moving the work to the GPU. This is significantly more efficient than 'position: absolute' with 'top'/'left' which triggers layout recalculations.
**Action:** For frequently moving UI elements like tooltips, promote them to their own compositor layer with 'will-change: transform' and use 'translate3d' for positioning.
