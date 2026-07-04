## 2026-07-04 - API Response Caching in LovService
**Learning:** Semi-static data like categories and LOV items were being re-fetched on every component navigation or tab switch. Implementing `shareReplay(1)` in the service layer effectively caches these responses, significantly reducing network overhead and improving perceived performance.
**Action:** Use `shareReplay(1)` for expensive or frequently accessed read-only API calls. Ensure robust cache invalidation on mutations (add/delete) and session changes (login/logout).
