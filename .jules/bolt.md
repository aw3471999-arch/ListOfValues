## 2026-06-16 - API Caching in LovService
**Learning:** Implementing API response caching using RxJS `shareReplay(1)` in services that fetch semi-static data (like categories or configuration) significantly reduces network overhead and improves UI snappiness.
**Action:** Use `shareReplay(1)` for idempotent GET/POST requests that return data that doesn't change frequently, and ensure a mechanism exists to invalidate the cache on mutations (POST/PUT/DELETE) or session changes (logout).
