# ⚡ Bolt's Performance Journal

## 2025-05-15 - Initial Setup
**Learning:** Found that the application uses multiple unthrottled or redundant scroll listeners that trigger layout thrashing by reading `offsetTop` frequently.
**Action:** Unify scroll listeners into a single throttled requestAnimationFrame handler and cache layout-triggering values.
