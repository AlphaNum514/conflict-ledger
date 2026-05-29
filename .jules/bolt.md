## 2025-05-22 - Layout Thrashing in Scroll Handlers
**Learning:** Accessing `offsetTop` or `scrollHeight` inside a scroll listener forced the browser to recalculate the layout on every event, leading to layout thrashing and dropped frames, especially in long documents.
**Action:** Cache layout-dependent values (offsets, max scroll) in a scoped object and only update them when the layout actually changes (e.g., window resize, content expansion, view switching). Use `requestAnimationFrame` to batch DOM updates.
