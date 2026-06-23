## 2026-06-23 - API Response Caching in LovService
**Learning:** Implementing `shareReplay(1)` for semi-static data like 'List of Values' (LOV) and categories significantly reduces redundant network requests, especially in Angular applications where multiple components might request the same data upon initialization or navigation.
**Action:** Use `shareReplay(1)` for GET-like POST requests that fetch reference data. Ensure to clear the cache upon data modification (Add/Delete) and logout to maintain data consistency.
