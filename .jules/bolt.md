## 2026-06-26 - API Response Caching in LovService
**Learning:** Implementing `shareReplay(1)` in Angular services for semi-static data (like LOV categories) significantly reduces redundant network requests during component navigation. However, strict cache invalidation (via `tap` in mutative methods like `addlov` and `deletelov`) is critical to prevent stale data.
**Action:** Use `shareReplay(1)` for all primary "fetch" operations of lookup data, and ensure a centralized `clearCache()` method is called by all "command" operations that modify the state.
