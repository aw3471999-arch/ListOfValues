## 2026-07-05 - API Response Caching in LovService
**Learning:** Implementing caching for semi-static data like 'List of Values' (LOV) using RxJS `shareReplay(1)` significantly reduces redundant network requests, especially in applications with frequent navigation between categories.
**Action:** Use `shareReplay(1)` for GET/POST requests that fetch reference data, and ensure a robust `clearCache` mechanism is triggered on mutations (add/delete) and session changes (login/logout).
