# Bolt's Performance Journal

## 2026-06-10 - Optimizing semi-static data with API response caching
**Learning:** In applications with frequent navigation between categories (like this LOV manager), semi-static data such as categories and "List of Values" items are often re-fetched redundantly, leading to unnecessary network overhead and UI flickering.
**Action:** Implement a caching layer in `LovService` using RxJS `shareReplay(1)` to store successful API responses. Ensure the cache is invalidated upon mutations (add/delete) and logout to maintain data consistency.
