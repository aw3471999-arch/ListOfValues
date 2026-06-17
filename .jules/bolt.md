## 2026-06-17 - API Response Caching in LovService
**Learning:** Implementing `shareReplay(1)` in Angular services for semi-static data (like List of Values) significantly reduces redundant API calls and improves perceived performance. It's critical to include `catchError` that clears the cache variable to ensure that a transient network error doesn't lock the application into a permanent failure state for that resource.
**Action:** Always use `catchError` to reset the cache variable to `null` or delete from `Map` when using `shareReplay` for caching.
