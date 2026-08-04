## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-08-04 - Layout Thrashing in Window Resize Events
**Learning:** In a single-page layout where element heights and offsets change, window `resize` events fire continuously at a high frequency during manual viewport adjustments. Immediately executing layout-queries like `offsetTop` or `scrollHeight` (via `refreshOffsets`) on every frame forces constant, synchronous layout recalculations, causing massive frame-rate drops.
**Action:** Always debounce the window `resize` event handler using a 150ms delay with `setTimeout`/`clearTimeout` to ensure heavy layout recalculation algorithms only run once resizing has completed or paused.
