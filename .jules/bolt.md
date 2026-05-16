
## 2025-05-14 - API Response Caching in LovService
**Learning:** For semi-static data like List of Values (LOV), implementing caching in the service layer using `shareReplay(1)` significantly reduces redundant network requests, especially when components like toolbars and tables are re-initialized or when multiple components consume the same data.
**Action:** Always implement caching for reference data and ensure proper cache invalidation on mutations (add/delete) and session changes (logout).
