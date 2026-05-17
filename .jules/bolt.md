## 2026-05-17 - Caching semi-static data with shareReplay(1)
**Learning:** List of Values (LOV) and Categories are semi-static data that are frequently requested by different components. Implementing API-level caching in the service layer using `shareReplay(1)` significantly reduces redundant HTTP traffic and improves UI responsiveness.
**Action:** Always consider `shareReplay(1)` for data that doesn't change frequently within a session, and ensure proper cache invalidation on data-modifying operations (ADD/DELETE/LOGOUT).

## 2026-05-17 - Vitest with Angular 21 Testing
**Learning:** Running tests in this environment requires `npx ng test` (which uses Vitest under the hood in this project) and correctly handling required inputs in standalone components using `fixture.componentRef.setInput`.
**Action:** When fixing or adding tests for Angular 21 components with required inputs, use `fixture.componentRef.setInput` before `fixture.detectChanges()`.
