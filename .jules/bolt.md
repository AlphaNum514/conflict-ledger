# Bolt's Journal - Critical Learnings

## 2025-05-15 - [Layout Thrashing in Nav Scroll Listener]
**Learning:** Accessing `offsetTop` within a scroll event listener causes the browser to recalculate the layout (reflow) on every scroll event, leading to layout thrashing and poor performance, especially on mobile or complex pages.
**Action:** Cache the `offsetTop` values of section elements and only recalculate them on window resize or when the view changes (e.g., switching between 'Simple' and 'Research' editions). Use `requestAnimationFrame` to decouple scroll event handling from visual updates.
