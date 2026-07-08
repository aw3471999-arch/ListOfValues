# Bolt's Journal - Performance Learnings

## 2026-07-08 - API Response Caching in Angular Services
**Learning:** For applications dealing with semi-static data like 'List of Values' (LOV) or categories, implementing caching at the service level using RxJS `shareReplay(1)` significantly reduces redundant network traffic and improves perceived performance during navigation. It is critical to implement cache invalidation on mutation operations (POST/PUT/DELETE) and authentication state changes (login/logout) to prevent stale data or cross-user data leakage.
**Action:** Use `shareReplay(1)` for caching GET-like POST requests in services, and always provide a `clearCache()` mechanism triggered by state-changing operations.
