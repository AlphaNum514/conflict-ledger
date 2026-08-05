## 2026-06-25 - Layout Thrashing in Scroll Listeners
**Learning:** Accessing `offsetTop` or `scrollHeight` inside high-frequency scroll events without throttling causes "layout thrashing" because the browser must synchronously recalculate the layout before returning the value. In single-page apps with many sections, this significantly impacts scroll performance.
**Action:** Always cache layout-sensitive values (like section offsets) in a variable and only update them when the layout actually changes (resize, view switch, content expansion). Use `requestAnimationFrame` to batch any DOM writes (like updating progress bars or classes) to ensure they happen at the start of the next frame.

## 2026-08-05 - Redundant Offset Calculations During Resize
**Learning:** High-frequency window resize events trigger hundreds of layout recalculations per second. Executing synchronous DOM offset queries (like `offsetTop` or `scrollHeight` inside `refreshOffsets`) on every event causes massive layout thrashing and severe UI jank during active resizing.
**Action:** Debounce high-frequency events like window resizing with a 150ms timeout. This allows the browser to settle the layout first, then executes a single, clean layout cache refresh once the resize finishes.
