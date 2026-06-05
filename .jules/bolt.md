## 2024-06-05 - Layout Thrashing in Unified Scroll Handler
**Learning:** Frequent reads of `offsetTop` inside multiple scroll listeners caused significant layout thrashing on this single-page app. Consolidating into one throttled listener is good, but caching layout positions and only refreshing them on content-changing events (resize, view switch, accordion toggle) is what actually eliminates the bottleneck.
**Action:** Always cache layout-triggering properties (offsetTop, scrollHeight) in a separate refresh function and call it only when the DOM structure changes.
