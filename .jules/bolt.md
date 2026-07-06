## 2026-07-06 - API Caching in LovService
**Learning:** Implementing API response caching using `shareReplay(1)` significantly reduces redundant network calls for semi-static data like Categories and List of Values. It's crucial to invalidate the cache on any mutation (add/delete) or session change (login/logout) to prevent stale data.

**Action:** Use `shareReplay(1)` for data-fetching observables in services, and implement a `clearCache()` method to be called on mutations and auth state changes.

## 2026-07-06 - Fixing Compilation and Test Failures
**Learning:** The project had several pre-existing issues:
1. `lov-card` component was obsolete and causing `TS2306` errors because it wasn't a proper module/component.
2. `interceptor-interceptor.spec.ts` was importing a non-existent member `interceptorInterceptor`. The actual export is `authInterceptor`.
3. `app.spec.ts` was looking for an `<h1>` tag that doesn't exist in the current template (which only contains a `<router-outlet>`).
4. `lov-dialog.spec.ts` was failing because the `mode` input is required and wasn't provided.

**Action:**
1. Deleted the obsolete `lov-card` directory.
2. Updated the interceptor spec to use the correct exported name `authInterceptor`.
3. Updated `app.spec.ts` to verify the `title` signal value instead of DOM elements.
4. Updated `lov-dialog.spec.ts` to set the required `mode` input using `fixture.componentRef.setInput('mode', 'ADD')`.
