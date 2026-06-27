## 2026-06-27 - API Response Caching in LovService
**Learning:** Implementing caching for semi-static data like categories and list-of-values significantly reduces redundant network requests and improves perceived application speed during navigation. Using RxJS `shareReplay(1)` provides a clean way to cache the last emitted value and share it among subscribers.
**Action:** Use `shareReplay(1)` for data-fetching observables in services, and ensure cache invalidation on mutations or session changes.
