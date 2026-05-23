# Bolt's Journal - Critical Learnings

## 2026-05-23 - API Caching in Angular Services
**Learning:** For semi-static data like 'List of Values' or categories, implementing a caching layer in the service level using RxJS `shareReplay(1)` significantly reduces redundant API calls, especially when multiple components or rapid navigation trigger the same requests. It's crucial to implement a robust invalidation strategy (e.g., clearing the cache on mutations or logout) and ensure failed requests are not cached.
**Action:** Use `shareReplay(1)` for GET-like POST requests in services, and always provide a `clearCache()` mechanism that is called after `add`, `update`, `delete`, or `logout` operations. Use `catchError` to reset the cache entry on failure.
