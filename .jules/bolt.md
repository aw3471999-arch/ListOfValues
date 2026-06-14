## 2026-06-14 - API Response Caching in LovService
**Learning:** Semi-static data like 'List of Values' categories and items are frequently accessed but rarely changed during a session. Implementing caching at the service level using RxJS `shareReplay(1)` significantly reduces redundant network requests and improves perceived performance.
**Action:** Use `shareReplay(1)` for caching GET-like POST requests in Angular services, ensuring proper cache invalidation on mutations (Add/Delete) and logout.
