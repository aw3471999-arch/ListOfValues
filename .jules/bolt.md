## 2026-05-18 - Optimized LovService with shareReplay(1)
**Learning:** Semi-static data like 'List of Values' and categories were being re-fetched on every component interaction, causing unnecessary network overhead.
**Action:** Implemented caching using RxJS `shareReplay(1)` in `LovService`. Added cache invalidation for `addlov`, `deletelov`, and `logout` to ensure data consistency.
