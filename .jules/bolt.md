# Bolt's Performance Journal ⚡

## 2024-05-13 - [Layout Thrashing in Scroll Listeners]
**Learning:** Accessing `offsetTop` inside a scroll event listener for multiple elements causes the browser to recalculate the layout (reflow) on every scroll tick. In this codebase, the navigation highlighting logic was checking `offsetTop` for 9 different sections every time the user scrolled, leading to significant layout thrashing.
**Action:** Cache layout-triggering properties like `offsetTop` in a global object and only recalculate them on `window.resize` or when the view changes (visibility toggles). Combine this with `requestAnimationFrame` for smooth updates.
