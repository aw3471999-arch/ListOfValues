## 2026-06-12 - API Response Caching in LovService
**Learning:** Implementing `shareReplay(1)` in services for frequently accessed, semi-static data (like LOV categories and items) provides a significant performance boost by eliminating redundant network requests during component navigation.
**Action:** Use `shareReplay(1)` for GET-like POST requests in Angular services, ensuring a robust `catchError` is implemented to clear the cache if the request fails, and `tap` is used on mutations to invalidate the cache.

## 2026-06-12 - Resolving Angular 21 Test Failures
**Learning:** In Angular 21 (zoneless), `required` signal inputs must be explicitly set in unit tests using `fixture.componentRef.setInput()` before `fixture.detectChanges()` or `whenStable()` to avoid `NG0950` errors. Also, public visibility of signals in components is sometimes necessary for DOM verification in tests.
**Action:** Always check for required inputs in spec files and ensure they are initialized. Use `fixture.componentRef.setInput()` as the preferred method for modern Angular testing.
