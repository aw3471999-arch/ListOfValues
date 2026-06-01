## 2026-06-01 - Implement Request Caching in LovService
**Learning:** Using `shareReplay(1)` in Angular services for semi-static data like categories and LOVs provides a significant performance boost by avoiding redundant network requests. It is crucial to implement proper cache invalidation (clearing the cache on mutations like `addlov` or `deletelov` and on `logout`) to maintain data consistency.
**Action:** Always consider implementing client-side caching for frequently accessed, slow-changing data. Ensure failed requests are removed from the cache using `catchError` to allow for retries.
