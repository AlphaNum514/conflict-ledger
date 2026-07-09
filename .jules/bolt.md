## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-07-09 - Layout Thrashing in Tooltip Engine
**Learning:** Reading `offsetHeight` and updating `top`/`left` styles on every `mousemove` event causes synchronous layout recalculations (thrashing). This is especially noticeable with tooltips that track the cursor.
**Action:** Use `position: fixed` with `transform: translate3d()` to promote the element to a GPU layer and avoid layout. Cache the tooltip dimensions (`offsetWidth`, `offsetHeight`) when the tooltip is shown, and use a `requestAnimationFrame` gate to throttle positioning updates to 60fps.
