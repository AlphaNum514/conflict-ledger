## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-06-25 - Compositor-only Scroll Progress Bars
**Learning:** Animating `width` in a scroll handler triggers a full Layout and Paint cycle for every frame. Switching to `transform: scaleX()` offloads the animation to the Compositor thread, significantly reducing Main Thread blocking. Throttling text updates and class toggles using state tracking (e.g., `lastPctRounded`) further reduces unnecessary DOM work.
**Action:** Use `transform` for all high-frequency visual indicators and implement state-based guards to prevent redundant DOM writes during events like scrolling or mouse movement.
