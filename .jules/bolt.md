## 2025-05-15 - Layout Thrashing in Unthrottled Scroll Listeners
**Learning:** Multiple scroll listeners reading properties like `offsetTop` and `scrollHeight` cause significant layout thrashing. In this codebase, 9+ unthrottled reads were occurring per scroll event, leading to "jank" and inefficient CPU usage. Caching these values and updating them only on layout-changing events (resize, view switch, content expansion) eliminates the need for expensive DOM reads during high-frequency scroll events.
**Action:** Always consolidate scroll-dependent logic into a single `requestAnimationFrame`-throttled listener. Cache layout-related properties and implement a centralized `refreshOffsets` mechanism to maintain cache consistency across the application lifecycle.

## 2025-05-15 - Initialization Timing for Scroll-Based Features
**Learning:** Using `window.load` to initialize scroll listeners and calculate offsets delays UI interactivity until all external assets (images, maps, fonts) have loaded. This can leave the UI in a broken state for several seconds on slow connections.
**Action:** Use `DOMContentLoaded` or immediate execution (if the script is at the end of `<body>`) for UI logic that doesn't strictly depend on fully loaded images, ensuring the app is interactive as soon as the DOM is parsed. Refine offset calculations if image loading affects layout.
