# Bolt's Journal - Critical Performance Learnings

## 2025-05-28 - Layout Thrashing in Scroll Handlers
**Learning:** Multiple scroll listeners reading `offsetTop` or `scrollHeight` cause significant layout thrashing, especially when toggling views or expanding content. Throttling with `requestAnimationFrame` is necessary but insufficient if layout is still read on every frame.
**Action:** Consolidate scroll handlers and cache layout properties. Provide a global `refreshOffsets` mechanism to invalidate the cache when the DOM changes.
