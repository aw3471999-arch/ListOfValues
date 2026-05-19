## 2025-05-19 - Caching LOV data in LovService
**Learning:** Semi-static data like 'List of Values' (LOV) categories and items were being re-fetched on every component initialization (e.g., when switching categories or opening dialogs). Implementing caching with `shareReplay(1)` in the service layer significantly reduces network overhead and improves UI responsiveness.
**Action:** Use `shareReplay(1)` for caching API responses of semi-static data. Ensure the cache is invalidated on data modification (ADD/DELETE) and logout. Use a `Map` to cache parameterized requests (e.g., by `lovTypeId`).
