# Bolt's Journal - Critical Learnings

## 2025-05-15 - Redundant API Calls for Static LOV Data
**Learning:** The application frequently fetches "List of Values" (LOV) categories and items, which are semi-static. Navigating between different views or re-selecting categories triggers redundant network requests, impacting perceived performance and increasing server load.
**Action:** Implement API response caching in `LovService` using RxJS `shareReplay(1)`. Ensure cache invalidation occurs on data mutations (add/delete) and user logout to maintain consistency.
