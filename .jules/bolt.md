## 2026-05-15 - API Response Caching in LovService
**Learning:** Caching semi-static data like categories and LOV items using `shareReplay(1)` significantly reduces redundant network requests and improves perceived application performance. Map-based caching allows for efficient per-category storage of observables.
**Action:** Always consider `shareReplay(1)` for data that doesn't change frequently within a session and implement clear cache invalidation strategies (e.g., on add/delete/logout).
