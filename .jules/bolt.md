# Bolt's Journal - Critical Learnings

## 2025-01-24 - API Response Caching in LovService
**Learning:** In this Angular application, semi-static data like 'List of Values' (LOV) categories and items were being fetched repeatedly on every navigation or component initialization. Implementing RxJS-based caching with `shareReplay(1)` significantly reduces network overhead.
**Action:** Use `shareReplay(1)` for caching GET-like POST requests in services, ensuring a `clearCache` mechanism is triggered on data mutations (Add/Delete) and Logout.
