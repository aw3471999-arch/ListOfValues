## 2026-06-21 - API Response Caching in LovService
**Learning:** Implementing caching for semi-static data like 'List of Values' using `shareReplay(1)` significantly reduces redundant network requests and improves perceived performance when navigating between categories. Caches must be cleared upon data mutation (`addlov`, `deletelov`) and logout to maintain data consistency and security.
**Action:** Always consider `shareReplay(1)` for data that doesn't change often but is requested multiple times across different components.
