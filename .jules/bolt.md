# Bolt's Journal - Critical Learnings Only

## 2026-06-24 - Redundant Scroll Listeners and Layout Thrashing
**Learning:** The application had four separate scroll listeners, each performing redundant DOM reads (`window.scrollY`, `offsetTop`, `scrollHeight`) and writes. `offsetTop` in particular triggers synchronous layout, and calling it repeatedly inside a scroll event for multiple sections leads to significant layout thrashing.
**Action:** Consolidate all scroll-based logic into a single throttled (via `requestAnimationFrame`) handler. Cache layout offsets and only recalculate them on window resize or specific view-altering events (view switch, glossary toggle).
