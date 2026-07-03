## 2026-07-03 - API Response Caching in LovService
**Learning:** In applications with semi-static data like 'List of Values' (LOV), implementing client-side caching in services using RxJS `shareReplay(1)` significantly reduces redundant network traffic and improves perceived performance. It's crucial to invalidate the cache on any mutation (Add/Delete) and on authentication state changes (Login/Logout) to prevent stale data.
**Action:** Always look for opportunities to cache semi-static data fetched via HTTP POST in Angular services, especially when the same data is accessed by multiple components.

## 2026-07-03 - Resolving TS2306/TS2305 in Angular 21
**Learning:** In this repository, some spec files were referencing obsolete components or incorrect export names, causing `TS2306` and `TS2305` errors during `ng test`. For example, `lov-card` was a non-module file being imported, and `authInterceptor` was incorrectly named in its spec file.
**Action:** Verify that all imports in spec files match the actual exports in the source files, and remove dead code or obsolete components that interfere with the build process.

## 2026-07-03 - Signal-based Component Testing
**Learning:** Testing components that use Angular Signals requires careful handling of required inputs and change detection. For `LovDialog`, missing a required input like `mode` caused a `NG0950` error during test execution.
**Action:** Use `fixture.componentRef.setInput()` to provide required signal inputs in unit tests before calling `fixture.detectChanges()`.
