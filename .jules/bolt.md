## 2026-05-28 - API Response Caching in Angular Services
**Learning:** For semi-static data like 'List of Values' (LOV), implementing client-side caching in services significantly reduces redundant network requests and improves UI responsiveness when navigating between categories. Using `shareReplay(1)` is an effective way to multi-cast the last successful response to all subscribers.
**Action:** Implement `shareReplay(1)` for lookup data and ensures cache invalidation occurs on mutations (add/edit/delete) and authentication state changes (logout).

## 2026-05-28 - Handling Test Failures in Modern Angular
**Learning:** Modern Angular (v17+) with standalone components and signal-based inputs requires specific test setup. Required inputs must be set via `fixture.componentRef.setInput()` before `fixture.detectChanges()`. Missing module/export errors (like `lov-card` or interceptor naming mismatches) can block the entire test suite even if they are unrelated to the current task.
**Action:** Proactively fix or remove broken/obsolete components that prevent the test builder from running. Ensure spec file imports match the actual exported names in source files.
