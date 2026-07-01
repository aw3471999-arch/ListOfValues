## 2026-07-01 - API Response Caching in LovService
**Learning:** Implementing API response caching using `shareReplay(1)` significantly reduces redundant network requests for semi-static data like categories and LOV items. In this application, categories were being fetched multiple times during component initialization and navigation.
**Action:** Use `shareReplay(1)` for caching GET/POST data requests in services. Ensure cache invalidation on mutation (add/delete) and authentication state changes (login/logout). Reset cache on HTTP errors to allow for subsequent retry attempts.
