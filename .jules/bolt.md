## 2026-07-02 - API Response Caching in LovService
**Learning:** Implementing API response caching using RxJS `shareReplay(1)` significantly reduces redundant network traffic for semi-static data like categories and LOV items. In an Angular 21 zoneless environment, this approach maintains reactivity while optimizing performance.
**Action:** Use `shareReplay(1)` for caching GET-like POST requests in services, ensuring cache invalidation on mutations and proper error handling to avoid "poisoning" the cache with failed states.
