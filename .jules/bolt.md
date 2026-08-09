## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-07-12 - Layout Thrashing in Tooltip Tracking
**Learning:** Accessing `offsetHeight` inside a `mousemove` listener for tooltips forces synchronous layout recalculation on every mouse movement. When combined with `top`/`left` positioning, this forces the browser through a full Reflow -> Paint -> Composite cycle 60+ times per second.
**Action:** Cache element dimensions in the `mouseover` handler and use `transform: translate3d()` with `position: fixed` to offload positioning to the GPU compositor thread, bypassing the layout and paint phases entirely.
