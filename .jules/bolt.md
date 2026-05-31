## 2024-05-31 - Unified Scroll Handler and Layout Caching

**Learning:** Combining multiple scroll listeners into a single throttled `requestAnimationFrame` loop and caching layout properties like `offsetTop` prevents layout thrashing (forced synchronous layouts), which is a common performance bottleneck in single-page applications with many scroll-linked UI elements.

**Action:** Always prefer a single, centralized scroll listener and pre-calculate layout-triggering properties outside of high-frequency event loops. Ensure the layout cache is invalidated on window resize, page load, and any DOM-modifying events (like toggling accordions or content visibility).
