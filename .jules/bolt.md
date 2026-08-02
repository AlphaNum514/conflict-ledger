## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-08-02 - Layout Recalculation Thrashing on Resize Events
**Learning:** Attaching heavy DOM reading tasks like `refreshOffsets` (which queries `offsetTop` of multiple sections and `scrollHeight` of the document body) directly to high-frequency window `resize` events triggers continuous synchronous layout passes, leading to severe layout thrashing and viewport rendering stutter.
**Action:** Always debounce window resize event handlers (e.g., using `setTimeout` with a 150ms delay) so that costly layout offset caching functions are executed only once after the resizing has completely stopped.
