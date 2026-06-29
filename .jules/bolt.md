## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-06-29 - Layout Thrashing on Mousemove
**Learning:** Accessing `offsetWidth` or `offsetHeight` inside high-frequency mousemove events causes the browser to perform synchronous layout recalculations. Combined with DOM writes to `top`/`left`, this creates a "read-write-read-write" loop that kills performance.
**Action:** Cache element dimensions once when the element is first displayed or modified. Use `position: fixed` and `transform: translate3d()` to move the element, as this avoids both layout and paint cycles by offloading positioning to the GPU compositor thread. Throttle updates using `requestAnimationFrame`.
