## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-07-11 - Redundant DOM Lookups in Interactive Components
**Learning:** Frequent 'oninput' events in sliders or text inputs can cause performance degradation if the handler performs multiple DOM lookups (e.g., `document.getElementById`) per call. In a large document, these lookups add up, especially when multiple results are updated simultaneously.
**Action:** Cache DOM element references in a persistent object outside the event handler's scope. This reduces the handler's execution time to pure calculation and direct property updates, ensuring a smooth 60fps experience even during rapid interaction.
