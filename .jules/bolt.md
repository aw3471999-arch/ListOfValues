## 2026-06-08 - API Response Caching in LovService
**Learning:** Implementing API response caching using `shareReplay(1)` in services for semi-static data (like 'List of Values' categories) significantly reduces redundant network requests. It's crucial to clear the cache during mutations (add/delete) and logout to maintain data consistency.
**Action:** Use `shareReplay(1)` for GET-like POST requests that return stable data, and implement a `clearCache()` mechanism.
