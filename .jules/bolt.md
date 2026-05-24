## 2026-05-24 - API Response Caching with shareReplay(1)
**Learning:** In applications with semi-static data like "List of Values" (LOV), redundant API calls on component re-initialization or navigation can be significantly reduced by implementing a caching layer in the service using `shareReplay(1)`. It's crucial to implement cache invalidation on mutations (Add/Delete) and logout to ensure data consistency.
**Action:** Always consider `shareReplay(1)` for "read-heavy" services and ensure a robust `clearCache()` mechanism is in place.
