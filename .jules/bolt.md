## 2026-05-22 - API Response Caching in LovService
**Learning:** For semi-static data like "List of Values" (LOV), implementing a caching layer in the service using `shareReplay(1)` significantly reduces redundant network requests and improves UI responsiveness during navigation between categories.
**Action:** Always consider `shareReplay(1)` for data that doesn't change frequently within a session, and ensure proper invalidation on mutation (add/delete/update) and logout.
