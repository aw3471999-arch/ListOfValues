## 2026-06-29 - API Response Caching in LovService

**Learning:** Implementing `shareReplay(1)` in Angular services for semi-static data (like categories or List of Values) significantly reduces network overhead. However, explicit cache invalidation is required during data mutations (`addlov`, `deletelov`) and session changes (`login`, `logout`) to prevent stale data.

**Action:** Use `shareReplay(1)` for GET-like POST requests that fetch static/semi-static data. Always implement a `clearCache()` mechanism that is triggered by state-changing operations.
