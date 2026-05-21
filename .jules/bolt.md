## 2025-05-15 - [Layout Thrashing in Scroll Listeners]
**Learning:** In a large single-page application like 'The Conflict Ledger', multiple scroll listeners querying `offsetTop` for numerous sections simultaneously causes significant layout thrashing and stutter during scroll.
**Action:** Consolidate scroll-dependent logic into a single `requestAnimationFrame`-throttled handler. Use recursive `offsetTop` summation to pre-calculate and cache section positions, updating the cache only on specific layout-altering events (resize, content expansion, view toggles).
