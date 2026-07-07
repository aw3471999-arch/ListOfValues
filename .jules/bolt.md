## 2026-07-07 - API Response Caching in LovService
**Learning:** Implementing caching at the service level using RxJS `shareReplay(1)` significantly reduces redundant network calls for semi-static data like categories and LOV items. It's crucial to handle cache invalidation on data mutations (add/delete) and authentication changes (login/logout) to ensure data consistency.
**Action:** Use `shareReplay(1)` for GET-like POST requests in services and provide a `clearCache()` mechanism.

## 2026-07-07 - Fixing Broken Test Suites
**Learning:** In this codebase, some spec files had mismatched imports or were asserting against non-existent DOM elements (e.g., App component template only has router-outlet but test looked for h1). Deleting obsolete/broken components (lov-card) was necessary to resolve TS2306 compilation errors.
**Action:** Always verify the actual component implementation and template before relying on boilerplate tests.
