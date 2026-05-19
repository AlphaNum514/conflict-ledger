## 2025-05-15 - Initial Performance Audit
**Learning:** Found unthrottled scroll listeners performing repeated DOM lookups and layout-triggering 'offsetTop' queries.
**Action:** Consolidate scroll handlers, cache DOM references, and throttle updates using requestAnimationFrame. Implement a layout offset cache that refreshes only on resize/view-switch.
