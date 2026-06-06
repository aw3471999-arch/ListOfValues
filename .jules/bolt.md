## 2026-06-06 - API Response Caching in LovService
**Learning:** Implementing caching for semi-static data like "List of Values" (LOVs) and Categories using RxJS `shareReplay(1)` significantly reduces redundant network requests. It is critical to ensure the cache is cleared upon data modification (Add/Delete) and Logout to prevent stale data.
**Action:** Always implement a `clearCache` mechanism when using `shareReplay` for service-level caching and call it in all mutation methods.
