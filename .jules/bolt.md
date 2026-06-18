## 2026-06-18 - API Response Caching in LovService
**Learning:** Implementing API response caching using RxJS `shareReplay(1)` significantly reduces redundant network requests for semi-static data like 'List of Values' (LOV) categories and items. Proper cache invalidation during data modification (add/delete) and session termination (logout) is critical for consistency.
**Action:** Always consider `shareReplay(1)` for caching GET/POST results of static data in Angular services. Ensure a centralized `clearCache()` mechanism is called during state mutations.
