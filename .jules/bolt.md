## 2025-05-14 - Optimized Scroll Listener to Prevent Layout Thrashing

**Learning:** Layout-triggering properties like `offsetTop` inside scroll listeners can cause significant performance degradation (layout thrashing), especially when queried for multiple elements on every scroll event.

**Action:** Cache DOM references and layout values (like `offsetTop`) outside the scroll listener. Use `requestAnimationFrame` to throttle DOM updates and recalculate cached values on `window.resize` or when elements become visible after being hidden.
