## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-06-27 - Compositor-only Properties and Mouse Event Thrashing
**Learning:** Animating 'width' on scroll triggers Layout and Paint stages on every frame, which is expensive for high-frequency events. Similarly, reading 'offsetWidth' or 'offsetHeight' in a 'mousemove' listener causes synchronous layout recalculation (thrashing) if the DOM was modified.
**Action:** Use 'transform: scaleX()' for progress bars and 'translate3d()' for positioning tooltips to ensure updates stay on the compositor thread. Cache element dimensions during the 'mouseover' event so 'mousemove' can position the element using only pre-calculated values and 'requestAnimationFrame' throttling.
