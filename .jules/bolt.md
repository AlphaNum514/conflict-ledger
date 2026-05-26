## 2026-05-26 - [Initial Setup]
**Learning:** Initializing the Bolt journal for performance tracking.
**Action:** Follow the Bolt daily process for the upcoming optimization.
## 2026-05-26 - [Scroll Performance Optimization]
**Learning:** Layout thrashing in scroll handlers can be eliminated by caching offsets recursively through the `offsetParent` chain. Throttling multiple UI updates (progress, nav, buttons) into a single `requestAnimationFrame` gate significantly reduces main thread pressure during high-frequency scroll events.
**Action:** Always prefer cached layout values for scroll-based logic. Ensure cache invalidation on resize, view switch, and DOM-modifying animations.
