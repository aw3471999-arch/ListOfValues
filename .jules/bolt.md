## 2026-06-28 - API Response Caching in LovService
**Learning:** List of Values (LOV) data is semi-static and frequently requested across different components (CategoryToolbar, CategoryCard). Implementing a caching layer in the service layer using RxJS `shareReplay(1)` significantly reduces redundant network requests and improves application responsiveness.
**Action:** Use `shareReplay(1)` for read-heavy, semi-static data fetching. Ensure cache invalidation is implemented for all mutation operations (Add/Update/Delete) and authentication state changes (Login/Logout).
