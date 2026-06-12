## 2025-05-15 - [Scroll performance bottleneck: Layout Thrashing]
**Learning:** The application has four separate scroll listeners. One of them (navigation highlighting) performs multiple `offsetTop` reads on every scroll event without any throttling, causing significant layout thrashing. Three other listeners (progress bars) are throttled via `requestAnimationFrame` but redundantly calculate `scrollHeight - innerHeight`.

**Action:** Consolidate all scroll listeners into a single `requestAnimationFrame` loop. Cache layout properties (`offsetTop` of sections and max scroll height) and update them only on window resize or content changes.

### Identified Scroll Listeners in index.html:
1. **L3091:** Simple view progress bar (`#prog`). Throttled.
2. **L3311:** Research view progress bar (`#progress-bar`) and scroll-to-top button (`#scrollTop`). Throttled.
3. **L3324:** Research view navigation highlighting (`.nav-link`). **NOT throttled. Reads `offsetTop` for 9 sections every scroll.**
4. **L3805:** Reading progress percentage text (`#nav-progress`). Throttled.
