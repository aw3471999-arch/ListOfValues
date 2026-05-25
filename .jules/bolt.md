## 2026-05-25 - API Response Caching for LOVs
**Learning:** The application frequently fetches "List of Values" (LOV) and categories which are semi-static. Re-fetching these on every component initialization or navigation adds unnecessary latency and server load. Implementing a service-level cache using RxJS `shareReplay(1)` significantly improves perceived performance.
**Action:** Use `shareReplay(1)` in services for semi-static data. Ensure the cache is cleared upon data modification (Add/Delete) and user logout to maintain data consistency.
