# Bolt's Journal - Performance Learnings

## 2025-05-15 - Caching semi-static "List of Values" (LOV) data
**Learning:** In applications with many dropdowns and categories, fetching the same "List of Values" repeatedly can lead to unnecessary network overhead and UI flickering. Since LOVs change infrequently during a session, they are perfect candidates for client-side caching.
**Action:** Use RxJS `shareReplay(1)` in services to cache API responses and implement a cache invalidation strategy (e.g., clearing on logout or data modification).
