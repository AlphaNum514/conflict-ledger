## 2024-05-22 - Layout Thrashing in Scroll Handlers
**Learning:** High-frequency events like `scroll` were triggering `offsetTop` and `scrollHeight` lookups on every tick, causing the browser to perform expensive layout calculations (reflows) repeatedly. In a complex page like this, these small delays accumulate, leading to "jank" and increased battery consumption.
**Action:** Use a "Cache & Refresh" pattern. Store layout offsets in variables during initialization or on specific events (`resize`, `load`, or content expansion) and use those cached values within the throttled `requestAnimationFrame` scroll handler.

## 2024-05-22 - View Switching Performance
**Learning:** The application's "dual-view" architecture means elements in the hidden view still trigger scroll listeners if they aren't explicitly gated. This wastes CPU cycles on non-visible UI updates (like the Simple View's progress bar while in Research View).
**Action:** Always add visibility guards (e.g., `if (!document.body.classList.contains('show-research')) return;`) to view-specific scroll handlers to ensure they exit as early as possible when not needed.
